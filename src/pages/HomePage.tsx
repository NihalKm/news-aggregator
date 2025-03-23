import React, { useState, useEffect, useCallback } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Divider, Drawer, Stack, AppBar, Box, Toolbar, IconButton, Typography } from '@mui/material';
import { NewsCard, NewsCardSkeleton } from '../components/NewsCard.tsx';
import { Tune, Newspaper, ArrowBack, CalendarMonth } from '@mui/icons-material';
import { MultiSelectDropdown, SearchBar } from '../components/CommonComponents.tsx';
import PreferencesModal from '../components/PreferencesModal.tsx';
import { getPreferences } from '../components/UtilityFunctions.ts';
import { fetchGuardianData, fetchNewsApiData, fetchNYTData } from '../api/fetchAggregatedData.ts';
import { DateRangeDrawer, DateSelectionType } from '../components/DateRangeDrawer.tsx';

const HomePage: React.FC = () => {
    //State to store the search term
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    // Available sources for user preferences
    const availableSources = React.useMemo(() => [
        "New York Times",
        "News API",
        "The Guardian"
    ], []);

    // State to store the sources, category and date filter to be used in the filter components
    const [source, setSource] = useState<string[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string[]>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    const [selectionRange, setSelectionRange] = useState<DateSelectionType>({
        startDate: undefined,
        endDate: undefined,
        key: 'selection',
    });
    const [gotPersonilisedData, setGotPersonilisedData] = useState(false);
    // State to track toggle of date filter and preferences drawer
    const [dateDrawer, setDateDrawer] = useState(false);
    const [preferencesOpen, setPreferencesOpen] = useState(false);

    useEffect(() => {
        //To get user preferences if stored; else set default preferences
        const { sources, category, authors } = getPreferences(availableSources);
        setSource(sources);
        setCurrentCategory(category);
        setAuthors(authors);
        setGotPersonilisedData(true)
    }, [availableSources]);

    // Function to save user preferences
    const handleSavePreferences = (selectedSources: string[], selectedCategory: string[], selectedAuthors: string[]) => {
        if (JSON.stringify(selectedSources) !== JSON.stringify(source)) {
            setSource(selectedSources);
        }
        // Set current category to selected category if changed; if no category is selected, set it to all available categories
        if (!selectedCategory.length || JSON.stringify(selectedCategory) !== JSON.stringify(currentCategory)) {
            setCurrentCategory(selectedCategory.length ? selectedCategory : availableCategories);
        }
        if (JSON.stringify(selectedAuthors) !== JSON.stringify(authors)) {
            setAuthors(selectedAuthors);
        }
        setPreferencesOpen(false);
        // fetch new data if preferences are changed
        // if (JSON.stringify(selectedSources) !== JSON.stringify(source) || JSON.stringify(selectedCategory) !== JSON.stringify(currentCategory) || JSON.stringify(selectedAuthors) !== JSON.stringify(authors)) {
        //     fetchData(selectedSources, selectedCategory, selectedAuthors);
        // }
    };

    const [articles, setArticles] = useState<any[]>([]);
    const [articlesAfterFilter, setArticlesAfterFilter] = useState<any[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[] | any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const dummyItems = Array.from({ length: 12 }, (_, id) => id + 1);

    const fetchData = async (selSource: string[] | undefined, selCategory: string[] | undefined, selAuthors: string[] | undefined) => {
        setIsLoaded(false);

        try {
            // Create a mapping of sources to their respective fetch functions
            const sourceFetchers: Record<string, Function> = {
                'News API': fetchNewsApiData,
                'The Guardian': fetchGuardianData,
                'New York Times': fetchNYTData,
            };

            // Push relevant promises into the array based on the selected sources
            // const promises = Object.keys(sourceFetchers).map((source) => sourceFetchers[source](debouncedSearchTerm));

            // Wait for all promises to resolve and combine the results
            // const combinedResults = (await Promise.all(promises)).flat();
            const combinedResults = [
                {
                    "source": {
                        "id": "fox-news",
                        "name": "Fox News"
                    },
                    "author": "Aubrie Spady",
                    "title": "Trump still needs Congress' help with plan to abolish Education Department - Fox News",
                    "description": "President Donald Trump is expected to sign an executive order to abolish the Department of Education, but he would need congressional approval to do completely eliminate the agency.",
                    "url": "https://www.foxnews.com/politics/trump-still-needs-congress-help-plan-abolish-education-department",
                    "urlToImage": "https://static.foxnews.com/foxnews.com/content/uploads/2025/03/trump-congress.jpg",
                    "publishedAt": "2025-03-20T14:25:00Z",
                    "content": "President Donald Trump could begin to dismantle the Department of Education via an executive order, but he would need congressional approval in order to officially abolish the agency.\r\nTrump is expec… [+4414 chars]",
                    "category": "general",
                    "date": "2025-03-20T14:25:00Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": "bloomberg",
                        "name": "Bloomberg"
                    },
                    "author": "Gillian Tan, Randall Williams",
                    "title": "Bill Chisholm Group Is Front-Runner to Buy Boston Celtics - Bloomberg",
                    "description": "A consortium that includes STG Partners co-founder Bill Chisholm reached a deal to buy the National Basketball Association’s Boston Celtics for $6.1 billion.",
                    "url": "https://www.bloomberg.com/news/articles/2025-03-20/bill-chisholm-group-is-front-runner-to-buy-boston-celtics",
                    "urlToImage": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iv5_ZvB3uSVM/v1/1200x800.jpg",
                    "publishedAt": "2025-03-20T14:07:27Z",
                    "content": "A consortium that includes STG Partners co-founder Bill Chisholm reached a deal to buy the National Basketball Associations Boston Celtics for $6.1 billion.\r\nThe takeover is the biggest NBA deal ever… [+105 chars]",
                    "category": "business",
                    "date": "2025-03-20T14:07:27Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "Variety"
                    },
                    "author": "Lauren Coates",
                    "title": "‘One Battle After Another’ Teaser: Leonardo DiCaprio, Paul Thomas Anderson Unite With Guns Blazing in First Footage - Variety",
                    "description": "Watch the trailer for the new Paul Thomas Anderson film \"One Battle After Another,' starring Leonardo DiCaprio",
                    "url": "https://variety.com/2025/film/news/one-battle-after-another-leonardo-dicaprio-paul-thomas-anderson-1236277796/",
                    "urlToImage": "https://variety.com/wp-content/uploads/2025/03/PTA.jpeg?w=1000&h=563&crop=1",
                    "publishedAt": "2025-03-20T14:04:47Z",
                    "content": "Warner Bros. Pictures has released the first teaser for “One Battle After Another,” the latest film from writer-director Paul Thomas Anderson starring Leonardo DiCaprio, Regina Hall, Teyana Taylor an… [+2197 chars]",
                    "date": "2025-03-20T14:04:47Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "CNBC"
                    },
                    "author": "Diana Olick",
                    "title": "February home resales jump much more than expected, despite higher mortgage rates - CNBC",
                    "description": "The median price of a home sold in February was $398,400, up 3.8% from the same time last year.",
                    "url": "https://www.cnbc.com/2025/03/20/february-home-resales-jump-more-than-expected-despite-mortgage-rates.html",
                    "urlToImage": "https://image.cnbcfm.com/api/v1/image/107217852-1680191448237-gettyimages-1247348366-US_HOMES_SALES.jpeg?v=1742477594&w=1920&h=1080",
                    "publishedAt": "2025-03-20T14:00:08Z",
                    "content": "Sales of previously owned homes in February rose 4.2% from January to 4.26 million units on a seasonally adjusted, annualized basis, according to the National Association of Realtors. Industry analys… [+2304 chars]",
                    "date": "2025-03-20T14:00:08Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "CBS Sports"
                    },
                    "author": null,
                    "title": "NCAA bracket predictions: Model hands out surprising March Madness 2025 tournament picks - CBS Sports",
                    "description": "SportsLine's model nailed 13 of the teams in the Sweet 16 last season and simulated the 2025 NCAA Tournament bracket 10,000 times",
                    "url": "https://www.cbssports.com/general/news/ncaa-bracket-predictions-model-hands-out-surprising-march-madness-2025-tournament-picks/",
                    "urlToImage": "https://sportshub.cbsistatic.com/i/r/2025/03/16/25b7952f-5a0c-4363-ab3a-0d719370ab70/thumbnail/1200x675/4c0ff18625c1c82481783841b7fff7da/michigan-wolverines-usatsi.jpg",
                    "publishedAt": "2025-03-20T13:19:39Z",
                    "content": "There has only been one year in which a First Four winner has not won at least one game in the NCAA Tournament bracket, and North Carolina will try to continue that trend during March Madness 2025. T… [+4267 chars]",
                    "date": "2025-03-20T13:19:39Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "Hoops Hype"
                    },
                    "author": "Cyro Asseo de Choch",
                    "title": "Aggregate 2025 NBA Mock Draft 4.0: Stock status before March Madness - Hoops Hype",
                    "description": "HoopsHype has updated the list of the top prospects for the 2025 NBA Draft by compiling 10 mock drafts from ESPN, CBS Sports, The Athletic, Bleacher Report, Babcock Hoops, USA Today, NBAdraft.net, …",
                    "url": "https://hoopshype.com/lists/aggregate-2025-nba-mock-draft-4-0-stock-status-before-march-madness/",
                    "urlToImage": "https://hoopshype.com/wp-content/uploads/sites/92/2025/03/image.png?w=1024&h=576&crop=1",
                    "publishedAt": "2025-03-20T13:04:00Z",
                    "content": "HoopsHype has updated the list of the top prospects for the 2025 NBA Draft by compiling 10 mock drafts from ESPN, CBS Sports, The Athletic, Bleacher Report, Babcock Hoops, USA Today, NBAdraft.net, SB… [+49932 chars]",
                    "date": "2025-03-20T13:04:00Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "BBC News"
                    },
                    "author": null,
                    "title": "Palestinians killed in new Israeli Gaza strikes, says Hamas-run agency - BBC.com",
                    "description": "Hamas fires rockets at Israel in response, as Israel resumes ground and air operations in Gaza.",
                    "url": "https://www.bbc.com/news/articles/cm2dr7jd7mno",
                    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/d0a4/live/64248d10-058d-11f0-97d3-37df2b293ed1.jpg",
                    "publishedAt": "2025-03-20T12:59:33Z",
                    "content": "Israel resumed large-scale air strikes on Gaza on Tuesday\r\nAt least 85 Palestinians have been killed in overnight Israeli air strikes in Gaza, the territory's Hamas-run health ministry has said.\r\nHou… [+4873 chars]",
                    "date": "2025-03-20T12:59:33Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": "abc-news",
                        "name": "ABC News"
                    },
                    "author": "ABC News",
                    "title": "Family of 3 missing after leaving Grand Canyon and driving through winter storm - ABC News",
                    "description": null,
                    "url": "https://abcnews.go.com/US/family-3-missing-after-leaving-grand-canyon-driving/story?id\\\\u003d119977799",
                    "urlToImage": null,
                    "publishedAt": "2025-03-20T12:13:53Z",
                    "content": null,
                    "category": "general",
                    "date": "2025-03-20T12:13:53Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "Yahoo Entertainment"
                    },
                    "author": "Evolve Editors",
                    "title": "Selena Gomez Was ‘Mortified’ After Arriving First to Taylor Swift’s Party - Yahoo Entertainment",
                    "description": "Selena Gomez recently shared a funny memory about arriving too early at one of Taylor Swift’s parties with Benny Blanco. While reminiscing about the early...",
                    "url": "https://www.yahoo.com/entertainment/selena-gomez-mortified-arriving-first-121342725.html",
                    "urlToImage": "https://media.zenfs.com/en/mandatory_995/e71663c9750d0b9f619df8ac2ed072ee",
                    "publishedAt": "2025-03-20T12:13:42Z",
                    "content": "Selena Gomez recently shared a funny memory about arriving too early at one of Taylor Swifts parties with Benny Blanco. While reminiscing about the early days of their relationship, Gomez admitted sh… [+1787 chars]",
                    "date": "2025-03-20T12:13:42Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "CNBC"
                    },
                    "author": "Sophie Kiderlin",
                    "title": "Bank of England holds interest rates, warns global trade uncertainty has intensified - CNBC",
                    "description": "The Bank of England on Thursday announced its latest interest rate decision, warning of increased global uncertainty.",
                    "url": "https://www.cnbc.com/2025/03/20/bank-of-england-interest-rate-decision-march-2025.html",
                    "urlToImage": "https://image.cnbcfm.com/api/v1/image/108118813-1742464050338-gettyimages-2201301185-20250219_bank_of_england_002.jpeg?v=1742474189&w=1920&h=1080",
                    "publishedAt": "2025-03-20T12:05:30Z",
                    "content": "Bank of England, the Royal Exchange and the statue of the Duke of Wellington in the City of London on 19th February 2025 in London, United Kingdom.\r\nThe Bank of England left interest rates unchanged … [+4700 chars]",
                    "date": "2025-03-20T12:05:30Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "BBC News"
                    },
                    "author": null,
                    "title": "Snow White film is both 'bad' and 'captivating' say critics - BBC.com",
                    "description": "The reviews are in for Disney's live-action remake of Snow White and the Seven Dwarfs.",
                    "url": "https://www.bbc.com/news/articles/cn0jvdg1y82o",
                    "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/c939/live/26226000-058d-11f0-88b7-5556e7b55c5e.jpg",
                    "publishedAt": "2025-03-20T11:53:26Z",
                    "content": "Annabel Rackham\r\nRachel Zegler plays Snow White in the live-action remake\r\nBritish film critics have mostly panned Disney's live-action remake of Snow White, while US reviewers have been somewhat mor… [+6418 chars]",
                    "date": "2025-03-20T11:53:26Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "Yahoo Entertainment"
                    },
                    "author": "Evolve Editors",
                    "title": "Kanye West’s Recent Tweets on Kim Kardashian Couldn’t Get Bolder - Yahoo Entertainment",
                    "description": "Kanye West‘s X (formerly Twitter) drama continues to escalate, with the rapper recently tweeting that his ex-wife Kim Kardashian is a “sex trafficker.” In...",
                    "url": "https://www.yahoo.com/entertainment/kanye-west-recent-tweets-kim-114500306.html",
                    "urlToImage": "https://media.zenfs.com/en/mandatory_995/cc80505d755df7e8273f838c2996be4d",
                    "publishedAt": "2025-03-20T11:45:00Z",
                    "content": "Kanye Wests X (formerly Twitter) drama continues to escalate, with the rapper recently tweeting that his ex-wife Kim Kardashian is a sex trafficker. In another explosive tweet targeting his former sp… [+2025 chars]",
                    "date": "2025-03-20T11:45:00Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": "cnn",
                        "name": "CNN"
                    },
                    "author": "Brenda Goodman",
                    "title": "Small study hints anti-amyloid therapy may keep Alzheimer’s symptoms at bay in certain patients - CNN",
                    "description": "For the first time, scientists say, they have evidence that using a biologic drug to remove sticky beta amyloid plaques from the brains of people destined to develop Alzheimer’s dementia can delay the disease.",
                    "url": "https://www.cnn.com/2025/03/19/health/amyloid-lowering-therapy-alzheimers/index.html",
                    "urlToImage": "https://media.cnn.com/api/v1/images/stellar/prod/beta-amyloid-tau-brain.jpg?c=16x9&q=w_800,c_fill",
                    "publishedAt": "2025-03-20T11:28:00Z",
                    "content": "For the first time, scientists say, they have evidence that using a biologic drug to remove sticky beta amyloid plaques from the brains of people destined to develop Alzheimers dementia can delay the… [+13317 chars]",
                    "category": "general",
                    "date": "2025-03-20T11:28:00Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "ZDNet"
                    },
                    "author": "Kerry Wan",
                    "title": "I thought the budget phone market was in shambles - then I held Google's latest Pixel - ZDNet",
                    "description": "The new Pixel 9a sports a refreshed design with subtle yet significant upgrades hidden in plain sight. It also sets a new record for Google phones overall.",
                    "url": "https://www.zdnet.com/article/i-thought-the-budget-phone-market-was-in-shambles-then-i-held-googles-latest-pixel/",
                    "urlToImage": "https://www.zdnet.com/a/img/resize/2f8b16a749a24736501e14f9082083911b37cce6/2025/03/18/030da77a-ecdc-4fa1-bf20-ab37de792671/dsc04850.jpg?auto=webp&fit=crop&height=675&width=1200",
                    "publishedAt": "2025-03-20T11:00:00Z",
                    "content": "Kerry Wan/ZDNET\r\nWe've reached the point in the mobile industry where every new upgrade is a game of \"Find the differences.\" Whether it's the iPhone, Samsung Galaxy, or Google Pixel, consumers need t… [+4194 chars]",
                    "date": "2025-03-20T11:00:00Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "Financial Times"
                    },
                    "author": "Ayla Jean Yackley",
                    "title": "Turkey detains 37 in escalating crackdown on opposition to Erdoğan - Financial Times",
                    "description": "Hundreds more sought by authorities as they move to stifle dissent over arrest of popular Istanbul mayor",
                    "url": "https://www.ft.com/content/c5950647-1ec0-449f-bd01-90a62382acaa",
                    "urlToImage": "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2F5f32884c-78dd-4ac8-a56e-32c8f8d954fe.jpg?source=next-barrier-page",
                    "publishedAt": "2025-03-20T10:45:23Z",
                    "content": "Complete digital access to quality analysis and expert insights, complemented with our award-winning Weekend Print edition.\r\n<ul><li></li>Everything in Print<li></li>Weekday Print Edition<li></li>FT … [+202 chars]",
                    "date": "2025-03-20T10:45:23Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "NBCSports.com"
                    },
                    "author": "Mike Florio",
                    "title": "How long will Steelers, Giants wait for Aaron Rodgers? - NBC Sports",
                    "description": "If Rodgers is gong to let things play out in Minnesota, will other interested teams move on?",
                    "url": "https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/how-long-will-steelers-giants-wait-for-aaron-rodgers",
                    "urlToImage": "https://nbcsports.brightspotcdn.com/dims4/default/23fe2c7/2147483647/strip/true/crop/3872x2178+0+0/resize/1440x810!/quality/90/?url=https%3A%2F%2Fnbc-sports-production-nbc-sports.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fd3%2F81%2F542d07ac4ccd9cd88ba4c6921432%2Fhttps-api-imagn.com%2Frest%2Fdownload%2FimageID%3D25133145",
                    "publishedAt": "2025-03-20T10:41:15Z",
                    "content": "The calliope has stopped for the NFLs game of musical chairs. Multiple teams had been waiting for Aaron Rodgers to pick a seat, any seat.\r\nIf hes not going to do it any time soon, at what point does … [+2446 chars]",
                    "date": "2025-03-20T10:41:15Z",
                    "sourceName": "News API"
                },
                {
                    "source": {
                        "id": null,
                        "name": "FXStreet"
                    },
                    "author": "Sagar Dua",
                    "title": "EUR/USD slumps as ECB Lagarde warns of potential Eurozone economic shocks - FXStreet",
                    "description": "EUR/USD slides to near 1.0830 as the US Dollar (USD) strengthens in North American trading hours on Thursday.",
                    "url": "https://www.fxstreet.com/news/eur-usd-slumps-as-ecb-lagarde-warns-of-potential-eurozone-economic-shocks-202503200928",
                    "urlToImage": "https://editorial.fxsstatic.com/images/i/EURUSD-bearish-object_Large.png",
                    "publishedAt": "2025-03-20T09:28:33Z",
                    "content": "<ul><li>EUR/USD falls to near 1.0830 as ECB Lagarde expects US President Trump-led trade war could slowdown the Eurozone economic growth.</li><li>The Fed kept borrowing rates steady and stuck to thei… [+7557 chars]",
                    "date": "2025-03-20T09:28:33Z",
                    "sourceName": "News API"
                },
                {
                    "id": "commentisfree/2017/dec/12/harry-potter-magic-jk-rowling",
                    "type": "article",
                    "sectionId": "commentisfree",
                    "sectionName": "Opinion",
                    "webPublicationDate": "2017-12-12T06:00:26Z",
                    "webTitle": "Harry Potter and the £4.50 chocolate frog | Alice O’Keeffe",
                    "webUrl": "https://www.theguardian.com/commentisfree/2017/dec/12/harry-potter-magic-jk-rowling",
                    "apiUrl": "https://content.guardianapis.com/commentisfree/2017/dec/12/harry-potter-magic-jk-rowling",
                    "fields": {
                        "headline": "Harry Potter and the £4.50 chocolate frog",
                        "trailText": "I was delighted when my son discovered JK Rowling’s books. But the magic is in danger of being sullied by merchandise, says freelance literary critic and journalist Alice O’Keeffe",
                        "byline": "Alice O'Keeffe",
                        "thumbnail": "https://media.guim.co.uk/c66852bfdbebb7c12cf66b9b98ccc3fd55fafabf/0_13_640_384/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/opinion",
                    "pillarName": "Opinion",
                    "category": "Opinion",
                    "url": "https://www.theguardian.com/commentisfree/2017/dec/12/harry-potter-magic-jk-rowling",
                    "title": "Harry Potter and the £4.50 chocolate frog",
                    "description": "I was delighted when my son discovered JK Rowling’s books. But the magic is in danger of being sullied by merchandise, says freelance literary critic and journalist Alice O’Keeffe",
                    "urlToImage": "https://media.guim.co.uk/c66852bfdbebb7c12cf66b9b98ccc3fd55fafabf/0_13_640_384/500.jpg",
                    "author": "Alice O'Keeffe",
                    "date": "2017-12-12T06:00:26Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "lifeandstyle/2017/dec/13/oumuamua-interstellar-body-sent-by-aliens-notes-queries",
                    "type": "article",
                    "sectionId": "lifeandstyle",
                    "sectionName": "Life and style",
                    "webPublicationDate": "2017-12-13T11:30:01Z",
                    "webTitle": "What if the interstellar body Oumuamua really was sent by aliens? | Notes and queries",
                    "webUrl": "https://www.theguardian.com/lifeandstyle/2017/dec/13/oumuamua-interstellar-body-sent-by-aliens-notes-queries",
                    "apiUrl": "https://content.guardianapis.com/lifeandstyle/2017/dec/13/oumuamua-interstellar-body-sent-by-aliens-notes-queries",
                    "fields": {
                        "headline": "What if the interstellar body Oumuamua really was sent by aliens?",
                        "trailText": "The long-running series in which readers answer other readers’ questions on subjects ranging from trivial flights of fancy to profound scientific concepts",
                        "thumbnail": "https://media.guim.co.uk/520c0c5de51cc2722ba7e8f5deb156167a3e96a6/0_0_1280_768/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/lifestyle",
                    "pillarName": "Lifestyle",
                    "category": "Life and style",
                    "url": "https://www.theguardian.com/lifeandstyle/2017/dec/13/oumuamua-interstellar-body-sent-by-aliens-notes-queries",
                    "title": "What if the interstellar body Oumuamua really was sent by aliens?",
                    "description": "The long-running series in which readers answer other readers’ questions on subjects ranging from trivial flights of fancy to profound scientific concepts",
                    "urlToImage": "https://media.guim.co.uk/520c0c5de51cc2722ba7e8f5deb156167a3e96a6/0_0_1280_768/500.jpg",
                    "date": "2017-12-13T11:30:01Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "us-news/2017/dec/16/mothers-cartoon-france-us",
                    "type": "article",
                    "sectionId": "us-news",
                    "sectionName": "US news",
                    "webPublicationDate": "2017-12-16T10:00:02Z",
                    "webTitle": "How new moms are supported – or not – in France v the US: a feminist cartoon",
                    "webUrl": "https://www.theguardian.com/us-news/2017/dec/16/mothers-cartoon-france-us",
                    "apiUrl": "https://content.guardianapis.com/us-news/2017/dec/16/mothers-cartoon-france-us",
                    "fields": {
                        "headline": "How new moms are supported – or not – in France v the US: a feminist cartoon",
                        "trailText": "France offers full coverage for prenatal and postnatal care, but young mothers get little help afterwards. In the US, things can be even worse",
                        "byline": "Emma",
                        "thumbnail": "https://media.guim.co.uk/c5000a8cf7ff34bf7fec1c2bf5d2f3f534c0b735/29_339_684_411/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "US news",
                    "url": "https://www.theguardian.com/us-news/2017/dec/16/mothers-cartoon-france-us",
                    "title": "How new moms are supported – or not – in France v the US: a feminist cartoon",
                    "description": "France offers full coverage for prenatal and postnatal care, but young mothers get little help afterwards. In the US, things can be even worse",
                    "urlToImage": "https://media.guim.co.uk/c5000a8cf7ff34bf7fec1c2bf5d2f3f534c0b735/29_339_684_411/500.jpg",
                    "author": "Emma",
                    "date": "2017-12-16T10:00:02Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "artanddesign/2018/jan/02/best-architecture-design-of-2018-windermere-vanda",
                    "type": "article",
                    "sectionId": "artanddesign",
                    "sectionName": "Art and design",
                    "webPublicationDate": "2018-01-02T15:00:19Z",
                    "webTitle": "Wet docks, giant ducks and the zero-waste city: the best architecture and design of 2018",
                    "webUrl": "https://www.theguardian.com/artanddesign/2018/jan/02/best-architecture-design-of-2018-windermere-vanda",
                    "apiUrl": "https://content.guardianapis.com/artanddesign/2018/jan/02/best-architecture-design-of-2018-windermere-vanda",
                    "fields": {
                        "headline": "Wet docks, giant ducks and the zero-waste city: the best architecture and design of 2018",
                        "trailText": "Windermere catches a wave, the V&amp;A unveils the city of tomorrow, and Hope to Nope harnesses the explosive power of graphic design",
                        "byline": "Oliver Wainwright",
                        "thumbnail": "https://media.guim.co.uk/44ce5476cf861df6496183e503aea7ad0c63f1ee/0_160_5184_3110/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/arts",
                    "pillarName": "Arts",
                    "category": "Art and design",
                    "url": "https://www.theguardian.com/artanddesign/2018/jan/02/best-architecture-design-of-2018-windermere-vanda",
                    "title": "Wet docks, giant ducks and the zero-waste city: the best architecture and design of 2018",
                    "description": "Windermere catches a wave, the V&amp;A unveils the city of tomorrow, and Hope to Nope harnesses the explosive power of graphic design",
                    "urlToImage": "https://media.guim.co.uk/44ce5476cf861df6496183e503aea7ad0c63f1ee/0_160_5184_3110/500.jpg",
                    "author": "Oliver Wainwright",
                    "date": "2018-01-02T15:00:19Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "us-news/2017/dec/22/why-medical-students-are-practicing-abortions-on-papayas",
                    "type": "article",
                    "sectionId": "us-news",
                    "sectionName": "US news",
                    "webPublicationDate": "2017-12-22T12:00:00Z",
                    "webTitle": "Why medical students are practicing abortions on papayas",
                    "webUrl": "https://www.theguardian.com/us-news/2017/dec/22/why-medical-students-are-practicing-abortions-on-papayas",
                    "apiUrl": "https://content.guardianapis.com/us-news/2017/dec/22/why-medical-students-are-practicing-abortions-on-papayas",
                    "fields": {
                        "headline": "Why medical students are practicing abortions on papayas",
                        "trailText": "Amid fears of a future abortion ban, a group teaches a discreet procedure using a fruit that looks a bit like the female reproductive system",
                        "byline": "Joanna Walters in Philadelphia",
                        "thumbnail": "https://media.guim.co.uk/30c3961339afe9edc9de8b037b969e031a410480/0_117_3500_2100/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "US news",
                    "url": "https://www.theguardian.com/us-news/2017/dec/22/why-medical-students-are-practicing-abortions-on-papayas",
                    "title": "Why medical students are practicing abortions on papayas",
                    "description": "Amid fears of a future abortion ban, a group teaches a discreet procedure using a fruit that looks a bit like the female reproductive system",
                    "urlToImage": "https://media.guim.co.uk/30c3961339afe9edc9de8b037b969e031a410480/0_117_3500_2100/500.jpg",
                    "author": "Joanna Walters in Philadelphia",
                    "date": "2017-12-22T12:00:00Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "football/blog/2017/dec/11/atletico-get-back-to-what-they-know-and-make-la-liga-a-four-horse-race",
                    "type": "article",
                    "sectionId": "football",
                    "sectionName": "Football",
                    "webPublicationDate": "2017-12-11T15:59:13Z",
                    "webTitle": "Atlético get back to what they know and make La Liga a four-horse race | Sid Lowe",
                    "webUrl": "https://www.theguardian.com/football/blog/2017/dec/11/atletico-get-back-to-what-they-know-and-make-la-liga-a-four-horse-race",
                    "apiUrl": "https://content.guardianapis.com/football/blog/2017/dec/11/atletico-get-back-to-what-they-know-and-make-la-liga-a-four-horse-race",
                    "fields": {
                        "headline": "Atlético get back to what they know and make La Liga a four-horse race",
                        "trailText": "Atlético Madrid, despite a number of issues this season, remain unbeaten in the league and still feel like one of the runners who will compete for the title",
                        "byline": "Sid Lowe",
                        "thumbnail": "https://media.guim.co.uk/980c55e2aeaab5ea857fe43106fe4b286f39610a/0_68_3876_2326/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/sport",
                    "pillarName": "Sport",
                    "category": "Football",
                    "url": "https://www.theguardian.com/football/blog/2017/dec/11/atletico-get-back-to-what-they-know-and-make-la-liga-a-four-horse-race",
                    "title": "Atlético get back to what they know and make La Liga a four-horse race",
                    "description": "Atlético Madrid, despite a number of issues this season, remain unbeaten in the league and still feel like one of the runners who will compete for the title",
                    "urlToImage": "https://media.guim.co.uk/980c55e2aeaab5ea857fe43106fe4b286f39610a/0_68_3876_2326/500.jpg",
                    "author": "Sid Lowe",
                    "date": "2017-12-11T15:59:13Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "books/2017/dec/15/the-house-of-government-by-yuri-slezkine-review-russian-revolution",
                    "type": "article",
                    "sectionId": "books",
                    "sectionName": "Books",
                    "webPublicationDate": "2017-12-15T09:00:12Z",
                    "webTitle": "The House of Government by Yuri Slezkine review – the Russian Revolution told through one building",
                    "webUrl": "https://www.theguardian.com/books/2017/dec/15/the-house-of-government-by-yuri-slezkine-review-russian-revolution",
                    "apiUrl": "https://content.guardianapis.com/books/2017/dec/15/the-house-of-government-by-yuri-slezkine-review-russian-revolution",
                    "fields": {
                        "headline": "The House of Government by Yuri Slezkine review – the Russian Revolution told through one building",
                        "trailText": "A dizzying epic history of a 1931 block of flats in Moscow, home to the Soviet elite, aims to tell of the rise and fall of Bolshevism",
                        "byline": "Owen Hatherley",
                        "thumbnail": "https://media.guim.co.uk/8e6a50e8653652ab3c7d9e72d2ab644c77d78228/35_47_5068_3041/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/arts",
                    "pillarName": "Arts",
                    "category": "Books",
                    "url": "https://www.theguardian.com/books/2017/dec/15/the-house-of-government-by-yuri-slezkine-review-russian-revolution",
                    "title": "The House of Government by Yuri Slezkine review – the Russian Revolution told through one building",
                    "description": "A dizzying epic history of a 1931 block of flats in Moscow, home to the Soviet elite, aims to tell of the rise and fall of Bolshevism",
                    "urlToImage": "https://media.guim.co.uk/8e6a50e8653652ab3c7d9e72d2ab644c77d78228/35_47_5068_3041/500.jpg",
                    "author": "Owen Hatherley",
                    "date": "2017-12-15T09:00:12Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "politics/2017/dec/12/theresa-may-puts-tackling-climate-change-back-on-tory-agenda",
                    "type": "article",
                    "sectionId": "politics",
                    "sectionName": "Politics",
                    "webPublicationDate": "2017-12-12T00:16:51Z",
                    "webTitle": "Theresa May puts tackling climate change back on Tory agenda",
                    "webUrl": "https://www.theguardian.com/politics/2017/dec/12/theresa-may-puts-tackling-climate-change-back-on-tory-agenda",
                    "apiUrl": "https://content.guardianapis.com/politics/2017/dec/12/theresa-may-puts-tackling-climate-change-back-on-tory-agenda",
                    "fields": {
                        "headline": "Theresa May puts tackling climate change back on Tory agenda",
                        "trailText": "Prime minister says there is a ‘moral imperative’ to help vulnerable countries as she prepares for summit in Paris",
                        "byline": "Rowena Mason Deputy political editor",
                        "thumbnail": "https://media.guim.co.uk/caf34c172797dc01c2cad6a4d811c2dd16fee9fc/0_157_4724_2834/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "Politics",
                    "url": "https://www.theguardian.com/politics/2017/dec/12/theresa-may-puts-tackling-climate-change-back-on-tory-agenda",
                    "title": "Theresa May puts tackling climate change back on Tory agenda",
                    "description": "Prime minister says there is a ‘moral imperative’ to help vulnerable countries as she prepares for summit in Paris",
                    "urlToImage": "https://media.guim.co.uk/caf34c172797dc01c2cad6a4d811c2dd16fee9fc/0_157_4724_2834/500.jpg",
                    "author": "Rowena Mason Deputy political editor",
                    "date": "2017-12-12T00:16:51Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "world/2017/dec/11/vladimir-putin-visit-to-syria-airbase-bashir-al-assad",
                    "type": "article",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2017-12-11T16:45:08Z",
                    "webTitle": "Vladimir Putin makes triumphant visit to Syria airbase",
                    "webUrl": "https://www.theguardian.com/world/2017/dec/11/vladimir-putin-visit-to-syria-airbase-bashir-al-assad",
                    "apiUrl": "https://content.guardianapis.com/world/2017/dec/11/vladimir-putin-visit-to-syria-airbase-bashir-al-assad",
                    "fields": {
                        "headline": "Vladimir Putin makes triumphant visit to Syria airbase",
                        "trailText": "President Assad tells Russian leader Syrian people will never forget Russia’s help in driving Islamic State from country<br>",
                        "byline": "Shaun Walker in Moscow",
                        "thumbnail": "https://media.guim.co.uk/304038367f6042bea77b78b5e70c825539656984/20_345_4720_2832/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "World news",
                    "url": "https://www.theguardian.com/world/2017/dec/11/vladimir-putin-visit-to-syria-airbase-bashir-al-assad",
                    "title": "Vladimir Putin makes triumphant visit to Syria airbase",
                    "description": "President Assad tells Russian leader Syrian people will never forget Russia’s help in driving Islamic State from country<br>",
                    "urlToImage": "https://media.guim.co.uk/304038367f6042bea77b78b5e70c825539656984/20_345_4720_2832/500.jpg",
                    "author": "Shaun Walker in Moscow",
                    "date": "2017-12-11T16:45:08Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "lifeandstyle/2017/dec/30/seasonal-gardening-advice-winter-flowering-clematis-dead-hedge-book-of-seeds",
                    "type": "article",
                    "sectionId": "lifeandstyle",
                    "sectionName": "Life and style",
                    "webPublicationDate": "2017-12-30T11:00:10Z",
                    "webTitle": "Gardens: what to do this week",
                    "webUrl": "https://www.theguardian.com/lifeandstyle/2017/dec/30/seasonal-gardening-advice-winter-flowering-clematis-dead-hedge-book-of-seeds",
                    "apiUrl": "https://content.guardianapis.com/lifeandstyle/2017/dec/30/seasonal-gardening-advice-winter-flowering-clematis-dead-hedge-book-of-seeds",
                    "fields": {
                        "headline": "Gardens: what to do this week",
                        "trailText": "Plant winter-flowering clematis, make a dead hedge and read The Book Of Seeds",
                        "byline": "Jane Perrone",
                        "thumbnail": "https://media.guim.co.uk/b992a22d6dac53030e326394f9130a128f481e81/0_863_2511_1506/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/lifestyle",
                    "pillarName": "Lifestyle",
                    "category": "Life and style",
                    "url": "https://www.theguardian.com/lifeandstyle/2017/dec/30/seasonal-gardening-advice-winter-flowering-clematis-dead-hedge-book-of-seeds",
                    "title": "Gardens: what to do this week",
                    "description": "Plant winter-flowering clematis, make a dead hedge and read The Book Of Seeds",
                    "urlToImage": "https://media.guim.co.uk/b992a22d6dac53030e326394f9130a128f481e81/0_863_2511_1506/500.jpg",
                    "author": "Jane Perrone",
                    "date": "2017-12-30T11:00:10Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "lifeandstyle/2017/dec/29/anyone-can-change-any-habit-science-keeping-2018-resolutions",
                    "type": "article",
                    "sectionId": "lifeandstyle",
                    "sectionName": "Life and style",
                    "webPublicationDate": "2017-12-29T12:00:31Z",
                    "webTitle": "‘Anyone can change any habit’: the science of keeping your 2018 resolutions",
                    "webUrl": "https://www.theguardian.com/lifeandstyle/2017/dec/29/anyone-can-change-any-habit-science-keeping-2018-resolutions",
                    "apiUrl": "https://content.guardianapis.com/lifeandstyle/2017/dec/29/anyone-can-change-any-habit-science-keeping-2018-resolutions",
                    "fields": {
                        "headline": "‘Anyone can change any habit’: the science of keeping your 2018 resolutions",
                        "trailText": "Living a healthier lifestyle isn’t always down to sheer willpower – it can be <br> as simple as forming new habits. But how do we do that? ",
                        "byline": "Moya Sarner"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/lifestyle",
                    "pillarName": "Lifestyle",
                    "category": "Life and style",
                    "url": "https://www.theguardian.com/lifeandstyle/2017/dec/29/anyone-can-change-any-habit-science-keeping-2018-resolutions",
                    "title": "‘Anyone can change any habit’: the science of keeping your 2018 resolutions",
                    "description": "Living a healthier lifestyle isn’t always down to sheer willpower – it can be <br> as simple as forming new habits. But how do we do that? ",
                    "author": "Moya Sarner",
                    "date": "2017-12-29T12:00:31Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "politics/2017/dec/11/theresa-may-forced-accept-brexit-scrutiny-committee-revolt-henry-viii-powers",
                    "type": "article",
                    "sectionId": "politics",
                    "sectionName": "Politics",
                    "webPublicationDate": "2017-12-11T20:07:30Z",
                    "webTitle": "Theresa May forced to accept new Brexit scrutiny committee",
                    "webUrl": "https://www.theguardian.com/politics/2017/dec/11/theresa-may-forced-accept-brexit-scrutiny-committee-revolt-henry-viii-powers",
                    "apiUrl": "https://content.guardianapis.com/politics/2017/dec/11/theresa-may-forced-accept-brexit-scrutiny-committee-revolt-henry-viii-powers",
                    "fields": {
                        "headline": "Theresa May forced to accept new Brexit scrutiny committee",
                        "trailText": "Facing revolt, prime minister agrees to allow MPs power to monitor conversion of EU laws on to the UK statute book",
                        "byline": "Rowena Mason, Heather Stewart and Patrick Wintour",
                        "thumbnail": "https://media.guim.co.uk/31cc31f8fe126ba22ac1dd7757ec381ea9918f23/177_317_2381_1429/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "Politics",
                    "url": "https://www.theguardian.com/politics/2017/dec/11/theresa-may-forced-accept-brexit-scrutiny-committee-revolt-henry-viii-powers",
                    "title": "Theresa May forced to accept new Brexit scrutiny committee",
                    "description": "Facing revolt, prime minister agrees to allow MPs power to monitor conversion of EU laws on to the UK statute book",
                    "urlToImage": "https://media.guim.co.uk/31cc31f8fe126ba22ac1dd7757ec381ea9918f23/177_317_2381_1429/500.jpg",
                    "author": "Rowena Mason, Heather Stewart and Patrick Wintour",
                    "date": "2017-12-11T20:07:30Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "lifeandstyle/2017/dec/30/fit-in-my-40s-zuu-exercise-regime-animal-zoe-williams",
                    "type": "article",
                    "sectionId": "lifeandstyle",
                    "sectionName": "Life and style",
                    "webPublicationDate": "2017-12-30T07:00:05Z",
                    "webTitle": "Fit in my 40s: welcome to Zuu, the animal-themed exercise regime that makes everybody look ridiculous | Zoe Williams",
                    "webUrl": "https://www.theguardian.com/lifeandstyle/2017/dec/30/fit-in-my-40s-zuu-exercise-regime-animal-zoe-williams",
                    "apiUrl": "https://content.guardianapis.com/lifeandstyle/2017/dec/30/fit-in-my-40s-zuu-exercise-regime-animal-zoe-williams",
                    "fields": {
                        "headline": "Fit in my 40s: welcome to Zuu, the animal-themed exercise regime that makes everybody look ridiculous",
                        "trailText": "It’s incredibly hard and everybody else covers way more ground, whether as a sideways gorilla or a crawling bear",
                        "byline": "Zoe Williams",
                        "thumbnail": "https://media.guim.co.uk/e1554ccf04268fa7f7e2a571d71408ab84a30b0d/276_0_2083_1250/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/lifestyle",
                    "pillarName": "Lifestyle",
                    "category": "Life and style",
                    "url": "https://www.theguardian.com/lifeandstyle/2017/dec/30/fit-in-my-40s-zuu-exercise-regime-animal-zoe-williams",
                    "title": "Fit in my 40s: welcome to Zuu, the animal-themed exercise regime that makes everybody look ridiculous",
                    "description": "It’s incredibly hard and everybody else covers way more ground, whether as a sideways gorilla or a crawling bear",
                    "urlToImage": "https://media.guim.co.uk/e1554ccf04268fa7f7e2a571d71408ab84a30b0d/276_0_2083_1250/500.jpg",
                    "author": "Zoe Williams",
                    "date": "2017-12-30T07:00:05Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "society/2017/dec/13/social-care-homes-increase-government-funding",
                    "type": "article",
                    "sectionId": "society",
                    "sectionName": "Society",
                    "webPublicationDate": "2017-12-13T07:30:13Z",
                    "webTitle": "The state of social care shames us all",
                    "webUrl": "https://www.theguardian.com/society/2017/dec/13/social-care-homes-increase-government-funding",
                    "apiUrl": "https://content.guardianapis.com/society/2017/dec/13/social-care-homes-increase-government-funding",
                    "fields": {
                        "headline": "The state of social care shames us all",
                        "trailText": "Care homes are unfairly relying on better-off residents to subsidise others’ care. The government urgently needs to increase funding to the sector",
                        "byline": "David Brindle",
                        "thumbnail": "https://media.guim.co.uk/9152553cae99eb5dd0f0549739ca5edad6b5d1d4/0_274_2978_1786/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "Society",
                    "url": "https://www.theguardian.com/society/2017/dec/13/social-care-homes-increase-government-funding",
                    "title": "The state of social care shames us all",
                    "description": "Care homes are unfairly relying on better-off residents to subsidise others’ care. The government urgently needs to increase funding to the sector",
                    "urlToImage": "https://media.guim.co.uk/9152553cae99eb5dd0f0549739ca5edad6b5d1d4/0_274_2978_1786/500.jpg",
                    "author": "David Brindle",
                    "date": "2017-12-13T07:30:13Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "world/2017/dec/31/look-to-the-future-what-does-2018-have-in-store",
                    "type": "article",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2017-12-31T06:00:22Z",
                    "webTitle": "Look to the future: what does 2018 have in store?",
                    "webUrl": "https://www.theguardian.com/world/2017/dec/31/look-to-the-future-what-does-2018-have-in-store",
                    "apiUrl": "https://content.guardianapis.com/world/2017/dec/31/look-to-the-future-what-does-2018-have-in-store",
                    "fields": {
                        "headline": "Look to the future: what does 2018 have in store?",
                        "trailText": "From news and politics to sport, culture and fashion, we preview the events likely to shape the year ahead",
                        "byline": "Guardian staff",
                        "thumbnail": "https://media.guim.co.uk/8bfa4af4dfba5e2e864d57222da0e1d5bf87f0e0/0_0_2560_1536/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "World news",
                    "url": "https://www.theguardian.com/world/2017/dec/31/look-to-the-future-what-does-2018-have-in-store",
                    "title": "Look to the future: what does 2018 have in store?",
                    "description": "From news and politics to sport, culture and fashion, we preview the events likely to shape the year ahead",
                    "urlToImage": "https://media.guim.co.uk/8bfa4af4dfba5e2e864d57222da0e1d5bf87f0e0/0_0_2560_1536/500.jpg",
                    "author": "Guardian staff",
                    "date": "2017-12-31T06:00:22Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "lifeandstyle/2017/dec/13/guilty-buying-christmas-tree-notes-queries",
                    "type": "article",
                    "sectionId": "lifeandstyle",
                    "sectionName": "Life and style",
                    "webPublicationDate": "2017-12-13T11:30:01Z",
                    "webTitle": "Should I feel guilty about buying Christmas tree? | Notes and queries",
                    "webUrl": "https://www.theguardian.com/lifeandstyle/2017/dec/13/guilty-buying-christmas-tree-notes-queries",
                    "apiUrl": "https://content.guardianapis.com/lifeandstyle/2017/dec/13/guilty-buying-christmas-tree-notes-queries",
                    "fields": {
                        "headline": "Should I feel guilty about buying a Christmas tree?",
                        "trailText": "The long-running series in which readers answer other readers’ questions on subjects ranging from trivial flights of fancy to profound scientific concepts",
                        "thumbnail": "https://media.guim.co.uk/3935f39fafb402e3193039d4d727b159b3c25044/0_183_3500_2100/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/lifestyle",
                    "pillarName": "Lifestyle",
                    "category": "Life and style",
                    "url": "https://www.theguardian.com/lifeandstyle/2017/dec/13/guilty-buying-christmas-tree-notes-queries",
                    "title": "Should I feel guilty about buying a Christmas tree?",
                    "description": "The long-running series in which readers answer other readers’ questions on subjects ranging from trivial flights of fancy to profound scientific concepts",
                    "urlToImage": "https://media.guim.co.uk/3935f39fafb402e3193039d4d727b159b3c25044/0_183_3500_2100/500.jpg",
                    "date": "2017-12-13T11:30:01Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "lifeandstyle/2017/dec/17/the-shed-tripadvisors-best-london-restaurant-you-literally-couldnt-get-a-table",
                    "type": "article",
                    "sectionId": "lifeandstyle",
                    "sectionName": "Life and style",
                    "webPublicationDate": "2017-12-17T06:00:22Z",
                    "webTitle": "The best restaurant in London? You literally can't get a table",
                    "webUrl": "https://www.theguardian.com/lifeandstyle/2017/dec/17/the-shed-tripadvisors-best-london-restaurant-you-literally-couldnt-get-a-table",
                    "apiUrl": "https://content.guardianapis.com/lifeandstyle/2017/dec/17/the-shed-tripadvisors-best-london-restaurant-you-literally-couldnt-get-a-table",
                    "fields": {
                        "headline": "The best restaurant in London? You literally can't get a table",
                        "trailText": "A make-believe restaurant serving pretend food to imaginary customers for fake reviews… What Tripadvisor reviews tell us about the way we live, by Eva Wiseman",
                        "byline": "Eva Wiseman",
                        "thumbnail": "https://media.guim.co.uk/846ad19e4a8f8d026cf08645c2413251445816b2/9_5_2043_1226/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/lifestyle",
                    "pillarName": "Lifestyle",
                    "category": "Life and style",
                    "url": "https://www.theguardian.com/lifeandstyle/2017/dec/17/the-shed-tripadvisors-best-london-restaurant-you-literally-couldnt-get-a-table",
                    "title": "The best restaurant in London? You literally can't get a table",
                    "description": "A make-believe restaurant serving pretend food to imaginary customers for fake reviews… What Tripadvisor reviews tell us about the way we live, by Eva Wiseman",
                    "urlToImage": "https://media.guim.co.uk/846ad19e4a8f8d026cf08645c2413251445816b2/9_5_2043_1226/500.jpg",
                    "author": "Eva Wiseman",
                    "date": "2017-12-17T06:00:22Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "sport/2017/dec/12/nba-surpassed-nfl-league-of-americas-future-kareem-abdul-jabbar",
                    "type": "article",
                    "sectionId": "sport",
                    "sectionName": "Sport",
                    "webPublicationDate": "2017-12-12T10:00:30Z",
                    "webTitle": "The NBA has surpassed the NFL as the league of America’s future | Kareem Abdul-Jabbar",
                    "webUrl": "https://www.theguardian.com/sport/2017/dec/12/nba-surpassed-nfl-league-of-americas-future-kareem-abdul-jabbar",
                    "apiUrl": "https://content.guardianapis.com/sport/2017/dec/12/nba-surpassed-nfl-league-of-americas-future-kareem-abdul-jabbar",
                    "fields": {
                        "headline": "The NBA, and not the NFL, is the league of America's future",
                        "trailText": "The NFL may still be America’s most popular sport, but it’s become increasingly clear that football embodies the spirit of a nation as it once was – not as it is today",
                        "byline": "Kareem Abdul-Jabbar",
                        "thumbnail": "https://media.guim.co.uk/3ed2aaf3077c0cd88fbe5fca8cb6791e35776f93/0_0_2579_1547/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/sport",
                    "pillarName": "Sport",
                    "category": "Sport",
                    "url": "https://www.theguardian.com/sport/2017/dec/12/nba-surpassed-nfl-league-of-americas-future-kareem-abdul-jabbar",
                    "title": "The NBA, and not the NFL, is the league of America's future",
                    "description": "The NFL may still be America’s most popular sport, but it’s become increasingly clear that football embodies the spirit of a nation as it once was – not as it is today",
                    "urlToImage": "https://media.guim.co.uk/3ed2aaf3077c0cd88fbe5fca8cb6791e35776f93/0_0_2579_1547/500.jpg",
                    "author": "Kareem Abdul-Jabbar",
                    "date": "2017-12-12T10:00:30Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "media/2017/dec/12/keith-chegwin-a-born-entertainer-with-natural-likability",
                    "type": "article",
                    "sectionId": "media",
                    "sectionName": "Media",
                    "webPublicationDate": "2017-12-12T07:00:27Z",
                    "webTitle": "Keith Chegwin: a born entertainer with natural likability",
                    "webUrl": "https://www.theguardian.com/media/2017/dec/12/keith-chegwin-a-born-entertainer-with-natural-likability",
                    "apiUrl": "https://content.guardianapis.com/media/2017/dec/12/keith-chegwin-a-born-entertainer-with-natural-likability",
                    "fields": {
                        "headline": "Keith Chegwin: a born entertainer with natural likability",
                        "trailText": "From huge early success, to an adult entertainment blip, to a late career comeback, Cheggers was almost a family member to viewers",
                        "byline": "Mark Lawson",
                        "thumbnail": "https://media.guim.co.uk/810e4e9c876aae82ad8ed507bffcffd7ab81219a/0_124_3600_2159/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "Media",
                    "url": "https://www.theguardian.com/media/2017/dec/12/keith-chegwin-a-born-entertainer-with-natural-likability",
                    "title": "Keith Chegwin: a born entertainer with natural likability",
                    "description": "From huge early success, to an adult entertainment blip, to a late career comeback, Cheggers was almost a family member to viewers",
                    "urlToImage": "https://media.guim.co.uk/810e4e9c876aae82ad8ed507bffcffd7ab81219a/0_124_3600_2159/500.jpg",
                    "author": "Mark Lawson",
                    "date": "2017-12-12T07:00:27Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "politics/2017/dec/12/nobody-cares-about-us-britons-living-in-rest-of-eu-british-brexit-future",
                    "type": "article",
                    "sectionId": "politics",
                    "sectionName": "Politics",
                    "webPublicationDate": "2017-12-12T08:00:28Z",
                    "webTitle": "'Nobody cares about us': Britons living in rest of EU voice their dismay",
                    "webUrl": "https://www.theguardian.com/politics/2017/dec/12/nobody-cares-about-us-britons-living-in-rest-of-eu-british-brexit-future",
                    "apiUrl": "https://content.guardianapis.com/politics/2017/dec/12/nobody-cares-about-us-britons-living-in-rest-of-eu-british-brexit-future",
                    "fields": {
                        "headline": "'Nobody cares about us': Britons living in rest of EU voice their dismay",
                        "trailText": "We asked British nationals living in the EU to tell us how they view the latest Brexit negotiations, and where they see the future<br>",
                        "byline": "Guardian readers and Matthew Holmes",
                        "thumbnail": "https://media.guim.co.uk/40568eb694084960a43ee383f458793641d463e2/0_116_3500_2101/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "Politics",
                    "url": "https://www.theguardian.com/politics/2017/dec/12/nobody-cares-about-us-britons-living-in-rest-of-eu-british-brexit-future",
                    "title": "'Nobody cares about us': Britons living in rest of EU voice their dismay",
                    "description": "We asked British nationals living in the EU to tell us how they view the latest Brexit negotiations, and where they see the future<br>",
                    "urlToImage": "https://media.guim.co.uk/40568eb694084960a43ee383f458793641d463e2/0_116_3500_2101/500.jpg",
                    "author": "Guardian readers and Matthew Holmes",
                    "date": "2017-12-12T08:00:28Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "film/2017/dec/17/hayley-squires-i-used-to-argue-with-everyone",
                    "type": "article",
                    "sectionId": "film",
                    "sectionName": "Film",
                    "webPublicationDate": "2017-12-17T08:00:25Z",
                    "webTitle": "Hayley Squires: ‘I used to argue with everyone’",
                    "webUrl": "https://www.theguardian.com/film/2017/dec/17/hayley-squires-i-used-to-argue-with-everyone",
                    "apiUrl": "https://content.guardianapis.com/film/2017/dec/17/hayley-squires-i-used-to-argue-with-everyone",
                    "fields": {
                        "headline": "Hayley Squires: ‘I used to argue with everyone’",
                        "trailText": "She made her name in I, Daniel Blake – Ken Loach’s searing indictment of the welfare state. Now Hayley Squires is stealing the show in the BBC’s adaptation of The Miniaturist. But, finds Rebecca Nicholson, there are a few things she wants to get off her chest first",
                        "byline": "Rebecca Nicholson",
                        "thumbnail": "https://media.guim.co.uk/83d26f23e60240b61e90bfc4d02e85d69b307c9d/0_2696_4912_2948/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/arts",
                    "pillarName": "Arts",
                    "category": "Film",
                    "url": "https://www.theguardian.com/film/2017/dec/17/hayley-squires-i-used-to-argue-with-everyone",
                    "title": "Hayley Squires: ‘I used to argue with everyone’",
                    "description": "She made her name in I, Daniel Blake – Ken Loach’s searing indictment of the welfare state. Now Hayley Squires is stealing the show in the BBC’s adaptation of The Miniaturist. But, finds Rebecca Nicholson, there are a few things she wants to get off her chest first",
                    "urlToImage": "https://media.guim.co.uk/83d26f23e60240b61e90bfc4d02e85d69b307c9d/0_2696_4912_2948/500.jpg",
                    "author": "Rebecca Nicholson",
                    "date": "2017-12-17T08:00:25Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "books/2017/dec/12/attrib-this-eley-williamss-experimental-stories-are-a-microblast",
                    "type": "article",
                    "sectionId": "books",
                    "sectionName": "Books",
                    "webPublicationDate": "2017-12-12T12:06:51Z",
                    "webTitle": "Attrib. this: Eley Williams's experimental stories are a microblast",
                    "webUrl": "https://www.theguardian.com/books/2017/dec/12/attrib-this-eley-williamss-experimental-stories-are-a-microblast",
                    "apiUrl": "https://content.guardianapis.com/books/2017/dec/12/attrib-this-eley-williamss-experimental-stories-are-a-microblast",
                    "fields": {
                        "headline": "Attrib. this: Eley Williams's experimental stories are a microblast",
                        "trailText": "This thought-stoppingly daring debut (and other stories) offers the winterval reader a bounteous sharing platter of thinking experiments. And a whole lot of fun<br>",
                        "byline": "Sam Jordison",
                        "thumbnail": "https://media.guim.co.uk/22cb25a17994f18bb75fa2f7592aae0a778757db/1316_1456_3491_2095/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/arts",
                    "pillarName": "Arts",
                    "category": "Books",
                    "url": "https://www.theguardian.com/books/2017/dec/12/attrib-this-eley-williamss-experimental-stories-are-a-microblast",
                    "title": "Attrib. this: Eley Williams's experimental stories are a microblast",
                    "description": "This thought-stoppingly daring debut (and other stories) offers the winterval reader a bounteous sharing platter of thinking experiments. And a whole lot of fun<br>",
                    "urlToImage": "https://media.guim.co.uk/22cb25a17994f18bb75fa2f7592aae0a778757db/1316_1456_3491_2095/500.jpg",
                    "author": "Sam Jordison",
                    "date": "2017-12-12T12:06:51Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "science/live/2018/feb/06/spacex-falcon-heavy-launch-elon-musk-live-updates",
                    "type": "liveblog",
                    "sectionId": "science",
                    "sectionName": "Science",
                    "webPublicationDate": "2018-02-06T22:33:18Z",
                    "webTitle": "Falcon Heavy, world's most powerful rocket, launches – as it happened",
                    "webUrl": "https://www.theguardian.com/science/live/2018/feb/06/spacex-falcon-heavy-launch-elon-musk-live-updates",
                    "apiUrl": "https://content.guardianapis.com/science/live/2018/feb/06/spacex-falcon-heavy-launch-elon-musk-live-updates",
                    "fields": {
                        "headline": "Falcon Heavy, world's most powerful rocket, launches – as it happened",
                        "trailText": "A heavy-duty rocket from Elon Musk’s private company launches for the first time and aims to make spaceflight cheaper and easier ",
                        "byline": "Alan Yuhas",
                        "thumbnail": "https://media.guim.co.uk/d0c5490afe82bef1a329ea613a96fa2fae08a2a1/0_320_3500_2100/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "Science",
                    "url": "https://www.theguardian.com/science/live/2018/feb/06/spacex-falcon-heavy-launch-elon-musk-live-updates",
                    "title": "Falcon Heavy, world's most powerful rocket, launches – as it happened",
                    "description": "A heavy-duty rocket from Elon Musk’s private company launches for the first time and aims to make spaceflight cheaper and easier ",
                    "urlToImage": "https://media.guim.co.uk/d0c5490afe82bef1a329ea613a96fa2fae08a2a1/0_320_3500_2100/500.jpg",
                    "author": "Alan Yuhas",
                    "date": "2018-02-06T22:33:18Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "tv-and-radio/2017/dec/17/sundays-best-tv-sports-personality-of-the-year-2017-the-apprentice-final-the-alternativity",
                    "type": "article",
                    "sectionId": "tv-and-radio",
                    "sectionName": "Television & radio",
                    "webPublicationDate": "2017-12-17T06:00:23Z",
                    "webTitle": "Sunday's best TV: Sports Personality of the Year 2017; The Apprentice final; The Alternativity",
                    "webUrl": "https://www.theguardian.com/tv-and-radio/2017/dec/17/sundays-best-tv-sports-personality-of-the-year-2017-the-apprentice-final-the-alternativity",
                    "apiUrl": "https://content.guardianapis.com/tv-and-radio/2017/dec/17/sundays-best-tv-sports-personality-of-the-year-2017-the-apprentice-final-the-alternativity",
                    "fields": {
                        "headline": "Sunday's best TV: Sports Personality of the Year 2017; The Apprentice final; The Alternativity",
                        "trailText": "As Sports Personality of the Year is unveiled, will it finally be Mo Farah’s year? Elsewhere, Lord Sugar finally names his next business partner, and Danny Boyle offers an untraditional take on the nativity from Palestine.",
                        "byline": "John Robinson, Hannah J Davies, Ellen E Jones, Sophie Harris, Jonathan Wright, Ben Arnold and Paul Howlett",
                        "thumbnail": "https://media.guim.co.uk/2137171a613f56d094aada3238a0206a73696217/596_270_3197_1918/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/arts",
                    "pillarName": "Arts",
                    "category": "Television & radio",
                    "url": "https://www.theguardian.com/tv-and-radio/2017/dec/17/sundays-best-tv-sports-personality-of-the-year-2017-the-apprentice-final-the-alternativity",
                    "title": "Sunday's best TV: Sports Personality of the Year 2017; The Apprentice final; The Alternativity",
                    "description": "As Sports Personality of the Year is unveiled, will it finally be Mo Farah’s year? Elsewhere, Lord Sugar finally names his next business partner, and Danny Boyle offers an untraditional take on the nativity from Palestine.",
                    "urlToImage": "https://media.guim.co.uk/2137171a613f56d094aada3238a0206a73696217/596_270_3197_1918/500.jpg",
                    "author": "John Robinson, Hannah J Davies, Ellen E Jones, Sophie Harris, Jonathan Wright, Ben Arnold and Paul Howlett",
                    "date": "2017-12-17T06:00:23Z",
                    "sourceName": "The Guardian"
                },
                {
                    "id": "uk-news/2017/dec/11/salford-attack-three-children-die-in-suspected-arson-attack-on-home",
                    "type": "article",
                    "sectionId": "uk-news",
                    "sectionName": "UK news",
                    "webPublicationDate": "2017-12-11T21:42:41Z",
                    "webTitle": "Five arrested after three children die in suspected arson attack",
                    "webUrl": "https://www.theguardian.com/uk-news/2017/dec/11/salford-attack-three-children-die-in-suspected-arson-attack-on-home",
                    "apiUrl": "https://content.guardianapis.com/uk-news/2017/dec/11/salford-attack-three-children-die-in-suspected-arson-attack-on-home",
                    "fields": {
                        "headline": "Five arrested after three children die in suspected arson attack",
                        "trailText": "Greater Manchester police carry out arrests after house set on fire in Salford, leaving three-year-old girl and woman critically ill in hospital",
                        "byline": "Frances Perraudin North of England reporter",
                        "thumbnail": "https://media.guim.co.uk/3f223f07594c86dd84f7e8179001323ca728b239/21_0_2958_1775/500.jpg"
                    },
                    "isHosted": false,
                    "pillarId": "pillar/news",
                    "pillarName": "News",
                    "category": "UK news",
                    "url": "https://www.theguardian.com/uk-news/2017/dec/11/salford-attack-three-children-die-in-suspected-arson-attack-on-home",
                    "title": "Five arrested after three children die in suspected arson attack",
                    "description": "Greater Manchester police carry out arrests after house set on fire in Salford, leaving three-year-old girl and woman critically ill in hospital",
                    "urlToImage": "https://media.guim.co.uk/3f223f07594c86dd84f7e8179001323ca728b239/21_0_2958_1775/500.jpg",
                    "author": "Frances Perraudin North of England reporter",
                    "date": "2017-12-11T21:42:41Z",
                    "sourceName": "The Guardian"
                },
                {
                    "section": "business",
                    "subsection": "",
                    "title": "Paul Weiss Chair Says Deal With Trump Adheres to Firm’s Principles",
                    "abstract": "In an email message on Thursday evening, Paul Weiss Chairman Brad Karp reassured employees that the deal with President Trump was in keeping with the firm’s principles.",
                    "url": "https://www.nytimes.com/2025/03/21/business/paul-weiss-memo-trump-deal.html",
                    "uri": "nyt://article/e1efae87-c113-5f9e-a918-4dabcd215de4",
                    "byline": "By Matthew Goldstein, Jessica Silver-Greenberg and Ben Protess",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T12:03:29-04:00",
                    "created_date": "2025-03-21T11:45:08-04:00",
                    "published_date": "2025-03-21T11:45:08-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Legal Profession",
                        "United States Politics and Government",
                        "Executive Orders and Memorandums",
                        "Government Contracts and Procurement"
                    ],
                    "org_facet": [
                        "Paul Weiss Rifkind Wharton & Garrison"
                    ],
                    "per_facet": [
                        "Trump, Donald J",
                        "Brad Karp"
                    ],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21biz-paulweiss-cfbv/21biz-paulweiss-cfbv-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Brad Karp, chairman of Paul Weiss, detailed the firm’s agreement with President Trump in an email to employees on Thursday.",
                            "copyright": "Carly Zavala for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21biz-paulweiss-cfbv/21biz-paulweiss-cfbv-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Brad Karp, chairman of Paul Weiss, detailed the firm’s agreement with President Trump in an email to employees on Thursday.",
                            "copyright": "Carly Zavala for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21biz-paulweiss-cfbv/21biz-paulweiss-cfbv-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Brad Karp, chairman of Paul Weiss, detailed the firm’s agreement with President Trump in an email to employees on Thursday.",
                            "copyright": "Carly Zavala for The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "business",
                    "description": "In an email message on Thursday evening, Paul Weiss Chairman Brad Karp reassured employees that the deal with President Trump was in keeping with the firm’s principles.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21biz-paulweiss-cfbv/21biz-paulweiss-cfbv-superJumbo.jpg",
                    "author": "Matthew Goldstein, Jessica Silver-Greenberg and Ben Protess",
                    "date": "2025-03-21T11:45:08-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "us",
                    "subsection": "politics",
                    "title": "Judge to Consider Block on Trump’s Use of Wartime Law to Deport Venezuelans",
                    "abstract": "A hearing on Friday afternoon could also include some discussion about the Justice Department’s repeated recalcitrance in responding to the judge’s demands.",
                    "url": "https://www.nytimes.com/2025/03/21/us/politics/trump-deportations-alien-enemies-act-block.html",
                    "uri": "nyt://article/81328034-4d84-5f60-824f-c588715fb7ca",
                    "byline": "By Alan Feuer",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:42:57-04:00",
                    "created_date": "2025-03-21T09:49:18-04:00",
                    "published_date": "2025-03-21T09:49:18-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "United States Politics and Government",
                        "Presidential Power (US)",
                        "Deportation"
                    ],
                    "org_facet": [
                        "Justice Department",
                        "Tren de Aragua (Gang)"
                    ],
                    "per_facet": [
                        "Boasberg, James E",
                        "Trump, Donald J"
                    ],
                    "geo_facet": [
                        "El Salvador",
                        "Venezuela"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-immig-kfwl/21dc-immig-kfwl-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 2048,
                            "width": 1366,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Judge James E. Boasberg scolded the Justice Department in a stern order on Thursday for having “evaded its obligations.”",
                            "copyright": "Erin Schaff/The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-immig-kfwl/21dc-immig-kfwl-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Judge James E. Boasberg scolded the Justice Department in a stern order on Thursday for having “evaded its obligations.”",
                            "copyright": "Erin Schaff/The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-immig-kfwl/21dc-immig-kfwl-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Judge James E. Boasberg scolded the Justice Department in a stern order on Thursday for having “evaded its obligations.”",
                            "copyright": "Erin Schaff/The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "us",
                    "description": "A hearing on Friday afternoon could also include some discussion about the Justice Department’s repeated recalcitrance in responding to the judge’s demands.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-immig-kfwl/21dc-immig-kfwl-superJumbo.jpg",
                    "author": "Alan Feuer",
                    "date": "2025-03-21T09:49:18-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "europe",
                    "title": "U.S. Says Decision to Turn Back French Scientist Had Nothing to Do With Trump",
                    "abstract": "The Department of Homeland Security said the academic was denied entry because he had “confidential” data from an American lab, not because of his views on the president’s policies.",
                    "url": "https://www.nytimes.com/2025/03/21/world/europe/us-france-scientist-entry-trump.html",
                    "uri": "nyt://article/7f91bacb-22bc-5c29-b873-beb4078e5f2f",
                    "byline": "By Aurelien Breeden",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:54:57-04:00",
                    "created_date": "2025-03-21T07:40:08-04:00",
                    "published_date": "2025-03-21T07:40:08-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Research",
                        "United States Politics and Government"
                    ],
                    "org_facet": [
                        "Homeland Security Department",
                        "Los Alamos National Laboratory"
                    ],
                    "per_facet": [
                        "Trump, Donald J"
                    ],
                    "geo_facet": [
                        "France",
                        "United States",
                        "Houston (Tex)",
                        "New Mexico"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-france-scientist-cvpm/21int-france-scientist-cvpm-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "The Los Alamos National Laboratory in New Mexico. A French scientist had information from the lab on an electronic device, a spokeswoman said.",
                            "copyright": "The Albuquerque Journal, via Associated Press"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-france-scientist-cvpm/21int-france-scientist-cvpm-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "The Los Alamos National Laboratory in New Mexico. A French scientist had information from the lab on an electronic device, a spokeswoman said.",
                            "copyright": "The Albuquerque Journal, via Associated Press"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-france-scientist-cvpm/21int-france-scientist-cvpm-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "The Los Alamos National Laboratory in New Mexico. A French scientist had information from the lab on an electronic device, a spokeswoman said.",
                            "copyright": "The Albuquerque Journal, via Associated Press"
                        }
                    ],
                    "short_url": "",
                    "category": "world",
                    "description": "The Department of Homeland Security said the academic was denied entry because he had “confidential” data from an American lab, not because of his views on the president’s policies.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-france-scientist-cvpm/21int-france-scientist-cvpm-superJumbo.jpg",
                    "author": "Aurelien Breeden",
                    "date": "2025-03-21T07:40:08-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "europe",
                    "title": "What We Know About the Closure of Heathrow Airport",
                    "abstract": "A fire at a substation in London cut off power to one of the world’s busiest airports, causing travel disruptions globally.",
                    "url": "https://www.nytimes.com/2025/03/21/world/europe/london-heathrow-airport-closed.html",
                    "uri": "nyt://article/323e85f2-ae00-5547-9bde-e73dbce524fb",
                    "byline": "By John Yoon and Qasim Nauman",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:03:38-04:00",
                    "created_date": "2025-03-21T02:18:41-04:00",
                    "published_date": "2025-03-21T02:18:41-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Airports",
                        "Fires and Firefighters",
                        "Power Failures and Blackouts"
                    ],
                    "org_facet": [
                        "Heathrow Airport (London, England)"
                    ],
                    "per_facet": [],
                    "geo_facet": [
                        "Great Britain",
                        "London (England)",
                        "England"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/world/21heathrow-WWK/21heathrow-WWK-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1366,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Heathrow Airport is an important travel hub for Britain, Europe and the world.",
                            "copyright": "Jason Alden/Bloomberg"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/world/21heathrow-WWK/21heathrow-WWK-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Heathrow Airport is an important travel hub for Britain, Europe and the world.",
                            "copyright": "Jason Alden/Bloomberg"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/world/21heathrow-WWK/21heathrow-WWK-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Heathrow Airport is an important travel hub for Britain, Europe and the world.",
                            "copyright": "Jason Alden/Bloomberg"
                        }
                    ],
                    "short_url": "",
                    "category": "world",
                    "description": "A fire at a substation in London cut off power to one of the world’s busiest airports, causing travel disruptions globally.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/world/21heathrow-WWK/21heathrow-WWK-superJumbo.jpg",
                    "author": "John Yoon and Qasim Nauman",
                    "date": "2025-03-21T02:18:41-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "europe",
                    "title": "‘We Are Stuck’: Heathrow Closure Creates Havoc for Travelers",
                    "abstract": "Flights for thousands of passengers were disrupted by the shutdown at the airport, which serves London and is one of the world’s major transport hubs.",
                    "url": "https://www.nytimes.com/2025/03/21/world/europe/heathrow-airport-closure-flights.html",
                    "uri": "nyt://article/1faac960-c1f7-5abe-9938-bc424ff15070",
                    "byline": "By Emma Bubola and Qasim Nauman",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:01:07-04:00",
                    "created_date": "2025-03-21T04:28:15-04:00",
                    "published_date": "2025-03-21T04:28:15-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Airlines and Airplanes",
                        "Airports",
                        "Fires and Firefighters"
                    ],
                    "org_facet": [
                        "Air Canada",
                        "American Airlines",
                        "British Airways PLC",
                        "Delta Air Lines Inc",
                        "Heathrow Airport (London, England)",
                        "JetBlue Airways Corporation",
                        "Qantas Airways",
                        "Singapore Airlines",
                        "United Airlines"
                    ],
                    "per_facet": [],
                    "geo_facet": [
                        "London (England)",
                        "Great Britain",
                        "Shenzhen (China)",
                        "Rome (Italy)",
                        "Hong Kong",
                        "England"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21heathrow-hubs-vljc/21heathrow-hubs-vljc-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "A departure board on Friday at Singapore Changi Airport showed the wide-reaching effect of Heathrow’s closing.",
                            "copyright": "Roslan Rahman/Agence France-Presse — Getty Images"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21heathrow-hubs-vljc/21heathrow-hubs-vljc-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "A departure board on Friday at Singapore Changi Airport showed the wide-reaching effect of Heathrow’s closing.",
                            "copyright": "Roslan Rahman/Agence France-Presse — Getty Images"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21heathrow-hubs-vljc/21heathrow-hubs-vljc-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "A departure board on Friday at Singapore Changi Airport showed the wide-reaching effect of Heathrow’s closing.",
                            "copyright": "Roslan Rahman/Agence France-Presse — Getty Images"
                        }
                    ],
                    "short_url": "",
                    "category": "world",
                    "description": "Flights for thousands of passengers were disrupted by the shutdown at the airport, which serves London and is one of the world’s major transport hubs.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21heathrow-hubs-vljc/21heathrow-hubs-vljc-superJumbo.jpg",
                    "author": "Emma Bubola and Qasim Nauman",
                    "date": "2025-03-21T04:28:15-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "business",
                    "subsection": "",
                    "title": "China’s Government Is Short of Money as Its Leaders Face Trump",
                    "abstract": "Tax revenues have fallen, leaving the government with less money to help consumers or exporters as Beijing braces for President Trump’s tariffs.",
                    "url": "https://www.nytimes.com/2025/03/21/business/china-taxes-trump-tariffs.html",
                    "uri": "nyt://article/56dd1f22-4dc6-5c18-bccc-53d2b1c35c74",
                    "byline": "By Keith Bradsher",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:30:45-04:00",
                    "created_date": "2025-03-21T00:00:22-04:00",
                    "published_date": "2025-03-21T00:00:22-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Economic Conditions and Trends",
                        "Prices (Fares, Fees and Rates)",
                        "Customs (Tariff)",
                        "Value-Added Tax"
                    ],
                    "org_facet": [],
                    "per_facet": [
                        "Trump, Donald J",
                        "Xi Jinping"
                    ],
                    "geo_facet": [
                        "China"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/Biz-China-Econ-01-pltf/Biz-China-Econ-01-pltf-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "An aluminium-base material factory in Binzhou, China. Beijing has less money to help Chinese exporters facing tariffs, or to help consumers weather an economic slowdown and housing market crash.",
                            "copyright": "Agence France-Presse — Getty Images"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/Biz-China-Econ-01-pltf/Biz-China-Econ-01-pltf-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "An aluminium-base material factory in Binzhou, China. Beijing has less money to help Chinese exporters facing tariffs, or to help consumers weather an economic slowdown and housing market crash.",
                            "copyright": "Agence France-Presse — Getty Images"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/Biz-China-Econ-01-pltf/Biz-China-Econ-01-pltf-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "An aluminium-base material factory in Binzhou, China. Beijing has less money to help Chinese exporters facing tariffs, or to help consumers weather an economic slowdown and housing market crash.",
                            "copyright": "Agence France-Presse — Getty Images"
                        }
                    ],
                    "short_url": "",
                    "category": "business",
                    "description": "Tax revenues have fallen, leaving the government with less money to help consumers or exporters as Beijing braces for President Trump’s tariffs.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/19/multimedia/Biz-China-Econ-01-pltf/Biz-China-Econ-01-pltf-superJumbo.jpg",
                    "author": "Keith Bradsher",
                    "date": "2025-03-21T00:00:22-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "business",
                    "subsection": "",
                    "title": "‘Who Will Come to Invest?’ China’s Attacks on Panama Canal Deal Alarm Hong Kong",
                    "abstract": "Beijing’s threat to stop a tycoon’s sale of his ports business has dealmakers wondering if they can still operate without political interference.",
                    "url": "https://www.nytimes.com/2025/03/20/business/trump-panama-canal-china-hong-kong.html",
                    "uri": "nyt://article/8ccc4107-d405-580a-ac0b-64752da69da7",
                    "byline": "By Alexandra Stevenson and Joy Dong",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:31:31-04:00",
                    "created_date": "2025-03-20T23:33:54-04:00",
                    "published_date": "2025-03-20T23:33:54-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "International Relations",
                        "Canals"
                    ],
                    "org_facet": [
                        "CK Hutchison Holdings Ltd",
                        "BlackRock Inc",
                        "Hong Kong Stock Exchange"
                    ],
                    "per_facet": [
                        "Li Ka-shing",
                        "Trump, Donald J"
                    ],
                    "geo_facet": [
                        "Panama Canal and Canal Zone",
                        "Hong Kong",
                        "China"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/HK-Panama-Tycoon-01-pqkc/HK-Panama-Tycoon-01-pqkc-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Li Ka-shing in Hong Kong in 2018. The tycoon has built an empire spanning property, shipping, telecommunications and more.",
                            "copyright": "Jerome Favre/EPA, via Shutterstock"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/HK-Panama-Tycoon-01-pqkc/HK-Panama-Tycoon-01-pqkc-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Li Ka-shing in Hong Kong in 2018. The tycoon has built an empire spanning property, shipping, telecommunications and more.",
                            "copyright": "Jerome Favre/EPA, via Shutterstock"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/HK-Panama-Tycoon-01-pqkc/HK-Panama-Tycoon-01-pqkc-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Li Ka-shing in Hong Kong in 2018. The tycoon has built an empire spanning property, shipping, telecommunications and more.",
                            "copyright": "Jerome Favre/EPA, via Shutterstock"
                        }
                    ],
                    "short_url": "",
                    "category": "business",
                    "description": "Beijing’s threat to stop a tycoon’s sale of his ports business has dealmakers wondering if they can still operate without political interference.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/19/multimedia/HK-Panama-Tycoon-01-pqkc/HK-Panama-Tycoon-01-pqkc-superJumbo.jpg",
                    "author": "Alexandra Stevenson and Joy Dong",
                    "date": "2025-03-20T23:33:54-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "europe",
                    "title": "In Germany, ‘Orphaned’ by U.S., Shock Gives Way to Action",
                    "abstract": "No country in Europe is as much a product of enlightened postwar American diplomacy. Now adrift, it has begun to reckon with a new world.",
                    "url": "https://www.nytimes.com/2025/03/21/world/europe/germany-us-ally-relationship-military.html",
                    "uri": "nyt://article/9b7f55f6-10af-5635-a339-ad55dfc3182e",
                    "byline": "By Steven Erlanger",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T06:30:49-04:00",
                    "created_date": "2025-03-21T05:02:42-04:00",
                    "published_date": "2025-03-21T05:02:42-04:00",
                    "material_type_facet": "",
                    "kicker": "News analysis",
                    "des_facet": [
                        "Politics and Government",
                        "International Relations",
                        "Russian Invasion of Ukraine (2022)",
                        "United States International Relations",
                        "Defense and Military Forces",
                        "United States Defense and Military Forces"
                    ],
                    "org_facet": [
                        "European Union",
                        "North Atlantic Treaty Organization"
                    ],
                    "per_facet": [
                        "Trump, Donald J"
                    ],
                    "geo_facet": [
                        "Germany"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-germany-adrift-01-pzwh/21int-germany-adrift-01-pzwh-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "On Tuesday, German lawmakers voted to loosen the country’s debt rules so that it could begin revamping its economy and rebuilding its military.",
                            "copyright": "Ebrahim Noroozi/Associated Press"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-germany-adrift-01-pzwh/21int-germany-adrift-01-pzwh-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "On Tuesday, German lawmakers voted to loosen the country’s debt rules so that it could begin revamping its economy and rebuilding its military.",
                            "copyright": "Ebrahim Noroozi/Associated Press"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-germany-adrift-01-pzwh/21int-germany-adrift-01-pzwh-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "On Tuesday, German lawmakers voted to loosen the country’s debt rules so that it could begin revamping its economy and rebuilding its military.",
                            "copyright": "Ebrahim Noroozi/Associated Press"
                        }
                    ],
                    "short_url": "",
                    "category": "world",
                    "description": "No country in Europe is as much a product of enlightened postwar American diplomacy. Now adrift, it has begun to reckon with a new world.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-germany-adrift-01-pzwh/21int-germany-adrift-01-pzwh-superJumbo.jpg",
                    "author": "Steven Erlanger",
                    "date": "2025-03-21T05:02:42-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "europe",
                    "title": "Russian Energy Sites Burn as Kyiv and Moscow Trade Accusations of Blame",
                    "abstract": "Russia and Ukraine are preparing to discuss a potential cease-fire on power infrastructure, and each is seeking to portray the other side as untrustworthy ahead of talks.",
                    "url": "https://www.nytimes.com/2025/03/21/world/europe/russia-ukraine-power-energy-grid.html",
                    "uri": "nyt://article/1cba96ae-3c92-5026-a721-fb33e3b6afd9",
                    "byline": "By Constant Méheut",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:53:52-04:00",
                    "created_date": "2025-03-21T08:01:40-04:00",
                    "published_date": "2025-03-21T08:01:40-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Russian Invasion of Ukraine (2022)",
                        "Oil (Petroleum) and Gasoline",
                        "Infrastructure (Public Works)"
                    ],
                    "org_facet": [],
                    "per_facet": [],
                    "geo_facet": [
                        "Russia",
                        "Ukraine"
                    ],
                    "multimedia": null,
                    "short_url": "",
                    "category": "world",
                    "description": "Russia and Ukraine are preparing to discuss a potential cease-fire on power infrastructure, and each is seeking to portray the other side as untrustworthy ahead of talks.",
                    "author": "Constant Méheut",
                    "date": "2025-03-21T08:01:40-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "arts",
                    "subsection": "television",
                    "title": "How ‘Severance’ Uses Old Tricks to Make Its Office Hell",
                    "abstract": "Clocks, elevators and cubicles become dystopian signifiers in the television show, which invokes and inverts workplace cinema.",
                    "url": "https://www.nytimes.com/2025/03/21/arts/television/severance-office-life-film-tricks.html",
                    "uri": "nyt://article/34ebfe92-5b38-5b1d-91db-53d488a0b92e",
                    "byline": "By Annie Aguiar",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T10:25:32-04:00",
                    "created_date": "2025-03-21T05:00:47-04:00",
                    "published_date": "2025-03-21T05:00:47-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Severance (TV Program)",
                        "Television",
                        "Movies"
                    ],
                    "org_facet": [
                        "Apple TV"
                    ],
                    "per_facet": [],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/arts/severance-corporate-promo/severance-corporate-promo-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Criterion Collection; Apple TV+"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/arts/severance-corporate-promo/severance-corporate-promo-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Criterion Collection; Apple TV+"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/arts/severance-corporate-promo/severance-corporate-promo-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Criterion Collection; Apple TV+"
                        }
                    ],
                    "short_url": "",
                    "category": "arts",
                    "description": "Clocks, elevators and cubicles become dystopian signifiers in the television show, which invokes and inverts workplace cinema.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/19/arts/severance-corporate-promo/severance-corporate-promo-superJumbo.jpg",
                    "author": "Annie Aguiar",
                    "date": "2025-03-21T05:00:47-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "arts",
                    "subsection": "television",
                    "title": "‘Severance’ Season 2 Finale: Mark vs. Mark",
                    "abstract": "The season ended with a bizarre but moving episode that found the Lumon employees’ inner and outer selves at cross purposes.",
                    "url": "https://www.nytimes.com/2025/03/21/arts/television/severance-season-2-finale-recap.html",
                    "uri": "nyt://article/94076923-53ad-54cf-8d37-8cf1f8886ce1",
                    "byline": "By Noel Murray",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:00:57-04:00",
                    "created_date": "2025-03-21T09:24:07-04:00",
                    "published_date": "2025-03-21T09:24:07-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Television",
                        "Severance (TV Program)"
                    ],
                    "org_facet": [
                        "Apple TV Plus"
                    ],
                    "per_facet": [],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/arts/21severance1/21severance1-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Adam Scott and Britt Lower in the \"Severance\" season finale.",
                            "copyright": "Apple TV+"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/arts/21severance1/21severance1-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Adam Scott and Britt Lower in the \"Severance\" season finale.",
                            "copyright": "Apple TV+"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/arts/21severance1/21severance1-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Adam Scott and Britt Lower in the \"Severance\" season finale.",
                            "copyright": "Apple TV+"
                        }
                    ],
                    "short_url": "",
                    "category": "arts",
                    "description": "The season ended with a bizarre but moving episode that found the Lumon employees’ inner and outer selves at cross purposes.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/arts/21severance1/21severance1-superJumbo.jpg",
                    "author": "Noel Murray",
                    "date": "2025-03-21T09:24:07-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "style",
                    "subsection": "",
                    "title": "What ‘Conservative Cosmo’ Thinks Women Want",
                    "abstract": "The Evie reader can work. She can be a mom. It’s her choice. It’s just not feminism.",
                    "url": "https://www.nytimes.com/2025/03/21/style/evie-magazine.html",
                    "uri": "nyt://article/493105d8-0f94-54ed-817a-2fb8cf50f005",
                    "byline": "By Katie J.M. Baker",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:19:56-04:00",
                    "created_date": "2025-03-21T09:00:14-04:00",
                    "published_date": "2025-03-21T09:00:14-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Women and Girls",
                        "Birth Control and Family Planning"
                    ],
                    "org_facet": [
                        "Evie Magazine",
                        "Cosmopolitan (Magazine)",
                        "Refinery29 Inc"
                    ],
                    "per_facet": [
                        "Thiel, Peter A",
                        "Brittany Hugoboom"
                    ],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/23/multimedia/21EVIE-EDITOR-hvjc/21EVIE-EDITOR-hvjc-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1503,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Brittany Hugoboom, 33, is the co-founder and editor in chief of Evie, a publication dedicated to celebrating “femininity.”",
                            "copyright": "Celeste Sloman for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/23/multimedia/21EVIE-EDITOR-hvjc/21EVIE-EDITOR-hvjc-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Brittany Hugoboom, 33, is the co-founder and editor in chief of Evie, a publication dedicated to celebrating “femininity.”",
                            "copyright": "Celeste Sloman for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/23/multimedia/21EVIE-EDITOR-hvjc/21EVIE-EDITOR-hvjc-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Brittany Hugoboom, 33, is the co-founder and editor in chief of Evie, a publication dedicated to celebrating “femininity.”",
                            "copyright": "Celeste Sloman for The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "style",
                    "description": "The Evie reader can work. She can be a mom. It’s her choice. It’s just not feminism.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/23/multimedia/21EVIE-EDITOR-hvjc/21EVIE-EDITOR-hvjc-superJumbo.jpg",
                    "author": "Katie J.M. Baker",
                    "date": "2025-03-21T09:00:14-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "business",
                    "subsection": "economy",
                    "title": "Why the Shipping Industry Isn’t Rushing Back to the Red Sea",
                    "abstract": "The companies that operate large container ships say they plan to keep going around Africa as violence flares in the region.",
                    "url": "https://www.nytimes.com/2025/03/21/business/economy/red-sea-shipping-houthis.html",
                    "uri": "nyt://article/c91eb249-3bd2-5dcf-b972-54728d1f8ebd",
                    "byline": "By Peter Eavis",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:25:48-04:00",
                    "created_date": "2025-03-21T00:00:23-04:00",
                    "published_date": "2025-03-21T00:00:23-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "United States Politics and Government",
                        "War and Armed Conflicts",
                        "Terrorism",
                        "Israel-Gaza War (2023- )",
                        "Ships and Shipping",
                        "Freight (Cargo)",
                        "United States Defense and Military Forces",
                        "Supply Chain",
                        "United States International Relations",
                        "United States Economy",
                        "International Trade and World Market"
                    ],
                    "org_facet": [
                        "Houthis",
                        "Maersk Line",
                        "United States Air Force"
                    ],
                    "per_facet": [
                        "Trump, Donald J"
                    ],
                    "geo_facet": [
                        "Red Sea",
                        "Suez Canal",
                        "Yemen"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/19biz-redsea-pmqh/19biz-redsea-pmqh-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Vessels aren’t likely to return to the Red Sea while U.S. strikes in Yemen continue.",
                            "copyright": "Naif Rahma/Reuters"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/19biz-redsea-pmqh/19biz-redsea-pmqh-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Vessels aren’t likely to return to the Red Sea while U.S. strikes in Yemen continue.",
                            "copyright": "Naif Rahma/Reuters"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/multimedia/19biz-redsea-pmqh/19biz-redsea-pmqh-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Vessels aren’t likely to return to the Red Sea while U.S. strikes in Yemen continue.",
                            "copyright": "Naif Rahma/Reuters"
                        }
                    ],
                    "short_url": "",
                    "category": "business",
                    "description": "The companies that operate large container ships say they plan to keep going around Africa as violence flares in the region.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/19/multimedia/19biz-redsea-pmqh/19biz-redsea-pmqh-superJumbo.jpg",
                    "author": "Peter Eavis",
                    "date": "2025-03-21T00:00:23-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "middleeast",
                    "title": "Israel Tries to Pressure Hamas to Free More Hostages",
                    "abstract": "Israel’s defense minister said it was preparing to seize more territory in Gaza and intensify attacks unless the Palestinian group freed more of the dozens of remaining captives.",
                    "url": "https://www.nytimes.com/2025/03/21/world/middleeast/israel-hamas-gaza-hostages.html",
                    "uri": "nyt://article/5748a37f-b7a0-5b39-ac61-c757e5ff2e72",
                    "byline": "By Aaron Boxerman",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:57:38-04:00",
                    "created_date": "2025-03-21T07:16:43-04:00",
                    "published_date": "2025-03-21T07:16:43-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Israel-Gaza War (2023- )",
                        "Kidnapping and Hostages",
                        "Defense and Military Forces",
                        "Humanitarian Aid"
                    ],
                    "org_facet": [
                        "Hamas"
                    ],
                    "per_facet": [
                        "Katz, Israel (1955- )"
                    ],
                    "geo_facet": [
                        "Gaza Strip",
                        "Israel"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-israel-gaza-01-zlvg/21int-israel-gaza-01-zlvg-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1365,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Displaced Palestinians in Gaza City with their belongings after the Israeli military issued warnings to evacuate their homes on Thursday.",
                            "copyright": "Saher Alghorra for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-israel-gaza-01-zlvg/21int-israel-gaza-01-zlvg-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Displaced Palestinians in Gaza City with their belongings after the Israeli military issued warnings to evacuate their homes on Thursday.",
                            "copyright": "Saher Alghorra for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-israel-gaza-01-zlvg/21int-israel-gaza-01-zlvg-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Displaced Palestinians in Gaza City with their belongings after the Israeli military issued warnings to evacuate their homes on Thursday.",
                            "copyright": "Saher Alghorra for The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "world",
                    "description": "Israel’s defense minister said it was preparing to seize more territory in Gaza and intensify attacks unless the Palestinian group freed more of the dozens of remaining captives.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21int-israel-gaza-01-zlvg/21int-israel-gaza-01-zlvg-superJumbo.jpg",
                    "author": "Aaron Boxerman",
                    "date": "2025-03-21T07:16:43-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "us",
                    "subsection": "politics",
                    "title": "Were the Kennedy Files a Bust? Not So Fast, Historians Say.",
                    "abstract": "The thousands of documents posted online this week disappointed assassination buffs. But historians are finding many newly revealed secrets.",
                    "url": "https://www.nytimes.com/2025/03/20/us/politics/jfk-assassination-files-cia.html",
                    "uri": "nyt://article/4f6119e0-7239-5853-a6de-512176edd744",
                    "byline": "By Jennifer Schuessler and Julian E. Barnes",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T12:00:56-04:00",
                    "created_date": "2025-03-20T20:40:30-04:00",
                    "published_date": "2025-03-20T20:40:30-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Assassinations and Attempted Assassinations",
                        "Classified Information and State Secrets",
                        "Archives and Records",
                        "Espionage and Intelligence Services",
                        "Cold War Era",
                        "United States Politics and Government",
                        "United States International Relations"
                    ],
                    "org_facet": [
                        "Central Intelligence Agency"
                    ],
                    "per_facet": [
                        "Kennedy, John Fitzgerald"
                    ],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/us/politics/20dc-jfk-security-topart/20dc-jfk-security-topart-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1366,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "President John F. Kennedy made John A. McCone head of the Central Intelligence Agency in 1961. Documents released by the National Archives this week revealed new details about the agency’s operations.",
                            "copyright": "John Rous/Associated Press"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/us/politics/20dc-jfk-security-topart/20dc-jfk-security-topart-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "President John F. Kennedy made John A. McCone head of the Central Intelligence Agency in 1961. Documents released by the National Archives this week revealed new details about the agency’s operations.",
                            "copyright": "John Rous/Associated Press"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/us/politics/20dc-jfk-security-topart/20dc-jfk-security-topart-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "President John F. Kennedy made John A. McCone head of the Central Intelligence Agency in 1961. Documents released by the National Archives this week revealed new details about the agency’s operations.",
                            "copyright": "John Rous/Associated Press"
                        }
                    ],
                    "short_url": "",
                    "category": "us",
                    "description": "The thousands of documents posted online this week disappointed assassination buffs. But historians are finding many newly revealed secrets.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/20/us/politics/20dc-jfk-security-topart/20dc-jfk-security-topart-superJumbo.jpg",
                    "author": "Jennifer Schuessler and Julian E. Barnes",
                    "date": "2025-03-20T20:40:30-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "us",
                    "subsection": "",
                    "title": "Long Before She Was Charged With Murder, a Group of Men Had Raised an Alarm",
                    "abstract": "“I told the judge, I told the D.A., that she was going to kill somebody,” said David Butler, one of several men who said they had been drugged and defrauded by the same woman in New Orleans.",
                    "url": "https://www.nytimes.com/2025/03/21/us/adan-manzano-death-suspect-drugs.html",
                    "uri": "nyt://article/a8d19229-8284-5f7b-8ff2-e70fb4fa2c78",
                    "byline": "By Neil Vigdor",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T08:31:11-04:00",
                    "created_date": "2025-03-21T08:30:42-04:00",
                    "published_date": "2025-03-21T08:30:42-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Computers and the Internet",
                        "Mobile Applications",
                        "Police",
                        "Virtual Currency",
                        "Bars and Nightclubs",
                        "Casinos",
                        "Deaths (Fatalities)",
                        "Robberies and Thefts",
                        "Banking and Financial Institutions",
                        "Luxury Goods and Services",
                        "Credit Cards",
                        "Frauds and Swindling"
                    ],
                    "org_facet": [
                        "Coinbase Inc",
                        "Ethereum Foundation",
                        "Federal Bureau of Investigation",
                        "Las Vegas Review-Journal",
                        "Police Department (New Orleans, La)",
                        "Telemundo Communications Group Inc",
                        "Uber Technologies Inc"
                    ],
                    "per_facet": [
                        "Colbert, Danette",
                        "Manzano, Adan (d 2025)"
                    ],
                    "geo_facet": [
                        "New Orleans (La)",
                        "Orleans Parish (La)",
                        "Louisiana",
                        "Clark County (Nev)",
                        "Las Vegas (Nev)",
                        "Nevada"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21xp-nolascammed-TOP-03-pfzw/21xp-nolascammed-TOP-03-pfzw-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1366,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Danette Colbert was charged in the murder of Adan Manzano. Other men said they had been drugged and robbed of thousands of dollars by the same woman.",
                            "copyright": "Bryan Tarnowski for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21xp-nolascammed-TOP-03-pfzw/21xp-nolascammed-TOP-03-pfzw-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Danette Colbert was charged in the murder of Adan Manzano. Other men said they had been drugged and robbed of thousands of dollars by the same woman.",
                            "copyright": "Bryan Tarnowski for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21xp-nolascammed-TOP-03-pfzw/21xp-nolascammed-TOP-03-pfzw-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Danette Colbert was charged in the murder of Adan Manzano. Other men said they had been drugged and robbed of thousands of dollars by the same woman.",
                            "copyright": "Bryan Tarnowski for The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "us",
                    "description": "“I told the judge, I told the D.A., that she was going to kill somebody,” said David Butler, one of several men who said they had been drugged and defrauded by the same woman in New Orleans.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21xp-nolascammed-TOP-03-pfzw/21xp-nolascammed-TOP-03-pfzw-superJumbo.jpg",
                    "author": "Neil Vigdor",
                    "date": "2025-03-21T08:30:42-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "books",
                    "subsection": "",
                    "title": "Life Isn’t Perfect. But This Poem Might Be.",
                    "abstract": "“Aunt Jennifer’s Tigers,” by Adrienne Rich, is a blazing portrait of an artist and her work. Our critic A.O. Scott admires its craft — and its wildness.",
                    "url": "https://www.nytimes.com/interactive/2025/03/21/books/adrienne-rich-aunt-jennifers-tigers-poem.html",
                    "uri": "nyt://interactive/e67f7cbb-bcf8-576d-aa62-0e1f754f636b",
                    "byline": "By A.O. Scott",
                    "item_type": "Interactive",
                    "updated_date": "2025-03-21T08:19:20-04:00",
                    "created_date": "2025-03-21T05:00:22-04:00",
                    "published_date": "2025-03-21T05:00:22-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Poetry and Poets",
                        "vis-design"
                    ],
                    "org_facet": [],
                    "per_facet": [
                        "Rich, Adrienne"
                    ],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/books/rich-illo/rich-illo-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1638,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Isabella Cotier"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/books/rich-illo/rich-illo-threeByTwoSmallAt2X-v2.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Isabella Cotier"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/books/rich-illo/rich-illo-thumbLarge-v2.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Isabella Cotier"
                        }
                    ],
                    "short_url": "",
                    "category": "books",
                    "description": "“Aunt Jennifer’s Tigers,” by Adrienne Rich, is a blazing portrait of an artist and her work. Our critic A.O. Scott admires its craft — and its wildness.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/books/rich-illo/rich-illo-superJumbo.jpg",
                    "author": "A.O. Scott",
                    "date": "2025-03-21T05:00:22-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "opinion",
                    "subsection": "",
                    "title": "Trump Voters Love Him More Than Before. Four Conservative Columnists Pinpoint Why.",
                    "abstract": "More registered voters think America is on the right track than at any point since 2004, a new poll says. What does that mean about Trump?",
                    "url": "https://www.nytimes.com/2025/03/21/opinion/trump-administration-polling.html",
                    "uri": "nyt://article/b5d8f7ee-e08e-5cd9-ab88-a41531a1ea9d",
                    "byline": "By David Brooks, Ross Douthat, David French and Bret Stephens",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T06:56:56-04:00",
                    "created_date": "2025-03-21T05:04:05-04:00",
                    "published_date": "2025-03-21T05:04:05-04:00",
                    "material_type_facet": "",
                    "kicker": "David Brooks, Ross Douthat, David French and Bret Stephens",
                    "des_facet": [
                        "Conservatism (US Politics)",
                        "United States Economy",
                        "Deportation",
                        "Colleges and Universities",
                        "Polls and Public Opinion",
                        "Presidential Election of 2024",
                        "Federal Courts (US)"
                    ],
                    "org_facet": [],
                    "per_facet": [
                        "Trump, Donald J",
                        "Musk, Elon",
                        "Biden, Joseph R Jr",
                        "Roberts, John G Jr",
                        "Hamilton, Alexander"
                    ],
                    "geo_facet": [
                        "Ukraine"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/opinion/21roundtable/21roundtable-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 2005,
                            "width": 2005,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Illustration by Shoshana Schultz/The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/opinion/21roundtable/21roundtable-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Illustration by Shoshana Schultz/The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/opinion/21roundtable/21roundtable-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Illustration by Shoshana Schultz/The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "opinion",
                    "description": "More registered voters think America is on the right track than at any point since 2004, a new poll says. What does that mean about Trump?",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/opinion/21roundtable/21roundtable-superJumbo.jpg",
                    "author": "David Brooks, Ross Douthat, David French and Bret Stephens",
                    "date": "2025-03-21T05:04:05-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "opinion",
                    "subsection": "",
                    "title": "What Having a Brother With Down Syndrome Has Taught Me About Everyone Else",
                    "abstract": "I’ve always seen my brother as just another kid. Why doesn’t the rest of the world?",
                    "url": "https://www.nytimes.com/2025/03/21/opinion/down-syndrome-family-life.html",
                    "uri": "nyt://article/fad846b0-2a84-595f-9df5-62e36710c504",
                    "byline": "By Jonatas Rubert",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T06:58:08-04:00",
                    "created_date": "2025-03-21T05:00:10-04:00",
                    "published_date": "2025-03-21T05:00:10-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Birth Defects",
                        "Down Syndrome",
                        "Families and Family Life",
                        "your-feed-opinionvideo",
                        "Disabilities"
                    ],
                    "org_facet": [],
                    "per_facet": [],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/01/14/autossell/op-brothers-thumb/op-brothers-thumb-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 720,
                            "width": 1280,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": ""
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/01/14/autossell/op-brothers-thumb/op-brothers-thumb-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": ""
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/01/14/autossell/op-brothers-thumb/op-brothers-thumb-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": ""
                        }
                    ],
                    "short_url": "",
                    "category": "opinion",
                    "description": "I’ve always seen my brother as just another kid. Why doesn’t the rest of the world?",
                    "urlToImage": "https://static01.nyt.com/images/2025/01/14/autossell/op-brothers-thumb/op-brothers-thumb-superJumbo.jpg",
                    "author": "Jonatas Rubert",
                    "date": "2025-03-21T05:00:10-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "briefing",
                    "subsection": "",
                    "title": "The Size of the Tax Cut",
                    "abstract": "We explain how Republicans are approaching taxes.",
                    "url": "https://www.nytimes.com/2025/03/21/briefing/the-size-of-the-tax-cut.html",
                    "uri": "nyt://article/92de31d5-12b4-5f3c-ac17-c037ee8bb53c",
                    "byline": "By Andrew Duehren",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:26:54-04:00",
                    "created_date": "2025-03-21T06:34:35-04:00",
                    "published_date": "2025-03-21T06:34:35-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "internal-storyline-no",
                        "United States Politics and Government",
                        "Politics and Government",
                        "Law and Legislation",
                        "United States Economy"
                    ],
                    "org_facet": [],
                    "per_facet": [],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21themorning-nl-LEAD-01-tkpb/21themorning-nl-LEAD-01-tkpb-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1792,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "House Speaker Mike Johnson",
                            "copyright": "Haiyun Jiang for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21themorning-nl-LEAD-01-tkpb/21themorning-nl-LEAD-01-tkpb-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "House Speaker Mike Johnson",
                            "copyright": "Haiyun Jiang for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21themorning-nl-LEAD-01-tkpb/21themorning-nl-LEAD-01-tkpb-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "House Speaker Mike Johnson",
                            "copyright": "Haiyun Jiang for The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "briefing",
                    "description": "We explain how Republicans are approaching taxes.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21themorning-nl-LEAD-01-tkpb/21themorning-nl-LEAD-01-tkpb-superJumbo.jpg",
                    "author": "Andrew Duehren",
                    "date": "2025-03-21T06:34:35-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "arts",
                    "subsection": "television",
                    "title": "Late Night Flunks Trump for Gutting the Department of Education",
                    "abstract": "“Trump famously said he loves the poorly educated, and now he will have so many more people to love,” Jimmy Kimmel said on Thursday.",
                    "url": "https://www.nytimes.com/2025/03/21/arts/television/late-night-trump-department-of-education.html",
                    "uri": "nyt://article/5e865e4d-3810-5454-8b72-797667b39cee",
                    "byline": "By Trish Bendix",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T02:43:18-04:00",
                    "created_date": "2025-03-21T02:15:42-04:00",
                    "published_date": "2025-03-21T02:15:42-04:00",
                    "material_type_facet": "",
                    "kicker": "Best of Late Night",
                    "des_facet": [
                        "Television",
                        "Jimmy Kimmel Live (TV Program)",
                        "The Tonight Show (TV Program)",
                        "The Daily Show with Trevor Noah (TV Program)"
                    ],
                    "org_facet": [],
                    "per_facet": [
                        "Kimmel, Jimmy",
                        "Fallon, Jimmy",
                        "Klepper, Jordan",
                        "Gutfeld, Greg"
                    ],
                    "geo_facet": [],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/arts/21latenight/21latenight-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1109,
                            "width": 1895,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "“They say ignorance is bliss,” Jimmy Kimmel noted during his Thursday monologue. ",
                            "copyright": "ABC"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/arts/21latenight/21latenight-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "“They say ignorance is bliss,” Jimmy Kimmel noted during his Thursday monologue. ",
                            "copyright": "ABC"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/arts/21latenight/21latenight-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "“They say ignorance is bliss,” Jimmy Kimmel noted during his Thursday monologue. ",
                            "copyright": "ABC"
                        }
                    ],
                    "short_url": "",
                    "category": "arts",
                    "description": "“Trump famously said he loves the poorly educated, and now he will have so many more people to love,” Jimmy Kimmel said on Thursday.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/arts/21latenight/21latenight-superJumbo.jpg",
                    "author": "Trish Bendix",
                    "date": "2025-03-21T02:15:42-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "weather",
                    "subsection": "",
                    "title": "How Desert Southwest Dust Ends Up on Your Windshield in Des Moines",
                    "abstract": "Rare back-to-back wind events have spread dust from Texas and New Mexico across the eastern U.S. and Canada.",
                    "url": "https://www.nytimes.com/2025/03/21/weather/dust-storm.html",
                    "uri": "nyt://article/f7b90c8d-d502-55fc-8747-7d4e965f4088",
                    "byline": "By Amy Graff, Nazaneen Ghaffar and Judson Jones",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T05:30:07-04:00",
                    "created_date": "2025-03-21T05:30:07-04:00",
                    "published_date": "2025-03-21T05:30:07-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Weather",
                        "Dust and Sand Storms",
                        "Deserts",
                        "Wind"
                    ],
                    "org_facet": [],
                    "per_facet": [],
                    "geo_facet": [
                        "Charleston (W Va)",
                        "Southwestern States (US)"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/autossell/weather-satellite-cover/weather-satellite-cover-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1080,
                            "width": 1620,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "NOAA/RAMMB/CIRA"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/autossell/weather-satellite-cover/weather-satellite-cover-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "NOAA/RAMMB/CIRA"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/19/autossell/weather-satellite-cover/weather-satellite-cover-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "NOAA/RAMMB/CIRA"
                        }
                    ],
                    "short_url": "",
                    "category": "weather",
                    "description": "Rare back-to-back wind events have spread dust from Texas and New Mexico across the eastern U.S. and Canada.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/19/autossell/weather-satellite-cover/weather-satellite-cover-superJumbo.jpg",
                    "author": "Amy Graff, Nazaneen Ghaffar and Judson Jones",
                    "date": "2025-03-21T05:30:07-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "us",
                    "subsection": "politics",
                    "title": "Supreme Court Rules for Chicago Politician in Bank Fraud Case",
                    "abstract": "The justices unanimously said a law prohibiting “any false statement or report” did not cover misleading assertions that fell short of outright lies.",
                    "url": "https://www.nytimes.com/2025/03/21/us/politics/supreme-court-chicago-politician-fraud.html",
                    "uri": "nyt://article/e7cbf934-43f9-52af-a965-7cda0c0d742f",
                    "byline": "By Adam Liptak",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T11:34:33-04:00",
                    "created_date": "2025-03-21T11:34:33-04:00",
                    "published_date": "2025-03-21T11:34:33-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Decisions and Verdicts",
                        "Frauds and Swindling",
                        "Banking and Financial Institutions",
                        "United States Politics and Government"
                    ],
                    "org_facet": [
                        "Supreme Court (US)",
                        "Washington Federal Bank for Savings",
                        "Federal Deposit Insurance Corp"
                    ],
                    "per_facet": [
                        "Thompson, Patrick Daley (1969- )"
                    ],
                    "geo_facet": [
                        "Chicago (Ill)"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-scotus-mcwq/21dc-scotus-mcwq-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1333,
                            "width": 2000,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Patrick Daley Thompson, a former Chicago alderman, conceded that he had misled regulators but said that did not make his statements criminal.",
                            "copyright": "Armando L. Sanchez/Chicago Tribune, via Getty Images"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-scotus-mcwq/21dc-scotus-mcwq-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Patrick Daley Thompson, a former Chicago alderman, conceded that he had misled regulators but said that did not make his statements criminal.",
                            "copyright": "Armando L. Sanchez/Chicago Tribune, via Getty Images"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-scotus-mcwq/21dc-scotus-mcwq-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Patrick Daley Thompson, a former Chicago alderman, conceded that he had misled regulators but said that did not make his statements criminal.",
                            "copyright": "Armando L. Sanchez/Chicago Tribune, via Getty Images"
                        }
                    ],
                    "short_url": "",
                    "category": "us",
                    "description": "The justices unanimously said a law prohibiting “any false statement or report” did not cover misleading assertions that fell short of outright lies.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/21/multimedia/21dc-scotus-mcwq/21dc-scotus-mcwq-superJumbo.jpg",
                    "author": "Adam Liptak",
                    "date": "2025-03-21T11:34:33-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "world",
                    "subsection": "americas",
                    "title": "Clues From Inside an ‘Extermination Camp’ Promise Despair and Hope",
                    "abstract": "The discovery of an “extermination camp” outside a small village in Mexico has sent families searching for their missing loved ones into a mix of turmoil and hope for answers.",
                    "url": "https://www.nytimes.com/2025/03/21/world/americas/mexico-extermination-camp.html",
                    "uri": "nyt://article/57956a27-3f78-5071-a1d5-90065f363a4a",
                    "byline": "By Paulina Villegas and Fred Ramos",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:26:35-04:00",
                    "created_date": "2025-03-21T05:03:57-04:00",
                    "published_date": "2025-03-21T05:03:57-04:00",
                    "material_type_facet": "",
                    "kicker": "Mexico Dispatch",
                    "des_facet": [
                        "Missing Persons",
                        "Drug Cartels",
                        "Deaths (Fatalities)"
                    ],
                    "org_facet": [
                        "Jalisco New Generation Cartel"
                    ],
                    "per_facet": [
                        "Sheinbaum, Claudia"
                    ],
                    "geo_facet": [
                        "Guadalajara (Mexico)",
                        "Jalisco (Mexico)",
                        "Mexico"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/20vid-mexico-drone-10672-cover/20vid-mexico-drone-10672-cover-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1080,
                            "width": 1620,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": ""
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/20vid-mexico-drone-10672-cover/20vid-mexico-drone-10672-cover-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": ""
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/20vid-mexico-drone-10672-cover/20vid-mexico-drone-10672-cover-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": ""
                        }
                    ],
                    "short_url": "",
                    "category": "world",
                    "description": "The discovery of an “extermination camp” outside a small village in Mexico has sent families searching for their missing loved ones into a mix of turmoil and hope for answers.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/20/20vid-mexico-drone-10672-cover/20vid-mexico-drone-10672-cover-superJumbo.jpg",
                    "author": "Paulina Villegas and Fred Ramos",
                    "date": "2025-03-21T05:03:57-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "us",
                    "subsection": "politics",
                    "title": "Alexandria Ocasio-Cortez Puts Her Own Spin on Bernie Sanders’s Pitch",
                    "abstract": "The two progressive leaders, one young and one old, are touring Western cities with a similar message but a key difference in how they sell it.",
                    "url": "https://www.nytimes.com/2025/03/20/us/politics/aoc-bernie-sanders-vegas-denver.html",
                    "uri": "nyt://article/28e95947-ce36-5a48-953b-4523b5d5547a",
                    "byline": "By Reid J. Epstein",
                    "item_type": "Article",
                    "updated_date": "2025-03-21T09:27:17-04:00",
                    "created_date": "2025-03-20T21:41:05-04:00",
                    "published_date": "2025-03-20T21:41:05-04:00",
                    "material_type_facet": "",
                    "kicker": "Political Memo",
                    "des_facet": [
                        "Liberalism (US Politics)",
                        "Presidential Election of 2028",
                        "United States Politics and Government"
                    ],
                    "org_facet": [
                        "Democratic Party"
                    ],
                    "per_facet": [
                        "Sanders, Bernard",
                        "Ocasio-Cortez, Alexandria",
                        "Trump, Donald J"
                    ],
                    "geo_facet": [
                        "Las Vegas (Nev)"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/multimedia/20pol-sanders-aoc-topart-lctv/20pol-sanders-aoc-topart-lctv-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1366,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Representative Alexandria Ocasio-Cortez, Democrat of New York, kicked off a series of events with Senator Bernie Sanders, independent of Vermont, in North Las Vegas, Nev., on Thursday.",
                            "copyright": "Mikayla Whitmore for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/multimedia/20pol-sanders-aoc-topart-lctv/20pol-sanders-aoc-topart-lctv-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Representative Alexandria Ocasio-Cortez, Democrat of New York, kicked off a series of events with Senator Bernie Sanders, independent of Vermont, in North Las Vegas, Nev., on Thursday.",
                            "copyright": "Mikayla Whitmore for The New York Times"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/20/multimedia/20pol-sanders-aoc-topart-lctv/20pol-sanders-aoc-topart-lctv-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "Representative Alexandria Ocasio-Cortez, Democrat of New York, kicked off a series of events with Senator Bernie Sanders, independent of Vermont, in North Las Vegas, Nev., on Thursday.",
                            "copyright": "Mikayla Whitmore for The New York Times"
                        }
                    ],
                    "short_url": "",
                    "category": "us",
                    "description": "The two progressive leaders, one young and one old, are touring Western cities with a similar message but a key difference in how they sell it.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/20/multimedia/20pol-sanders-aoc-topart-lctv/20pol-sanders-aoc-topart-lctv-superJumbo.jpg",
                    "author": "Reid J. Epstein",
                    "date": "2025-03-20T21:41:05-04:00",
                    "sourceName": "New York Times"
                },
                {
                    "section": "t-magazine",
                    "subsection": "",
                    "title": "Could You Live in an Acid Green Apartment?",
                    "abstract": "The jewelry designer Bea Bongiasca’s Milan studio is a celebration of color and creativity.",
                    "url": "https://www.nytimes.com/2025/03/19/t-magazine/bea-bongiasca-milan-apartment.html",
                    "uri": "nyt://article/50a3ba60-0336-5a6c-a2cd-eb3ade412908",
                    "byline": "By Laura May Todd",
                    "item_type": "Article",
                    "updated_date": "2025-03-19T17:13:42-04:00",
                    "created_date": "2025-03-19T16:39:07-04:00",
                    "published_date": "2025-03-19T16:39:07-04:00",
                    "material_type_facet": "",
                    "kicker": "",
                    "des_facet": [
                        "Interior Design and Furnishings",
                        "Jewels and Jewelry"
                    ],
                    "org_facet": [],
                    "per_facet": [
                        "Bongiasca, Bea",
                        "Locatelli, Massimiliano"
                    ],
                    "geo_facet": [
                        "Milan (Italy)"
                    ],
                    "multimedia": [
                        {
                            "url": "https://static01.nyt.com/images/2025/03/12/t-magazine/12tmag-bea-bongiasca-slide-18R8-copy/12tmag-bea-bongiasca-slide-18R8-copy-superJumbo.jpg",
                            "format": "Super Jumbo",
                            "height": 1366,
                            "width": 2048,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Paolo Lobbia"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/12/t-magazine/12tmag-bea-bongiasca-slide-18R8-copy/12tmag-bea-bongiasca-slide-18R8-copy-threeByTwoSmallAt2X.jpg",
                            "format": "threeByTwoSmallAt2X",
                            "height": 400,
                            "width": 600,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Paolo Lobbia"
                        },
                        {
                            "url": "https://static01.nyt.com/images/2025/03/12/t-magazine/12tmag-bea-bongiasca-slide-18R8-copy/12tmag-bea-bongiasca-slide-18R8-copy-thumbLarge.jpg",
                            "format": "Large Thumbnail",
                            "height": 150,
                            "width": 150,
                            "type": "image",
                            "subtype": "photo",
                            "caption": "",
                            "copyright": "Paolo Lobbia"
                        }
                    ],
                    "short_url": "",
                    "category": "t-magazine",
                    "description": "The jewelry designer Bea Bongiasca’s Milan studio is a celebration of color and creativity.",
                    "urlToImage": "https://static01.nyt.com/images/2025/03/12/t-magazine/12tmag-bea-bongiasca-slide-18R8-copy/12tmag-bea-bongiasca-slide-18R8-copy-superJumbo.jpg",
                    "author": "Laura May Todd",
                    "date": "2025-03-19T16:39:07-04:00",
                    "sourceName": "New York Times"
                }
            ]
            var result: any[] = [];
            const uniqueCategories = new Set<string>();
            const currCategory = selCategory ? selCategory : currentCategory;
            const currAuthors = selAuthors ? selAuthors : authors;
            // Filter based on sources and categories
            combinedResults.forEach((article) => {
                let date = new Date(article.date);
                // Format date to be more readable
                article.date = date.toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' });
                article.category = article.category ? article.category : "general";
                // If the data comes from the selected source
                if ((selSource ? selSource : source).includes(article.sourceName))
                    // If the category is the same as the selected category or no category
                    if (currCategory.includes(article.category)) {
                        // If authors are selected, only show articles by those authors
                        if (currAuthors.length) {
                            if (article.author && currAuthors.includes(article.author)) {
                                result.push(article);
                            }
                        } else {
                            result.push(article);
                        }
                    }
                uniqueCategories.add(article.category);
            });
            setArticles(combinedResults);
            setArticlesAfterFilter(result);
            const uniqueCategoriesArray: string[] = [...uniqueCategories];
            setAvailableCategories(uniqueCategoriesArray);
            // To reset category filter
            setCurrentCategory(selCategory?.length ? selCategory : uniqueCategoriesArray);
            // To reset date filter
            setSelectionRange({
                startDate: undefined,
                endDate: undefined,
                key: 'selection',
            })
        } catch (err) {
        } finally {
            setIsLoaded(true);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    useEffect(() => {
        // Fetch data only after fetching personalised data
        if (gotPersonilisedData) {
            fetchData(source, currentCategory, undefined);
        }
    }, [debouncedSearchTerm, gotPersonilisedData]);

    // Filter data whenever filters change
    useEffect(() => {
        try {
            console.log(currentCategory, source, articles, selectionRange)
            var result: any[] = [];
            // Filter based on sources and categories
            articles.forEach((article) => {
                if (source.includes(article.sourceName)) {
                    if (selectionRange.startDate && selectionRange.endDate) {
                        const articleDate = new Date(article.date);
                        if (articleDate >= selectionRange.startDate && articleDate <= selectionRange.endDate) {
                            if (currentCategory.includes(article.category)) {
                                // If authors are selected, only show articles by those authors
                                if (authors.length) {
                                    if (article.author && authors.includes(article.author)) {
                                        result.push(article);
                                    }
                                } else {
                                    result.push(article);
                                }
                            }
                        }
                    } else {
                        if (currentCategory.includes(article.category)) {
                            // If authors are selected, only show articles by those authors
                            if (authors.length) {
                                if (article.author && authors.includes(article.author)) {
                                    result.push(article);
                                }
                            } else {
                                result.push(article);
                            }
                        }
                    }
                }
            });
            setArticlesAfterFilter(result);
        } catch (err) {
        } finally {
        }
    }, [currentCategory, source, selectionRange, articles, source, authors, currentCategory]);

    const handleSelect = useCallback((ranges: { selection: DateSelectionType }) => {
        setSelectionRange({ ...ranges.selection });
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDateDrawer(false);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, height: "100vh" }}>
            <PreferencesModal
                open={preferencesOpen}
                onClose={() => setPreferencesOpen(false)}
                availableSources={availableSources}
                onSave={handleSavePreferences}
            />
            <AppBar sx={{ backgroundColor: "#D9AFD9", backgroundImage: "linear-gradient(to right, #cdc6c6 0%, #9b9494 51%, #939393 72%)" }} position="static">
                <Toolbar sx={{
                    flexDirection: { xs: 'column', sm: "column", md: "row" },
                    padding: { xs: '8px 16px', sm: "0px 24px" },
                    gap: { xs: '2px' },
                    justifyContent: "space-between"
                }}>
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                        <Newspaper sx={{ color: "#535370" }} />
                        <Typography noWrap variant="h6" component="div" sx={{ color: "#1f1f29ab", flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: { xs: "bold" } }}>
                            News Aggregator
                        </Typography>
                    </Stack>
                    <Stack alignItems="center" sx={{ flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", md: "initial" }, justifyContent: { sm: "space-between" } }}>
                        <Stack flexDirection="row">
                            <IconButton onClick={() => setDateDrawer(true)}>
                                <CalendarMonth />
                            </IconButton>
                            <MultiSelectDropdown itemType='Source' options={availableSources} selectedValue={source} onSelectChange={setSource} />
                            <MultiSelectDropdown itemType='Category' options={availableCategories} selectedValue={currentCategory} onSelectChange={setCurrentCategory} />
                            {/* <CategoryFilter categories={availableCategories} selectedCategory={currentCategory} onSelectCategory={setCurrentCategory} /> */}
                        </Stack>
                        <Stack flexDirection="row" sx={{ justifyContent: { xs: "space-between", sm: "end" }, width: "100%" }}>
                            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
                        </Stack>
                    </Stack>
                    <DateRangeDrawer selectionRange={selectionRange} open={dateDrawer} onClose={handleDrawerClose} onSelect={handleSelect} />
                </Toolbar>
            </AppBar>
            <Stack alignContent={"start"} justifyContent={articlesAfterFilter.length === 0 ? "center" : "initial"} flexDirection="row" flexWrap={"wrap"} sx={{ minHeight: "calc(100vh - 98px)", borderTop: "1px solid #7c6b6b", background: "linear-gradient(to right, #cdc6c6 0%, #9b9494 51%, #939393 72%)", rowGap: "8px", columnGap: "8px", padding: "16px", "@media (max-width: 900px)":{ minHeight: "calc(100vh - 120px)" }, "@media (max-width: 600px)":{ minHeight: "calc(100vh - 166px)" }  }}>
                {
                    authors.length > 0 ?
                        <Typography variant="h6" sx={{ textAlign:"center", width:"100%", display: "flex", justifyContent: "center", color: "#1f1f29ab", "@media (max-width: 400px)":{ fontSize: "0.7rem" } }}>{"Selected Authors: " + authors.join(", ")}</Typography> : ""
                }
                {
                    !isLoaded ?
                        dummyItems.map((article, idx) => <NewsCardSkeleton key={idx} />) :
                        (
                            articlesAfterFilter.length === 0 ? <Typography variant="h6" sx={{ color: "#1f1f29ab" }}>No Articles Found</Typography> :
                                articlesAfterFilter.map((article, idx) => <NewsCard category={article.category} key={idx} date={article.date} url={article.url} title={article.title} subtitle={article.description} imageUrl={article.urlToImage} author={article.author} />)
                        )
                }
            </Stack>
            <IconButton
                sx={{
                    position: "fixed",
                    zIndex: 1000,
                    right: "3rem",
                    bottom: "3rem",
                    height: "50px",
                    width: "50px",
                    background: "linear-gradient(to right, #cdc6c6 0%, #9b9494 51%, #939393 72%)",
                    border: "2px solid #4835359c",
                    borderRadius: "10px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    '&:hover': {
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        background: "linear-gradient(to right, #cdc6c6 0%, #9b9494 40%, #939393 72%)"
                    }
                }}
                onClick={() => setPreferencesOpen(true)}
            >
                <Tune />
            </IconButton>
        </Box>
    );
};

export default HomePage;

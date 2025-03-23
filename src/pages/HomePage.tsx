import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Stack, AppBar, Box, Toolbar, IconButton, Typography } from '@mui/material';
import { NewsCard, NewsCardSkeleton } from '../components/NewsCard.tsx';
import { Tune, Newspaper, CalendarMonth } from '@mui/icons-material';
import { MultiSelectDropdown, SearchBar, TitleComponent } from '../components/CommonComponents.tsx';
import PreferencesModal from '../components/PreferencesModal.tsx';
import { getPreferences } from '../components/UtilityFunctions.ts';
import { fetchGuardianData, fetchNewsApiData, fetchNYTData } from '../service/fetchAggregatedData.ts';
import { DateRangeDrawer, DateSelectionType } from '../components/DateRangeDrawer.tsx';


const PreferenceButton: React.FC<{ onClick: () => void }> = React.memo(({ onClick }) => {
    return (
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
            onClick={onClick}
        >
            <Tune />
        </IconButton>
    )
});

const HomePage: React.FC = () => {
    // State to store the sources, category and date filter to be used in the filter components
    const [source, setSource] = useState<string[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string[]>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    //State to store the search term
    const [searchTerm, setSearchTerm] = useState('');
    // const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    // Available sources for user preferences
    const availableSources = React.useMemo(() => [
        "New York Times",
        "News API",
        "The Guardian"
    ], []);
    const [selectionRange, setSelectionRange] = useState<DateSelectionType>({
        startDate: undefined,
        endDate: undefined,
        key: 'selection',
    });
    const [gotPersonilisedData, setGotPersonilisedData] = useState(false);
    // State to track toggle of date filter and preferences drawer
    const [dateDrawer, setDateDrawer] = useState(false);
    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [articlesAfterFilter, setArticlesAfterFilter] = useState<any[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[] | any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const titleIcon = useMemo(() => <Newspaper sx={{ color: "#535370" }} />, []);

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


    const dummyItems = React.useMemo(() => Array.from({ length: 12 }, (_, id) => id + 1), []);

    const fetchData = async (searchText: string, selSource: string[] | undefined, selCategory: string[], selAuthors: string[] | undefined, onLoad?: boolean) => {
        setIsLoaded(false);

        try {
            // Create a mapping of sources to their respective fetch functions
            const sourceFetchers: Record<string, Function> = {
                'News API': fetchNewsApiData,
                'The Guardian': fetchGuardianData,
                'New York Times': fetchNYTData,
            };

            // Push relevant promises into the array based on the selected sources
            const promises = Object.keys(sourceFetchers).map((source) => sourceFetchers[source](searchText));

            // Wait for all promises to resolve and combine the results
            const combinedResults = (await Promise.all(promises)).flat();
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
            setCurrentCategory(onLoad ? (selCategory.length ? selCategory : Array.from(uniqueCategories)) : selCategory);
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

    const fetchNews = (onLoad:boolean = false) => {
        fetchData(searchTerm, source, currentCategory, authors, onLoad);
    };

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setDebouncedSearchTerm(searchTerm);
    //     }, 1000);

    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, [searchTerm]);

    useEffect(() => {
        // Fetch data only after fetching personalised data
        if (gotPersonilisedData) {
            fetchNews(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gotPersonilisedData]);

    // Filter data whenever filters change
    useEffect(() => {
        try {
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
    }, [selectionRange, articles, source, authors, currentCategory]);

    const handleSelect = useCallback((ranges: { selection: DateSelectionType }) => {
        setSelectionRange({ ...ranges.selection });
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDateDrawer(false);
    }, []);

    const handlePreferenceOpen = useCallback(() => {
        setPreferencesOpen(true);
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
                    <TitleComponent title="News Aggregator" icon={titleIcon} />
                    <Stack alignItems="center" sx={{ flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", md: "initial" }, justifyContent: { sm: "space-between" } }}>
                        <Stack flexDirection="row">
                            <IconButton onClick={() => setDateDrawer(true)}>
                                <CalendarMonth />
                            </IconButton>
                            <MultiSelectDropdown itemType='Source' options={availableSources} selectedValue={source} onSelectChange={setSource} />
                            <MultiSelectDropdown itemType='Category' options={availableCategories} selectedValue={currentCategory} onSelectChange={setCurrentCategory} />
                        </Stack>
                        <Stack flexDirection="row" sx={{ justifyContent: { xs: "space-between", sm: "end" }, width: "100%" }}>
                            <SearchBar onEnterClick={fetchNews} searchTerm={searchTerm} onSearch={setSearchTerm} />
                        </Stack>
                    </Stack>
                    <DateRangeDrawer selectionRange={selectionRange} open={dateDrawer} onClose={handleDrawerClose} onSelect={handleSelect} />
                </Toolbar>
            </AppBar>
            <Stack alignContent={"start"} justifyContent={articlesAfterFilter.length === 0 ? "center" : "initial"} flexDirection="row" flexWrap={"wrap"} sx={{ minHeight: "calc(100vh - 98px)", borderTop: "1px solid #7c6b6b", background: "linear-gradient(to right, #cdc6c6 0%, #9b9494 51%, #939393 72%)", rowGap: "8px", columnGap: "8px", padding: "16px", "@media (max-width: 900px)": { minHeight: "calc(100vh - 120px)" }, "@media (max-width: 600px)": { minHeight: "calc(100vh - 166px)" } }}>
                {
                    authors.length > 0 ?
                        <Typography variant="h6" sx={{ textAlign: "center", width: "100%", display: "flex", justifyContent: "center", color: "#1f1f29ab", "@media (max-width: 400px)": { fontSize: "0.7rem" } }}>{"Selected Authors: " + authors.join(", ")}</Typography> : ""
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
            <PreferenceButton onClick={handlePreferenceOpen} />
        </Box>
    );
};

export default HomePage;

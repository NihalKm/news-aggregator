import axios from 'axios';

const newsApiClient = axios.create({
  baseURL: 'https://newsapi.org/v2/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    apiKey: '8a85d593f78345ea9fd6b2f99259c571', // To set API key as a default query parameter
    Language: "en" // To set language "en" as a default query parameter
  },
});

const guardianApiClient = axios.create({
  baseURL: 'https://content.guardianapis.com/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    "api-key": '6ad49e04-0805-4958-876e-29ea4e350b49', /// To set API key as a default query parameter
    "show-fields": "trailText,headline,thumbnail,byline", // To set fields as a default query parameter
    "page-size": 25, // To set page size as a default query parameter
  },
});

const newYorkTimesApiClient = axios.create({
  baseURL: 'https://api.nytimes.com/svc/topstories/v2/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    "api-key": 'YHdYpAQXV7FmA1f0zgbGtoMVXSeZkALb', /// To set API key as a default query parameter
  },
});

export { newsApiClient, guardianApiClient, newYorkTimesApiClient };

const getPreferences = (availableSources:string[]) => {
  const storedPreferences = localStorage.getItem("preferences") || "{}";
  const parsedPreferences = JSON.parse(storedPreferences);
  //To set default sources if no preferences are stored
  const sources = parsedPreferences.selectedSources ? parsedPreferences.selectedSources : availableSources;
  const category = parsedPreferences.selectedCategory || [];
  const authors = parsedPreferences.selectedAuthors || [];

  return {
    sources,
    category,
    authors
  };
};

export { getPreferences };

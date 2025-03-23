import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Divider, Drawer, IconButton, Stack, Tab, Tabs } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getPreferences } from './UtilityFunctions.ts';
import { ToggleComponent, TabPanel } from './CommonComponents.tsx';
import { ArrowBack, Newspaper, Draw, Category, SaveAs } from '@mui/icons-material';
interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
  availableSources: string[];
  onSave: (selectedSources: string[], selectedCategory: string[], selectedAuthors: string[]) => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = React.memo(({ open, onClose, availableSources, onSave }) => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // Hardcoded authors for preferences
  const availableAuthors = [
    "The Associated Press",
    "Michael David Smith",
    "TMZ Staff",
    "NBC Staff",
    "Anam Hamid",
    "Web Desk",
    "Michael Williams",
    "Rebecca Falconer",
    "Georgia Nicols",
    "Barron's",
    "Avery Lotz",
    "Zoe Williams",
    "David Brindle",
    "Guardian staff",
    "Eva Wiseman",
    "Kareem Abdul-Jabbar",
    "Mark Lawson",
    "Alan Feuer",
    "Luke Broadwater",
    "Elisabeth Bumiller"
  ]
  // Hardcoded categories for preferences
  const availableCategories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
    "Politics",
    "World news",
    "Society",
    "Sport",
    "weather",
    "arts",
    "Media"
  ];

  useEffect(() => {
    //To get user preferences if stored; else set default preferences
    const { sources, category, authors } = getPreferences(availableSources);
    setSelectedSources(sources);
    setSelectedCategory(category);
    setSelectedAuthors(authors);
  }, [availableSources]);

  const handleSave = () => {
    onSave(selectedSources, selectedCategory, selectedAuthors);
    const preferences = {
      selectedSources,
      selectedCategory,
      selectedAuthors,
    };
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }

  const setFunctionMap: Record<string, Function> = useMemo(() => ({
    "setSelectedSources": setSelectedSources,
    "setSelectedCategory": setSelectedCategory,
    "setSelectedAuthors": setSelectedAuthors
  }), []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let { item, setFunction } = JSON.parse(event.target.name);
    if (event.target.checked) {
      setFunctionMap[setFunction]((prev) => [...prev, item]);
    } else {
      setFunctionMap[setFunction]((prev) => prev.filter((s) => s !== item));
    }
  }, [])

  return (
    <Drawer PaperProps={{ sx: { borderRadius: "0px 0px 30px 30px", width: { md:"70%" }, left: { md:"15%" } } }} anchor={"top"} open={open} onClose={onClose}>
      <Stack divider={<Divider orientation="horizontal" flexItem />}>
        <Stack justifyContent={"space-between"} flexDirection="row" >
          <IconButton onClick={onClose}>
            <ArrowBack />
          </IconButton>
          <h2 style={{ textAlign: "center", flex:1, color:"#9d8f8f" }}>Customize Your Feed</h2>
        </Stack>
        <Stack style={{ padding: '0px 20px 12px', borderBottom: '4px solid #3d3b3b', borderRadius: "30px" }}>
          <Tabs TabIndicatorProps={{ style: { backgroundColor: "#8c5f5f" } }} value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} variant="fullWidth">
            <Tab sx={{textTransform:"capitalize", '&.Mui-selected':{color: "#aa6d6d"}, '&:focus':{ color: "#aa6d6d"}}} icon={<Newspaper sx={{ '@media (max-width: 500px)':{ fontSize: "1rem"} }} />} label="Source" />
            <Tab sx={{textTransform:"capitalize", '&.Mui-selected':{color: "#aa6d6d"}, '&:focus':{ color: "#aa6d6d"}}} icon={<Category sx={{ '@media (max-width: 500px)':{ fontSize: "1rem"} }} />} label="Category" />
            <Tab sx={{textTransform:"capitalize", '&.Mui-selected':{color: "#aa6d6d"}, '&:focus':{ color: "#aa6d6d"}}} icon={<Draw sx={{ '@media (max-width: 500px)':{ fontSize: "1rem"} }} />} label="Author" />
          </Tabs>
          <TabPanel value={selectedTab} index={0} >
            {/* Sources */}
            {/* <h4 style={{ margin: "8px 0px" }}>Sources</h4> */}
            <Stack flexDirection={"column"} flexWrap={"wrap"} gap={"1rem"}>
              {
                availableSources.map((source, idx) => (
                  <ToggleComponent key={idx} label={source} value={selectedSources.includes(source)} name={JSON.stringify({ item: source, setFunction: "setSelectedSources" })} onChange={handleChange} />
                ))
              }
            </Stack>
          </TabPanel>
          <TabPanel value={selectedTab} index={1} >
            {/* Categories */}
            {/* <h4 style={{ margin: "8px 0px" }}>Categories</h4> */}
            <Stack flexDirection={"column"} flexWrap={"wrap"} textTransform={"capitalize"} gap={"1rem"}>
              {
                availableCategories.map((category, idx) => (
                  <ToggleComponent key={idx} label={category} value={selectedCategory.includes(category)} name={JSON.stringify({ item: category, setFunction: "setSelectedCategory" })} onChange={handleChange} />
                ))
              }
            </Stack>
          </TabPanel>
          <TabPanel value={selectedTab} index={2} >
            {/* Authors */}
            {/* <h4 style={{ margin: "8px 0px" }}>Authors</h4> */}
            <Stack flexDirection={"column"} flexWrap={"wrap"} gap={"1rem"}>
              {
                availableAuthors.map((author, idx) => (
                  <ToggleComponent key={idx} label={author} value={selectedAuthors.includes(author)} name={JSON.stringify({ item: author, setFunction: "setSelectedAuthors" })} onChange={handleChange} />
                ))
              }
            </Stack>
          </TabPanel>
          <Stack sx={{ width: "100%", alignItems: "center", mt: 2 }}>
            <IconButton size='medium' onClick={handleSave}  >
              <SaveAs sx={{ color:"#9d8f8f", fontSize: { xs: "1.5rem", sm: "2rem" }}}/>
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
});

export default PreferencesModal;
import { MenuItem, Select, FormControl } from '@mui/material';
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const capitalize = (s: string) => {
  return s?.charAt(0).toUpperCase() + s?.slice(1);
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: {xs:150, lg:200}, maxWidth: {xs:150, lg:200}, '@media (max-width: 375px)': { minWidth: 110, maxWidth: 110 } }} size="small">
      <Select 
        sx={{background:"white"}}
        value={selectedCategory}
        displayEmpty
        renderValue={(selected) => selectedCategory === "" ? "All Categories" : capitalize(selectedCategory)}
        onChange={(e) => onSelectCategory(e.target.value)}
      >
        <MenuItem value="">
          <em>All Categories</em>
        </MenuItem>
        {
          categories.map((category) => (
            <MenuItem sx={{textTransform:"capitalize"}} key={category} value={category}>{category}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default CategoryFilter;

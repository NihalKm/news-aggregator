import React from 'react';
import { Checkbox, FormControl, ListItemText, MenuItem, Select, InputBase, SwitchProps, Switch, FormControlLabel, Box, Typography, Stack } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

interface MultiSelectDropdownProps {
  options: string[];
  selectedValue: string[];
  onSelectChange: (selected: string[]) => void;
  itemType?: string | undefined;
}

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onEnterClick?: () => void;
}

interface ToggleComponentProps {
  label: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  boxSx?: { [key: string]: any; };
  [key: string]: any;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = React.memo(({ options, selectedValue, onSelectChange, itemType }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: { xs: 150, lg: 200 }, maxWidth: { xs: 150, lg: 200 }, '@media (max-width: 375px)': { minWidth: 110, maxWidth: 110 } }} size="small">
      <Select
        sx={{ background: "white", borderRadius: "25px", fontSize: "0.75rem" }}
        value={selectedValue}
        multiple
        displayEmpty
        renderValue={(selected) => {
          let selOptions = selected.filter((item: string) => options.includes(item));
          return selOptions.length === 0 ? (itemType ? `Select ${itemType}` : "Select") : selOptions.length === options.length ? "All Selected" : (selOptions as string[]).map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(', ')
        }}
        onChange={(e) => {
          var { target: { value }, } = e;
          const isSelectAll = value.includes("Select All");
          if (isSelectAll) {
            if (value.length === options.length + 1) value = []; else value = options;
          }
          const newValue = typeof value === 'string' ? value.split(',') : value;
          onSelectChange(newValue);
        }}
      >
        <MenuItem value={"Select All"} sx={{ padding: "0px" }}>
          <Checkbox sx={{ '&.Mui-checked': { color: "#6c748ef5" } }} checked={options.length === selectedValue.length} />
          <ListItemText slotProps={{ primary: { sx: { fontSize: "0.75rem" } } }} primary={"Select All"} />
        </MenuItem>
        {
          options.map((option) => (
            <MenuItem sx={{ textTransform: "capitalize", padding: "0px" }} key={option} value={option}>
              <Checkbox sx={{ '&.Mui-checked': { color: "#6c748ef5" } }} checked={selectedValue.includes(option)} />
              <ListItemText slotProps={{ primary: { sx: { fontSize: "0.75rem" } } }} primary={option} />
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('lg')]: {
      width: '30ch !important',
      '&:focus': {
        width: '35ch !important',
      },
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '25ch',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SearchBar: React.FC<SearchBarProps> = React.memo(({ searchTerm, onSearch, onEnterClick }) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        value={searchTerm}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onEnterClick?.();
          }
        }}
        onChange={(e) => onSearch(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  );
});

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const ToggleComponent: React.FC<ToggleComponentProps> = React.memo((props) => {
  const { label, value, onChange, name } = props;
  return (
    <FormControlLabel sx={{ gap: 1 }} name={name} key={label} label={label}
      control={<IOSSwitch onChange={onChange}
        checked={value} value={label} size="small" />}
    />
  )
});

const TabPanel: React.FC<TabPanelProps> = React.memo((props) => {
  const { children, value, index, boxSx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, ...boxSx }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
});

const TitleComponent: React.FC<{ icon: React.ReactElement; title: string }> = React.memo(({ icon, title }) => {
  return (
    <Stack flexDirection="row" alignItems="center" gap={1}>
      {icon}
      <Typography noWrap variant="h6" component="div" sx={{ color: "#1f1f29ab", flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: { xs: "bold" } }}>
        {title}
      </Typography>
    </Stack>
  )
});

export { MultiSelectDropdown, SearchBar, IOSSwitch, ToggleComponent, TabPanel, TitleComponent };
import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { Divider, Drawer, IconButton, Stack } from "@mui/material";
import { DateRangePicker } from 'react-date-range';

interface DateSelectionType {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key: string;
}

interface DateRangeDrawerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (ranges: any) => void;
    selectionRange: DateSelectionType;
}

const DateRangeDrawer: React.FC<DateRangeDrawerProps> = React.memo(({ open, onClose, onSelect, selectionRange }) => {
    return (
        <Drawer
            PaperProps={{ sx: { maxWidth: "100vw" } }}
            anchor={"right"}
            open={open}
            onClose={onClose}
        >
            <Stack divider={<Divider orientation="horizontal" flexItem />}>
                <Stack justifyContent={"start"} flexDirection="row">
                    <IconButton onClick={onClose}>
                        <ArrowBack />
                    </IconButton>
                </Stack>
                <DateRangePicker
                    showSelectionPreview={false}
                    ranges={[selectionRange]}
                    onChange={onSelect}
                    inputRanges={[]}
                    style={{ width: "90%", maxWidth: "100vw" }}
                />
            </Stack>
        </Drawer>
    )
});

export { DateRangeDrawer, DateSelectionType };
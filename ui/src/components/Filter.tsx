import React from "react";
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { Language } from "../languages.ts";

type FilterProps = {
	selectedLanguage: Language | "";
	availableLanguages: Language[];
	onFilterChange: (language: Language | "") => void;
};

const Filter: React.FC<FilterProps> = ({
	selectedLanguage,
	availableLanguages,
	onFilterChange,
}) => {
	const handleChange = (event: SelectChangeEvent<Language | "">) => {
		onFilterChange(event.target.value as Language | "");
	};

	return (
		<Box sx={{ width: 200, mb: 4 }}>
			<FormControl fullWidth variant="outlined">
				<InputLabel id="language-select-label">Language</InputLabel>
				<Select
					labelId="language-select-label"
					id="language-select"
					data-testid="language-filter"
					value={selectedLanguage}
					label="Language"
					onChange={handleChange}
					sx={{
						bgcolor: "secondary.main",
						color: "text.primary",
						borderRadius: 1,
						"& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
						"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
					}}
					MenuProps={{
						PaperProps: {
							sx: {
								bgcolor: "#2d333b",
								color: "text.primary",
								"& .MuiMenuItem-root": {
									"&:hover": { bgcolor: "#444c56" },
									"&.Mui-selected": {
										bgcolor: "#444c56",
										"&:hover": { bgcolor: "#586069" },
									},
								},
							},
						},
					}}
				>
					<MenuItem value="" data-testid="all-languages-option">
						All Languages
					</MenuItem>
					{availableLanguages.map((language) => (
						<MenuItem
							key={language}
							value={language}
							data-testid={`language-option-${language}`}
						>
							{language}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

export default Filter;

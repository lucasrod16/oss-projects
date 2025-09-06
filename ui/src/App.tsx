import React, { useEffect, useState, useMemo } from "react";
import { Container, CssBaseline, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "./components/Card";
import Pagination from "./components/Pagination";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Filter from "./components/Filter";
import { Language } from "./languages.ts";
import { Repo } from "./types/repo.ts";

const theme = createTheme({
	palette: {
		background: { default: "#0d1117" },
		text: { primary: "#c9d1d9", secondary: "#8b949e" },
		primary: { main: "#58a6ff" },
		secondary: { main: "#161b22" },
		action: { hover: "#444c56", selected: "#444c56" },
	},
	typography: {
		fontFamily: "Arial, sans-serif",
		h1: { fontSize: "2.5rem", fontWeight: 700 },
		body1: { fontSize: "1.15rem", lineHeight: 1.8 },
	},
});

const CARDS_PER_PAGE = 20;

const App = () => {
	const [repos, setRepos] = useState<Repo[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedLanguage, setSelectedLanguage] = useState<Language | "">("");

	useEffect(() => {
		fetch(`${window.location.origin}/repos`)
			.then((res) =>
				res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`)
			)
			.then(setRepos)
			.catch((err) => console.error("Error fetching repos:", err));
	}, []);

	const availableLanguages = useMemo(
		() =>
			Array.from(
				new Set(repos.map((repo) => repo.language).filter(Boolean))
			).sort() as Language[],
		[repos]
	);

	const filteredRepos = useMemo(
		() =>
			selectedLanguage
				? repos.filter((repo) => repo.language === selectedLanguage)
				: repos,
		[repos, selectedLanguage]
	);

	const { totalPages, currentRepos } = useMemo(() => {
		const total = Math.ceil(filteredRepos.length / CARDS_PER_PAGE);
		const start = (currentPage - 1) * CARDS_PER_PAGE;
		const current = filteredRepos.slice(start, start + CARDS_PER_PAGE);
		return { totalPages: total, currentRepos: current };
	}, [filteredRepos, currentPage]);

	const handleFilterChange = (language: Language | "") => {
		setSelectedLanguage(language);
		setCurrentPage(1);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
			>
				<Navbar />
				<Container sx={{ textAlign: "center", mt: 4, mb: 4 }}>
					<Filter
						selectedLanguage={selectedLanguage}
						onFilterChange={handleFilterChange}
						availableLanguages={availableLanguages}
					/>
				</Container>
				<Container sx={{ flex: 1 }}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 3,
							alignItems: "center",
						}}
					>
						{currentRepos.map((repo) => (
							<Card repo={repo} key={repo.name} />
						))}
					</Box>
					<Pagination
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
				</Container>
				<Footer />
			</Box>
		</ThemeProvider>
	);
};

export default App;

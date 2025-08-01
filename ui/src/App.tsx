import React, { useEffect, useState } from "react";
import { Container, CssBaseline, Box, Fade } from "@mui/material";
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
		background: {
			default: "#0d1117",
		},
		text: {
			primary: "#c9d1d9",
			secondary: "#8b949e",
		},
		primary: {
			main: "#58a6ff",
		},
		secondary: {
			main: "#161b22",
		},
	},
	typography: {
		fontFamily: "Arial, sans-serif",
		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
		},
		body1: {
			fontSize: "1.15rem",
			lineHeight: 1.8,
		},
	},
});

const App = () => {
	const [cards, setCards] = useState<Repo[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
	const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
	const cardsPerPage = 20;

	useEffect(() => {
		const fetchRepos = async () => {
			const baseURL = window.location.origin;
			const apiURL = `${baseURL}/repos`;
			try {
				const response = await fetch(apiURL);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				setCards(data);

				const availableLanguages = Array.from(
					new Set(data.map((repo: Repo) => repo.language).filter(Boolean))
				) as Language[];
				setAvailableLanguages(availableLanguages);
			} catch (error) {
				console.error("Error fetching repos:", (error as Error).message);
			}
		};
		fetchRepos();
	}, []);

	const filteredCards = selectedLanguages.length
		? cards.filter((repo) => selectedLanguages.includes(repo.language as Language))
		: cards;

	const indexOfLastCard = currentPage * cardsPerPage;
	const indexOfFirstCard = indexOfLastCard - cardsPerPage;
	const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

	const handleFilterChange = (selectedLanguages: Language[]) => {
		setSelectedLanguages(selectedLanguages);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
				<Navbar />
				{/* Header section with centered filter */}
				<Box sx={{ textAlign: "center", mt: 4, mb: 4, position: "relative" }}>
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "background.default",
							zIndex: -1,
						}}
					/>
					<Container>
						<Fade in={true} timeout={1000}>
							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<Filter
									selectedLanguages={selectedLanguages}
									onFilterChange={handleFilterChange}
									availableLanguages={availableLanguages}
								/>
							</Box>
						</Fade>
					</Container>
				</Box>
				<Container sx={{ flex: 1 }}>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
						{currentCards.map((repo) => (
							<Card repo={repo} key={repo.name} />
						))}
					</Box>
					<Pagination
						totalPages={Math.ceil(filteredCards.length / cardsPerPage)}
						currentPage={currentPage}
						onPageChange={(page: React.SetStateAction<number>) => setCurrentPage(page)}
					/>
				</Container>
				<Footer />
			</Box>
		</ThemeProvider>
	);
};

export default App;

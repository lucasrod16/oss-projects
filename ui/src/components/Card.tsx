import React from "react";
import {
	Card as MuiCard,
	CardContent,
	Typography,
	CardMedia,
	Box,
} from "@mui/material";
import { getLanguageImageURL } from "../languages";
import { Repo } from "../types/repo";

const Card: React.FC<{ repo: Repo }> = ({ repo }) => {
	return (
		<MuiCard
			data-testid={`repo-card-${repo.name}`}
			sx={{
				width: "100%",
				maxWidth: "90%",
				margin: "auto",
				borderRadius: 2,
				bgcolor: "secondary.main",
				boxShadow: 3,
				textDecoration: "none",
				overflow: "hidden",
				position: "relative",
				transition: "transform 0.2s ease-in-out",
				"&:hover": { transform: "translateY(-5px)" },
			}}
			component="a"
			href={repo.repoURL}
			target="_blank"
			rel="noopener noreferrer"
		>
			{/* GitHub Badges */}
			<img
				src={`https://img.shields.io/github/stars/${repo.owner}/${repo.name}.svg?style=social`}
				alt="stars"
				width="80"
				style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
			/>
			<img
				src={`https://img.shields.io/github/contributors-anon/${repo.owner}/${repo.name}.svg`}
				alt="contributors"
				width="100"
				style={{ position: "absolute", bottom: 8, right: 8, zIndex: 10 }}
			/>

			<Box sx={{ display: "flex", alignItems: "flex-start", p: 2, pb: "60px" }}>
				<CardMedia
					component="img"
					image={repo.avatarURL}
					alt={repo.name}
					sx={{
						width: { xs: 50, sm: 60 },
						height: { xs: 50, sm: 60 },
						borderRadius: "50%",
						mr: 2,
					}}
				/>
				<CardContent sx={{ flex: 1, p: 0 }}>
					<Typography
						variant="h6"
						sx={{
							mb: 1,
							fontSize: { xs: "1rem", sm: "1.25rem" },
							overflowWrap: "break-word",
						}}
					>
						{repo.name}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							lineHeight: 1.5,
							wordBreak: "break-word",
							pr: { xs: 2, md: "120px" },
						}}
					>
						{repo.description}
					</Typography>
				</CardContent>
			</Box>

			{/* Language Icon */}
			<Box
				sx={{
					position: "absolute",
					bottom: 8,
					left: "50%",
					transform: "translateX(-50%)",
				}}
			>
				<img
					src={getLanguageImageURL(repo.language)}
					alt={repo.language}
					style={{ width: 35, height: 35 }}
				/>
			</Box>
		</MuiCard>
	);
};

export default Card;

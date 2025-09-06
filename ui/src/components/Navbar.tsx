import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const Navbar: React.FC = () => (
	<AppBar
		position="sticky"
		sx={{
			backdropFilter: "blur(10px)",
			bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
			boxShadow: "none",
			borderBottom: (theme) =>
				`1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
			py: 0.5,
		}}
	>
		<Toolbar sx={{ justifyContent: "center" }}>
			<Typography
				variant="h6"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				sx={{
					fontWeight: 700,
					color: "text.primary",
					textTransform: "lowercase",
					letterSpacing: "0.1em",
					cursor: "pointer",
				}}
			>
				osscontribute.dev
			</Typography>
		</Toolbar>
	</AppBar>
);

export default Navbar;

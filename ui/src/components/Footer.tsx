import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => (
	<Box
		sx={{
			p: 2,
			mt: "auto",
			bgcolor: "secondary.main",
			color: "text.secondary",
			textAlign: "center",
			borderTop: (theme) => `1px solid ${theme.palette.text.primary}`,
		}}
	>
		<Typography variant="body2">
			&copy; {new Date().getFullYear()} By Lucas Rodriguez. All rights reserved.
		</Typography>
	</Box>
);

export default Footer;

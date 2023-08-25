import { Button, Modal, Sheet, Typography } from "@mui/joy"
import React from "react";
import Cookies from "universal-cookie";

export const CookieConsent = () => {
	const cookies = new Cookies();
	const cookieConsent = cookies.get("cookieConsent");

	const [open, setOpen] = React.useState(cookieConsent !== true);
	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}
			sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
		>
			<Sheet
				sx={{
					maxWidth: 500,
					borderRadius: "md",
					p: 3,
					boxShadow: "lg",
				}}
			>
				<Typography level="h3">Cookie Consent</Typography>
				<Typography>
					This website would like to use cookies to store your long-term
					settings. This information is completely private to you, and is used
					purely to make the app more convenient for you.
				</Typography>
				<Button
					onClick={() => {
						cookies.set("cookieConsent", true);
						setOpen(false);
					}}
					sx={{ margin: "5px 50px 0px 0px" }}
				>
					Accept Cookies
				</Button>
				<Button
					onClick={() => {
						cookies.set("cookieConsent", false);
						setOpen(false);
					}}
					sx={{ margin: "5px 0px 0px 0px" }}
					variant="outlined"
				>
					Decline Cookies
				</Button>
			</Sheet>
		</Modal>
	);
}
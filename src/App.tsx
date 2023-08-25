import Sheet from "@mui/joy/Sheet";
import {
	Box,
	CssVarsProvider,
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from "@mui/joy";
import GoingLowCarbCalculator from "./GoingLowCarbCalculator";
import DarkModeButton from "./DarkModeButton";
import React from "react";
import { CookieConsent } from "./CookieConsent";

function App() {
	return (
		<CssVarsProvider>
			<Sheet sx={{ width: "100vw", height: "100vh" }}>
				<Tabs defaultValue={0}>
					<Box sx={{ display: "flex" }}>
						<TabList sx={{ flexGrow: 1 }}>
							<Tab>Going Low Carb Calculator</Tab>
						</TabList>
						<DarkModeButton sx={{ marginLeft: "auto" }} />
					</Box>
					<TabPanel value={0}>
						<GoingLowCarbCalculator />
					</TabPanel>
				</Tabs>
				<CookieConsent />
			</Sheet>
		</CssVarsProvider>
	);
}

export default App;

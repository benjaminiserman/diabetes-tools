import {
	Button,
	Card,
	CardContent,
	Grid,
	Input,
	Sheet,
	Tooltip,
	Typography,
} from "@mui/joy";
import React from "react";
import Cookies from "universal-cookie";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { HelpIconWithTooltip } from "./HelpIconWithTooltip";

export const GoingLowCarbCalculator = () => {
	const cookies = new Cookies();
	const getCookieValueOrSetDefault = (
		cookieName: string,
		defaultValue: string
	) => {
		if (cookies.get("cookieConsent") !== true) {
			return defaultValue;
		}

		const cookieValue = cookies.get(cookieName);
		if (cookieValue === undefined) {
			cookies.set(cookieName, defaultValue);
			return defaultValue;
		}

		return cookieValue;
	};

	const defaultCorrectionFactor = 200;
	const defaultBolusRatio = 25;
	const defaultTargetBloodGlucose = 130;

	const correctionFactorCookieValue = getCookieValueOrSetDefault(
		"correctionFactor",
		defaultCorrectionFactor.toString()
	) as string;
	const bolusRatioCookieValue = getCookieValueOrSetDefault(
		"bolusRatio",
		defaultBolusRatio.toString()
	) as string;
	const targetBloodGlucoseCookieValue = getCookieValueOrSetDefault(
		"targetBloodGlucose",
		defaultTargetBloodGlucose.toString()
	) as string;

	const [correctionFactor, setCorrectionFactor] = React.useState(
		correctionFactorCookieValue
	);
	const [bolusRatio, setBolusRatio] = React.useState(bolusRatioCookieValue);
	const [targetBloodGlucose, setTargetBloodGlucose] = React.useState(
		targetBloodGlucoseCookieValue
	);

	const [insulinOnBoard, setInsulinOnBoard] = React.useState("");
	const [bloodGlucose, setBloodGlucose] = React.useState("");

	const getNumericValueFromInput = (inputValue: string) =>
		Number(inputValue === "." ? "0" : inputValue);

	window.onbeforeunload = () => {
		const getNumericValueOrDefault = (value: string, defaultValue: number) => {
			if (value === "") {
				return defaultValue.toString();
			}

			return getNumericValueFromInput(value).toString();
		};

		if (cookies.get("cookieConsent") !== true) {
			return;
		}

		cookies.set(
			"correctionFactor",
			getNumericValueOrDefault(correctionFactor, defaultCorrectionFactor)
		);
		cookies.set(
			"bolusRatio",
			getNumericValueOrDefault(bolusRatio, defaultBolusRatio)
		);
		cookies.set(
			"targetBloodGlucose",
			getNumericValueOrDefault(targetBloodGlucose, defaultTargetBloodGlucose)
		);
	};

	const handleNumericInput = (
		input: string,
		setter: React.Dispatch<React.SetStateAction<string>>
	) => {
		const textWithoutNonDigits = input.replace(/[^\d.]/, "");

		// forbid multiple decimals
		if ((textWithoutNonDigits.match(/\./g) ?? []).length > 1) {
			return;
		}

		// trim leading zeroes
		const textWithoutExtraLeadingZeroes = textWithoutNonDigits.replace(
			/^0*?(0?\.\d*|0)$|^0*([1-9]\d*)$/g,
			"$1$2"
		);

		setter(textWithoutExtraLeadingZeroes);
	};

	const getGramsNeededToReachTarget = () => {
		if (
			[
				targetBloodGlucose,
				bloodGlucose,
				correctionFactor,
				insulinOnBoard,
				bolusRatio,
			].includes("")
		) {
			return "...";
		}

		const targetBloodGlucoseValue =
			getNumericValueFromInput(targetBloodGlucose);
		const bloodGlucoseValue = getNumericValueFromInput(bloodGlucose);
		const correctionFactorValue = getNumericValueFromInput(correctionFactor);
		const insulinOnBoardValue = getNumericValueFromInput(insulinOnBoard);
		const bolusRatioValue = getNumericValueFromInput(bolusRatio);

		const gramsNeeded =
			((targetBloodGlucoseValue -
				(bloodGlucoseValue - correctionFactorValue * insulinOnBoardValue)) /
				correctionFactorValue) *
			bolusRatioValue;

		return `${Math.round(gramsNeeded)}g`;
	};

	return (
		<Sheet sx={{ overflowX: 'hidden' }}>
			<Card sx={{ maxWidth: '1000px', margin: 'auto' }}>
				<Typography level="h2" textAlign="center">
					Long-term Settings
					<Tooltip title="Reset to Default Settings" variant="plain">
						<Button
							variant="plain"
							sx={{ padding: "10px", margin: "0px 10px" }}
							onClick={() => {
								setCorrectionFactor(defaultCorrectionFactor.toString());
								setBolusRatio(defaultBolusRatio.toString());
								setTargetBloodGlucose(defaultTargetBloodGlucose.toString());
							}}
						>
							<RestartAltIcon />
						</Button>
					</Tooltip>
				</Typography>
				<br />

				<Grid container spacing={2} sx={{ justifyContent: "center" }}>
					<Grid xs={4}>
						<Card>
							<CardContent>
								<Typography
									level="h4"
									endDecorator={
										<HelpIconWithTooltip helpText="Correction Factor: The amount your blood glucose level would decrease from one unit of insulin under normal circumstances." />
									}
								>
									Correction factor
								</Typography>
								<Typography level="body-lg">
									1u per{" "}
									<b>
										<Input
											placeholder="..."
											value={correctionFactor}
											type="text"
											size="lg"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												handleNumericInput(
													event.target.value,
													setCorrectionFactor
												)
											}
											sx={{
												display: "inline-block",
												minWidth: "3em",
												maxWidth: "3em",
												minHeight: "3.5ex",
											}}
										/>
									</b>{" "}
									BG
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid xs={4}>
						<Card>
							<CardContent>
								<Typography
									level="h4"
									endDecorator={
										<HelpIconWithTooltip helpText="Bolus Ratio: The number of grams of carbs that are metabolized by one unit of insulin under normal circumstances." />
									}
								>
									Bolus ratio
								</Typography>
								<Typography level="body-lg">
									1u per{" "}
									<b>
										<Input
											placeholder="..."
											value={bolusRatio}
											type="text"
											size="lg"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												handleNumericInput(event.target.value, setBolusRatio)
											}
											sx={{
												display: "inline-block",
												minWidth: "2em",
												maxWidth: "2.5em",
												minHeight: "3.5ex",
											}}
										/>
									</b>
									g
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid xs={4}>
						<Card>
							<CardContent>
								<Typography
									level="h4"
									endDecorator={
										<HelpIconWithTooltip helpText="Target Blood Glucose: The desired level of blood glucose to maintain good health while reducing the likelihood of a swing to a dangerously low level." />
									}
								>
									Target BG
								</Typography>
								<Typography level="body-lg">
									<b>
										<Input
											placeholder="enter target BG..."
											value={targetBloodGlucose}
											type="text"
											size="lg"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												handleNumericInput(
													event.target.value,
													setTargetBloodGlucose
												)
											}
											sx={{
												display: "inline-block",
												minHeight: "3.5ex",
												maxWidth: "5em"
											}}
										/>
									</b>
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<br />
				<Typography level="h2" textAlign="center">
					Variables
				</Typography>
				<br />
				<Grid container spacing={2} sx={{ justifyContent: "center" }}>
					<Grid xs={4}>
						<Card>
							<CardContent>
								<Typography
									level="h4"
									endDecorator={
										<HelpIconWithTooltip helpText="Insulin On Board (IOB): The amount of insulin currently in your blood stream as reported by your connected device." />
									}
								>
									IOB
								</Typography>
								<Input
									placeholder="enter IOB..."
									value={insulinOnBoard}
									type="text"
									size="lg"
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										handleNumericInput(event.target.value, setInsulinOnBoard)
									}
								/>
							</CardContent>
						</Card>
					</Grid>
					<Grid xs={4}>
						<Card>
							<CardContent>
								<Typography
									level="h4"
									endDecorator={
										<HelpIconWithTooltip helpText="Blood Glucose Level (BG): The amount of glucose in your blood stream measured in mg/dl." />
									}
								>
									BG
								</Typography>
								<Input
									placeholder="enter BG..."
									value={bloodGlucose}
									type="text"
									size="lg"
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										handleNumericInput(event.target.value, setBloodGlucose)
									}
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<br />
				<Typography level="h2" textAlign="center">
					Result
				</Typography>
				<Grid container spacing={2} sx={{ justifyContent: "center" }}>
					<Grid xs={6}>
						<Card sx={{ margin: "auto" }}>
							<CardContent>
								<Typography level="h4">
									Grams of carbs needed to reach target:
								</Typography>
								<Typography sx={{ margin: "auto" }} fontSize={60}>
									{getGramsNeededToReachTarget()}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Card>
			<br />
			<Sheet
				sx={{
					width: "100%",
					position: "fixed",
					bottom: 0,
				}}
			>
				<Typography>
					Note: The result is based on the inputted numbers only and does not
					include other factors such as activity level.
				</Typography>
			</Sheet>
		</Sheet>
	);
};

export default GoingLowCarbCalculator;

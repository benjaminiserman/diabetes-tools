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
import Cookies from 'universal-cookie';
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const GoingLowCarbCalculator = () => {
	const cookies = new Cookies();
	const getCookieValueOrSetDefault = (cookieName: string, defaultValue: string) => {
		const cookieValue = cookies.get(cookieName);
		if (cookieValue === undefined) {
			cookies.set(cookieName, defaultValue);
			return defaultValue;
		}

		return cookieValue;
	}

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

	const [correctionFactor, setCorrectionFactor] = React.useState(correctionFactorCookieValue);
	const [bolusRatio, setBolusRatio] = React.useState(bolusRatioCookieValue);
	const [targetBloodGlucose, setTargetBloodGlucose] = React.useState(targetBloodGlucoseCookieValue);

	const [insulinOnBoard, setInsulinOnBoard] = React.useState("");
	const [bloodGlucose, setBloodGlucose] = React.useState("");

	const getNumericValueFromInput = (inputValue: string) =>
		Number(inputValue === "." ? "0" : inputValue);

	window.onbeforeunload = () => {
		const getNumericValueOrDefault = (value: string, defaultValue: number) => {
			if (value === "") {
				return defaultValue.toString();
			}

			return getNumericValueFromInput(value).toString();;
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

		const targetBloodGlucoseValue = getNumericValueFromInput(targetBloodGlucose);
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
		<Sheet>
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
							<Typography level="body-lg">Correction factor</Typography>
							<Typography>
								1u per{" "}
								<b>
									<Input
										placeholder="..."
										value={correctionFactor}
										type="text"
										size="sm"
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
							<Typography level="body-lg">Bolus ratio</Typography>
							<Typography>
								1u per{" "}
								<b>
									<Input
										placeholder="..."
										value={bolusRatio}
										type="text"
										size="sm"
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
							<Typography level="body-lg">Target Blood Glucose</Typography>
							<Typography>
								<b>
									<Input
										placeholder="enter target blood glucose..."
										value={targetBloodGlucose}
										type="text"
										size="sm"
										onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
											handleNumericInput(
												event.target.value,
												setTargetBloodGlucose
											)
										}
										sx={{
											display: "inline-block",
											minHeight: "3.5ex",
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
							<Typography level="body-lg">Insulin On Board</Typography>
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
							<Typography level="body-lg">Blood Glucose Level</Typography>
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
							<Typography level="body-lg">
								Grams of carbs needed to reach target:
							</Typography>
							<Typography sx={{ margin: "auto" }} fontSize={60}>
								{getGramsNeededToReachTarget()}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<br />
		</Sheet>
	);
}

export default GoingLowCarbCalculator;

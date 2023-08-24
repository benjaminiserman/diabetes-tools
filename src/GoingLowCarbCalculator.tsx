import {
	Card,
	CardContent,
	Grid,
	Input,
	Sheet,
	Typography,
} from "@mui/joy";
import React from "react";

export const GoingLowCarbCalculator = () => {
	const correctionFactor = 200;
	const bolusRatio = 25;
	const targetBloodGlucose = 130;

	const [insulinOnBoard, setInsulinOnBoard] = React.useState("");
	const [bloodGlucose, setBloodGlucose] = React.useState("");

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

	const getInsulinOnBoard = () =>
		Number(insulinOnBoard === "." ? "0" : insulinOnBoard);
	const getBloodGlucose = () =>
		Number(bloodGlucose === "." ? "0" : bloodGlucose);

	const getGramsNeededToReachTarget = () => {
		if (insulinOnBoard === "" || bloodGlucose === "") {
			return "...";
		}

		const gramsNeeded =
			((targetBloodGlucose -
				(getBloodGlucose() - correctionFactor * getInsulinOnBoard())) /
				correctionFactor) *
			bolusRatio;

		return `${Math.round(gramsNeeded)}g`;
	};

	return (
		<Sheet>
			<Typography level="h2" textAlign="center">
				Constants
			</Typography>
			<br />
			<Grid container spacing={2} sx={{ justifyContent: "center" }}>
				<Grid xs={4}>
					<Card>
						<CardContent>
							<Typography level="body-lg">Correction factor</Typography>
							<Typography>
								1u per <b>{correctionFactor}</b> BG
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid xs={4}>
					<Card>
						<CardContent>
							<Typography level="body-lg">Bolus ratio</Typography>
							<Typography>
								1u per <b>{bolusRatio}</b>g
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid xs={4}>
					<Card>
						<CardContent>
							<Typography level="body-lg">Target Blood Glucose</Typography>
							<Typography>
								<b>{targetBloodGlucose}</b>
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
								value={insulinOnBoard ?? ""}
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
								value={bloodGlucose ?? ""}
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

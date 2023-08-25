import React from 'react';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from '@mui/joy';

export interface HelpIconWithTooltipProps {
	helpText: string;
}

export const HelpIconWithTooltip = (props: HelpIconWithTooltipProps) => {
	const { helpText } = props;

	return (
		<Tooltip title={helpText} variant="outlined" sx={{
			fontSize: 16,
			maxWidth: "30em"
		}}>
			<HelpOutlineIcon sx={{ width: "16px" }} />
		</Tooltip>
	);
};
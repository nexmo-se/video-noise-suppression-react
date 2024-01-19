import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';

export function ButtonNoiseSuppression({ enabled, onClick }) {
  return (
    <Tooltip title={"Noise Suppression " + (enabled? "Enabled" : "Disabled")}>
    <IconButton 
      edge="start"
      color={enabled? "success" : "inherit" }
      aria-label="Noise Suppression"
      onClick={onClick}
    >
      <TuneIcon fontSize="inherit" />
    </IconButton>
    </Tooltip>
  );
}

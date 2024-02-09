
import { useCallback, useEffect, useRef, useState } from "react";
import useStyles from "./styles";
import { MicButton } from "../MicButton";
import { VideoButton } from "../VideoButton";
import { ButtonNoiseSuppression } from "../ButtonNoiseSuppression";

export const ControlToolBar = ({
  className,
  hasAudio,
  hasVideo,
  handleMicButtonClick,
  handleVideoButtonClick,
  isNoiseSuppressionEnabled, toggleNoiseSuppression,
}) => {
  const [visible, setVisible] = useState(true);
  const classes = useStyles();
  const hiddenTimeoutTimer = 8000;
  let hiddenTimeout = useRef();

  const setHiddenTimeout = useCallback(() => {
    hiddenTimeout.current = setTimeout(() => {
      setVisible(false);
    }, hiddenTimeoutTimer);
  }, []);

  function handleMouseEnter() {
    clearTimeout(hiddenTimeout.current);
    setVisible(true);
  }

  function handleMouseLeave() {
    setHiddenTimeout();
  }

  useEffect(() => {
    setHiddenTimeout();
  }, [setHiddenTimeout]);

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${classes.toolbarBackground} ${
          !visible ? classes.hidden : ""
        }`}
      >
        <MicButton
          hasAudio={hasAudio}
          onClick={handleMicButtonClick}
        ></MicButton>

        <VideoButton
          hasVideo={hasVideo}
          onClick={handleVideoButtonClick}
        ></VideoButton>
        
        <ButtonNoiseSuppression 
          enabled={isNoiseSuppressionEnabled}
          onClick={toggleNoiseSuppression}
        />
      </div>
    </div>
  );
};

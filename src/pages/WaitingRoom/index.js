import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { UserContext } from '../../context/UserContext';
import { usePublisher } from '../../hooks/usePublisher';
import { AudioSettings } from '../../components/AudioSetting';
import { VideoSettings } from '../../components/VideoSetting';
import { Stack, Button } from '@mui/material';
import { UserSetting } from '../../components/UserSetting';

export function WaitingRoom() {
  const { user, setUser } = useContext(UserContext);

  const waitingRoomVideoContainerRef = useRef();

  const [localAudio, setLocalAudio] = useState(user.defaultSettings.publishAudio);
  const [localVideo, setLocalVideo] = useState(user.defaultSettings.publishVideo);

  const {
    publisher,
    initPublisher,
    isInitialised,
  } = usePublisher();

  const navigate = useNavigate();
  const classes = useStyles();

  const handleAudioChange = useCallback((e) => {
    localStorage.setItem("defaultPublishAudio", e.target.checked);
    setLocalAudio(e.target.checked);
  }, []);

  const handleVideoChange = useCallback((e) => {
    localStorage.setItem("defaultPublishVideo", e.target.checked);
    setLocalVideo(e.target.checked);
  }, []);

  const handleJoinClick = () => {
    navigate({
      pathname: '/meeting-room',
      // search: `?a={a}`,
    });
  };

  // --- 
  useEffect(() => {
    setUser({
      ...user,
      defaultSettings: {
        publishAudio: localAudio,
        publishVideo: localVideo,
      }
    });
  }, [ localAudio, localVideo ]);

  useEffect(() => {
    console.log({isInitialised})
    // null true, or false
    if (isInitialised === null) {
      initPublisher({
        container: waitingRoomVideoContainerRef.current.id,
        publisherOptions: user.defaultSettings
      }).catch(console.log);
    }
  }, [isInitialised]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(localAudio);
    }
  }, [localAudio, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(localVideo);
    }
  }, [localVideo, publisher]);

  return (<>
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <AudioSettings
        hasAudio={localAudio}
        onAudioChange={handleAudioChange}
      />

      <VideoSettings
        hasVideo={localVideo}
        onVideoChange={handleVideoChange}
      />

      <div
        id="waiting-room-video-container"
        className={classes.waitingRoomVideoPreview}
        ref={waitingRoomVideoContainerRef}
      ></div>

      <UserSetting />

      <Button
        variant="contained"
        onClick={handleJoinClick}
      >{"Join Call"}</Button>

    </Stack>
  </>);
}

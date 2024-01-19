import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import useStyles from './styles';
import { getCredentials } from '../../api/credentials';
import { UserContext } from '../../context/UserContext';
import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import { useDevices } from '../../hooks/useDevices';
import { useMediaProcessor } from '../../hooks/useMediaProcessor';
import { ControlToolBar } from '../../components/ControlToolBar';
import { useLayoutManager } from '../../hooks/useLayoutManager';
import OT from "@opentok/client";

OT.on("exception", ({type, title}) => console.log(type, title));

export function MeetingRoom() {
  const { user } = useContext(UserContext);

  const videoContainerRef = useRef();

  const [credentials, setCredentials] = useState(null);
  const [hasAudio, setHasAudio] = useState(user.defaultSettings.publishAudio);
  const [hasVideo, setHasVideo] = useState(user.defaultSettings.publishVideo);

  const [isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled] = useState(false);

  const { 
    publisher,
    publish,
    isPublishing,
    isInitialised
  } = usePublisher();

  const { 
    session,
    connectSession, 
    isConnected,
    streams
   } = useSession({
    container: "video-container"
  });

  const { getDevices } = useDevices();
  
  const { layoutManager, layout } = useLayoutManager({
    container: "video-container"
  });

  const classes = useStyles();

  const { 
    processor, 
    connector,
   } = useMediaProcessor();

  const toggleAudio = useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
    localStorage.setItem("defaultPublishAudio", !hasAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
    localStorage.setItem("defaultPublishVideo", !hasVideo);
  }, []);

  const toggleNoiseSuppression = useCallback(() => {
    setIsNoiseSuppressionEnabled((prev) => !prev);
  }, []);

  // 
  useEffect(() => {
    getCredentials().then(setCredentials).catch(console.log);
    //
    var resizeTimeout;
    window.onresize = function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        layout();
      }, 100);
    };
  }, []);

  useEffect(() => {
    if (credentials) {
      connectSession(credentials);
    }
  }, [credentials]);

  useEffect(() => {
    if (session && isConnected && isPublishing === null) {
      publish(session, {
        container: videoContainerRef.current.id,
        publisherOptions: {
          publishAudio: hasAudio,
          publishVideo: hasVideo,
          name: user.username, 
        }
      }).catch(console.log);
    }
    layout();
  }, [session, isConnected, isPublishing]);

  useEffect(() => {
    layout();
  }, [session, streams]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(hasVideo);
    }
  }, [hasVideo, publisher]);

  useEffect(() => {
    if (!OT.hasMediaProcessorSupport()) {
      return console.log('MediaProcessors are only supported in recent versions of Chrome, Electron, Opera, and Edge.')
    }

    if (publisher && isInitialised) {
      if (isNoiseSuppressionEnabled) {
        publisher.setAudioMediaProcessorConnector(connector)
        .catch(console.log)
        .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));

      } else {
        publisher.setAudioMediaProcessorConnector(null)
            .catch(console.log)
            .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
      }

    }
  }, [isNoiseSuppressionEnabled, publisher, processor, connector, isInitialised]);

  return (<>
    <div
      id="video-container"
      className={classes.videoContainer}
      ref={videoContainerRef}
    >
    </div>

    <ControlToolBar
      className={classes.controlToolbar}
      hasAudio={hasAudio}
      hasVideo={hasVideo}
      handleMicButtonClick={toggleAudio}
      handleVideoButtonClick={toggleVideo}
      isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
      toggleNoiseSuppression={toggleNoiseSuppression}
    />
    
  </>
  );
}

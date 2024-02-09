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
import OT from "@vonage/client-sdk-video";

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
    streams,
   } = useSession({
    container: "video-container"
  });

  const {} = useDevices();

  const { layout } = useLayoutManager({
    container: "video-container"
  });

  const classes = useStyles();

  const { 
    processor, 
    connector,
   } = useMediaProcessor();

  const toggleAudio = useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
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
    if (isPublishing !== null) {
      layout();
    }
  }, [session, isConnected, isPublishing]);

  useEffect(() => {
    layout();
  }, [streams]);

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
    if (publisher && isInitialised && connector) {
      // --- option 1 ---
      if (isNoiseSuppressionEnabled) {
        publisher.setAudioMediaProcessorConnector(connector)
          .catch(console.log)
          .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
      } else {
        // clear the current connector by calling this method with null.
        publisher.setAudioMediaProcessorConnector(null)
          .catch(console.log)
          .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
      }

      // --- option 2 ---
      // if (isNoiseSuppressionEnabled) {
      //   OT.getUserMedia({
      //     noiseSuppression: false,
      //   }).catch().then(s1 => {
      //     suppressNoiseFromAudioStream(s1).catch(console.log).then((s2) => {
      //       let audioTrack = s2.getAudioTracks()[0];
      //       publisher.setAudioSource(audioTrack).catch(console.log);
      //     });
      //   });
      // }

    }
  }, [isNoiseSuppressionEnabled, publisher, isInitialised, processor, connector]);

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

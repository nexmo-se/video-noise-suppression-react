import { useState, useRef } from "react";
import OT from "@opentok/client";

OT.on("exception", ({type, title}) => console.log(type, title));

const defaultSubscriberOptions = {
  insertMode: "append",
  width: "100%",
  height: "100%",
  style: {
    buttonDisplayMode: "on",
    nameDisplayMode: "on",
  },
  showControls: true,
  fitMode: "contain"
};

export function useSession({ container }) {
  const sessionRef = useRef(null);

  const [isConnected, setIsConnected] = useState(null);
  const [streams, setStreams] = useState([]);

  const addStream = (stream) => {
    setStreams((prev) => [...prev, stream]);
  };

  const removeStream = (stream) => {
    setStreams((prev) =>
      prev.filter((prevStream) => prevStream.id !== stream.id)
    );
  };

  const subscribe = (stream) => {
    sessionRef.current.subscribe(stream, container, defaultSubscriberOptions, (err) => {
      if (err) {
        console.log("[session.subscribe err]", err.name || err.message);
      } else {
        // console.log("[session.subscribe done]");
      }
    });
  };

  const onStreamCreated = ({ stream }) => {
    subscribe(stream);
    addStream(stream);
  };

  const onStreamDestroyed = ({ stream }) => {
    console.log("session on onStreamDestroyed");
    removeStream(stream);
  };

  const onSessionConnected = () => {
    setIsConnected(true);
  };

  const onSessionDisconnected = () => {
    setIsConnected(false);
    setStreams([]);
  };

  const onStreamPropertyChanged = (e) => {
    console.log(e)
  }

  const connectSession = ({ apiKey, sessionId, token }) => {
    if (sessionRef.current) {
      // console.log("connectSession already isConnected");
      return;
    }
    if (!apiKey || !sessionId || !token) {
      throw new Error("connectSession Missing Credentials", {apiKey, sessionId, token});
    }

    console.log("connecting ",  {sessionId});
    sessionRef.current = OT.initSession(apiKey, sessionId);

    sessionRef.current.off();
    sessionRef.current.on({
      streamCreated: onStreamCreated,
      streamDestroyed: onStreamDestroyed,
      sessionConnected: onSessionConnected,
      sessionDisconnected: onSessionDisconnected,
      streamPropertyChanged: onStreamPropertyChanged
    });

    sessionRef.current.connect(token, (err) => {
      if (err) {
        console.log("connectSession err", err);
        setIsConnected(false);
        sessionRef.current = null;
      } else if (!err) {
        // console.log("connectSession done");
        setIsConnected(true);
      }
    });
  };

  const disconnectSession = () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      setIsConnected(false);
    }
  };

  return {
    session: sessionRef.current,
    isConnected,
    connectSession,
    disconnectSession,
    streams,
  };
}

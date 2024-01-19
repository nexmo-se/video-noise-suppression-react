import { useCallback, useRef, useState } from "react";
import OT from "@opentok/client";

OT.on("exception", ({type, title}) => console.log(type, title));

const defaultPublisherOptions = {
  insertMode: "append",
  width: "100%",
  height: "100%",
  showControls: false,
  fitMode: "contain"
};

export function usePublisher() {
  const publisherRef = useRef();

  const [isPublishing, setIsPublishing] = useState(null);
  const [isInitialised, setIsInitialised] = useState(null);

  const accessAllowedListener = useCallback(async () => {
    // console.log("publisher on accessAllowedListener");
    setIsInitialised(true);
  }, []);
  const accessDeniedListener = useCallback(async () => {
    // console.log("publisher on accessDeniedListener");
    setIsInitialised(false);
  }, []);
  const videoElementCreatedListener = useCallback(() => {
    // console.log("publisher on videoElementCreatedListener");
    setIsInitialised(true);
  }, []);

  const streamCreatedListener = useCallback(({ stream }) => {
    setIsPublishing(true);
  }, []);

  const streamDestroyedListener = useCallback(() => {
    setIsPublishing(false);
  }, []);

  const destroyedListener = useCallback(() => {
    publisherRef.current = null;
    setIsInitialised(false);
    setIsPublishing(false);
  }, []);

  const initPublisher = async ({ container, publisherOptions }) => {
    if (publisherRef.current) {
      console.log("[initPublisher already initiated]");
      return;
    }

    const finalPublisherOptions = {
      ...defaultPublisherOptions, 
      ...publisherOptions
    };
    
    return new Promise((resolve, reject) => {
      publisherRef.current = OT.initPublisher(container, finalPublisherOptions, (err) => {
        if (err) {
          console.log("[initPublisher err]", err.name || err.message);
          // publisherRef.current = null;
          reject(err);
        } else {
          // console.log("[initPublisher done]", "isLoading()", publisherRef.current.isLoading());
          // console.log("[initPublisher done]");
          resolve(publisherRef.current);
        }
      });
  
      console.log("[initPublisher set event listeners] ..");

      publisherRef.current.on("accessAllowed", accessAllowedListener);
      publisherRef.current.on("accessDenied", accessDeniedListener);
      publisherRef.current.on("videoElementCreated", videoElementCreatedListener);
      publisherRef.current.on("streamCreated", streamCreatedListener);
      publisherRef.current.on("streamDestroyed", streamDestroyedListener);
      publisherRef.current.on("destroyed", destroyedListener);
  
      return publisherRef.current;
    })
  };

  const destroyPublisher = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
    }
  };

  const publish = async (session, { container, publisherOptions }) => {
    try {
      if (!publisherRef.current) {
        await initPublisher({ container, publisherOptions });
      }
      if (isPublishing === null) {
        session.publish(publisherRef.current, (err) => {
          if (err) {
            console.log("[session.publish err]", err.name || err.message);
          } else {
            setIsPublishing(true);
          }
        });
      } else {
        console.log("[publisher already is publishing]");
      }
    } catch (error) {
      console.log("[failed to publish]", error.name || error.message)
    }
  };

  const unpublish = (session) => {
    if (publisherRef.current && isPublishing) {
      session.unpublish(publisherRef.current);
      setIsPublishing(false);
    }
  };

  return {
    publisher: publisherRef.current,
    initPublisher,
    isInitialised,
    destroyPublisher,
    publish,
    isPublishing,
    unpublish,
  };
}

import { useState, useEffect, useCallback } from 'react';
import OT from "@opentok/client";

export function useDevices() {
  const [deviceInfo, setDeviceInfo] = useState({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
  });

  const getDevices = useCallback(async () => {
    return new Promise((resolve, reject) => {
      OT.getDevices((error, devices) => {
        if (error) {
          reject(error);
        }
        else {
          const audioInputDevices = devices.filter(
            (d) => d.kind.toLowerCase() === 'audioinput'
          );
          const videoInputDevices = devices.filter(
            (d) => d.kind.toLowerCase() === 'videoinput'
          );
          resolve({
            audioInputDevices,
            videoInputDevices,
          });
        }
      });
    })
  }, []);

  const getDeviceInfo = () => {
    getDevices().catch(console.log).then(setDeviceInfo);
  }

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDeviceInfo);
    
    getDeviceInfo();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDeviceInfo);
    };
  }, []);

  return { 
    deviceInfo, 
    getDevices
  };
}

import { useRef } from "react";
import LM from "opentok-layout-js";

export function useLayoutManager({ container }) {
  const layoutRef = useRef(null);

  const init = () => {
    const element = document.getElementById(container);
    if (element) {
      layoutRef.current = LM(element, {
        fixedRatio: false, 
        scaleLastRow: false,
        bigFirst: false,
        bigFixedRatio: true,
        bigAlignItems: "left"
      });
    }
    else throw new Error("Cannot find container");
  }

  const layout = () => {
    if (layoutRef.current === null) {
      // console.log("useLayoutManager init")
      init();
    }
    layoutRef.current.layout();
  }

  return {
    layoutManager: layoutRef.current,
    layout,
  };
}
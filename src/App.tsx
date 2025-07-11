import {ReactUnityEventParameter} from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useCallback, useEffect, useState } from "react";

import "./App.css";

function App() {
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    sendMessage,
    isLoaded,
    loadingProgression,
  } = useUnityContext({
    loaderUrl: "Build/<ReplaceWithDirectoryName>.loader.js",
    dataUrl: "Build/<ReplaceWithDirectoryName>.data",
    frameworkUrl: "Build/<ReplaceWithDirectoryName>.framework.js",
    codeUrl: "Build/<ReplaceWithDirectoryName>.wasm",
  });

  const loadingPercentage = Math.round(loadingProgression * 100);

  const handleSequenceWalletAuth = useCallback((...parameters: ReactUnityEventParameter[]): ReactUnityEventParameter => {
    const walletUrl = parameters[0] as string;
    window.open(walletUrl);

    /*setMessageToSend({
      functionName: "HandleResponse",
      value: walletUrl,
    });*/
    return '';
  }, []);

  const [messageToSend, setMessageToSend] = useState<{ functionName: string; value: string; } | undefined>();

  useEffect(() => {
    if (messageToSend) {
      const message = messageToSend;
      setMessageToSend(undefined);
      sendMessage("SequenceNativeReceiver", message.functionName, message.value);
    }
  }, [messageToSend]);

  useEffect(() => {
    addEventListener("OpenWalletApp", handleSequenceWalletAuth);
    window.addEventListener("resize", handleResize);
    handleResize()
    return () => {
      removeEventListener("OpenWalletApp", handleSequenceWalletAuth);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    const container = document.querySelector('.container') as any;

    let w = window.innerWidth * 0.98;
    let h = window.innerHeight * 0.98;

    const r = 600 / 960;
    if (w * r > window.innerHeight) {
      w = Math.min(w, Math.ceil(h / r));
    }

    h = Math.floor(w * r);

    container.style.width = w + "px";
    container.style.height = h + "px";
  }

  return (
      <div className="outer-container">
        <div className="container">
          {isLoaded === false && (
              <div className="loading-overlay">
                <p>Loading... ({loadingPercentage}%)</p>
              </div>
          )}
          <Unity className="unity" unityProvider={unityProvider} />
        </div>
      </div>
  );
}

export default App;

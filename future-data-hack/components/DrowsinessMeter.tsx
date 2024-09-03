import { useEffect, useState } from "react";
import { useWebsocket, isWebsocketMessage } from "./contexts/websocketContext";

const DrowsinessMeter = () => {
  const { lastMessage } = useWebsocket();
  const [drowsinessLevel, setDrowsinessLevel] = useState<
    number | string | undefined
  >(0);

  // parse the last message and see if it is incoming audio
  useEffect(() => {
    if (
      lastMessage &&
      isWebsocketMessage(lastMessage) &&
      lastMessage.event === "drowsiness"
    ) {
      const drowsinessLevel = lastMessage.data;
      console.log("Received drowsiness level:", drowsinessLevel);
      // set the state
      setDrowsinessLevel(drowsinessLevel);
    }
  }, [lastMessage]);
  return (
    <>
      {
        // TODO: implement a real visual component for the drowsiness meter
      }
    </>
  );
};

export default DrowsinessMeter;

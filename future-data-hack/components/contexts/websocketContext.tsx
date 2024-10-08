import { createContext, useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";

type WebsocketMessage = {
  event: string;
  data: string;
};

export function isWebsocketMessage(obj: any): obj is WebsocketMessage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.event === "string" &&
    typeof obj.data === "string"
  );
}

type WebSocketContextType = {
  ws: WebSocket | null;
  sendMessage: (message: WebsocketMessage) => void;
  connectionStatus: string;
  lastMessage: WebsocketMessage | null;
  deviceUUID: string;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

const WebsocketProvider = ({ children }: { children: React.JSX.Element }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastMessage, setLastMessage] = useState<WebsocketMessage | null>(null);
  const [deviceUUID, _] = useState(uuid.v4() as string);

  useEffect(() => {
    // const websocketURL = "wss://ws.ifelse.io"; // this url is to test whether the websocket can connect to a random server meant for testing
    const websocketURL = "ws://127.0.0.1:5000/ws"; // this will connect to our websocket server
    // generate a device UUID
    const websocket = new WebSocket(websocketURL);

    websocket.onopen = () => {
      setConnectionStatus("connected");
      console.log("WebSocket connection opened.");
    };

    websocket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (isWebsocketMessage(data)) {
        setLastMessage(data);
      } else {
        console.error("Invalid WebSocket message format received:", data);
      }
      console.log("WebSocket message received:", e.data);
    };

    websocket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    websocket.onclose = (e) => {
      setConnectionStatus("disconnected");
      console.log("WebSocket connection closed:", e.code, e.reason);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  // Function to send messages through WebSocket
  const sendMessage = (message: WebsocketMessage) => {
    if (ws && connectionStatus === "connected") {
      ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ ws, sendMessage, connectionStatus, lastMessage, deviceUUID }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebsocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }
  return context;
};

export { WebsocketProvider, useWebsocket };

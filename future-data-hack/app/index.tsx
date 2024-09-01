import Camera from "@/components/camera";
import { Text, View } from "react-native";
import MicrophoneComponent from "@/components/Microphone";
import { useWebsocket } from "@/components/contexts/websocketContext";

export default function Index() {
  const { connectionStatus } = useWebsocket();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Camera />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <Text>WebSocket connection status: {connectionStatus}</Text>
        <MicrophoneComponent />
      </View>
    </View>
  );
}

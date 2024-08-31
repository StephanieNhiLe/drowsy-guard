import Camera from "@/components/camera";
import { Text, View } from "react-native";
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
      <Text>WebSocket connection status: {connectionStatus}</Text>
      <Camera />
    </View>
  );
}

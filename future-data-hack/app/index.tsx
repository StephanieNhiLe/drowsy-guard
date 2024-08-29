import { Text, View } from "react-native";
import { useWebsocket } from "@/components/contexts/websocketContext";

export default function Index() {
  const { sendMessage, lastMessage, connectionStatus } = useWebsocket();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>WebSocket connection status: {connectionStatus}</Text>
      <Text>Camera is not available rip</Text>
    </View>
  );
}

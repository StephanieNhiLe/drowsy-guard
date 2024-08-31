import { WebsocketProvider } from "@/components/contexts/websocketContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WebsocketProvider>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </WebsocketProvider>
  );
}

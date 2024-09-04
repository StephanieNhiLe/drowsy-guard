import { WebsocketProvider } from "@/components/contexts/websocketContext";
import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <WebsocketProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </WebsocketProvider>
  );
}

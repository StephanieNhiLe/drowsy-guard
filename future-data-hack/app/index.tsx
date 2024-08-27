import { Text, View } from "react-native";
export default function Index() {
  const ws = new WebSocket("http://127.0.0.1:8000/ws");

  ws.onopen = () => {
    // connection opened
    ws.send("something"); // send a message
  };

  ws.onmessage = (e) => {
    // a message was received
    console.log(e.data);
  };

  ws.onerror = (e) => {
    // an error occurred
    console.log(e);
  };

  ws.onclose = (e) => {
    // connection closed
    console.log(e.code, e.reason);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Camera is not available rip</Text>
    </View>
  );
}

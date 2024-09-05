import { useEffect, useState } from "react";
import { useWebsocket, isWebsocketMessage } from "./contexts/websocketContext";
import { View, Text, StyleSheet } from "react-native";

const DrowsinessMeter = () => {
  const { lastMessage } = useWebsocket();
  const [drowsinessLevel, setDrowsinessLevel] = useState<string | undefined>("Non-Drowsy");

  useEffect(() => {
    if (
      lastMessage &&
      isWebsocketMessage(lastMessage) &&
      lastMessage.event === "prediction"
    ) {
      const drowsinessLevel = lastMessage.data;
      console.log("Received drowsiness level:", drowsinessLevel);
      setDrowsinessLevel(drowsinessLevel);
    }
  }, [lastMessage]);

  const getAlertText = (level: string) => {
    if (level === "Non-Drowsy") return "No Warning";
    return "Warning: Drowsiness Detected";
  };

  const getAlertColor = (level: string) => {
    if (level === "Non-Drowsy") return styles.greenAlert;
    return styles.redAlert;
  };

  return (
    <View style={[styles.alertBox, getAlertColor(drowsinessLevel ?? "Non-Drowsy")]}>
      <Text style={styles.alertText}>{getAlertText(drowsinessLevel ?? "Non-Drowsy")}</Text>
      <Text style={styles.subText}>
        {drowsinessLevel === "Non-Drowsy" ? "No Drowsy Behaviors Detected" : "Drowsy Behaviors Detected"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderColor: 'green',
    borderWidth: 1,
  },
  greenAlert: {
    backgroundColor: '#e6f9e7',
    borderColor: 'green',
  },
  redAlert: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  alertText: {
    color: '#155724',
    fontWeight: 'bold',
  },
  subText: {
    color: '#155724',
  }
});

export default DrowsinessMeter;
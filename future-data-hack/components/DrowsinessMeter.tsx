import { useEffect, useState } from "react";
import { useWebsocket, isWebsocketMessage } from "./contexts/websocketContext";
import { View, Text, StyleSheet } from "react-native";

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
      lastMessage.event === "prediction"
    ) {
      const drowsinessLevel = lastMessage.data;
      console.log("Received drowsiness level:", drowsinessLevel);
      // set the state
      setDrowsinessLevel(drowsinessLevel);
    }
  }, [lastMessage]);

  const getAlertText = (level: number) => {
    if (level === 0) return "No Warning";
    if (level === 1) return "Caution";
    return "Warning: Drowsiness Detected";
  };

  const getAlertColor = (level: number) => {
    if (level < 3) return styles.greenAlert;
    if (level < 6) return styles.yellowAlert;
    return styles.redAlert;
  };

  return (
    <View style={[styles.alertBox, getAlertColor(Number(drowsinessLevel))]}>
    <Text style={styles.alertText}>{getAlertText(Number(drowsinessLevel))}</Text>
    <Text style={styles.subText}>
      {drowsinessLevel === 0 ? "No Drowsy Behaviors Detected" : "Drowsy Behaviors Detected"} 
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
  yellowAlert: {
    backgroundColor: '#fff5cc',
    borderColor: '#ffc107',
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

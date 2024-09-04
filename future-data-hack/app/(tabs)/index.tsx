import React, { useState } from "react";
import Camera from "@/components/camera";
import { Text, View, TouchableOpacity } from "react-native";
import { useWebsocket } from "@/components/contexts/websocketContext";
import DrowsinessMeter from "@/components/DrowsinessMeter";
import Icon from "react-native-vector-icons/MaterialIcons";
import MicrophoneComponent from "@/components/Microphone";
import AudioStreamPlayer from "@/components/AudioStreamPlayer";
import MicrophoneComponent_ALT from "@/components/Microphone_ALT";

export default function Home() {
  const { connectionStatus } = useWebsocket();
  const [isMicrophoneActive, setMicrophoneActive] = useState(false);
  const [isAudioPlayerActive, setAudioPlayerActive] = useState(false);

  const handleMicrophonePress = () => {
    setMicrophoneActive(!isMicrophoneActive);
  };

  const handlePlayerPress = () => {
    setAudioPlayerActive(!isAudioPlayerActive);
  };

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
          paddingBottom: 40,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Text>WebSocket connection status: {connectionStatus}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
          {/* <TouchableOpacity onPress={handleMicrophonePress}>
            <Icon 
              name="mic" 
              size={40} 
              color={isMicrophoneActive ? "blue" : "gray"} 
              style={{ opacity: isMicrophoneActive ? 1 : 0.5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayerPress}>
            <Icon
              name="play-arrow"
              size={40}
              color={isAudioPlayerActive ? "blue" : "gray"}
              style={{ opacity: isAudioPlayerActive ? 1 : 0.5 }}
            />
          </TouchableOpacity> */}
          <MicrophoneComponent_ALT />
        </View>

        <DrowsinessMeter />
      </View>

      {isMicrophoneActive && <MicrophoneComponent />}
      {isAudioPlayerActive && <AudioStreamPlayer />}
    </View>
  );
}

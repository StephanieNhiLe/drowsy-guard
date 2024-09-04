import React, { useState } from "react";
import Camera from "@/components/camera";
import { Text, View, TouchableOpacity } from "react-native";
import { useWebsocket } from "@/components/contexts/websocketContext";
import DrowsinessMeter from "@/components/DrowsinessMeter";
import Icon from "react-native-vector-icons/MaterialIcons";
import MicrophoneComponent from "@/components/Microphone";
import AudioStreamPlayer from "@/components/AudioStreamPlayer";

export default function Action() {
  return (
    <View style={{ padding: 10 }}>
      <View style={{ display: "flex" }}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: "grey",
            marginRight: 10,
          }}
        />
        <View>
          <Text style={{ fontWeight: "bold" }}>Driver's Assisstant</Text>
          <Text>Assessing Driver Alertness</Text>
        </View>
      </View>
      <DrowsinessMeter />
    </View>
  );
}

import React, { useState } from "react";
import Camera from "@/components/camera";
import { Text, View, TouchableOpacity } from "react-native";
import { useWebsocket } from "@/components/contexts/websocketContext";
import DrowsinessMeter from "@/components/DrowsinessMeter";
import Icon from "react-native-vector-icons/MaterialIcons";
import MicrophoneComponent from "@/components/Microphone";
import AudioStreamPlayer from "@/components/AudioStreamPlayer";

export default function Action() {
  const assisstances = [
    {
      isrecommended: true,
      image: "Rest stop",
      title: "Rest break recommended",
      distance: "5 miles ahead",
    },
    {
      isrecommended: false,
      image: "Rest stop",
      title: "Rest break recommended",
      distance: "5 miles ahead",
    },
  ];
  return (
    <View style={{ padding: 10 }}>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
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
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Driver's Assisstant
          </Text>
          <Text>Assessing Driver Alertness</Text>
        </View>
      </View>
      <DrowsinessMeter />
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          {" "}
          Nearest Assistance
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {assisstances.map((as) => {
            return (
              <View
                style={{
                  borderRadius: 10,
                  position: "relative",
                  borderColor: "grey",
                  width: 200,
                  height: 300,
                  borderWidth: 1,
                  marginRight: 20,
                  overflow: "hidden",
                }}
              >
                {as.isrecommended && (
                  <Text
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      color: "black",
                      zIndex: 1,
                    }}
                  >
                    Recommended
                  </Text>
                )}
                <View
                  style={{
                    backgroundColor: "grey",
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>{as.image}</Text>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ marginBottom: 10 }}>{as.title}</Text>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {as.distance}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

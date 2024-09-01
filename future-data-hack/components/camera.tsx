import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useWebsocket } from "./contexts/websocketContext";

const Camera = () => {
  const [hasCameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const { sendMessage } = useWebsocket();

  const startCapturingFrames = () => {
    console.log("Starting to capture frames");
    const interval = setInterval(async () => {
      const cameraRefValue = cameraRef.current;
      if (cameraRefValue) {
        const photo = await cameraRefValue.takePictureAsync({
          base64: true,
        });
        if (photo && photo.base64) {
          // console.log(photo.base64);
          // send the image to the server
          sendMessage({ data: photo.base64, event: "image" });
        }
      } else {
        console.log("Camera ref is not available");
      }
    }, 500); // capture the frame every so often

    return () => clearInterval(interval);
  };

  if (!hasCameraPermission) {
    // Camera permissions are loading
    return <View />;
  }

  if (!hasCameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant Permission" />
      </View>
    );
  }

  return hasCameraPermission.granted ? (
    <CameraView
      style={styles.camera}
      facing={"front"}
      onCameraReady={() => {
        startCapturingFrames();
      }}
      ref={cameraRef}
    />
  ) : (
    <Text>Camera is not available rip</Text>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: "100%", // Set width to 100%
    height: "100%", // Set height to 100%
  },

  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});

export default Camera;

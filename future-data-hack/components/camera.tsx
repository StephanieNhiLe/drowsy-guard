import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, useCameraPermissions, CameraViewRef } from "expo-camera";

const Camera = () => {
  const [hasCameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<React.RefObject<CameraViewRef | null>>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

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

  const onCameraReady = () => {
    setIsCameraReady(true);
    startCapturingFrames();
  };

  const startCapturingFrames = () => {
    const interval = setInterval(async () => {
      const cameraRefValue = cameraRef.current;
      if (cameraRefValue) {
        const photo = await cameraRefValue.current?.takePicture({
          base64: true,
        });
        if (photo) {
          console.log(photo.base64);
        }
      }
    }, 1000); // capture the frame every so often

    return () => clearInterval(interval);
  };

  return hasCameraPermission.granted ? (
    <CameraView style={styles.camera} facing={"front"}></CameraView>
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

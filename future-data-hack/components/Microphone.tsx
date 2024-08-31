// import button from react native
import { Button, Text } from "react-native";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

const MicrophoneComponent = () => {
  const [recordingState, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [currentMeter, setCurrentMeter] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (recordingState) {
        stop();
      }
    };
  }, []);

  let silenceTimeStamp: number | undefined = 0;
  let soundDetected = false;

  async function handleVoiceDetection(data: Audio.RecordingStatus) {
    // implement a simple VAD (Voice Activity Detection)
    const metering = data.metering;
    console.log(metering);
    setCurrentMeter(metering); // for debugging purposes

    // when it is lower than a threshold, we can assume that the user is not speaking
    // talking next to the phone is about like, -25
    const threshold = -26;
    if (metering !== undefined && metering <= threshold) {
      // give a buffer of 1 second before stopping the recording
      let currentSilenceTimeStamp = data.durationMillis;
      if (
        silenceTimeStamp !== undefined &&
        currentSilenceTimeStamp - silenceTimeStamp! > 1000 &&
        soundDetected
      ) {
        // stop recording, send the sound snippet to the server through websockets
        console.log("Sending sound snippet to the server to be transcribed...");
        await stop();
      } else {
        // this is the new silence timestamp
        silenceTimeStamp = currentSilenceTimeStamp;
      }
    } else {
      soundDetected = true;
    }
  }

  const start = async () => {
    try {
      if (permissionResponse && permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        handleVoiceDetection
      );
      setRecording(recording);
      soundDetected = false;
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stop = async () => {
    if (recordingState) {
      console.log("Stopping recording..");
      await recordingState.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      });
      const uri = recordingState.getURI();
      setRecording(undefined);
      console.log("Recording stopped and stored at", uri);
    } else {
      console.log("No recording to stop");
    }
  };

  return (
    <>
      <Button
        title={recordingState ? "Stop Recording" : "Start Recording"}
        onPress={recordingState ? stop : start}
      />
      <Text>{currentMeter}</Text>
    </>
  );
};

export default MicrophoneComponent;

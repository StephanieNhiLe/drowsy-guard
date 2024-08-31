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
  const [currentDuration, setCurrentDuration] = useState<number | undefined>(0);

  useEffect(() => {
    return () => {
      if (recordingState) {
        stop();
      }
    };
  }, []);

  useEffect(() => {
    console.log(currentMeter);
    // implement a simple VAD (Voice Activity Detection)
    // when it is lower than a threshold, we can assume that the user is not speaking
    // talking next to the phone is about like, -25
    const threshold = -26;
    if (
      currentMeter !== undefined &&
      currentMeter <= threshold &&
      currentDuration !== undefined
    ) {
      // give a buffer of 1 second before stopping the recording
      let currentSilenceTimeStamp = currentDuration;
      console.log("current silence timestamp:", currentSilenceTimeStamp);
      if (silenceTimeStamp !== undefined) {
        console.log("difference:", currentSilenceTimeStamp - silenceTimeStamp);
      }
      if (
        silenceTimeStamp !== undefined &&
        currentSilenceTimeStamp - silenceTimeStamp > 1000
      ) {
        // stop recording, send the sound snippet to the server through websockets
        console.log("Sending sound snippet to the server to be transcribed...");
        stop();
      } else {
        // this is the new silence timestamp
        console.log("updating silence timestamp");
        silenceTimeStamp = currentSilenceTimeStamp;
      }
    }
  }, [currentMeter]);

  let silenceTimeStamp: number | undefined = 0;

  async function handleVoiceDetection(data: Audio.RecordingStatus) {
    if (data.isRecording) {
      setCurrentMeter(data.metering); // for debugging purposes
      setCurrentDuration(data.durationMillis);
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
        allowsRecordingIOS: false,
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

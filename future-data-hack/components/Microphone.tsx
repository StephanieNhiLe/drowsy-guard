// import button from react native
import { Button, Text } from "react-native";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useWebsocket } from "./contexts/websocketContext";
import * as FileSystem from "expo-file-system";

const MicrophoneComponent = () => {
  const [recordingState, setRecording] = useState<Audio.Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [currentMeter, setCurrentMeter] = useState<number | undefined>(
    undefined
  );
  const [currentDuration, setCurrentDuration] = useState<number | undefined>(0);
  const [audioBuffer, setAudioBuffer] = useState<string[]>([]);

  const { ws, sendMessage } = useWebsocket();

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
        saveAudioChunk();
        if (audioBuffer.length > 0) {
          const chunk = audioBuffer[0];
          if (chunk) {
            streamAudio(chunk);
            // remove the audio from the buffer
            setAudioBuffer((prevAudioBuffer) => prevAudioBuffer.slice(1));
          }
        }
      } else {
        // this is the new silence timestamp
        console.log("updating silence timestamp");
        silenceTimeStamp = currentSilenceTimeStamp;
      }
    }
  }, [currentMeter]);

  let silenceTimeStamp: number | undefined = 0;

  async function handleVoiceDetection(data: Audio.RecordingStatus) {
    setCurrentDuration(data.durationMillis);
    setCurrentMeter(data.metering); // for debugging purposes
  }

  const saveAudioChunk = async () => {
    // stop to save the audio chunk
    await stop();
    // resume recording
    await start();
  };

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
      if (uri) {
        setAudioBuffer((prevAudioBuffer) => [...prevAudioBuffer, uri]);
      }
    } else {
      console.log("No recording to stop");
    }
  };

  const streamAudio = async (audioUri: string) => {
    console.log("Streaming audio..");
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected!");
      return;
    }

    try {
      // get file info
      const fileInfo = await FileSystem.getInfoAsync(audioUri);

      if (!fileInfo.exists) {
        console.error("Audio file not found!");
        return;
      }

      // set chunk size
      const chunkSize = 4096;

      // send file info in chunks
      const readFileAndSendChunks = async (offset = 0) => {
        const data = await FileSystem.readAsStringAsync(audioUri, {
          encoding: FileSystem.EncodingType.Base64,
          position: offset,
          length: chunkSize,
        });

        if (data.length > 0) {
          // Send the chunk through the WebSocket
          sendMessage({ data: data, event: "audio" });

          // Read and send the next chunk recursively
          readFileAndSendChunks(offset + chunkSize);
        } else {
          // Signal end of stream (optional)
          // webSocket.send("EOS"); // Or any other delimiter
          console.log("Audio stream complete!");
        }
      };

      // Start reading and sending chunks
      readFileAndSendChunks();
    } catch (error) {
      console.error("Error streaming audio:", error);
    }
  };

  const playRecentRecorded = async () => {
    if (audioBuffer.length === 0) {
      console.log("No audio to play");
      return;
    }
    const sound = new Audio.Sound();
    try {
      console.log("Loading sound..");
      await sound.loadAsync({ uri: audioBuffer[0] });
      console.log("Playing sound..");
      await sound.playAsync();
      // remove the sound from the buffer
      setAudioBuffer((prevAudioBuffer) => prevAudioBuffer.slice(1));
    } catch (err) {
      console.error("Failed to play sound", err);
    }
  };

  return (
    <>
      <Button
        title={recordingState ? "Stop Recording" : "Start Recording"}
        onPress={recordingState ? stop : start}
      />
      <Text>{currentMeter}</Text>
      <Button title="Play most recent audio" onPress={playRecentRecorded} />
    </>
  );
};

export default MicrophoneComponent;

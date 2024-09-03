import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useWebsocket, isWebsocketMessage } from "./contexts/websocketContext";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";

const AudioStreamPlayer = () => {
  const [audioQueue, setAudioQueue] = useState<string[]>([]);

  const { lastMessage } = useWebsocket();

  // parse the last message and see if it is incoming audio
  useEffect(() => {
    if (
      lastMessage &&
      isWebsocketMessage(lastMessage) &&
      lastMessage.event === "audio"
    ) {
      // take the audio data and save it to a file url
      const audioData = lastMessage.data;
      // FIXME: assuming this is a base64 encoded audio data
      const audioBuffer = Buffer.from(audioData, "base64");
      // convert the buffer to a string
      const audioString = audioBuffer.toString("base64");
      // save the audioBuffer to a file to be played
      const fileURI = FileSystem.cacheDirectory + `${uuid.v4()}.mp3`;
      const newAudioChunk = FileSystem.writeAsStringAsync(
        fileURI,
        audioString,
        { encoding: FileSystem.EncodingType.Base64 }
      )
        .then(() => {
          // add the file url to the audio queue
          setAudioQueue((prevAudioQueue) => [...prevAudioQueue, fileURI]);
        })
        .catch((error) => {
          console.error("Error saving file:", error);
        });
    }
  }, [lastMessage]);

  // play the audio from the audio queue
  useEffect(() => {
    if (audioQueue.length > 0) {
      const soundObject = new Audio.Sound();
      const playAudio = async () => {
        try {
          await soundObject.loadAsync({
            uri: audioQueue[0],
          });
          await soundObject.playAsync();
          // remove the audio from the queue
          setAudioQueue((prevAudioQueue) => prevAudioQueue.slice(1));
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      };
      // FIXME: I am worried about async issues here
      playAudio();
      return () => {
        soundObject.unloadAsync();
      };
    }
  }, [audioQueue]);

  return null;
};

export default AudioStreamPlayer;

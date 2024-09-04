import React from 'react';
import { Button, FlatList, Text, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';

type Message = {
  text: string;
  isAI: boolean;
};

const MicrophoneComponent_ALT = () => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [messages, setMessages] = useState<Message[]>([]);

  const startRecording = async () => {
    try {
      if (permissionResponse && permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      console.log('Stopping recording..');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      setRecording(undefined);
      console.log('Recording stopped and stored at', uri);
      if (uri) {
        await sendAudioToBackend(uri);
      }
    } else {
      console.log('No recording to stop');
    }
  };

  const sendAudioToBackend = async (audioUri: string) => {
    try {
      const audioData = await fetch(audioUri);
      const audioBlob = await audioData.blob();

      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch('https://super-capybara-5jp7xqj7qxrh59r-5000.app.github.dev/llm-drive', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newMessages: Message[] = [
          { text: result.transcript, isAI: false },
          { text: result.gemini_response, isAI: true }
        ];
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
        console.log('Backend processing successful:', result);
      } else {
        console.error('Backend API error:', await response.text());
      }
    } catch (error) {
      console.error('Error sending audio to backend:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const messageStyle = item.isAI ? styles.aiMessage : styles.userMessage;
    return (
      <View style={[styles.messageContainer, messageStyle]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        style={styles.chatContainer}
      />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
});

export default MicrophoneComponent_ALT;

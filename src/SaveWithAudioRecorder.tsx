// src/AudioRecorder.tsx
import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

const SaveWithAudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      //   timer 
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.wav';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    console.log('data stream', isRecording, audioUrl, audioBlob, mediaRecorderRef, audioChunksRef)
  }, [audioBlob, audioUrl, isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>{isRecording && <span>Recording: {formatTime(timer)}</span>}</div>
      <p></p>
      {audioUrl && (
        <div>
            <button onClick={saveRecording}>Save Recording</button>
            <p></p>
            <AudioPlayer audioFile={audioUrl}/>
        </div>
      )}
    </div>
  );
};

export default SaveWithAudioRecorder;

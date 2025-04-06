import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const MITTherapy = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [background, setBackground] = useState("white");
  
  // Function to play melody
  const playMelody = async () => {
    const synth = new Tone.Synth().toDestination();
    await Tone.start();
    const notes = ["C4", "D4", "E4", "G4"];
    
    notes.forEach((note, i) => {
      setTimeout(() => {
        synth.triggerAttackRelease(note, "8n");
      }, i * 500);
    });
  };
  
  // Function to start speech recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const userSpeech = event.results[0][0].transcript;
      setTranscript(userSpeech);
      provideFeedback(userSpeech);
    };
    
    recognition.start();
  };
  
  // Function to provide feedback
  const provideFeedback = (text) => {
    const expectedPhrase = "hello world"; // Example target phrase
    if (text.toLowerCase().includes(expectedPhrase)) {
      setBackground("green");
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else {
      setBackground("red");
      if (navigator.vibrate) navigator.vibrate(500);
    }
  };
  
  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: background, transition: "0.5s" }}>
      <h1>Melodic Intonation Therapy</h1>
      <button onClick={playMelody}>🎵 Play Melody</button>
      <button onClick={startListening} disabled={isListening}>
        🎤 {isListening ? "Listening..." : "Start Speaking"}
      </button>
      <p>Say: "Hello world"</p>
      <p><strong>Detected:</strong> {transcript}</p>
    </div>
  );
};

export default MITTherapy;

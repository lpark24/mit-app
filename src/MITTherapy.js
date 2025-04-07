import React, { useState } from "react";
import * as Tone from "tone";

const melodyNotes = [
  { note: "G4", label: "High", color: "#FF6B6B", syllable: "What’s", duration: 400 },
  { note: "C4", label: "Low",  color: "#FFD93D", syllable: "for",    duration: 200 },
  { note: "G4", label: "High", color: "#FF6B6B", syllable: "din-",   duration: 400 },
  { note: "C4", label: "Low",  color: "#FFD93D", syllable: "ner?",   duration: 200 },
];


const MITTherapy = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [background, setBackground] = useState("white");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");

  // 🎵 Play melody and vibrate
  const playMelody = async () => {
    const synth = new Tone.Synth().toDestination();
    await Tone.start();
  
    melodyNotes.forEach((item, i) => {
      setTimeout(() => {
        setCurrentNoteIndex(i); // 🎯 trigger animation
        synth.triggerAttackRelease(item.note, "8n");
        if (navigator.vibrate) navigator.vibrate(item.duration);
      }, i * 600);
    });
  
    // Reset after last note
    setTimeout(() => setCurrentNoteIndex(-1), melodyNotes.length * 600);
  };

  // 🎤 Request microphone permission
  const requestMicrophoneAccess = async () => {
    try {
      await Tone.start(); // ✅ Unlock audio in response to user interaction
      setPermissionGranted(true); // ✅ Mark app as ready
      setErrorMessage(""); // Clear any previous errors
    } catch (err) {
      setErrorMessage("Something went wrong while starting the app.");
    }
  };
  

  // 🎤 Start listening
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

  // ✅ Feedback
  const provideFeedback = (text) => {
    const expectedPhrase = "what's for dinner";
    if (text.toLowerCase().includes(expectedPhrase)) {
      setBackground("#D4EDDA"); // light green
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else {
      setBackground("#F8D7DA"); // light red
      if (navigator.vibrate) navigator.vibrate(500);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: background, transition: "0.5s" }}>
      <h1>Melodic Intonation Therapy</h1>
      <h3>Target Phrase: <span style={{ color: "#333" }}>“What’s for dinner?”</span></h3>

      {/* Visual Melody */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", margin: "20px 0" }}>
        {melodyNotes.map((item, i) => (
          <div
          key={i}
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px",
            transform: i === currentNoteIndex ? "scale(1.2)" : "scale(1)",
            boxShadow: i === currentNoteIndex ? "0 0 10px rgba(0,0,0,0.5)" : "none",
            transition: "all 0.3s ease"
          }}
        >
            {item.label}
          </div>
        ))}
      </div>

      {/* Syllables under notes */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        {melodyNotes.map((item, i) => (
          <span
          key={i}
          style={{
            width: 50,
            textAlign: "center",
            fontWeight: i === currentNoteIndex ? "bold" : "normal",
            fontSize: i === currentNoteIndex ? "16px" : "14px",
            color: i === currentNoteIndex ? "#222" : "#555",
            transition: "all 0.3s ease"
          }}
        >
          {item.syllable}
        </span>
        ))}
      </div>

      {/* Buttons */}
      {!permissionGranted ? (
        <button onClick={requestMicrophoneAccess}>🎬 Start Therapy</button>
      ) : (
        <>
          <button onClick={playMelody}>🎵 Play Melody</button>
          <button onClick={singWithVibration}>🎶 Sing with Vibration</button>
          <button onClick={startListening} disabled={isListening}>
            🎤 {isListening ? "Listening..." : "Start Speaking"}
          </button>
        </>
      )}
{errorMessage && (
  <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
)}
      <p><strong>Say:</strong> “What’s for dinner?”</p>
      <p><strong>Detected:</strong> {transcript}</p>
    </div>
  );
};
// 🎤 Sing with vibration
const singWithVibration = async () => {
  const synth = new Tone.Synth().toDestination();
  await Tone.start();

  melodyNotes.forEach((item, i) => {
    setTimeout(() => {
      setCurrentNoteIndex(i); // 🔥 trigger visual highlight
      synth.triggerAttackRelease(item.note, "8n");
      if (navigator.vibrate) {
        navigator.vibrate(item.duration);
      }
    }, i * 600);
  });

  // Reset the highlight after the melody finishes
  setTimeout(() => setCurrentNoteIndex(-1), melodyNotes.length * 600);
};



export default MITTherapy;

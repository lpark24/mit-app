import React, { useState } from "react";
import * as Tone from "tone";

const melodyNotes = [
  { note: "G4", color: "#FF6B6B", syllable: "What’s" }, // High
  { note: "C4", color: "#FFD93D", syllable: "for" },    // Low
  { note: "G4", color: "#FF6B6B", syllable: "din-" },   // High
  { note: "C4", color: "#FFD93D", syllable: "ner?" },   // Low
];

const MITTherapy = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [background, setBackground] = useState("white");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🎵 Play melody and vibrate
  const playMelody = async () => {
    const synth = new Tone.Synth().toDestination();
    await Tone.start();

    melodyNotes.forEach((item, i) => {
      setTimeout(() => {
        synth.triggerAttackRelease(item.note, "8n");
        if (navigator.vibrate) navigator.vibrate(200);
      }, i * 600);
    });
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
          <div key={i} style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "14px"
          }}>
            {item.note}
          </div>
        ))}
      </div>

      {/* Syllables under notes */}
      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
        {melodyNotes.map((item, i) => (
          <span key={i} style={{ width: 50, textAlign: "center" }}>{item.syllable}</span>
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
  const notes = ["C4", "G3", "C4", "G3"];
  const rhythm = [400, 200, 400, 200]; // milliseconds per note

  notes.forEach((note, i) => {
    setTimeout(() => {
      synth.triggerAttackRelease(note, "8n");

      // Vibrate for that note if supported
      if (navigator.vibrate) {
        navigator.vibrate(rhythm[i]);
      }

    }, i * 600); // add some spacing between notes
  });
};


export default MITTherapy;

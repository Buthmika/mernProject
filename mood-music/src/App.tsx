import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

export default function App() {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("Detecting...");
  const [playlist, setPlaylist] = useState("");

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // models inside public/
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  // Detect emotions every second
  useEffect(() => {
    const interval = setInterval(async () => {
      if (webcamRef.current?.video?.readyState === 4) {
        const detections = await faceapi
          .detectSingleFace(
            webcamRef.current.video,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detections?.expressions) {
          const expressions = detections.expressions;
          const sorted = Object.entries(expressions).sort(
            (a, b) => b[1] - a[1]
          );
          const topEmotion = sorted[0][0];
          setEmotion(topEmotion);

          // Playlist mapping
          if (topEmotion === "happy") setPlaylist("🎵 Happy Vibes Playlist");
          else if (topEmotion === "sad") setPlaylist("🎵 Lo-Fi Chill Playlist");
          else if (topEmotion === "angry") setPlaylist("🎵 Rock Energy Playlist");
          else if (topEmotion === "neutral") setPlaylist("🎵 Relaxing Jazz Playlist");
          else if (topEmotion === "surprised") setPlaylist("🎵 Party Hits Playlist");
          else setPlaylist("🎵 Mixed Mood Playlist");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", background: "#111", minHeight: "100vh", color: "white", padding: "20px" }}>
      <h1>AI Mood Music Recommender 🎶</h1>
      <Webcam
        ref={webcamRef}
        audio={false}
        width={400}
        height={300}
        style={{ borderRadius: "12px", marginTop: "20px" }}
      />
      <div style={{ marginTop: "20px", fontSize: "20px" }}>
        <p>Detected Emotion: <b>{emotion}</b></p>
        <p>Suggested Playlist: <b>{playlist}</b></p>
      </div>
    </div>
  );
}

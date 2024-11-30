import React, { useEffect, useState, useContext } from 'react';
import { PhotoContext } from '../../context/PhotoContext';
import * as faceapi from 'face-api.js';
import '../../styles/pages/Analysis.css';

// Add face shape functions here
const determineFaceShape = (width, height) => {
  const ratio = width / height;
  
  if (ratio > 1.1) return "Round";
  if (ratio < 0.9) return "Oval";
  return "Square";
};

const getGlassesRecommendations = (faceShape) => {
  const recommendations = {
    Round: [
      "Square frames",
      "Rectangle frames",
      "Angular frames",
      "Wayfarer styles"
    ],
    Oval: [
      "Aviator styles",
      "Square frames",
      "Geometric shapes",
      "Most frame styles"
    ],
    Square: [
      "Round frames",
      "Oval frames",
      "Curved frames",
      "Rimless styles"
    ]
  };

  return recommendations[faceShape] || ["Any frame style"];
};

const Analysis = () => {
  const { capturedPhoto } = useContext(PhotoContext);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!capturedPhoto) {
      return;
    }
    
    setLoading(true);
    const analyzeFace = async () => {
      try {
        console.log('Starting face analysis...');
        
        // Load models
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ]);
        
        // Create image
        const img = await createImageFromDataUrl(capturedPhoto);
        
        // Detect face
        const detections = await faceapi.detectSingleFace(img)
          .withFaceLandmarks();

        if (detections) {
          // Get measurements
          const landmarks = detections.landmarks.positions;
          const measurements = {
            faceWidth: landmarks[16].x - landmarks[0].x,
            faceHeight: landmarks[8].y - landmarks[27].y,
          };
          
          // Determine face shape
          const shape = determineFaceShape(
            measurements.faceWidth,
            measurements.faceHeight
          );
          
          // Get recommendations
          const recommendations = getGlassesRecommendations(shape);

          setAnalysis({
            faceShape: shape,
            recommendations: recommendations
          });
        } else {
          setError('No face detected. Please try taking another photo.');
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Error analyzing face. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    analyzeFace();
  }, [capturedPhoto]);

  const createImageFromDataUrl = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => resolve(img);
    });
  };

  return (
    <div className="analysis" style={{ 
      border: '2px solid red',
      padding: '20px',
      margin: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <h2>Analysis Status</h2>
      {!capturedPhoto && <div>No photo captured yet. Please take a photo.</div>}
      {loading && <div>Analyzing your face shape...</div>}
      {error && <div className="error">{error}</div>}
      {analysis && (
        <>
          <h2>Your Face Analysis Results</h2>
          <div className="analysis-results">
            <div className="face-shape">
              <h3>Your Face Shape: {analysis.faceShape}</h3>
            </div>
            <div className="recommendations">
              <h3>Recommended Glasses Styles:</h3>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analysis; 
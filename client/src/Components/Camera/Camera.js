import React, { useCallback, useRef, useState, useContext } from 'react';
import { PhotoContext } from '../../context/PhotoContext';
import Webcam from 'react-webcam';
import '../../styles/components/Camera.css';

const Camera = () => {
  const webcamRef = useRef(null);
  const [error, setError] = useState(null);
  const { setCapturedPhoto } = useContext(PhotoContext);

  const capture = useCallback(() => {
    try {
      console.log('Capture button clicked');
      
      if (!webcamRef.current) {
        console.error('Webcam reference is not available');
        setError('Camera not initialized');
        return;
      }
      
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Photo captured:', imageSrc ? 'Success' : 'Failed');
      
      if (!imageSrc) {
        console.error('Failed to capture image');
        setError('Failed to capture photo');
        return;
      }
      
      setCapturedPhoto(imageSrc);
      console.log('Photo saved to context');
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo: ' + err.message);
    }
  }, [webcamRef, setCapturedPhoto]);

  return (
    <div className="camera-wrapper">
      <div className="camera-container">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          mirrored={true}
          className="webcam"
          onUserMediaError={(err) => {
            console.error('Webcam access error:', err);
            setError('Failed to access camera');
          }}
        />
        <button onClick={capture}>Take Photo</button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Camera;

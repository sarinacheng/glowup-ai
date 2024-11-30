import React from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../../Components/Camera/Camera';
import '../../styles/pages/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handlePhotoCapture = () => {
    // After photo is captured
    navigate('/analysis');  // This will redirect to the analysis page
  };

  return (
    <div className="home">
      <h1>Find Your Perfect Glasses</h1>
      <p>Take a front-facing photo to analyze your facial features</p>
      <Camera onPhotoCapture={handlePhotoCapture} />
    </div>
  );
};

export default Home;

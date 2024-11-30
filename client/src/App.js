import React from 'react';
import { PhotoProvider } from './context/PhotoContext';
import Camera from './Components/Camera/Camera';
import Analysis from './Pages/Analysis/Analysis';
import './styles/App.css';

function App() {
  return (
    <PhotoProvider>
      <div className="app">
        <h1>Find Your Perfect Glasses</h1>
        <Camera />
        <Analysis />
      </div>
    </PhotoProvider>
  );
}

export default App;
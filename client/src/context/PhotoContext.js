import React, { createContext, useState } from 'react';

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  return (
    <PhotoContext.Provider value={{ capturedPhoto, setCapturedPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};
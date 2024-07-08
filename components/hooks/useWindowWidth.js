import React, { createContext, useState, useEffect, useContext } from 'react';

const WindowSizeContext = createContext();

export function WindowSizeProvider({ children }) {
  const [isSmallerDevice, setIsSmallerDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallerDevice(width < 500);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={{ isSmallerDevice }}>
      {children}
    </WindowSizeContext.Provider>
  );
}

// Converted useWindowWidth hook to ContextAPI
export function useWindowWidth() {
  const context = useContext(WindowSizeContext);
  if (context === undefined) {
    throw new Error('useWindowWidth must be used within a WindowSizeProvider');
  }
  return context;
}

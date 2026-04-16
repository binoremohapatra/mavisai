import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { MavisDashboard } from './components/MavisDashboard';
import { MascotCenterStage } from './components/MascotCenterStage';
import { SpeechProvider } from './contexts/SpeechProvider';
import { screenService } from './services/screen-service';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      screenService.hideLoading();
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (userName?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName || 'User');
  };

  const handleRegisterSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'New User');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
  };

  return (
    <SpeechProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
        
        {/* Mascot in Background (Z-0) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <MascotCenterStage />
        </div>

        {/* UI Overlay (Z-10) */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {!isLoggedIn ? (
            <AuthScreen 
              onLogin={handleLoginSuccess} 
              onRegisterSuccess={handleRegisterSuccess} 
            />
          ) : (
            <MavisDashboard onLogout={handleLogout} />
          )}
        </div>

      </div>
    </SpeechProvider>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/optimized.css'; // Import optimized CSS

// Preload critical assets for home page
const preloadHomeAssets = () => {
  const heroVideoUrl = "https://player.vimeo.com/progressive_redirect/playback/921376317/rendition/1080p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=81fe3100ce7a792e4a2487a6a6a26a72df29adc0cfe19bf09dcae05be11dce97";
  
  // Preload hero video
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = heroVideoUrl;
  link.as = 'video';
  // Use regular attribute setting for non-standard attributes
  link.setAttribute('importance', 'high');
  document.head.appendChild(link);
  
  // Force video fetch with high priority
  const video = document.createElement('video');
  video.style.display = 'none';
  video.preload = 'auto';
  video.setAttribute('importance', 'high');
  
  const source = document.createElement('source');
  source.src = heroVideoUrl;
  source.type = 'video/mp4';
  
  video.appendChild(source);
  document.head.appendChild(video);
  
  // Remove after load attempt
  setTimeout(() => {
    document.head.removeChild(video);
  }, 1000);
};

// Call preload function
preloadHomeAssets();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

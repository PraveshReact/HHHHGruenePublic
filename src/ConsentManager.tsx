import React, { useEffect } from 'react';
import './klaroConfig'; // Ensure the Klaro config is imported
import 'klaro/dist/klaro.css'; // Include Klaro styles

// declare global {
//   interface Window {
//     klaro?: any;
//   }
// }

const ConsentManager = () => {
  console.log('load consent manager')
  useEffect(() => {
    if (!window.klaroConfig) {
      console.error('Klaro configuration not found!');
      return;
    }
  
    const script = document.createElement('script');
    script.src = 'https://cdn.kiprotect.com/klaro/latest/klaro.js';
    script.async = true;
    script.onload = () => {
      if (window?.klaro) {
        window.klaro.show(); // Show the Klaro popup
      } else {
        console.error('Klaro failed to load!');
      }
    };
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  return <div id="klaro"></div>; // Ensure this ID matches the one in klaroConfig
};

export default ConsentManager;

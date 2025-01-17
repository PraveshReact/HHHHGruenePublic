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
    script.innerHTML = `
            function KlaroWatcher() {};
            KlaroWatcher.prototype.update = function(obj, name, data) { 
              if (data !== 'undefined' && data.hasOwnProperty('matomo')) {
                if (data.matomo) { 
                  _paq.push(['rememberCookieConsentGiven']);
                  _paq.push(['setConsentGiven']);
                } else {
                  _paq.push(['forgetCookieConsentGiven']);
                  _paq.push(['deleteCookies']);
                }
              }  
            }; 
            window.kw = new KlaroWatcher();

            var waitForTrackerCount = 0;
            function matomoWaitForTracker() {
              if (typeof _paq === 'undefined' || typeof klaro === 'undefined') {                
                if (waitForTrackerCount < 40) {
                  setTimeout(matomoWaitForTracker, 250);
                  waitForTrackerCount++;  
                  return;
                }
              } else {
                klaro.getManager().watch(kw);
              }
            }  
            document.addEventListener('DOMContentLoaded', matomoWaitForTracker());
        `;
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

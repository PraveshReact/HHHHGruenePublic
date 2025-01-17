export {}; // Ensure this file is treated as a module

declare global {
  interface Window {
    klaroConfig?: any;
    klaro?:any; // Declare klaroConfig as optional
  }
}

// Define klaroConfig globally on the window object
window.klaroConfig = {
  version: 1,
  elementID: 'klaro',
  storageMethod: 'localStorage',
  cookieName: 'klaro-consent',
  privacyPolicy: '/privacy',
  services: [
    {
      name: 'matomo',
      title: 'Matomo Analytics',
      purposes: ['analytics'],
      cookies: [/^pk.*$/, /^mtm.*$/, /^MATOMO.*$/],
      default: false,
      required: false,
    },
  ],
  translations: {
    en: {
      consentModal: {
        title: 'Privacy Settings',
        description: 'We use cookies to improve your experience. Manage your preferences below.',
      },
      matomo: {
        description: 'Collects anonymous usage data to help us improve our website.',
      },
      purposes: {
        analytics: 'Analytics',
      },
    },
  },
};

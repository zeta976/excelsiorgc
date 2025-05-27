// AdSlot.js
// Generic ad slot component for Google AdSense or direct ads
// Usage: <AdSlot position="homepage-banner" />

import React, { useEffect } from 'react';

const AD_CONFIG = {
  'homepage-banner': {
    // Replace with your AdSense ad unit code
    slot: 'YOUR_ADSENSE_SLOT_ID',
    style: { display: 'block', width: '100%', minHeight: 90, margin: '24px 0' },
    format: 'horizontal',
  },
  'article-inline': {
    slot: 'YOUR_ADSENSE_SLOT_ID',
    style: { display: 'block', width: '100%', minHeight: 90, margin: '24px 0' },
    format: 'horizontal',
  },
  'section-banner': {
    slot: 'YOUR_ADSENSE_SLOT_ID',
    style: { display: 'block', width: '100%', minHeight: 90, margin: '24px 0' },
    format: 'horizontal',
  },
};

export default function AdSlot({ position = 'homepage-banner' }) {
  useEffect(() => {
    if (window && window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  const config = AD_CONFIG[position] || AD_CONFIG['homepage-banner'];

  // For production, replace 'ca-pub-XXXXXXXXXXXXXXXX' with your AdSense publisher ID
  return (
    <div className="ad-slot" style={config.style}>
      <ins
        className="adsbygoogle"
        style={config.style}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={config.slot}
        data-ad-format={config.format}
      ></ins>
    </div>
  );
}

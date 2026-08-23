/**
 * Security & Anti-Inspection Suite for NST Cosmic Learning Platform
 * Protects against inspection, view-source shortcuts, DevTools tampering, and XSS injection.
 */

// Helper to sanitize text strings and prevent XSS
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface SecurityEventCallback {
  (message: string, type?: 'warning' | 'alert' | 'blocked'): void;
}

/**
 * Initializes anti-inspection, anti-key shortcuts, and right-click interceptors
 */
export function initSecurityProtection(onSecurityTriggered?: SecurityEventCallback): () => void {
  // 1. Right Click / Context Menu Intercept
  const handleContextMenu = (e: MouseEvent) => {
    // allow input field right click for normal text typing if needed, otherwise block
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    onSecurityTriggered?.('🛡️ Context Menu & Element Inspection disabled by NST Cyber Shield', 'blocked');
    return false;
  };

  // 2. Keyboard shortcuts blocker (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Cmd+Alt+I etc.)
  const handleKeyDown = (e: KeyboardEvent) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode || e.which;

    // F12
    if (key === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      onSecurityTriggered?.('🛡️ Developer Console (F12) blocked by NST Security Shield', 'blocked');
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect)
    if (isCtrlOrCmd && isShift && (key === 'I' || keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      onSecurityTriggered?.('🛡️ Inspect Element shortcut blocked by NST Cyber Shield', 'blocked');
      return false;
    }

    // Ctrl+Shift+J / Cmd+Option+J (Console)
    if (isCtrlOrCmd && isShift && (key === 'J' || keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      onSecurityTriggered?.('🛡️ Console Tools shortcut blocked by NST Cyber Shield', 'blocked');
      return false;
    }

    // Ctrl+Shift+C (Inspect Element selector)
    if (isCtrlOrCmd && isShift && (key === 'C' || keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      onSecurityTriggered?.('🛡️ DOM Inspector shortcut blocked by NST Cyber Shield', 'blocked');
      return false;
    }

    // Ctrl+U (View Source)
    if (isCtrlOrCmd && (key === 'U' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      onSecurityTriggered?.('🛡️ Page Source Viewing (Ctrl+U) blocked by NST Cyber Shield', 'blocked');
      return false;
    }

    // Ctrl+S (Save Page)
    if (isCtrlOrCmd && (key === 'S' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      onSecurityTriggered?.('🛡️ Page Scraping/Saving (Ctrl+S) blocked by NST Cyber Shield', 'blocked');
      return false;
    }
  };

  // 3. DevTools open detector using window size delta check
  let devToolsOpen = false;
  const checkDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      if (!devToolsOpen) {
        devToolsOpen = true;
        onSecurityTriggered?.('⚠️ DevTools Window Detected! NST Security Defense Active.', 'warning');
      }
    } else {
      devToolsOpen = false;
    }
  };

  const devToolsInterval = setInterval(checkDevTools, 2000);

  // Attach listeners
  document.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('keydown', handleKeyDown, true);

  // Return cleanup function
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    clearInterval(devToolsInterval);
  };
}

/**
 * Dynamic SVG batch thumbnail generator with custom NST branding and high aesthetic
 */
export function generateCosmicThumbnail(title: string, category?: string): string {
  const t = (title || 'NST Cosmic Batch').trim();
  const lower = t.toLowerCase();
  
  let accent = '#7c3aed';
  let accent2 = '#2563eb';
  let icon = '✦';
  let tag = 'PREMIUM BATCH';
  let emblem = 'NST';

  if (lower.includes('railway') || lower.includes('ntpc') || lower.includes('alp') || lower.includes('group d')) {
    accent = '#ef4444';
    accent2 = '#991b1b';
    icon = '🚆';
    tag = 'RAILWAY SPECIAL';
    emblem = 'RRB';
  } else if (lower.includes('ssc') || lower.includes('cgl') || lower.includes('chsl') || lower.includes('selection')) {
    accent = '#3b82f6';
    accent2 = '#1e3a8a';
    icon = '◈';
    tag = 'SSC SELECTION';
    emblem = 'SSC';
  } else if (lower.includes('math')) {
    accent = '#8b5cf6';
    accent2 = '#4c1d95';
    icon = '∑';
    tag = 'MATHS SPECIAL';
    emblem = 'MATH';
  } else if (lower.includes('english') || lower.includes('vocab')) {
    accent = '#06b6d4';
    accent2 = '#164e63';
    icon = 'Aa';
    tag = 'ENGLISH SPECIAL';
    emblem = 'ENG';
  } else if (lower.includes('reasoning')) {
    accent = '#f59e0b';
    accent2 = '#78350f';
    icon = '⚡';
    tag = 'REASONING MASTER';
    emblem = 'LOGIC';
  } else if (lower.includes('science') || lower.includes('ncert')) {
    accent = '#10b981';
    accent2 = '#064e3b';
    icon = '⚗';
    tag = 'SCIENCE SPECIAL';
    emblem = 'SCI';
  } else if (lower.includes('gs') || lower.includes('polity') || lower.includes('lekhpal') || lower.includes('upsi') || lower.includes('police')) {
    accent = '#ec4899';
    accent2 = '#831843';
    icon = '🛡';
    tag = 'GS & STATE SPECIAL';
    emblem = 'GK';
  } else if (lower.includes('defence') || lower.includes('nda')) {
    accent = '#14b8a6';
    accent2 = '#134e4a';
    icon = '★';
    tag = 'DEFENCE FORCES';
    emblem = 'DEF';
  }

  const shortTitle = t.length > 28 ? t.slice(0, 28) + '…' : t;
  const escapedTitle = sanitizeInput(shortTitle);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0d1d" />
        <stop offset="45%" stop-color="${accent}" stop-opacity="0.85" />
        <stop offset="100%" stop-color="${accent2}" />
      </linearGradient>
      <radialGradient id="orbG" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
      <pattern id="gridPattern" width="36" height="36" patternUnits="userSpaceOnUse">
        <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" stroke-width="0.8" stroke-opacity="0.07" />
      </pattern>
    </defs>

    <rect width="800" height="450" fill="url(#bgG)" />
    <rect width="800" height="450" fill="url(#gridPattern)" />
    <circle cx="680" cy="90" r="190" fill="url(#orbG)" />
    <circle cx="120" cy="380" r="160" fill="url(#orbG)" />

    <!-- Top Badge Row -->
    <g transform="translate(40, 44)">
      <rect width="180" height="38" rx="19" fill="#000000" fill-opacity="0.45" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.5" />
      <text x="22" y="25" fill="#a78bfa" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="900">✦ NST</text>
      <text x="74" y="25" fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="800" letter-spacing="1">COSMIC</text>

      <rect x="195" y="0" width="160" height="38" rx="19" fill="${accent}" fill-opacity="0.35" stroke="${accent}" stroke-opacity="0.6" stroke-width="1.5" />
      <text x="275" y="24" text-anchor="middle" fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="800" letter-spacing="1.5">${tag}</text>
    </g>

    <!-- Center Emblem & Icon -->
    <circle cx="400" cy="210" r="64" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" />
    <text x="400" y="226" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="48" font-weight="900">${icon}</text>

    <!-- Batch Title -->
    <text x="400" y="324" text-anchor="middle" fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="30" font-weight="900" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.8))">${escapedTitle}</text>
    <text x="400" y="364" text-anchor="middle" fill="#d1d5db" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="600" letter-spacing="2">LIVE &amp; VOD LECTURES • DETAILED NOTES • TELEGRAM: @NST_XY_09</text>

    <!-- Bottom security seal -->
    <path d="M 40 405 L 760 405" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1" />
    <text x="40" y="428" fill="#a5b4fc" font-family="system-ui, sans-serif" font-size="12" font-weight="700">🔒 NST SECURE PORTAL</text>
    <text x="760" y="428" text-anchor="end" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Telegram Community: t.me/NST_XY_09 ↗</text>
  </svg>`;

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

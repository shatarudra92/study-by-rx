/**
 * NST RUDRA - External Player Integration Utility
 * Generates direct launch intents, protocols, and M3U playlists for all popular media players.
 */

export interface ExternalPlayerOption {
  id: string;
  name: string;
  badge: string;
  iconName: string;
  color: string;
  getSchemeUrl: (videoUrl: string, title?: string) => string;
  getIntentUrl?: (videoUrl: string, title?: string) => string;
  description: string;
}

export const EXTERNAL_PLAYERS: ExternalPlayerOption[] = [
  {
    id: 'vlc',
    name: 'VLC Media Player',
    badge: 'Universal',
    iconName: 'cone',
    color: '#f97316',
    description: 'High performance playback on Android, Windows, Mac & iOS',
    getSchemeUrl: (url) => `vlc://${url}`,
    getIntentUrl: (url, title) =>
      `intent:${url}#Intent;action=android.intent.action.VIEW;type=video/*;package=org.videolan.vlc;S.title=${encodeURIComponent(
        title || 'NST Lecture'
      )};end`
  },
  {
    id: 'mx',
    name: 'MX Player',
    badge: 'Android Popular',
    iconName: 'play-square',
    color: '#0284c7',
    description: 'Hardware acceleration with multi-core decoding & gestures',
    getSchemeUrl: (url) => `intent:${url}#Intent;package=com.mxtech.videoplayer.ad;type=video/*;end`,
    getIntentUrl: (url, title) =>
      `intent:${url}#Intent;action=android.intent.action.VIEW;type=video/*;package=com.mxtech.videoplayer.ad;S.title=${encodeURIComponent(
        title || 'NST Lecture'
      )};end`
  },
  {
    id: 'mx-pro',
    name: 'MX Player Pro',
    badge: 'Pro Edition',
    iconName: 'crown',
    color: '#3b82f6',
    description: 'Ad-free hardware playback engine for Android users',
    getSchemeUrl: (url) => `intent:${url}#Intent;package=com.mxtech.videoplayer.pro;type=video/*;end`,
    getIntentUrl: (url, title) =>
      `intent:${url}#Intent;action=android.intent.action.VIEW;type=video/*;package=com.mxtech.videoplayer.pro;S.title=${encodeURIComponent(
        title || 'NST Lecture'
      )};end`
  },
  {
    id: 'playit',
    name: 'PlayIt Player',
    badge: 'Fast HD',
    iconName: 'video',
    color: '#ec4899',
    description: 'Smooth HD & 4K video player with background playback',
    getSchemeUrl: (url) => `intent:${url}#Intent;package=com.playit.videoplayer;type=video/*;end`,
    getIntentUrl: (url, title) =>
      `intent:${url}#Intent;action=android.intent.action.VIEW;type=video/*;package=com.playit.videoplayer;S.title=${encodeURIComponent(
        title || 'NST Lecture'
      )};end`
  },
  {
    id: 'splayer',
    name: 'SPlayer / nPlayer',
    badge: 'Multi-Format',
    iconName: 'layers',
    color: '#10b981',
    description: 'Ultra fast streaming player with custom subtitles & audio track support',
    getSchemeUrl: (url) => `splayer://${url}`,
    getIntentUrl: (url, title) =>
      `intent:${url}#Intent;action=android.intent.action.VIEW;type=video/*;package=com.kmplayer;S.title=${encodeURIComponent(
        title || 'NST Lecture'
      )};end`
  },
  {
    id: 'potplayer',
    name: 'PotPlayer / PC Player',
    badge: 'Windows PC',
    iconName: 'monitor',
    color: '#8b5cf6',
    description: 'Best desktop player with DXVA video rendering',
    getSchemeUrl: (url) => `potplayer://${url}`,
    getIntentUrl: (url) => url
  }
];

/**
 * Generates and triggers instant browser download for an .M3U playlist file.
 * Opening this file opens the system's default media player.
 */
export function downloadM3UPlaylist(title: string, streamUrl: string) {
  const sanitizedTitle = (title || 'NST_Rudra_Lecture').replace(/[^a-zA-Z0-9_-]/g, '_');
  const m3uContent = `#EXTM3U
#EXTINF:-1 tvg-name="${title}" group-title="NST RUDRA Batches",${title}
${streamUrl}
`;

  const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `${sanitizedTitle}.m3u`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Launch in external player using scheme or intent
 */
export function launchExternalPlayer(player: ExternalPlayerOption, videoUrl: string, title?: string): boolean {
  try {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const targetUrl = isAndroid && player.getIntentUrl
      ? player.getIntentUrl(videoUrl, title)
      : player.getSchemeUrl(videoUrl, title);

    window.location.href = targetUrl;
    return true;
  } catch (err) {
    console.error('Failed to launch external player:', err);
    return false;
  }
}

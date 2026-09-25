import React, { useEffect, useRef } from 'react';

export default function LyricsDrawer({
  currentTrack,
  currentTime,
  onSeek,
  onClose
}) {
  const activeLineRef = useRef(null);

  const lyrics = currentTrack?.lyrics || [
    { time: 0, text: `Listening to ${currentTrack?.title || 'Unknown'}` },
    { time: 5, text: `By ${currentTrack?.artist || 'Unknown'}` },
    { time: 10, text: "Lyrics unavailable for this instrumental mix" }
  ];

  // Find active line index
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto-scroll active lyric into center view
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  return (
    <div style={{
      position: 'fixed',
      top: '64px',
      right: 0,
      bottom: '90px',
      width: '460px',
      backgroundColor: 'rgba(18, 18, 18, 0.92)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderLeft: '1px solid var(--border-hover)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.65)'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '24px' }}>
            mic
          </span>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
            Live Synchronized Lyrics
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '50%'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPassed = idx < activeIndex;

          return (
            <p
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => onSeek(line.time)}
              style={{
                fontSize: isActive ? '1.5rem' : '1.25rem',
                fontWeight: isActive ? '800' : '600',
                color: isActive ? '#ffffff' : isPassed ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)',
                lineHeight: 1.35,
                margin: 0,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none',
                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                transformOrigin: 'left center'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = isPassed ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)';
              }}
            >
              {line.text}
            </p>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)'
      }}>
        <span>Tap any lyric to jump playback</span>
        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>SoundPulse Musixmatch</span>
      </div>
    </div>
  );
}

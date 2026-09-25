import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  likedTrackIds,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onSelectArtist,
  onToggleLyrics,
  showLyrics,
  onToggleQueue,
  showQueue,
  onToggleDevices,
  showDevices
}) {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [isScrubberHovered, setIsScrubberHovered] = useState(false);
  const progressBarRef = useRef(null);

  const isLiked = currentTrack && likedTrackIds.has(currentTrack.id);

  // Format seconds into m:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!currentTrack) return;
    const willBeLiked = !isLiked;
    onToggleLike(currentTrack.id);
    if (willBeLiked) {
      try {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 28,
          spread: 60,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          },
          colors: ['#1ed760', '#4cf479', '#ffffff', '#69ff89']
        });
      } catch (err) {
        // Confetti fallback
      }
    }
  };

  const progressPercent = duration > 0 ? (isScrubbing ? scrubPosition : (currentTime / duration)) * 100 : 0;

  const handleSeekStart = (e) => {
    if (!progressBarRef.current || duration <= 0) return;
    setIsScrubbing(true);
    updateSeekFromEvent(e);
  };

  const updateSeekFromEvent = (e) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setScrubPosition(pos);
    onSeek(pos * duration);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isScrubbing) {
        updateSeekFromEvent(e);
      }
    };
    const handleMouseUp = () => {
      if (isScrubbing) {
        setIsScrubbing(false);
      }
    };

    if (isScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, duration]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <footer style={{
      height: '90px',
      backgroundColor: 'var(--bg-canvas)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 50,
      boxSizing: 'border-box'
    }}>
      {/* 1. Left Column: Track Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '30%',
        minWidth: '220px'
      }}>
        {currentTrack ? (
          <>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-surface-high)',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer'
            }}
            onClick={onToggleLyrics}
            title="Open Lyrics / Now Playing"
            >
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                onClick={onToggleLyrics}
                className="truncate"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  cursor: 'pointer',
                  margin: 0
                }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {currentTrack.title}
              </p>
              <p
                onClick={() => onSelectArtist(currentTrack.artist)}
                className="truncate"
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  margin: '3px 0 0 0'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.textDecoration = 'none';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={handleLikeClick}
              title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
              style={{
                color: isLiked ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                transition: 'transform 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.15)';
                if (!isLiked) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                if (!isLiked) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <span className={`material-symbols-outlined ${isLiked ? 'icon-filled' : ''}`} style={{ fontSize: '22px' }}>
                favorite
              </span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined">music_note</span>
            </div>
            <span style={{ fontSize: '0.84rem' }}>Select a track to play</span>
          </div>
        )}
      </div>

      {/* 2. Center Column: Controls & Scrubber */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        width: '40%',
        maxWidth: '680px'
      }}>
        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Shuffle */}
          <button
            onClick={onToggleShuffle}
            title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            style={{
              color: isShuffle ? 'var(--primary)' : 'var(--text-secondary)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => { if (!isShuffle) e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { if (!isShuffle) e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shuffle</span>
            {isShuffle && (
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)'
              }} />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={onPrevTrack}
            title="Previous"
            style={{
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>skip_previous</span>
          </button>

          {/* Master Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            title={isPlaying ? "Pause" : "Play"}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.25)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px' }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next */}
          <button
            onClick={onNextTrack}
            title="Next"
            style={{
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>skip_next</span>
          </button>

          {/* Repeat */}
          <button
            onClick={onToggleRepeat}
            title={`Repeat: ${repeatMode}`}
            style={{
              color: repeatMode !== 'off' ? 'var(--primary)' : 'var(--text-secondary)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => { if (repeatMode === 'off') e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { if (repeatMode === 'off') e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {repeatMode === 'one' ? 'repeat_one' : 'repeat'}
            </span>
            {repeatMode !== 'off' && (
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)'
              }} />
            )}
          </button>
        </div>

        {/* Progress Scrubber */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span className="tabular-nums" style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            width: '36px',
            textAlign: 'right'
          }}>
            {formatTime(isScrubbing ? scrubPosition * duration : currentTime)}
          </span>

          <div
            ref={progressBarRef}
            onMouseDown={handleSeekStart}
            onMouseEnter={() => setIsScrubberHovered(true)}
            onMouseLeave={() => setIsScrubberHovered(false)}
            style={{
              flex: 1,
              height: isScrubberHovered ? '6px' : '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'height 0.15s ease',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: isScrubberHovered ? 'var(--primary)' : '#ffffff',
              borderRadius: '9999px',
              position: 'relative'
            }}>
              {/* Scrubbing Handle Knob */}
              <span style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
                opacity: isScrubberHovered || isScrubbing ? 1 : 0,
                transition: 'opacity 0.15s ease'
              }} />
            </div>
          </div>

          <span className="tabular-nums" style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            width: '36px'
          }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Right Column: Lyrics, Queue, Devices, Volume, Fullscreen */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        width: '30%',
        minWidth: '220px'
      }}>
        {/* Lyrics Toggle */}
        <button
          onClick={onToggleLyrics}
          title="Lyrics"
          style={{
            color: showLyrics ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={e => { if (!showLyrics) e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { if (!showLyrics) e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
        </button>

        {/* Queue Toggle */}
        <button
          onClick={onToggleQueue}
          title="Queue"
          style={{
            color: showQueue ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={e => { if (!showQueue) e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { if (!showQueue) e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>queue_music</span>
        </button>

        {/* Devices Toggle */}
        <button
          onClick={onToggleDevices}
          title="Connect to a device"
          style={{
            color: showDevices ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={e => { if (!showDevices) e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { if (!showDevices) e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>devices</span>
        </button>

        {/* Volume Controls */}
        <div
          className="group"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <button
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            style={{
              color: isMuted ? 'var(--text-muted)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = isMuted ? 'var(--text-muted)' : 'var(--text-secondary)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
          </button>

          <div style={{
            width: '90px',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              height: '100%',
              width: `${isMuted ? 0 : volume * 100}%`,
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              position: 'relative'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={e => onVolumeChange(parseFloat(e.target.value))}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          title="Fullscreen"
          style={{
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>open_in_full</span>
        </button>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';

export default function LikedSongsView({
  allTracks,
  likedTrackIds,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onToggleLike,
  onSelectArtist,
  setCurrentView
}) {
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [sortField, setSortField] = useState('default');
  const [isDownloaded, setIsDownloaded] = useState(true);

  // Filter by liked tracks and playlist search
  let displayTracks = allTracks.filter(t => likedTrackIds.has(t.id));
  
  // If user unliked everything, show catalog sample
  if (displayTracks.length === 0) {
    displayTracks = allTracks.slice(0, 8);
  }

  if (playlistSearch.trim()) {
    const q = playlistSearch.toLowerCase();
    displayTracks = displayTracks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sortField === 'title') {
    displayTracks = [...displayTracks].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortField === 'artist') {
    displayTracks = [...displayTracks].sort((a, b) => a.artist.localeCompare(b.artist));
  } else if (sortField === 'duration') {
    displayTracks = [...displayTracks].sort((a, b) => a.durationSeconds - b.durationSeconds);
  }

  const isMasterPlaying = currentTrack && displayTracks.some(t => t.id === currentTrack.id) && isPlaying;

  const handleMasterPlay = () => {
    if (displayTracks.length === 0) return;
    if (isMasterPlaying) {
      // Toggle play/pause through currently playing track
      onPlayTrack(currentTrack);
    } else {
      onPlayTrack(displayTracks[0]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* High-Impact Hero Banner */}
      <section style={{
        padding: '32px 32px 24px 32px',
        background: 'linear-gradient(180deg, #4d15b0 0%, #201046 65%, var(--bg-surface-low) 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '28px',
        minHeight: '260px'
      }}>
        {/* Massive Glowing Heart Box */}
        <div style={{
          width: '210px',
          height: '210px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #450af5 0%, #8e8ee5 50%, #1ed760 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(69, 10, 245, 0.4)',
          flexShrink: 0
        }}>
          <span className="material-symbols-outlined icon-filled" style={{
            fontSize: '84px',
            color: '#ffffff'
          }}>
            favorite
          </span>
        </div>

        {/* Title & Metadata Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
          <span style={{
            fontSize: '0.84rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#ffffff'
          }}>
            Playlist
          </span>

          <h1 style={{
            fontSize: '3.6rem',
            fontWeight: '900',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            margin: 0
          }}>
            Liked Songs
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2Qaf-1f6BQ7JcOIZoowbjFa3hVxbi6zZFTSExmh5dwxgREcfXigl0Aj6GZn0klxXEbtVQIFt2vSLuDKL6R7REREZ-uCEOoGtu-w5QQkLqKQe84OuGE9CpoyTxKN5qMdClbbMtiKlaL-81OgfqDypNI4d4CLtFnR9RW_atrgKiJ3vGsXr0dlR66LqVrxI0IkBkg9EAa1zkBfcS5leosncrlpWblatdsVoI86137_wgFq_PfVR_V9xydw"
                alt="Alex Mercer"
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>
                Alex Mercer
              </span>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>•</span>
            <span style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: '600' }}>
              {displayTracks.length} songs
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>•</span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              approx. 21 hr 14 min
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Actions Bar */}
      <section style={{
        position: 'sticky',
        top: '64px',
        zIndex: 10,
        backgroundColor: 'rgba(24, 24, 24, 0.95)',
        backdropFilter: 'blur(16px)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Left: Master Play + Secondary Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={handleMasterPlay}
            title={isMasterPlaying ? "Pause Liked Songs" : "Play Liked Songs"}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(30, 215, 96, 0.4)',
              transition: 'transform 0.15s ease, background-color 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
          >
            <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>
              {isMasterPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
            <button
              onClick={() => onPlayTrack(displayTracks[Math.floor(Math.random() * displayTracks.length)])}
              title="Shuffle"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>shuffle</span>
            </button>

            <button
              onClick={() => setIsDownloaded(!isDownloaded)}
              title={isDownloaded ? "Downloaded to device" : "Download playlist"}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDownloaded ? 'var(--primary)' : 'inherit',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={e => { if (!isDownloaded) e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { if (!isDownloaded) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <span className="material-symbols-outlined icon-filled" style={{ fontSize: '26px' }}>
                arrow_circle_down
              </span>
            </button>

            <button
              title="Add Collaborators"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>person_add</span>
            </button>
          </div>
        </div>

        {/* Right: In-playlist search & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute',
              left: '10px',
              fontSize: '18px',
              color: 'var(--text-secondary)',
              pointerEvents: 'none'
            }}>
              search
            </span>
            <input
              type="text"
              placeholder="Search in playlist"
              value={playlistSearch}
              onChange={e => setPlaylistSearch(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-container)',
                border: '1px solid transparent',
                borderRadius: '9999px',
                padding: '6px 14px 6px 34px',
                fontSize: '0.82rem',
                color: '#ffffff',
                outline: 'none',
                width: '180px',
                transition: 'all 0.2s ease'
              }}
              onFocus={e => {
                e.currentTarget.style.width = '240px';
                e.currentTarget.style.borderColor = 'var(--border-hover)';
              }}
              onBlur={e => {
                if (!playlistSearch) e.currentTarget.style.width = '180px';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="default" style={{ backgroundColor: 'var(--bg-surface-high)' }}>Custom order</option>
            <option value="title" style={{ backgroundColor: 'var(--bg-surface-high)' }}>Title</option>
            <option value="artist" style={{ backgroundColor: 'var(--bg-surface-high)' }}>Artist</option>
            <option value="duration" style={{ backgroundColor: 'var(--bg-surface-high)' }}>Duration</option>
          </select>
        </div>
      </section>

      {/* Table Tracklist View */}
      <section style={{ padding: '8px 32px 48px 32px', display: 'flex', flexDirection: 'column' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(220px, 4fr) minmax(160px, 3fr) minmax(120px, 2fr) 90px',
          alignItems: 'center',
          padding: '10px 16px',
          fontSize: '0.78rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '8px'
        }}>
          <span style={{ textAlign: 'center' }}>#</span>
          <span>Title</span>
          <span>Album</span>
          <span>Date Added</span>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>schedule</span>
          </div>
        </div>

        {/* Track Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {displayTracks.map((track, index) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            const isLiked = likedTrackIds.has(track.id);

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px minmax(220px, 4fr) minmax(160px, 3fr) minmax(120px, 2fr) 90px',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: isThisPlaying ? 'var(--bg-surface-container)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isThisPlaying) e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                }}
                onMouseLeave={e => {
                  if (!isThisPlaying) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* 1. Leading Slot: Index or Animated EQ or Play Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isThisPlaying ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                      <span className="eq-bar-1" style={{ width: '3px', backgroundColor: 'var(--primary)', borderRadius: '1px' }} />
                      <span className="eq-bar-2" style={{ width: '3px', backgroundColor: 'var(--primary)', borderRadius: '1px' }} />
                      <span className="eq-bar-3" style={{ width: '3px', backgroundColor: 'var(--primary)', borderRadius: '1px' }} />
                      <span className="eq-bar-4" style={{ width: '3px', backgroundColor: 'var(--primary)', borderRadius: '1px' }} />
                    </div>
                  ) : (
                    <>
                      <span className="tabular-nums group-hover-hidden" style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {index + 1}
                      </span>
                    </>
                  )}
                </div>

                {/* 2. Title & Artist with Album Thumbnail */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, paddingRight: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-surface-highest)',
                    flexShrink: 0
                  }}>
                    <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="truncate" style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: isThisPlaying ? 'var(--primary)' : '#ffffff',
                      margin: 0
                    }}>
                      {track.title}
                    </p>
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtist(track.artist);
                        setCurrentView('artist');
                      }}
                      className="truncate"
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        margin: '2px 0 0 0',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* 3. Album */}
                <span className="truncate" style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  paddingRight: '16px'
                }}>
                  {track.album}
                </span>

                {/* 4. Date Added */}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {track.dateAdded}
                </span>

                {/* 5. Heart & Duration */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(track.id);
                    }}
                    style={{
                      color: isLiked ? 'var(--primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span className={`material-symbols-outlined ${isLiked ? 'icon-filled' : ''}`} style={{ fontSize: '18px' }}>
                      favorite
                    </span>
                  </button>

                  <span className="tabular-nums" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {track.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

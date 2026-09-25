import React, { useState } from 'react';

export default function SearchView({
  allTracks,
  topArtists,
  browseCategories,
  searchQuery,
  setSearchQuery,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayTrack,
  onToggleLike,
  onSelectArtist,
  setCurrentView
}) {
  const [recentSearches, setRecentSearches] = useState([
    { id: 'rec-1', text: 'Daft Punk', type: 'artist' },
    { id: 'rec-2', text: 'Lofi Girl', type: 'artist' },
    { id: 'rec-3', text: 'Synthwave Chill', type: 'playlist' },
    { id: 'rec-4', text: 'Hans Zimmer', type: 'artist' },
    { id: 'rec-5', text: 'Midnight City Lights', type: 'song' }
  ]);

  const handleDismissRecent = (e, id) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(r => r.id !== id));
  };

  // Filter tracks and artists by query
  const query = searchQuery.trim().toLowerCase();
  const matchingTracks = query
    ? allTracks.filter(t => t.title.toLowerCase().includes(query) || t.artist.toLowerCase().includes(query) || t.genre.toLowerCase().includes(query))
    : [];

  const topMatchingArtist = topArtists.find(a => 
    query && (a.name.toLowerCase().includes(query) || a.genres.some(g => g.toLowerCase().includes(query)))
  ) || (query && matchingTracks.length > 0 ? topArtists.find(a => a.name.toLowerCase() === matchingTracks[0].artist.toLowerCase()) : null);

  const topResult = topMatchingArtist || (matchingTracks.length > 0 ? matchingTracks[0] : null);

  return (
    <div style={{ padding: '24px 32px 64px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Search Input Bar (in-page focusable) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '640px' }}>
          <span className="material-symbols-outlined" style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '24px',
            color: 'var(--text-secondary)'
          }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search songs, artists, or genres..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface-container)',
              border: '2px solid transparent',
              borderRadius: '9999px',
              padding: '14px 48px 14px 54px',
              fontSize: '1rem',
              color: '#ffffff',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
            </button>
          )}
        </div>

        {/* Recent Searches Pills */}
        {!searchQuery && recentSearches.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              Recent:
            </span>
            {recentSearches.map(rec => (
              <div
                key={rec.id}
                onClick={() => setSearchQuery(rec.text)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-surface-container)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                  {rec.type === 'artist' ? 'person' : rec.type === 'playlist' ? 'queue_music' : 'music_note'}
                </span>
                <span>{rec.text}</span>
                <button
                  onClick={(e) => handleDismissRecent(e, rec.id)}
                  style={{
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    marginLeft: '2px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conditional: Search Results vs Browse All */}
      {searchQuery.trim() ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Top Result + Songs Table Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 4.5fr) minmax(360px, 7.5fr)',
            gap: '24px'
          }}>
            {/* Top Result Hero Tile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Top Result
              </h2>
              {topResult ? (
                <div
                  onClick={() => {
                    if (topResult.monthlyListeners) {
                      onSelectArtist(topResult.id);
                      setCurrentView('artist');
                    } else {
                      onPlayTrack(topResult);
                    }
                  }}
                  className="group media-card"
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-surface-container)',
                    borderRadius: '8px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Subtle Emerald Ambient Glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(30, 215, 96, 0.15)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }} />

                  <div>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: topResult.monthlyListeners ? '50%' : '8px',
                      overflow: 'hidden',
                      marginBottom: '18px',
                      backgroundColor: 'var(--bg-surface-highest)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                    }}>
                      <img
                        src={topResult.image || topResult.cover}
                        alt={topResult.name || topResult.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <h3 style={{
                      fontSize: '1.8rem',
                      fontWeight: '800',
                      letterSpacing: '-0.02em',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      {topResult.name || topResult.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--bg-surface-highest)',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: '#ffffff'
                      }}>
                        {topResult.monthlyListeners ? 'Artist' : 'Song'}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        {topResult.monthlyListeners ? `• ${topResult.monthlyListeners} monthly listeners` : `• ${topResult.artist}`}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '24px'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {topResult.genres ? topResult.genres.join(' • ') : topResult.genre}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (topResult.monthlyListeners) {
                          onPlayTrack(allTracks[0]);
                        } else {
                          onPlayTrack(topResult);
                        }
                      }}
                      className="card-play-btn"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(30, 215, 96, 0.4)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '28px' }}>
                        play_arrow
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '32px',
                  backgroundColor: 'var(--bg-surface-container)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)'
                }}>
                  No direct top match found.
                </div>
              )}
            </div>

            {/* Songs Matching List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Songs
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {matchingTracks.slice(0, 4).map((track, idx) => {
                  const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                  const isLiked = likedTrackIds.has(track.id);
                  return (
                    <div
                      key={track.id}
                      onClick={() => onPlayTrack(track)}
                      className="group"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                        <div style={{
                          position: 'relative',
                          width: '44px',
                          height: '44px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: 'var(--bg-surface-highest)',
                          flexShrink: 0
                        }}>
                          <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {isThisPlaying && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
                                volume_up
                              </span>
                            </div>
                          )}
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
                          <p className="truncate" style={{
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                            margin: '2px 0 0 0'
                          }}>
                            {track.artist}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                          <span className={`material-symbols-outlined ${isLiked ? 'icon-filled' : ''}`} style={{ fontSize: '20px' }}>
                            favorite
                          </span>
                        </button>
                        <span className="tabular-nums" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Browse All Category Tiles */
        <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            Browse all
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {browseCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSearchQuery(cat.name)}
                style={{
                  height: '160px',
                  borderRadius: '10px',
                  backgroundColor: cat.color,
                  padding: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.2s ease, filter 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  maxWidth: '120px',
                  lineHeight: 1.15
                }}>
                  {cat.name}
                </h3>

                {/* Angled Decorative Icon/Card */}
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '-10px',
                  width: '90px',
                  height: '90px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(25deg)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
                }}>
                  <span className="material-symbols-outlined" style={{
                    fontSize: '44px',
                    color: '#ffffff',
                    transform: 'rotate(-5deg)'
                  }}>
                    {cat.icon}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

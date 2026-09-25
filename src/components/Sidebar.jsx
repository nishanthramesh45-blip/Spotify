import React, { useState } from 'react';

export default function Sidebar({
  currentView,
  setCurrentView,
  userPlaylists,
  currentTrack,
  isPlaying,
  onPlayPlaylist,
  onSelectArtist
}) {
  const [libraryFilter, setLibraryFilter] = useState('All');
  const [librarySearch, setLibrarySearch] = useState('');
  const [customPlaylists, setCustomPlaylists] = useState([]);

  const filteredPlaylists = [...userPlaylists, ...customPlaylists].filter(p => {
    if (libraryFilter === 'Playlists' && p.type !== 'Playlist') return false;
    if (libraryFilter === 'Artists' && p.type !== 'Artist') return false;
    if (librarySearch.trim()) {
      return p.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
             (p.subtitle && p.subtitle.toLowerCase().includes(librarySearch.toLowerCase()));
    }
    return true;
  });

  const handleCreatePlaylist = () => {
    const newId = `playlist-${Date.now()}`;
    const newPlaylist = {
      id: newId,
      name: `My Playlist #${userPlaylists.length + customPlaylists.length + 1}`,
      type: 'Playlist',
      songCount: 0,
      curator: 'Alex Mercer',
      subtitle: 'By Alex Mercer',
      tracks: []
    };
    setCustomPlaylists(prev => [newPlaylist, ...prev]);
  };

  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '8px 0 8px 8px',
      height: 'calc(100vh - 90px)',
      boxSizing: 'border-box'
    }}>
      {/* Top Navigation Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          {/* Animated SoundPulse SVG Logo */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#131313',
            border: '2px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px var(--primary-glow)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="10" width="2.5" height="4" rx="1.25" fill="#1ed760" className="eq-bar-1" />
              <rect x="7.5" y="6" width="2.5" height="12" rx="1.25" fill="#1ed760" className="eq-bar-2" />
              <rect x="12" y="3" width="2.5" height="18" rx="1.25" fill="#1ed760" className="eq-bar-3" />
              <rect x="16.5" y="8" width="2.5" height="8" rx="1.25" fill="#1ed760" className="eq-bar-4" />
              <rect x="21" y="11" width="2.5" height="2" rx="1" fill="#1ed760" />
            </svg>
          </div>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              display: 'block',
              lineHeight: 1
            }}>
              SoundPulse
            </span>
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--primary)',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}>
              Desktop Hi-Fi
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => setCurrentView('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '10px 12px',
              borderRadius: '6px',
              color: currentView === 'home' ? '#ffffff' : 'var(--text-secondary)',
              backgroundColor: currentView === 'home' ? 'var(--bg-surface-high)' : 'transparent',
              fontWeight: currentView === 'home' ? '700' : '600',
              fontSize: '0.95rem',
              transition: 'all 0.15s ease',
              textAlign: 'left'
            }}
            onMouseEnter={e => {
              if (currentView !== 'home') {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-low)';
              }
            }}
            onMouseLeave={e => {
              if (currentView !== 'home') {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className={`material-symbols-outlined ${currentView === 'home' ? 'icon-filled' : ''}`} style={{
              color: currentView === 'home' ? 'var(--primary)' : 'inherit',
              fontSize: '26px'
            }}>
              home
            </span>
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentView('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '10px 12px',
              borderRadius: '6px',
              color: currentView === 'search' ? '#ffffff' : 'var(--text-secondary)',
              backgroundColor: currentView === 'search' ? 'var(--bg-surface-high)' : 'transparent',
              fontWeight: currentView === 'search' ? '700' : '600',
              fontSize: '0.95rem',
              transition: 'all 0.15s ease',
              textAlign: 'left'
            }}
            onMouseEnter={e => {
              if (currentView !== 'search') {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-low)';
              }
            }}
            onMouseLeave={e => {
              if (currentView !== 'search') {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className={`material-symbols-outlined ${currentView === 'search' ? 'icon-filled' : ''}`} style={{
              color: currentView === 'search' ? 'var(--primary)' : 'inherit',
              fontSize: '26px'
            }}>
              search
            </span>
            <span>Search</span>
          </button>
        </nav>
      </div>

      {/* Your Library Panel */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '8px',
        flex: 1,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Library Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <button
            onClick={() => setCurrentView('liked')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: currentView === 'liked' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => {
              if (currentView !== 'liked') e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>library_music</span>
            <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>Your Library</span>
          </button>
          
          <button
            onClick={handleCreatePlaylist}
            title="Create playlist"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {['All', 'Playlists', 'Artists'].map(filter => (
            <button
              key={filter}
              onClick={() => setLibraryFilter(filter)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: '600',
                backgroundColor: libraryFilter === filter ? '#ffffff' : 'var(--bg-surface-high)',
                color: libraryFilter === filter ? '#000000' : 'var(--text-primary)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => {
                if (libraryFilter !== filter) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-highest)';
                }
              }}
              onMouseLeave={e => {
                if (libraryFilter !== filter) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                }
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search bar inside library */}
        <div style={{
          position: 'relative',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span className="material-symbols-outlined" style={{
            position: 'absolute',
            left: '8px',
            fontSize: '18px',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search in Your Library"
            value={librarySearch}
            onChange={e => setLibrarySearch(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface-low)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 10px 6px 32px',
              fontSize: '0.8rem',
              color: '#ffffff',
              outline: 'none',
              transition: 'border 0.2s ease'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          />
          {librarySearch && (
            <button
              onClick={() => setLibrarySearch('')}
              style={{
                position: 'absolute',
                right: '8px',
                color: 'var(--text-muted)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          )}
        </div>

        {/* Playlist & Library Scrollable List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          paddingRight: '2px'
        }}>
          {/* Liked Songs Special Item */}
          <div
            onClick={() => setCurrentView('liked')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: currentView === 'liked' ? 'var(--bg-surface-high)' : 'transparent',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => {
              if (currentView !== 'liked') e.currentTarget.style.backgroundColor = 'var(--bg-surface-low)';
            }}
            onMouseLeave={e => {
              if (currentView !== 'liked') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #450af5 0%, #8e8ee5 50%, #1ed760 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
            }}>
              <span className="material-symbols-outlined icon-filled" style={{ color: '#ffffff', fontSize: '22px' }}>
                favorite
              </span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: '0.88rem',
                fontWeight: '700',
                color: currentView === 'liked' ? 'var(--primary)' : '#ffffff',
                margin: 0
              }} className="truncate">
                Liked Songs
              </p>
              <p style={{
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                margin: '2px 0 0 0'
              }} className="truncate">
                📌 Playlist • 348 songs
              </p>
            </div>
            {currentView === 'liked' && isPlaying && (
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '18px' }}>
                volume_up
              </span>
            )}
          </div>

          {/* Regular Playlists */}
          {filteredPlaylists.map(playlist => {
            const isThisPlaylistPlaying = currentTrack && playlist.tracks && playlist.tracks.some(t => t.id === currentTrack.id) && isPlaying;
            return (
              <div
                key={playlist.id}
                onClick={() => {
                  if (playlist.id === 'liked-songs') {
                    setCurrentView('liked');
                  } else {
                    onPlayPlaylist(playlist);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-low)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface-highest)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>
                      queue_music
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: '0.88rem',
                    fontWeight: isThisPlaylistPlaying ? '700' : '600',
                    color: isThisPlaylistPlaying ? 'var(--primary)' : '#ffffff',
                    margin: 0
                  }} className="truncate">
                    {playlist.name}
                  </p>
                  <p style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)',
                    margin: '2px 0 0 0'
                  }} className="truncate">
                    {playlist.type} • {playlist.subtitle || playlist.curator}
                  </p>
                </div>
                {isThisPlaylistPlaying && (
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '18px' }}>
                    volume_up
                  </span>
                )}
              </div>
            );
          })}

          {/* Followed Artist Quick Link */}
          <div
            onClick={() => {
              onSelectArtist('artist-daft-punk');
              setCurrentView('artist');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: currentView === 'artist' ? 'var(--bg-surface-high)' : 'transparent',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => {
              if (currentView !== 'artist') e.currentTarget.style.backgroundColor = 'var(--bg-surface-low)';
            }}
            onMouseLeave={e => {
              if (currentView !== 'artist') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-highest)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBryw0uBagspk7-5pOqMqrotn-6cGA3znFkhq-7lZrwQgAH1tl3XCQLyyYGoQa0qAOIujtOheaA8lb0t_iE8Djc70uZNr7DiHyJMP0hH5_Uk5sSGgFIipKuDIUYVejd1XziVlMiExGrTd3ppdycxin86Xq5Z3ImQOveKPsHu5XRWDqGXTdqWGor8x155b0Z5z06Jl_Kzh7DIKZ0geMwdEfmR10o6vDIo2FiSpRCyeVsWFUJ8Wtu6rdbRg"
                alt="Daft Punk"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: '0.88rem',
                fontWeight: currentView === 'artist' ? '700' : '600',
                color: currentView === 'artist' ? 'var(--primary)' : '#ffffff',
                margin: 0
              }} className="truncate">
                Daft Punk
              </p>
              <p style={{
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                margin: '2px 0 0 0'
              }} className="truncate">
                Artist • Verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

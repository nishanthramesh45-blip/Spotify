import React, { useState } from 'react';

export default function HomeView({
  allTracks,
  topArtists,
  userPlaylists,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayPlaylist,
  onSelectArtist,
  setCurrentView
}) {
  const [activeChip, setActiveChip] = useState('All');

  // Greeting based on real hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickAccessItems = [
    {
      id: 'liked-songs',
      title: 'Liked Songs',
      subtitle: '348 tracks',
      isLiked: true,
      onClick: () => setCurrentView('liked'),
      onPlay: () => onPlayTrack(allTracks[0])
    },
    {
      id: 'daily-mix-1',
      title: 'Daily Mix 1',
      subtitle: 'Tycho, Bonobo, Tourist',
      image: userPlaylists[1]?.cover,
      onClick: () => onPlayPlaylist(userPlaylists[1]),
      onPlay: () => onPlayTrack(allTracks[1])
    },
    {
      id: 'synthwave-2099',
      title: 'Synthwave 2099',
      subtitle: 'Kavinsky, Gunship, Carpenter Brut',
      image: userPlaylists[2]?.cover,
      onClick: () => onPlayPlaylist(userPlaylists[2]),
      onPlay: () => onPlayTrack(allTracks[5])
    },
    {
      id: 'deep-focus',
      title: 'Deep Focus',
      subtitle: 'Brian Eno, Max Richter, Nils Frahm',
      image: userPlaylists[3]?.cover,
      onClick: () => onPlayPlaylist(userPlaylists[3]),
      onPlay: () => onPlayTrack(allTracks[7])
    },
    {
      id: 'chill-lofi',
      title: 'Chill Lofi Beats',
      subtitle: 'ChilledCow, Kupla, Idealism',
      image: userPlaylists[4]?.cover,
      onClick: () => onPlayPlaylist(userPlaylists[4]),
      onPlay: () => onPlayTrack(allTracks[8])
    },
    {
      id: 'artist-daft-punk',
      title: 'Daft Punk',
      subtitle: '21M monthly listeners',
      image: topArtists[0]?.image,
      onClick: () => {
        onSelectArtist('artist-daft-punk');
        setCurrentView('artist');
      },
      onPlay: () => onPlayTrack(allTracks[0])
    }
  ];

  return (
    <div style={{ position: 'relative', padding: '16px 32px 64px 32px' }}>
      {/* Dynamic Atmospheric Glow Gradient */}
      <div style={{
        position: 'absolute',
        top: '-64px',
        left: 0,
        right: 0,
        height: '380px',
        background: 'linear-gradient(180deg, rgba(22, 56, 36, 0.7) 0%, rgba(16, 36, 24, 0.3) 60%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(60px)',
        opacity: 0.85
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 0'
        }}>
          {['All', 'Music', 'Podcasts', 'Audiobooks'].map(chip => (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              style={{
                padding: '7px 18px',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: activeChip === chip ? '700' : '600',
                backgroundColor: activeChip === chip ? '#ffffff' : 'var(--bg-surface-high)',
                color: activeChip === chip ? '#000000' : '#ffffff',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (activeChip !== chip) e.currentTarget.style.backgroundColor = 'var(--bg-surface-highest)';
              }}
              onMouseLeave={e => {
                if (activeChip !== chip) e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Quick Access Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: 0
            }}>
              {getGreeting()}
            </h1>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)'
            }}>
              Session Mix • 48 kHz FLAC
            </span>
          </div>

          {/* 2 Rows x 3 Columns Desktop Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '12px'
          }}>
            {quickAccessItems.map(item => {
              const isPlayingThis = currentTrack && item.id.includes(currentTrack.id) && isPlaying;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className="media-card group"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-surface-container)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)'}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '72px',
                    height: '72px',
                    flexShrink: 0,
                    backgroundColor: 'var(--bg-surface-highest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.isLiked ? 'linear-gradient(135deg, #450af5 0%, #8e8ee5 50%, #1ed760 100%)' : undefined
                  }}>
                    {item.isLiked ? (
                      <span className="material-symbols-outlined icon-filled" style={{ color: '#ffffff', fontSize: '32px' }}>
                        favorite
                      </span>
                    ) : item.image ? (
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>
                        music_note
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div style={{ flex: 1, padding: '0 16px', minWidth: 0 }}>
                    <span className="truncate" style={{
                      display: 'block',
                      fontSize: '0.94rem',
                      fontWeight: '700',
                      color: '#ffffff'
                    }}>
                      {item.title}
                    </span>
                    <span className="truncate" style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      marginTop: '2px'
                    }}>
                      {item.subtitle}
                    </span>
                  </div>

                  {/* Floating Play Button */}
                  <div style={{ paddingRight: '16px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onPlay();
                      }}
                      className="card-play-btn"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5), 0 4px 8px rgba(30,215,96,0.3)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span className="material-symbols-outlined icon-filled" style={{ fontSize: '26px' }}>
                        {isPlayingThis ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Made For You Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Made For You
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Personalized mixes updated daily with your favorite genres
              </p>
            </div>
            <button
              onClick={() => setCurrentView('search')}
              style={{
                fontSize: '0.76rem',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Show all
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '18px'
          }}>
            {userPlaylists.slice(1).map(playlist => (
              <div
                key={playlist.id}
                onClick={() => onPlayPlaylist(playlist)}
                className="media-card"
                style={{
                  backgroundColor: 'var(--bg-surface-container)',
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background-color 0.25s ease, transform 0.25s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  backgroundColor: 'var(--bg-surface-highest)',
                  boxShadow: '0 6px 14px rgba(0, 0, 0, 0.4)'
                }}>
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Floating Play Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayPlaylist(playlist);
                    }}
                    className="card-play-btn"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(30,215,96,0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '26px' }}>
                      play_arrow
                    </span>
                  </button>
                </div>

                <span className="truncate" style={{
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: '#ffffff'
                }}>
                  {playlist.name}
                </span>
                <p className="line-clamp-2" style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  lineHeight: 1.35
                }}>
                  {playlist.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Artists Section */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Popular Artists
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Leading innovators shaping contemporary sounds
              </p>
            </div>
            <button
              onClick={() => {
                onSelectArtist('artist-daft-punk');
                setCurrentView('artist');
              }}
              style={{
                fontSize: '0.76rem',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Show all
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '18px'
          }}>
            {topArtists.map(artist => (
              <div
                key={artist.id}
                onClick={() => {
                  onSelectArtist(artist.id);
                  setCurrentView('artist');
                }}
                className="media-card"
                style={{
                  backgroundColor: 'var(--bg-surface-container)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'background-color 0.25s ease, transform 0.25s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  backgroundColor: 'var(--bg-surface-highest)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                }}>
                  <img
                    src={artist.image}
                    alt={artist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Floating Play Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(allTracks[0]);
                    }}
                    className="card-play-btn"
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(30,215,96,0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '26px' }}>
                      play_arrow
                    </span>
                  </button>
                </div>

                <span className="truncate" style={{
                  fontSize: '0.94rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center'
                }}>
                  {artist.name}
                </span>
                <span style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  textAlign: 'center'
                }}>
                  Artist • {artist.monthlyListeners} listeners
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* New Releases For You */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                New Releases For You
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Hot off the press from your favorite labels
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '18px'
          }}>
            {allTracks.slice(5, 10).map(track => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track)}
                className="media-card"
                style={{
                  backgroundColor: 'var(--bg-surface-container)',
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background-color 0.25s ease, transform 0.25s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  backgroundColor: 'var(--bg-surface-highest)',
                  boxShadow: '0 6px 14px rgba(0, 0, 0, 0.4)'
                }}>
                  <img
                    src={track.cover}
                    alt={track.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.66rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    New Release
                  </span>
                  {/* Floating Play Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(track);
                    }}
                    className="card-play-btn"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(30,215,96,0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span className="material-symbols-outlined icon-filled" style={{ fontSize: '26px' }}>
                      play_arrow
                    </span>
                  </button>
                </div>

                <span className="truncate" style={{
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: '#ffffff'
                }}>
                  {track.title}
                </span>
                <p className="truncate" style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  marginTop: '4px'
                }}>
                  {track.artist} • {track.genre}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

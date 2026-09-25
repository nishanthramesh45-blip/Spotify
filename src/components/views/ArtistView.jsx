import React, { useState } from 'react';

export default function ArtistView({
  artistId,
  topArtists,
  allTracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onPlayTrack,
  onToggleLike
}) {
  const [isFollowing, setIsFollowing] = useState(true);
  const [discographyTab, setDiscographyTab] = useState('Albums');

  const artist = topArtists.find(a => a.id === artistId || a.name.toLowerCase() === (artistId || '').toLowerCase()) || topArtists[0];

  // Artist's tracks from catalog
  const artistTracks = allTracks.filter(t => t.artist.toLowerCase().includes(artist.name.toLowerCase()));
  const popularTracks = artistTracks.length > 0 ? artistTracks : allTracks.slice(0, 5);

  const isMasterPlaying = currentTrack && artistTracks.some(t => t.id === currentTrack.id) && isPlaying;

  const handleMasterPlay = () => {
    if (popularTracks.length === 0) return;
    if (isMasterPlaying) {
      onPlayTrack(currentTrack);
    } else {
      onPlayTrack(popularTracks[0]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Artist Hero Header */}
      <section style={{
        position: 'relative',
        height: '340px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}>
        {/* Background Image with Ambient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${artist.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'brightness(0.65)'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(18,18,18,0.7) 60%, var(--bg-surface) 100%)'
        }} />

        {/* Hero Metadata */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined icon-filled" style={{ color: '#3d91f4', fontSize: '24px' }}>
              verified
            </span>
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#ffffff' }}>
              Verified Artist
            </span>
          </div>

          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: '900',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            margin: 0
          }}>
            {artist.name}
          </h1>

          <p style={{
            fontSize: '0.94rem',
            fontWeight: '600',
            color: '#ffffff',
            margin: '4px 0 0 0'
          }}>
            {artist.monthlyListeners} monthly listeners
          </p>
        </div>
      </section>

      {/* Action Controls Bar */}
      <section style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        <button
          onClick={handleMasterPlay}
          title={isMasterPlaying ? "Pause" : "Play"}
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
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span className="material-symbols-outlined icon-filled" style={{ fontSize: '32px' }}>
            {isMasterPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: isFollowing ? 'transparent' : '#ffffff',
            color: isFollowing ? '#ffffff' : '#000000',
            fontSize: '0.86rem',
            fontWeight: '700',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            if (isFollowing) e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={e => {
            if (isFollowing) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button style={{ color: 'var(--text-secondary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>more_horiz</span>
        </button>
      </section>

      {/* Main Content Split: Popular Tracks & About Showcase */}
      <section style={{
        padding: '0 32px 64px 32px',
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 7fr) minmax(280px, 4fr)',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left Column: Popular Tracks & Discography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Popular Tracks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              Popular
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {popularTracks.map((track, idx) => {
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
                      <span className="tabular-nums" style={{
                        width: '24px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: isThisPlaying ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: '600'
                      }}>
                        {idx + 1}
                      </span>

                      <div style={{
                        width: '44px',
                        height: '44px',
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
                        <p className="truncate" style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          margin: '2px 0 0 0'
                        }}>
                          {track.featuring || track.album}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      color: 'var(--text-secondary)'
                    }}>
                      <span className="tabular-nums" style={{ fontSize: '0.84rem' }}>
                        {track.playCount}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(track.id);
                        }}
                        style={{
                          color: isLiked ? 'var(--primary)' : 'inherit',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <span className={`material-symbols-outlined ${isLiked ? 'icon-filled' : ''}`} style={{ fontSize: '18px' }}>
                          favorite
                        </span>
                      </button>

                      <span className="tabular-nums" style={{ fontSize: '0.82rem', width: '38px', textAlign: 'right' }}>
                        {track.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discography Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Discography
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Albums', 'Singles and EPs'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDiscographyTab(tab)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      backgroundColor: discographyTab === tab ? '#ffffff' : 'var(--bg-surface-high)',
                      color: discographyTab === tab ? '#000000' : '#ffffff'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '16px'
            }}>
              {(artist.albums || [
                { title: 'Random Access Memories', year: '2013', type: 'Album', cover: popularTracks[0]?.cover },
                { title: 'Discovery', year: '2001', type: 'Album', cover: popularTracks[1]?.cover }
              ]).map((album, idx) => (
                <div
                  key={idx}
                  className="media-card"
                  style={{
                    backgroundColor: 'var(--bg-surface-container)',
                    borderRadius: '8px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)'}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    position: 'relative'
                  }}>
                    <img src={album.cover} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p className="truncate" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    {album.title}
                  </p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {album.year} • {album.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: About Showcase Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            About
          </h2>

          <div style={{
            backgroundColor: 'var(--bg-surface-container)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              height: '220px',
              backgroundImage: `url(${artist.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--primary)'
              }}>
                {artist.globalRank || '#14 in the World'}
              </span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {artist.monthlyListeners}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  monthly listeners
                </p>
              </div>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                margin: 0
              }}>
                {artist.bio}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
                  public
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#ffffff' }}>
                  Worldwide Discography & Archive
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';

export default function QueueDrawer({
  currentTrack,
  queue,
  onPlayTrack,
  onRemoveFromQueue,
  onClose
}) {
  return (
    <div style={{
      position: 'fixed',
      top: '64px',
      right: 0,
      bottom: '90px',
      width: '420px',
      backgroundColor: 'rgba(20, 20, 20, 0.94)',
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
            queue_music
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
            Play Queue
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Now Playing Block */}
        {currentTrack && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
              Now Playing
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-high)',
              border: '1px solid var(--border-hover)'
            }}>
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="truncate" style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>
                  {currentTrack.title}
                </p>
                <p className="truncate" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {currentTrack.artist}
                </p>
              </div>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
                graphic_eq
              </span>
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            Next In Queue ({queue.length})
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {queue.map((track, idx) => (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => onPlayTrack(track)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className="tabular-nums" style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', width: '20px' }}>
                  {idx + 1}
                </span>
                <img
                  src={track.cover}
                  alt={track.title}
                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="truncate" style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                    {track.title}
                  </p>
                  <p className="truncate" style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    {track.artist}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromQueue(idx);
                  }}
                  title="Remove from queue"
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

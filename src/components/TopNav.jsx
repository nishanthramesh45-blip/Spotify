import React, { useState } from 'react';

export default function TopNav({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  onBack,
  onForward
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <header style={{
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      backgroundColor: 'rgba(18, 18, 18, 0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }}>
      {/* Left History Buttons & Quick Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onBack}
            title="Go back"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-highest)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <button
            onClick={onForward}
            title="Go forward"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-highest)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>

        {/* Search Bar Input in Header */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{
            position: 'absolute',
            left: '14px',
            fontSize: '20px',
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }}>
            search
          </span>
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (currentView !== 'search') setCurrentView('search');
            }}
            onFocus={() => {
              if (currentView !== 'search') setCurrentView('search');
            }}
            style={{
              width: '340px',
              backgroundColor: 'var(--bg-surface-container)',
              border: '1px solid transparent',
              borderRadius: '9999px',
              padding: '10px 40px 10px 42px',
              fontSize: '0.88rem',
              color: '#ffffff',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)'}
            onMouseLeave={e => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
              }
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Explore Premium Badge */}
        <button
          onClick={() => alert("SoundPulse Hi-Fi Lossless tier is active for your account!")}
          style={{
            padding: '7px 16px',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '0.84rem',
            fontWeight: '700',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1ed760' }}>workspace_premium</span>
          Explore Premium
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            title="Notifications"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 6px var(--primary)'
            }} />
          </button>

          {showNotificationToast && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '280px',
              backgroundColor: 'var(--bg-surface-high)',
              border: '1px solid var(--border-hover)',
              borderRadius: '8px',
              padding: '14px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.75)',
              zIndex: 100
            }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>
                What's New
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Daft Punk released high-fidelity remaster of "Discovery". Tap to listen now!
              </p>
            </div>
          )}
        </div>

        {/* Profile Chip */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 8px 3px 3px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-high)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2Qaf-1f6BQ7JcOIZoowbjFa3hVxbi6zZFTSExmh5dwxgREcfXigl0Aj6GZn0klxXEbtVQIFt2vSLuDKL6R7REREZ-uCEOoGtu-w5QQkLqKQe84OuGE9CpoyTxKN5qMdClbbMtiKlaL-81OgfqDypNI4d4CLtFnR9RW_atrgKiJ3vGsXr0dlR66LqVrxI0IkBkg9EAa1zkBfcS5leosncrlpWblatdsVoI86137_wgFq_PfVR_V9xydw"
              alt="Alex Mercer"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#ffffff' }}>Alex Mercer</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              arrow_drop_down
            </span>
          </button>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '190px',
              backgroundColor: 'var(--bg-surface-high)',
              border: '1px solid var(--border-hover)',
              borderRadius: '8px',
              padding: '6px',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.75)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {['Account', 'Profile', 'Upgrade to Family', 'Settings', 'Log out'].map(item => (
                <button
                  key={item}
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: item === 'Log out' ? '#ff7b72' : '#ffffff',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-highest)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

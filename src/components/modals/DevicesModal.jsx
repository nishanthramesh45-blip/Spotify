import React, { useState } from 'react';

export default function DevicesModal({ onClose }) {
  const [selectedDevice, setSelectedDevice] = useState('browser');

  const devices = [
    {
      id: 'browser',
      name: 'This Web Browser',
      type: 'Desktop App (FLAC 24-bit 96kHz)',
      icon: 'laptop_chromebook',
      isCurrent: true
    },
    {
      id: 'airpods',
      name: "Alex's AirPods Max",
      type: 'Spatial Audio • Bluetooth',
      icon: 'headphones',
      isCurrent: false
    },
    {
      id: 'sonos',
      name: 'Living Room Sonos Era 300',
      type: 'Dolby Atmos • Wi-Fi AirPlay 2',
      icon: 'speaker',
      isCurrent: false
    },
    {
      id: 'studio',
      name: 'Genelec Studio Monitors',
      type: 'USB DAC / Audio Interface',
      icon: 'speaker_group',
      isCurrent: false
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '80px',
      width: '340px',
      backgroundColor: 'var(--bg-surface-high)',
      border: '1px solid var(--border-hover)',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '22px' }}>
            devices
          </span>
          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
            Connect to a Device
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ color: 'var(--text-secondary)', padding: '2px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {devices.map(device => {
          const isSelected = selectedDevice === device.id;
          return (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: isSelected ? 'rgba(30, 215, 96, 0.12)' : 'var(--bg-surface-container)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-highest)';
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-container)';
              }}
            >
              <span className="material-symbols-outlined" style={{
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '24px'
              }}>
                {device.icon}
              </span>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? '700' : '600',
                  color: isSelected ? 'var(--primary)' : '#ffffff',
                  margin: 0
                }}>
                  {device.name}
                </p>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {device.type}
                </p>
              </div>

              {isSelected && (
                <span className="material-symbols-outlined icon-filled" style={{ color: 'var(--primary)', fontSize: '18px' }}>
                  check_circle
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        paddingTop: '10px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        Listening on <strong style={{ color: '#ffffff' }}>SoundPulse Connect Lossless</strong>
      </div>
    </div>
  );
}

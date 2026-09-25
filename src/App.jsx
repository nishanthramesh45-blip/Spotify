import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import PlayerBar from './components/PlayerBar';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import LikedSongsView from './components/views/LikedSongsView';
import ArtistView from './components/views/ArtistView';
import LyricsDrawer from './components/modals/LyricsDrawer';
import QueueDrawer from './components/modals/QueueDrawer';
import DevicesModal from './components/modals/DevicesModal';

import { allTracks, topArtists, userPlaylists, browseCategories } from './data/musicData';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  // Navigation & History State
  const [currentView, setCurrentView] = useState('home');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedArtistId, setSelectedArtistId] = useState('artist-daft-punk');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback State
  const [currentTrack, setCurrentTrack] = useState(allTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(allTracks[0].durationSeconds);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  const [queue, setQueue] = useState(allTracks.slice(1));
  const [likedTrackIds, setLikedTrackIds] = useState(new Set(['track-1', 'track-2', 'track-3', 'track-5']));

  // Modals & Drawers
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showDevices, setShowDevices] = useState(false);

  const mainScrollRef = useRef(null);

  // Sync with audio engine
  useEffect(() => {
    const unsubTime = audioEngine.onTimeUpdate((time, dur) => {
      setCurrentTime(time);
      if (dur) setDuration(dur);
    });

    const unsubEnded = audioEngine.onEnded(() => {
      handleNextTrack();
    });

    return () => {
      unsubTime();
      unsubEnded();
    };
  }, [queue, repeatMode, isShuffle, currentTrack]);

  // Navigate view with history tracking
  const navigateTo = (view) => {
    if (view === currentView) return;
    const nextHistory = viewHistory.slice(0, historyIndex + 1);
    nextHistory.push(view);
    setViewHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentView(view);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setCurrentView(viewHistory[prevIdx]);
    }
  };

  const handleForward = () => {
    if (historyIndex < viewHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCurrentView(viewHistory[nextIdx]);
    }
  };

  // Playback Handlers
  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(track);
      setDuration(track.durationSeconds);
      setIsPlaying(true);
      audioEngine.playTrack(track);

      // Re-populate queue with remaining tracks
      const remaining = allTracks.filter(t => t.id !== track.id);
      setQueue(remaining);
    }
  };

  const handleTogglePlay = () => {
    if (!currentTrack) {
      handlePlayTrack(allTracks[0]);
      return;
    }
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one' && currentTrack) {
      audioEngine.playTrack(currentTrack);
      setIsPlaying(true);
      return;
    }

    if (queue.length > 0) {
      let nextIndex = 0;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
      const nextTrack = queue[nextIndex];
      const newQueue = queue.filter((_, idx) => idx !== nextIndex);
      setCurrentTrack(nextTrack);
      setDuration(nextTrack.durationSeconds);
      setIsPlaying(true);
      audioEngine.playTrack(nextTrack);
      setQueue(newQueue);
    } else if (repeatMode === 'all') {
      const restarted = allTracks.filter(t => t.id !== currentTrack.id);
      setCurrentTrack(allTracks[0]);
      setDuration(allTracks[0].durationSeconds);
      setIsPlaying(true);
      audioEngine.playTrack(allTracks[0]);
      setQueue(restarted);
    } else {
      audioEngine.pause();
      setIsPlaying(false);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioEngine.seek(0);
      return;
    }
    const currentIdx = allTracks.findIndex(t => t.id === currentTrack?.id);
    if (currentIdx > 0) {
      handlePlayTrack(allTracks[currentIdx - 1]);
    } else {
      audioEngine.seek(0);
    }
  };

  const handleSeek = (seconds) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
    audioEngine.setVolume(newVol);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const handleToggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const handleToggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const handleToggleLike = (trackId) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  const handleSelectArtist = (artistIdOrName) => {
    const found = topArtists.find(a =>
      a.id === artistIdOrName || a.name.toLowerCase() === (artistIdOrName || '').toLowerCase()
    );
    if (found) {
      setSelectedArtistId(found.id);
    } else {
      setSelectedArtistId('artist-daft-punk');
    }
    navigateTo('artist');
  };

  const handlePlayPlaylist = (playlist) => {
    if (!playlist.tracks || playlist.tracks.length === 0) return;
    const first = playlist.tracks[0];
    setCurrentTrack(first);
    setDuration(first.durationSeconds);
    setIsPlaying(true);
    audioEngine.playTrack(first);
    setQueue(playlist.tracks.slice(1));
  };

  const handleRemoveFromQueue = (index) => {
    setQueue(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-canvas)',
      overflow: 'hidden'
    }}>
      {/* Top Shell (Sidebar + Main Content Canvas) */}
      <div style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 90px)',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={navigateTo}
          userPlaylists={userPlaylists}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPlaylist={handlePlayPlaylist}
          onSelectArtist={handleSelectArtist}
        />

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          margin: '8px 8px 8px 0',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Top Sticky Nav Bar */}
          <TopNav
            currentView={currentView}
            setCurrentView={navigateTo}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onBack={handleBack}
            onForward={handleForward}
          />

          {/* Scrollable View Canvas */}
          <main
            ref={mainScrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              position: 'relative'
            }}
          >
            {currentView === 'home' && (
              <HomeView
                allTracks={allTracks}
                topArtists={topArtists}
                userPlaylists={userPlaylists}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onPlayPlaylist={handlePlayPlaylist}
                onSelectArtist={handleSelectArtist}
                setCurrentView={navigateTo}
              />
            )}

            {currentView === 'search' && (
              <SearchView
                allTracks={allTracks}
                topArtists={topArtists}
                browseCategories={browseCategories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayTrack={handlePlayTrack}
                onToggleLike={handleToggleLike}
                onSelectArtist={handleSelectArtist}
                setCurrentView={navigateTo}
              />
            )}

            {currentView === 'liked' && (
              <LikedSongsView
                allTracks={allTracks}
                likedTrackIds={likedTrackIds}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onToggleLike={handleToggleLike}
                onSelectArtist={handleSelectArtist}
                setCurrentView={navigateTo}
              />
            )}

            {currentView === 'artist' && (
              <ArtistView
                artistId={selectedArtistId}
                topArtists={topArtists}
                allTracks={allTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedTrackIds={likedTrackIds}
                onPlayTrack={handlePlayTrack}
                onToggleLike={handleToggleLike}
              />
            )}
          </main>
        </div>
      </div>

      {/* Persistent Bottom Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        likedTrackIds={likedTrackIds}
        onTogglePlay={handleTogglePlay}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
        onToggleLike={handleToggleLike}
        onSelectArtist={handleSelectArtist}
        onToggleLyrics={() => setShowLyrics(prev => !prev)}
        showLyrics={showLyrics}
        onToggleQueue={() => setShowQueue(prev => !prev)}
        showQueue={showQueue}
        onToggleDevices={() => setShowDevices(prev => !prev)}
        showDevices={showDevices}
      />

      {/* Side Drawers & Overlays */}
      {showLyrics && (
        <LyricsDrawer
          currentTrack={currentTrack}
          currentTime={currentTime}
          onSeek={handleSeek}
          onClose={() => setShowLyrics(false)}
        />
      )}

      {showQueue && (
        <QueueDrawer
          currentTrack={currentTrack}
          queue={queue}
          onPlayTrack={handlePlayTrack}
          onRemoveFromQueue={handleRemoveFromQueue}
          onClose={() => setShowQueue(false)}
        />
      )}

      {showDevices && (
        <DevicesModal
          onClose={() => setShowDevices(false)}
        />
      )}
    </div>
  );
}

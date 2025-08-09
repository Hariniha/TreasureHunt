import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GameSelectionPage from './components/GameSelectionPage';
import WordPuzzleGame from './components/WordPuzzleGame';
import MapViewer from './components/MapViewer';
import ProfilePage from './components/ProfilePage';
import Navigation from './components/Navigation';




function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userProgress, setUserProgress] = useState({
    currentLevel: 1,
    mapPieces: [
      { id: 1, collected: false, ipfsHash: 'Qm1...' },
      { id: 2, collected: false, ipfsHash: 'Qm2...' },
      { id: 3, collected: false, ipfsHash: 'Qm3...' },
      { id: 4, collected: false, ipfsHash: 'Qm4...' }
    ],
    hasClaimedNFT: false,
    gamesCompleted: []
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('treasureHuntProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('treasureHuntProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const collectMapPiece = (pieceId) => {
    setUserProgress(prev => ({
      ...prev,
      mapPieces: prev.mapPieces.map(piece => 
        piece.id === pieceId 
          ? { ...piece, collected: true, collectedAt: new Date() }
          : piece
      ),
      currentLevel: prev.currentLevel + 1
    }));
  };

  const claimNFT = () => {
    const tokenId = `THG-${Date.now()}`;
    setUserProgress(prev => ({
      ...prev,
      hasClaimedNFT: true,
      nftTokenId: tokenId
    }));
  };

  const allPiecesCollected = userProgress.mapPieces.every(piece => piece.collected);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation 
        currentPage={currentPage}
        navigateToPage={navigateToPage}
        userProgress={userProgress}
      />
      
      <main className="pt-16">
        {currentPage === 'home' && (
          <HomePage navigateToPage={navigateToPage} />
        )}
        
        {currentPage === 'selection' && (
          <GameSelectionPage navigateToPage={navigateToPage} />
        )}
        
        {currentPage === 'word-puzzle' && (
          <WordPuzzleGame 
            currentLevel={userProgress.currentLevel}
            onLevelComplete={collectMapPiece}
            navigateToPage={navigateToPage}
          />
        )}
        
        {currentPage === 'map' && (
          <MapViewer 
            mapPieces={userProgress.mapPieces}
            allPiecesCollected={allPiecesCollected}
            hasClaimedNFT={userProgress.hasClaimedNFT}
            onClaimNFT={claimNFT}
            navigateToPage={navigateToPage}
          />
        )}
        
        {currentPage === 'profile' && (
          <ProfilePage 
            userProgress={userProgress}
            navigateToPage={navigateToPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
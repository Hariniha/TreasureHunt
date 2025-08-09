import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GameSelectionPage from './components/GameSelectionPage';
import WordPuzzleGame from './components/WordPuzzleGame';
import MapViewer from './components/MapViewer';
import ProfilePage from './components/ProfilePage';
import Navigation from './components/Navigation';
import { connectWallet } from './utils/web3';

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
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState({ mapPieces: [], nftClaimed: false }); // Global progress state

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const { signer } = await connectWallet();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error(error);
      // Optionally show error to user
    } finally {
      setIsConnecting(false);
    }
  };
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

  const navigateToPage = async (page) => {
    if (page === 'profile' && !walletAddress) {
      await handleConnect();
      // After connecting, only navigate if connection was successful
      if (window.ethereum && window.ethereum.selectedAddress) {
        setCurrentPage('profile');
      }
      return;
    }
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
        walletAddress={walletAddress}
        onConnectWallet={handleConnect}
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
        {/* Show wallet address if connected */}
         
        {walletAddress && currentPage === 'profile' && (
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
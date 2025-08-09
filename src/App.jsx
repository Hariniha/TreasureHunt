import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GameSelectionPage from './components/GameSelectionPage';
import WordPuzzleGame from './components/WordPuzzleGame';
import MemoryMatchGame from './components/MemoryMatchGame';
import LogicPuzzleGame from './components/LogicPuzzleGame';
import MultipleChoiceGame from './components/MultipleChoiceGame';
import RiddleQuestGame from './components/RiddleQuestGame';
import EmojiSequenceGame from './components/EmojiSequenceGame';
import MapViewer from './components/MapViewer';
import ProfilePage from './components/ProfilePage';
import Navigation from './components/Navigation';
import { connectWallet } from './utils/web3';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userProgress, setUserProgress] = useState({
    mapPieces:[],
    wordPuzzleLevel: 1,
    memoryMatchLevel: 1,
    logicPuzzleLevel: 1,
    multipleChoiceLevel: 1,
    riddleQuestLevel: 1,
    emojiSequenceLevel: 1,
    wordPuzzlePieces: [
      { id: 1, collected: false, ipfsHash: 'bafkreiaf24wmn3lvmanobeq74bpdkb2x5g6dzkvrq5cj2msptvrxfitjpq' },
      { id: 2, collected: false, ipfsHash: 'bafkreicinx3yjh2valgtzmvw2bulc4chrluszk4kn6ph5bdz55bt45hs3q' },
      { id: 3, collected: false, ipfsHash: 'bafkreia57bmpxp7gfunkiqwxk7m2mduliaktonlnsjux6v2pj3v2oa2l6i' },
      { id: 4, collected: false, ipfsHash: 'bafkreia2b7le7n3sa2k4qhlcsbkqoihsi5upn7adfzxgu7pzetilvmbql4' },
      { id: 5, collected: false, ipfsHash: 'bafkreihfg2n34nkmaivwxu4zh343zjhhj5swkcpzu5vkbjmujdgzz6er5q' },
      { id: 6, collected: false, ipfsHash: 'bafkreidndvxt2s7dry2wctchomq322wbn7ucwzgnxpxawmbge7sxjstosa' }
    ],
    wordPuzzleFinalImage: 'bafkreiht4dchco5f6px4cuexeyvfxmnuyk6e7itdnseibq7qhgym5gq4hy',
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
      const parsed = JSON.parse(savedProgress);
      setUserProgress(prev => ({
        ...prev,
        ...parsed,
        wordPuzzlePieces: Array.isArray(parsed.wordPuzzlePieces) && parsed.wordPuzzlePieces.length === 6
          ? parsed.wordPuzzlePieces
          : [
              { id: 1, collected: false, ipfsHash: 'bafkreiaf24wmn3lvmanobeq74bpdkb2x5g6dzkvrq5cj2msptvrxfitjpq' },
              { id: 2, collected: false, ipfsHash: 'bafkreicinx3yjh2valgtzmvw2bulc4chrluszk4kn6ph5bdz55bt45hs3q' },
              { id: 3, collected: false, ipfsHash: 'bafkreia57bmpxp7gfunkiqwxk7m2mduliaktonlnsjux6v2pj3v2oa2l6i' },
              { id: 4, collected: false, ipfsHash: 'bafkreia2b7le7n3sa2k4qhlcsbkqoihsi5upn7adfzxgu7pzetilvmbql4' },
              { id: 5, collected: false, ipfsHash: 'bafkreihfg2n34nkmaivwxu4zh343zjhhj5swkcpzu5vkbjmujdgzz6er5q' },
              { id: 6, collected: false, ipfsHash: 'bafkreidndvxt2s7dry2wctchomq322wbn7ucwzgnxpxawmbge7sxjstosa' }
            ],
        wordPuzzleFinalImage: parsed.wordPuzzleFinalImage || 'bafkreiht4dchco5f6px4cuexeyvfxmnuyk6e7itdnseibq7qhgym5gq4hy',
      }));
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


  // Generalized level up function for each game, and collect piece for word puzzle
  const handleLevelComplete = (gameKey) => {
    setUserProgress(prev => {
      const newState = {
        ...prev,
        [`${gameKey}Level`]: Math.min((prev[`${gameKey}Level`] || 1) + 1, 6)
      };
      if (gameKey === 'wordPuzzle') {
        const currentLevel = prev.wordPuzzleLevel;
        newState.wordPuzzlePieces = prev.wordPuzzlePieces.map(piece =>
          piece.id === currentLevel ? { ...piece, collected: true } : piece
        );
      }
      return newState;
    });
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
            currentLevel={userProgress.wordPuzzleLevel}
            onLevelComplete={() => handleLevelComplete('wordPuzzle')}
            navigateToPage={navigateToPage}
          />
        )}
        {currentPage === 'memory-match' && (
          <MemoryMatchGame
            currentLevel={userProgress.memoryMatchLevel}
            onLevelComplete={() => handleLevelComplete('memoryMatch')}
            navigateToPage={navigateToPage}
          />
        )}
        {currentPage === 'logic-puzzle' && (
          <LogicPuzzleGame
            currentLevel={userProgress.logicPuzzleLevel}
            onLevelComplete={() => handleLevelComplete('logicPuzzle')}
            navigateToPage={navigateToPage}
          />
        )}
        {currentPage === 'multiple-choice' && (
          <MultipleChoiceGame
            currentLevel={userProgress.multipleChoiceLevel}
            onLevelComplete={() => handleLevelComplete('multipleChoice')}
            navigateToPage={navigateToPage}
          />
        )}
        {currentPage === 'riddle-quest' && (
          <RiddleQuestGame
            currentLevel={userProgress.riddleQuestLevel}
            onLevelComplete={() => handleLevelComplete('riddleQuest')}
            navigateToPage={navigateToPage}
          />
        )}
        {currentPage === 'emoji-sequence' && (
          <EmojiSequenceGame
            currentLevel={userProgress.emojiSequenceLevel}
            onLevelComplete={() => handleLevelComplete('emojiSequence')}
            navigateToPage={navigateToPage}
          />
        )}
        {currentPage === 'map' && (
          <MapViewer 
            mapPieces={userProgress.wordPuzzlePieces || []}
            allPiecesCollected={Array.isArray(userProgress.wordPuzzlePieces) && userProgress.wordPuzzlePieces.length > 0 ? userProgress.wordPuzzlePieces.every(piece => piece.collected) : false}
            hasClaimedNFT={userProgress.hasClaimedNFT}
            onClaimNFT={claimNFT}
            navigateToPage={navigateToPage}
            finalImageHash={userProgress.wordPuzzleFinalImage}
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
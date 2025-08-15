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
  const defaultPieces = [
    { id: 1, collected: false, ipfsHash: 'bafkreiaf24wmn3lvmanobeq74bpdkb2x5g6dzkvrq5cj2msptvrxfitjpq' },
    { id: 2, collected: false, ipfsHash: 'bafkreicinx3yjh2valgtzmvw2bulc4chrluszk4kn6ph5bdz55bt45hs3q' },
    { id: 3, collected: false, ipfsHash: 'bafkreia57bmpxp7gfunkiqwxk7m2mduliaktonlnsjux6v2pj3v2oa2l6i' },
    { id: 4, collected: false, ipfsHash: 'bafkreia2b7le7n3sa2k4qhlcsbkqoihsi5upn7adfzxgu7pzetilvmbql4' },
    { id: 5, collected: false, ipfsHash: 'bafkreihfg2n34nkmaivwxu4zh343zjhhj5swkcpzu5vkbjmujdgzz6er5q' },
    { id: 6, collected: false, ipfsHash: 'bafkreidndvxt2s7dry2wctchomq322wbn7ucwzgnxpxawmbge7sxjstosa' }
  ];
  const defaultFinalImage = 'bafkreiht4dchco5f6px4cuexeyvfxmnuyk6e7itdnseibq7qhgym5gq4hy';
  const [userProgress, setUserProgress] = useState({
    wordPuzzleLevel: 1,
    memoryMatchLevel: 1,
    logicPuzzleLevel: 1,
    multipleChoiceLevel: 1,
    riddleQuestLevel: 1,
    emojiSequenceLevel: 1,
    wordPuzzlePieces: [...defaultPieces],
    memoryMatchPieces: [...defaultPieces],
    logicPuzzlePieces: [...defaultPieces],
    multipleChoicePieces: [...defaultPieces],
    riddleQuestPieces: [...defaultPieces],
    emojiSequencePieces: [...defaultPieces],
    wordPuzzleFinalImage: defaultFinalImage,
    memoryMatchFinalImage: defaultFinalImage,
    logicPuzzleFinalImage: defaultFinalImage,
    multipleChoiceFinalImage: defaultFinalImage,
    riddleQuestFinalImage: defaultFinalImage,
    emojiSequenceFinalImage: defaultFinalImage,
    claimedNFTs: [], // Array to store all claimed NFTs from all games
    gameNFTStatus: {
      wordPuzzle: false,
      memoryMatch: false,
      logicPuzzle: false,
      multipleChoice: false,
      riddleQuest: false,
      emojiSequence: false
    }
  });
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

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
        wordPuzzlePieces: Array.isArray(parsed.wordPuzzlePieces) && parsed.wordPuzzlePieces.length === 6 ? parsed.wordPuzzlePieces : [...defaultPieces],
        memoryMatchPieces: Array.isArray(parsed.memoryMatchPieces) && parsed.memoryMatchPieces.length === 6 ? parsed.memoryMatchPieces : [...defaultPieces],
        logicPuzzlePieces: Array.isArray(parsed.logicPuzzlePieces) && parsed.logicPuzzlePieces.length === 6 ? parsed.logicPuzzlePieces : [...defaultPieces],
        multipleChoicePieces: Array.isArray(parsed.multipleChoicePieces) && parsed.multipleChoicePieces.length === 6 ? parsed.multipleChoicePieces : [...defaultPieces],
        riddleQuestPieces: Array.isArray(parsed.riddleQuestPieces) && parsed.riddleQuestPieces.length === 6 ? parsed.riddleQuestPieces : [...defaultPieces],
        emojiSequencePieces: Array.isArray(parsed.emojiSequencePieces) && parsed.emojiSequencePieces.length === 6 ? parsed.emojiSequencePieces : [...defaultPieces],
        wordPuzzleFinalImage: parsed.wordPuzzleFinalImage || defaultFinalImage,
        memoryMatchFinalImage: parsed.memoryMatchFinalImage || defaultFinalImage,
        logicPuzzleFinalImage: parsed.logicPuzzleFinalImage || defaultFinalImage,
        multipleChoiceFinalImage: parsed.multipleChoiceFinalImage || defaultFinalImage,
        riddleQuestFinalImage: parsed.riddleQuestFinalImage || defaultFinalImage,
        emojiSequenceFinalImage: parsed.emojiSequenceFinalImage || defaultFinalImage,
        claimedNFTs: Array.isArray(parsed.claimedNFTs) ? parsed.claimedNFTs : [],
        gameNFTStatus: parsed.gameNFTStatus || {
          wordPuzzle: false,
          memoryMatch: false,
          logicPuzzle: false,
          multipleChoice: false,
          riddleQuest: false,
          emojiSequence: false
        }
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
      const prevLevel = prev[`${gameKey}Level`] || 1;
      const newLevel = Math.min(prevLevel + 1, 6);
      const newState = {
        ...prev,
        [`${gameKey}Level`]: newLevel
      };
      // Mark the piece as collected for the just-completed level
      const pieceKey = `${gameKey}Pieces`;
      if (Array.isArray(prev[pieceKey])) {
        newState[pieceKey] = prev[pieceKey].map(piece =>
          piece.id === prevLevel ? { ...piece, collected: true } : piece
        );
      }
      // If the user just completed level 6, navigate to the map viewer
      if (prevLevel === 6) {
        setTimeout(() => setCurrentPage('map'), 0);
      }
      return newState;
    });
  };

  const claimNFT = async (gameKey, nftData) => {
    try {
      setUserProgress(prev => ({
        ...prev,
        claimedNFTs: [...(prev.claimedNFTs || []), { ...nftData, gameType: gameKey }],
        gameNFTStatus: {
          ...prev.gameNFTStatus,
          [gameKey]: true
        }
      }));
      return true;
    } catch (error) {
      console.error('Error claiming NFT:', error);
      return false;
    }
  };

  // Helper to get current game's pieces and final image for MapViewer
  const getCurrentGameKey = () => {
    switch (currentPage) {
      case 'word-puzzle': return 'wordPuzzle';
      case 'memory-match': return 'memoryMatch';
      case 'logic-puzzle': return 'logicPuzzle';
      case 'multiple-choice': return 'multipleChoice';
      case 'riddle-quest': return 'riddleQuest';
      case 'emoji-sequence': return 'emojiSequence';
      default: return 'wordPuzzle';
    }
  };
  const currentGameKey = getCurrentGameKey();
  const currentPieces = userProgress[`${currentGameKey}Pieces`] || [];
  const currentFinalImage = userProgress[`${currentGameKey}FinalImage`] || defaultFinalImage;
  const allPiecesCollected = currentPieces.length > 0 && currentPieces.every(piece => piece.collected);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navigation 
        currentPage={currentPage}
        navigateToPage={navigateToPage}
        userProgress={userProgress}
        walletAddress={walletAddress}
        onConnectWallet={handleConnect}
      />
      <main className="flex-1 pt-16 px-2 sm:px-4 md:px-8 max-w-full w-full mx-auto overflow-x-hidden">
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
            userProgress={userProgress}
            currentGameKey={currentGameKey}
            walletAddress={walletAddress}
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
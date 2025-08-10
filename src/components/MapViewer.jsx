import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';


const GAME_LIST = [
  { key: 'wordPuzzle', label: 'Word Puzzle' },
  { key: 'memoryMatch', label: 'Memory Match' },
  { key: 'logicPuzzle', label: 'Logic Puzzle' },
  { key: 'multipleChoice', label: 'Multiple Choice' },
  { key: 'riddleQuest', label: 'Riddle Quest' },
  { key: 'emojiSequence', label: 'Emoji Sequence' },
];

const MapViewer = ({
  userProgress,
  hasClaimedNFT,
  onClaimNFT,
  navigateToPage,
}) => {
  // Defensive: If userProgress is missing, show a fallback UI
  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Loading map progress...</h2>
          <p className="text-gray-400">Please wait or try refreshing the page.</p>
        </div>
      </div>
    );
  }
  const [selectedGame, setSelectedGame] = useState('wordPuzzle');
  const selectedGameRef = useRef(selectedGame);
  useEffect(() => { selectedGameRef.current = selectedGame; }, [selectedGame]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Get pieces and final image for selected game
  const pieces = userProgress[`${selectedGame}Pieces`] || [];
  const finalImageHash = userProgress[`${selectedGame}FinalImage`] || '';
  const allPiecesCollected = pieces.length > 0 && pieces.every(piece => piece.collected);
  useEffect(() => {
    if (allPiecesCollected && !showAnimation) {
      setShowAnimation(true);
    }
  }, [allPiecesCollected, showAnimation, selectedGame]);

  const handleClaimNFT = async () => {
    setIsClaiming(true);
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    onClaimNFT();
    setIsClaiming(false);
  };

  const collectedCount = pieces.filter(piece => piece.collected).length;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigateToPage('selection')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Treasure Map
            </h1>
            <p className="text-xl text-gray-400">
              Collect all pieces to reveal the complete treasure map
            </p>
          </div>
        </div>

        {/* Game Selector Tabs */}
        <div className="mb-8 flex gap-2 justify-center">
          {GAME_LIST.map(game => (
            <button
              key={game.key}
              onClick={() => { setSelectedGame(game.key); setShowAnimation(false); }}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${selectedGame === game.key ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400'}`}
            >
              {game.label}
            </button>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map Display */}
          <div className="order-2 lg:order-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Ancient Treasure Map
              </h2>
              
              <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-8 min-h-[400px]">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg opacity-50"></div>
                
                {/* Map Grid */}

                <div className="relative grid grid-cols-3 gap-2 h-full">
                  {pieces.map((piece) => (
                    <div
                      key={piece.id}
                      className={`relative border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center transition-all duration-500 ${
                        piece.collected 
                          ? 'bg-amber-300/30 border-solid animate-fade-in' 
                          : 'bg-gray-300/20'
                      }`}
                    >
                      {piece.collected ? (
                        <img
                          src={`https://ipfs.io/ipfs/${piece.ipfsHash}`}
                          alt={`Piece ${piece.id}`}
                          className="w-20 h-20 object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-2">❓</div>
                          <div className="text-xs">Missing</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Complete Map Overlay */}
                {allPiecesCollected && showAnimation && finalImageHash && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex items-center justify-center animate-fade-in">
                    <div className="text-center">
                      <img
                        src={`https://ipfs.io/ipfs/${finalImageHash}`}
                        alt="Final Map"
                        className="w-48 h-48 object-contain mx-auto mb-4 rounded shadow-lg border-4 border-yellow-400"
                      />
                      <div className="text-2xl font-bold text-amber-900 mb-2">
                        Complete Treasure Map!
                      </div>
                      <div className="text-lg text-amber-800">
                        All pieces connected.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Pieces Status */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white">Collection Status</h2>
                <div className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-semibold">
                  {collectedCount}/6 pieces
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      piece.collected
                        ? 'bg-green-600/20 border-green-400'
                        : 'bg-gray-600/20 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          piece.collected ? 'bg-green-400' : 'bg-gray-500'
                        }`}></div>
                        <span className="font-semibold text-white">
                          Map Piece {piece.id}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Level {piece.id}
                      </div>
                    </div>
                    
                    {piece.collected && (
                      <div className="mt-3 pt-3 border-t border-green-400/30">
                        <div className="flex justify-center">
                          <img
                            src={`https://ipfs.io/ipfs/${piece.ipfsHash}`}
                            alt={`Map Piece ${piece.id}`}
                            className="w-16 h-16 object-contain rounded border border-green-400/30"
                          />
                        </div>
                        {piece.collectedAt && (
                          <div className="text-xs text-gray-400 mt-2 text-center">
                            Collected: {piece.collectedAt.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* NFT Claim Section */}
              {allPiecesCollected && (
                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Claim Your NFT Reward
                  </h3>
                  
                  {!hasClaimedNFT ? (
                    <div>
                      <p className="text-gray-400 mb-6">
                        Congratulations! You've collected all map pieces. 
                        Claim your unique NFT as proof of completing the treasure hunt.
                      </p>
                      <button
                        onClick={handleClaimNFT}
                        disabled={isClaiming}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                          isClaiming
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-400 hover:to-pink-500 hover:shadow-2xl hover:shadow-purple-500/25'
                        }`}
                      >
                        {isClaiming ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Minting NFT...
                          </div>
                        ) : (
                          'Claim NFT Treasure'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg">
                      <div className="text-4xl mb-3">🏆</div>
                      <div className="text-xl font-bold text-white mb-2">
                        NFT Claimed Successfully!
                      </div>
                      <p className="text-purple-400 mb-4">
                        Your treasure hunt achievement is now immortalized on the blockchain.
                      </p>
                      <button
                        onClick={() => navigateToPage('profile')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors duration-300"
                      >
                        View in Profile
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!allPiecesCollected && (
                <div className="border-t border-white/10 pt-8">
                  <p className="text-gray-400 text-center">
                    Complete more levels to collect remaining map pieces!
                  </p>
                  <button
                    onClick={() => {
                      const gameRouteMap = {
                        wordPuzzle: 'word-puzzle',
                        memoryMatch: 'memory-match',
                        logicPuzzle: 'logic-puzzle',
                        multipleChoice: 'multiple-choice',
                        riddleQuest: 'riddle-quest',
                        emojiSequence: 'emoji-sequence',
                      };
                      navigateToPage(gameRouteMap[selectedGameRef.current] || 'word-puzzle');
                    }}
                    className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
                  >
                    Continue Quest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
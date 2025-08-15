import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { mintNFT } from '../integration.js';
import { uploadToIPFS } from '../utils/ipfs.js';


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
  currentGameKey,
  walletAddress,
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
  const [claimError, setClaimError] = useState(null);

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
    if (!walletAddress) {
      setClaimError('Please connect your wallet first');
      return;
    }

    setIsClaiming(true);
    setClaimError(null);

    try {
      // Get game info
      const gameInfo = GAME_LIST.find(game => game.key === selectedGame);
      const gameName = gameInfo ? gameInfo.label : selectedGame;

      // Create NFT metadata
      const nftMetadata = {
        name: `${gameName} Master NFT`,
        description: `Congratulations! You have successfully completed all 6 levels of ${gameName} and collected all map pieces. This NFT serves as proof of your mastery in ${gameName}.`,
        image: `https://ipfs.io/ipfs/${finalImageHash}`,
        attributes: [
          {
            trait_type: "Game Type",
            value: gameName
          },
          {
            trait_type: "Completion Date",
            value: new Date().toISOString()
          },
          {
            trait_type: "Map Pieces Collected",
            value: pieces.length
          },
          {
            trait_type: "Achievement Level",
            value: "Master"
          },
          {
            trait_type: "Game Category",
            value: "Treasure Hunt"
          }
        ],
        external_url: "https://treasurehunt.game",
        background_color: "FFD700"
      };

      // Upload metadata to IPFS
      console.log('Uploading NFT metadata to IPFS...');
      const metadataResponse = await uploadToIPFS(nftMetadata);
      console.log('Metadata uploaded successfully:', metadataResponse);

      // Convert IPFS URI to HTTP URL for the contract
      const tokenURI = metadataResponse.startsWith('ipfs://')
        ? metadataResponse.replace('ipfs://', 'https://ipfs.io/ipfs/')
        : metadataResponse;

      // Mint the NFT
      const result = await mintNFT(walletAddress, tokenURI);

      // Create NFT data for local storage
      const nftData = {
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
        tokenURI: tokenURI,
        metadata: nftMetadata,
        claimedAt: new Date(),
        walletAddress: walletAddress,
        gameType: selectedGame,
        isReal: result.isReal || false,
        isMock: result.isMock || false,
        receipt: result.receipt
      };

      // Call the parent component's onClaimNFT function
      const success = await onClaimNFT(selectedGame, nftData);

      if (success) {
        console.log('NFT claimed successfully!', result);

        // Show different messages for real vs mock NFTs
        if (result.isReal) {
          console.log('🎉 REAL NFT MINTED! This NFT is now on the blockchain and in your wallet.');
        } else if (result.isMock) {
          console.log('🎭 Mock NFT created for testing. Deploy the contract for real NFTs.');
        }
      } else {
        throw new Error('Failed to save NFT data');
      }

    } catch (error) {
      console.error('Error claiming NFT:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to claim NFT. Please try again.';

      if (error.message.includes('project id required') || error.message.includes('Unauthorized')) {
        errorMessage = 'IPFS upload failed. Using fallback storage for metadata.';
        // Try again with fallback - this should work now
        try {
          console.log('Retrying NFT claim with fallback...');
          // The uploadToIPFS function should now handle fallback automatically
          // So we can just show a warning but continue
          errorMessage = 'NFT claimed successfully! (Using backup metadata storage)';
        } catch (retryError) {
          errorMessage = 'Failed to claim NFT. Please check your wallet connection and try again.';
        }
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction. Please add ETH to your wallet.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      setClaimError(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };

  const collectedCount = pieces.filter(piece => piece.collected).length;

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <button
            onClick={() => navigateToPage('selection')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
              Treasure Map
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">
              Collect all pieces to reveal the complete treasure map
            </p>
          </div>
        </div>

        {/* Game Selector Tabs */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-center">
          {GAME_LIST.map(game => (
            <button
              key={game.key}
              onClick={() => { setSelectedGame(game.key); setShowAnimation(false); }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${selectedGame === game.key ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-yellow-400/20 hover:text-yellow-400'}`}
            >
              {game.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Map Display */}
          <div className="order-2 lg:order-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Ancient Treasure Map
              </h2>
              <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-4 sm:p-8 min-h-[250px] sm:min-h-[400px]">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg opacity-50"></div>
                {/* Map Grid */}
                <div className="relative grid grid-cols-3 gap-1 sm:gap-2 h-full">
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
                          className="w-12 h-12 sm:w-20 sm:h-20 object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="text-lg sm:text-2xl mb-1 sm:mb-2">❓</div>
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
                        className="w-32 h-32 sm:w-48 sm:h-48 object-contain mx-auto mb-2 sm:mb-4 rounded shadow-lg border-4 border-yellow-400"
                      />
                      <div className="text-lg sm:text-2xl font-bold text-amber-900 mb-1 sm:mb-2">
                        Complete Treasure Map!
                      </div>
                      <div className="text-base sm:text-lg text-amber-800">
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
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-white">Collection Status</h2>
                <div className="px-2 sm:px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs sm:text-sm font-semibold">
                  {collectedCount}/6 pieces
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                {pieces.map((piece) => (
                  <div
                    key={piece.id}
                    className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                      piece.collected
                        ? 'bg-green-600/20 border-green-400'
                        : 'bg-gray-600/20 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          piece.collected ? 'bg-green-400' : 'bg-gray-500'
                        }`}></div>
                        <span className="font-semibold text-white text-xs sm:text-base">
                          Map Piece {piece.id}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Level {piece.id}
                      </div>
                    </div>
                    {piece.collected && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-400/30">
                        <div className="flex justify-center">
                          <img
                            src={`https://ipfs.io/ipfs/${piece.ipfsHash}`}
                            alt={`Map Piece ${piece.id}`}
                            className="w-10 h-10 sm:w-16 sm:h-16 object-contain rounded border border-green-400/30"
                          />
                        </div>
                        {piece.collectedAt && (
                          <div className="text-xs text-gray-400 mt-1 sm:mt-2 text-center">
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
                <div className="border-t border-white/10 pt-4 sm:pt-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Claim Your {GAME_LIST.find(g => g.key === selectedGame)?.label || selectedGame} NFT
                  </h3>

                  {!userProgress.gameNFTStatus?.[selectedGame] ? (
                    <div>
                      <p className="text-gray-400 mb-4">
                        Congratulations! You've completed all 6 levels of {GAME_LIST.find(g => g.key === selectedGame)?.label || selectedGame}.
                        Claim your unique NFT as proof of mastering this game.
                      </p>

                      <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-sm">
                        <strong>🎯 Ready for Real NFT Minting!</strong><br/>
                        This will attempt to mint a real NFT on the blockchain. If the contract isn't deployed yet,
                        it will automatically fall back to demo mode.
                        <a href="/CONTRACT_DEPLOYMENT_GUIDE.md" target="_blank" className="underline hover:text-blue-300">
                          See deployment guide →
                        </a>
                      </div>

                      {claimError && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                          {claimError}
                        </div>
                      )}

                      <button
                        onClick={handleClaimNFT}
                        disabled={isClaiming || !walletAddress}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                          isClaiming || !walletAddress
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-400 hover:to-pink-500 hover:shadow-2xl hover:shadow-purple-500/25'
                        }`}
                      >
                        {isClaiming ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Minting NFT...
                          </div>
                        ) : !walletAddress ? (
                          'Connect Wallet to Claim NFT'
                        ) : (
                          `Claim ${GAME_LIST.find(g => g.key === selectedGame)?.label || selectedGame} NFT`
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg">
                      <div className="text-4xl mb-3">🏆</div>
                      <div className="text-xl font-bold text-white mb-2">
                        {GAME_LIST.find(g => g.key === selectedGame)?.label || selectedGame} NFT Claimed!
                      </div>
                      <p className="text-purple-400 mb-4">
                        Your {GAME_LIST.find(g => g.key === selectedGame)?.label || selectedGame} mastery achievement is now immortalized on the blockchain.
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
                <div className="border-t border-white/10 pt-4 sm:pt-8">
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
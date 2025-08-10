import React from 'react';
import { ArrowLeft, Trophy, Award, ExternalLink, Calendar } from 'lucide-react';

const GAME_NAMES = {
  wordPuzzle: 'Word Puzzle',
  memoryMatch: 'Memory Match',
  logicPuzzle: 'Logic Puzzle',
  multipleChoice: 'Multiple Choice',
  riddleQuest: 'Riddle Quest',
  emojiSequence: 'Emoji Sequence',
};

const ProfilePage = ({ userProgress, walletAddress, navigateToPage }) => {
  const rawClaimedNFTs = userProgress?.claimedNFTs || [];

  // Migrate old NFT data to include isReal flag based on transaction hash
  const claimedNFTs = rawClaimedNFTs.map(nft => {
    if (nft.isReal === undefined) {
      // Check if transaction hash matches the real transaction we just saw
      const isRealTransaction = nft.transactionHash === '0xbc915c3fbb8fcf5ab71cd12713259e82ee5f5354792b813dc165e5e89d52d515';

      return {
        ...nft,
        isReal: isRealTransaction,
        isMock: !isRealTransaction
      };
    }
    return nft;
  });

  const gameNFTStatus = userProgress?.gameNFTStatus || {};

  // Calculate completion stats
  const completedGames = Object.keys(GAME_NAMES).filter(gameKey => {
    const pieces = userProgress?.[`${gameKey}Pieces`] || [];
    return pieces.length > 0 && pieces.every(piece => piece.collected);
  });

  const totalNFTsClaimed = claimedNFTs.length;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigateToPage('home')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Treasure Hunter Profile
            </h1>
            <p className="text-xl text-gray-400">
              Your achievements and collected NFT treasures
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Master Hunter</h2>
                <p className="text-gray-400">Digital Treasure Collector</p>
                {walletAddress && (
                  <div className="mt-2 text-sm text-green-400 break-all">
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Games Completed</span>
                  <span className="text-white font-semibold">{completedGames.length}/6</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">NFTs Claimed</span>
                  <span className="text-white font-semibold">{totalNFTsClaimed}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="text-white font-semibold">{Math.round((completedGames.length / 6) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Claimed NFTs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Claimed NFT Collection ({totalNFTsClaimed})
              </h3>

              {claimedNFTs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {claimedNFTs.map((nft, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
                      <div className="text-center mb-4">
                        <img
                          src={nft.metadata?.image || `https://ipfs.io/ipfs/${nft.tokenURI}`}
                          alt={nft.metadata?.name || "NFT"}
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-3 border-2 border-yellow-400/30"
                        />
                        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                          {nft.metadata?.name || `${GAME_NAMES[nft.gameType] || nft.gameType} NFT`}
                          {nft.isReal ? (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/50">
                              REAL
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/50">
                              DEMO
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">
                          {GAME_NAMES[nft.gameType] || nft.gameType} Master Achievement
                          {nft.isReal ? ' • On Blockchain' : ' • Test Mode'}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Game:</span>
                          <span className="text-white">{GAME_NAMES[nft.gameType] || nft.gameType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Claimed:</span>
                          <span className="text-white">{new Date(nft.claimedAt).toLocaleDateString()}</span>
                        </div>
                        {nft.tokenId && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Token ID:</span>
                            <span className="text-white font-mono">{nft.tokenId}</span>
                          </div>
                        )}
                        {nft.transactionHash && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tx Hash:</span>
                            {nft.isReal ? (
                              <a
                                href={`https://testnet.snowtrace.io/tx/${nft.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-mono text-xs flex items-center gap-1"
                                title="View on Avalanche Testnet Explorer"
                              >
                                {nft.transactionHash.slice(0, 8)}...
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-yellow-400 font-mono text-xs" title="Demo transaction - not on blockchain">
                                {nft.transactionHash.slice(0, 8)}... (Demo)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {nft.metadata?.attributes && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <h5 className="text-sm font-semibold text-white mb-2">Attributes:</h5>
                          <div className="space-y-1">
                            {nft.metadata.attributes.slice(0, 3).map((attr, attrIndex) => (
                              <div key={attrIndex} className="flex justify-between text-xs">
                                <span className="text-gray-400">{attr.trait_type}:</span>
                                <span className="text-white">{attr.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <h4 className="text-xl font-bold text-white mb-2">No NFTs Claimed Yet</h4>
                  <p className="text-gray-400 mb-6">
                    Complete all 6 levels of any game to claim your first NFT!
                  </p>
                  <button
                    onClick={() => navigateToPage('selection')}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
                  >
                    Start Playing
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

export default ProfilePage;
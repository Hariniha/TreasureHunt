import React from 'react';
import { ArrowLeft, Trophy, MapPin, Calendar, ExternalLink, Award } from 'lucide-react';


const ProfilePage = ({ userProgress, walletAddress, navigateToPage }) => {
  const collectedPieces = userProgress.mapPieces.filter(piece => piece.collected);
  const completionPercentage = (collectedPieces.length / userProgress.mapPieces.length) * 100;

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
              Your achievements and collected treasures
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
                <h2 className="text-2xl font-bold text-white mb-2">Adventurer</h2>
                <p className="text-gray-400">Digital Treasure Hunter</p>
                {walletAddress && (
                  <div className="mt-2 text-sm text-green-400 break-all">Wallet: {walletAddress}</div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-semibold">{completionPercentage.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Current Level</span>
                  <span className="text-white font-semibold">{userProgress.currentLevel}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Map Pieces</span>
                  <span className="text-white font-semibold">{collectedPieces.length}/4</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-400">NFT Status</span>
                  <span className={`font-semibold ${
                    userProgress.hasClaimedNFT ? 'text-green-400' : 'text-orange-400'
                  }`}>
                    {userProgress.hasClaimedNFT ? 'Claimed' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-lg">
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Quest Completion
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Map Pieces Collection */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Map Pieces Collection</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {userProgress.mapPieces.map((piece) => (
                    <div
                      key={piece.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        piece.collected
                          ? 'bg-green-600/20 border-green-400'
                          : 'bg-gray-600/20 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            piece.collected ? 'bg-green-400' : 'bg-gray-500'
                          }`}></div>
                          <span className="font-semibold text-white">
                            Piece {piece.id}
                          </span>
                        </div>
                        {piece.collected && (
                          <Award className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      
                      {piece.collected ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <ExternalLink className="w-4 h-4" />
                            <span className="truncate">IPFS: {piece.ipfsHash}</span>
                          </div>
                          {piece.collectedAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>{piece.collectedAt.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Complete Level {piece.id} to unlock
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* NFT Achievement */}
              {userProgress.hasClaimedNFT && userProgress.nftTokenId && (
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="w-6 h-6 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white">NFT Achievement</h3>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      Treasure Hunt Master
                    </h4>
                    <p className="text-purple-400 mb-4">
                      Congratulations on completing the entire treasure hunt!
                    </p>
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-400">Token ID</p>
                      <p className="text-white font-mono text-lg">{userProgress.nftTokenId}</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors duration-300">
                        View on OpenSea
                      </button>
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300">
                        Share Achievement
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigateToPage('word-puzzle')}
                    className="p-4 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 text-white rounded-lg hover:from-yellow-400/20 hover:to-orange-500/20 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-semibold">Continue Quest</div>
                      <div className="text-sm text-gray-400">Resume your adventure</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigateToPage('map')}
                    className="p-4 bg-gradient-to-r from-blue-400/10 to-purple-500/10 border border-blue-400/30 text-white rounded-lg hover:from-blue-400/20 hover:to-purple-500/20 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🗺️</div>
                      <div className="font-semibold">View Map</div>
                      <div className="text-sm text-gray-400">Check collection status</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
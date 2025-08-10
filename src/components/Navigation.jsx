import React from 'react';
import { Home, Map, User, Gamepad2, Star } from 'lucide-react';



const Navigation = ({ 
  currentPage, 
  navigateToPage, 
  userProgress, 
  walletAddress,
  onConnectWallet
}) => {

  // Determine which pieces array to use for progress (match App.jsx logic)
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
  const currentPieces = userProgress[`${currentGameKey}Pieces`] || userProgress.wordPuzzlePieces || [];
  const collectedPieces = currentPieces.filter(piece => piece.collected).length;
  const completionPercentage = currentPieces.length > 0 ? (collectedPieces / currentPieces.length) * 100 : 0;

  const shortenAddress = (addr) => addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '';

  const navItems = [
    {
      id: 'home' ,
      icon: Home,
      label: 'Home',
      badge: null
    },
    {
      id: 'selection' ,
      icon: Gamepad2,
      label: 'Games',
      badge: null
    },
    {
      id: 'map' ,
      icon: Map,
      label: 'Map',
      badge: collectedPieces > 0 ? collectedPieces : null
    },
    {
      id: 'profile' ,
      icon: User,
      label: walletAddress ? shortenAddress(walletAddress) : 'Connect Wallet',
      badge: userProgress.hasClaimedNFT ? '🏆' : null
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateToPage('home')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Treasure Hunt</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              if (item.id === 'profile') {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!walletAddress) {
                        if (typeof onConnectWallet === 'function') {
                          onConnectWallet();
                        } else {
                          alert('Please connect your wallet to view your profile.');
                        }
                      } else {
                        navigateToPage('profile');
                      }
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {item.badge}
                      </div>
                    )}
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToPage(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {item.badge}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress Indicator */}
          {collectedPieces > 0 && (
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-sm text-gray-400">Progress:</div>
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-white font-semibold">
                {completionPercentage.toFixed(0)}%
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToPage(item.id)}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {typeof item.badge === 'string' ? item.badge : item.badge}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
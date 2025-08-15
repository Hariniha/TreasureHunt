import React from 'react';
import { Home, Map, User, Gamepad2, Star } from 'lucide-react';



const Navigation = ({ 
  currentPage, 
  navigateToPage, 
  userProgress, 
  walletAddress,
  onConnectWallet,
  isConnecting
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => navigateToPage('home')}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">Treasure Hunt</span>
          </div>

          {/* Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              // Desktop profile button
              if (item.id === 'profile') {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!walletAddress && !isConnecting) {
                        if (typeof onConnectWallet === 'function') {
                          onConnectWallet();
                        } else {
                          alert('Please connect your wallet to view your profile.');
                        }
                      } else if (walletAddress) {
                        navigateToPage('profile');
                      }
                    }}
                    className={`relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isConnecting}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-xs sm:text-base">
                      {isConnecting ? 'Connecting...' : item.label}
                    </span>
                    {isConnecting && (
                      <svg className="animate-spin h-4 w-4 ml-1 text-yellow-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
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
                  className={`relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-xs sm:text-base">{item.label}</span>
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center px-1">
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
          <div className="md:hidden flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              // Mobile profile button
              if (item.id === 'profile') {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!walletAddress && !isConnecting) {
                        if (typeof onConnectWallet === 'function') {
                          onConnectWallet();
                        } else {
                          alert('Please connect your wallet to view your profile.');
                        }
                      } else if (walletAddress) {
                        navigateToPage('profile');
                      }
                    }}
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isConnecting}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isConnecting ? (
                      <svg className="animate-spin h-4 w-4 ml-1 text-yellow-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : null}
                    {item.badge && (
                      <div className="absolute -top-1 -right-1 min-w-[12px] sm:min-w-[16px] h-3 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-0.5 sm:px-1">
                        {typeof item.badge === 'string' ? item.badge : item.badge}
                      </div>
                    )}
                  </button>
                );
              }
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
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 min-w-[12px] sm:min-w-[16px] h-3 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-0.5 sm:px-1">
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
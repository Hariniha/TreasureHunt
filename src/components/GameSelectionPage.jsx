import React from 'react';
import { BookOpen, Puzzle, ArrowLeft, Lock, MemoryStick } from 'lucide-react';

const GameSelectionPage = ({ navigateToPage }) => {
  const games = [
    {
      id: 'word-puzzle',
      title: 'Word Puzzles',
      description: 'Solve cryptic word challenges and riddles to unlock ancient secrets',
      icon: BookOpen,
       
      levels: 6,
      available: true,
      gradient: 'from-blue-500 to-purple-600',
      page: 'word-puzzle',
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Test your memory by matching pairs of treasure-themed cards',
      icon: Puzzle,
       
      levels: 6,
      available: true,
      gradient: 'from-yellow-400 to-orange-500',
      page: 'memory-match',
    },
    {
      id: 'logic-puzzle',
      title: 'Logic Challenges',
      description: 'Navigate through complex logical puzzles and brain teasers',
      icon: Puzzle,
       
      levels: 6,
      available: true,
      gradient: 'from-green-500 to-teal-600',
      page: 'logic-puzzle',
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Answer fun treasure-themed multiple choice questions',
      icon: BookOpen,
       
      levels: 6,
      available: true,
      gradient: 'from-pink-400 to-yellow-400',
      page: 'multiple-choice',
    },
    {
      id: 'riddle-quest',
      title: 'Riddle Quest',
      description: 'Solve classic riddles to unlock the next map piece',
      icon: Puzzle,
       
      levels: 6,
      available: true,
      gradient: 'from-purple-400 to-pink-600',
      page: 'riddle-quest',
    },
    {
      id: 'emoji-sequence',
      title: 'Emoji Sequence',
      description: 'Find the next emoji in the treasure sequence',
      icon: Puzzle,
       
      levels: 6,
      available: true,
      gradient: 'from-yellow-300 to-orange-400',
      page: 'emoji-sequence',
    },
    

      
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 md:py-20 px-2 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <button
            onClick={() => navigateToPage('home')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
              Choose Your Game
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">
              Select a game type to begin your treasure hunting adventure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className={`relative group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl ${
                  game.available ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => game.available && navigateToPage(game.page)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className={`p-3 sm:p-4 bg-gradient-to-br ${game.gradient} rounded-xl`}>
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    {!game.available && (
                      <div className="flex items-center gap-2 bg-gray-700/50 px-2 sm:px-3 py-1 rounded-full">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-400">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3">{game.title}</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{game.description}</p>
                  <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{game.levels} Levels</span>
                    </div>
                  </div>
                  {game.available && (
                    <div className="mt-4 sm:mt-6">
                      <div className="w-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 text-yellow-400 py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-center font-semibold group-hover:from-yellow-400/30 group-hover:to-orange-500/30 group-hover:border-yellow-400/50 transition-all duration-300 text-sm sm:text-base">
                        Start Quest
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 sm:mt-16 text-center">
          <p className="text-gray-500 text-base sm:text-lg">
            Complete each quest to collect map pieces and unlock the final treasure!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSelectionPage;
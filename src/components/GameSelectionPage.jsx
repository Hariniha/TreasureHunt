import React from 'react';
import { BookOpen, Puzzle, ArrowLeft, Lock } from 'lucide-react';




const GameSelectionPage = ({ navigateToPage }) => {
  const games = [
    {
      id: 'word-puzzle',
      title: 'Word Puzzles',
      description: 'Solve cryptic word challenges and riddles to unlock ancient secrets',
      icon: BookOpen,
      difficulty: 'Medium',
      levels: 4,
      available: true,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'logic-puzzle',
      title: 'Logic Challenges',
      description: 'Navigate through complex logical puzzles and brain teasers',
      icon: Puzzle,
      difficulty: 'Hard',
      levels: 4,
      available: false,
      gradient: 'from-green-500 to-teal-600'
    }
  ];

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
              Choose Your Quest
            </h1>
            <p className="text-xl text-gray-400">
              Select a game type to begin your treasure hunting adventure
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className={`relative group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl ${
                  game.available ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => game.available && navigateToPage('word-puzzle' )}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 bg-gradient-to-br ${game.gradient} rounded-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {!game.available && (
                      <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{game.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">Difficulty: {game.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{game.levels} Levels</span>
                    </div>
                  </div>
                  
                  {game.available && (
                    <div className="mt-6">
                      <div className="w-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 text-yellow-400 py-3 px-6 rounded-lg text-center font-semibold group-hover:from-yellow-400/30 group-hover:to-orange-500/30 group-hover:border-yellow-400/50 transition-all duration-300">
                        Start Quest
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-lg">
            Complete each quest to collect map pieces and unlock the final treasure!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSelectionPage;
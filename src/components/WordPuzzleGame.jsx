import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Lightbulb, Star } from 'lucide-react';




const puzzles = [
  {
    level: 1,
    word: 'TREASURE',
    clue: 'Pirates bury this precious collection of gold and jewels',
    hint: 'T _ _ _ _ _ _ _'
  },
  {
    level: 2,
    word: 'COMPASS',
    clue: 'This magnetic instrument always points to the north',
    hint: 'C _ _ _ _ _ _'
  },
  {
    level: 3,
    word: 'ADVENTURE',
    clue: 'An exciting and daring journey into the unknown',
    hint: 'A _ _ _ _ _ _ _ _'
  },
  {
    level: 4,
    word: 'LEGENDARY',
    clue: 'Something famous from ancient stories and myths',
    hint: 'L _ _ _ _ _ _ _ _'
  },
  {
    level: 5,
    word: 'ISLAND',
    clue: 'A piece of land surrounded by water, often the site of hidden treasures',
    hint: 'I _ _ _ _ _'
  },
  {
    level: 6,
    word: 'PARROT',
    clue: 'A colorful bird that often mimics speech and is a pirate’s companion',
    hint: 'P _ _ _ _ _'
  }
];

const WordPuzzleGame = ({ 
  currentLevel, 
  onLevelComplete, 
  navigateToPage 
}) => {
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const currentPuzzle = puzzles.find(p => p.level === Math.min(currentLevel, 6));
  
  useEffect(() => {
    setUserInput('');
    setShowResult(false);
    setIsCorrect(false);
    setShowHint(false);
    setAttempts(0);
  }, [currentLevel]);

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-xl text-gray-400 mb-8">You've completed all levels!</p>
          <button
            onClick={() => navigateToPage('map')}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
          >
            View Your Map
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const isAnswerCorrect = userInput.toUpperCase().trim() === currentPuzzle.word;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setAttempts(prev => prev + 1);

    if (isAnswerCorrect) {
      setTimeout(() => {
          onLevelComplete();
        setShowResult(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigateToPage('selection')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Level {currentPuzzle.level}
              </h1>
              
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentLevel - 1) / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Word Puzzle Challenge</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {currentPuzzle.clue}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="text-3xl font-mono text-yellow-400 bg-gray-800/50 px-6 py-3 rounded-lg border border-yellow-400/30">
                {showHint ? currentPuzzle.hint : `${currentPuzzle.word.length} letters`}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your answer..."
                className="w-full max-w-md px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-center text-xl font-bold uppercase tracking-wider focus:border-yellow-400 focus:outline-none transition-colors duration-300"
                disabled={showResult && isCorrect}
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-600/30 transition-all duration-300"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || (showResult && isCorrect)}
                  className="px-8 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>

          {showResult && (
            <div className={`text-center p-6 rounded-lg border-2 ${
              isCorrect 
                ? 'bg-green-600/20 border-green-400 text-green-400' 
                : 'bg-red-600/20 border-red-400 text-red-400'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                <span className="text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-lg">
                {isCorrect 
                  ? 'You found a piece of the treasure map!' 
                  : `The answer was "${currentPuzzle.word}". Try again!`
                }
              </p>
              {isCorrect && (
                <div className="mt-4 text-yellow-400">
                  <div className="animate-spin w-8 h-8 mx-auto">⭐</div>
                  <p className="text-sm mt-2">Collecting map piece...</p>
                </div>
              )}
            </div>
          )}

          {attempts > 0 && !isCorrect && (
            <div className="text-center text-gray-400 text-sm mt-4">
              Attempts: {attempts}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordPuzzleGame;
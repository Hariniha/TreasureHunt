import React, { useState, useEffect } from 'react';

// Mock data: 4 number/code breaking puzzles
const codePuzzles = [
  {
    level: 1,
    code: '357',
    clue: 'The code is a 3-digit number. The sum of the digits is 15. The digits are all different. The middle digit is 5.',
    length: 3,
  },
  {
    level: 2,
    code: '2468',
    clue: 'The code is a 4-digit even number. All digits are even and increase by 2 each time.',
    length: 4,
  },
  {
    level: 3,
    code: '2025',
    clue: 'The code is a 4-digit year. It is the current year.',
    length: 4,
  },
  {
    level: 4,
    code: '314',
    clue: 'The code is the first three digits of Pi (without the decimal).',
    length: 3,
  },
  {
    level: 5,
    code: '1234',
    clue: 'The code is a 4-digit sequence, each digit increases by 1.',
    length: 4,
  },
  {
    level: 6,
    code: '7777',
    clue: 'The code is a 4-digit number, all digits are the same and lucky.',
    length: 4,
  },
];

const LogicPuzzleGame = ({ currentLevel = 1, onLevelComplete, navigateToPage }) => {
  const puzzle = codePuzzles.find(p => p.level === Math.min(currentLevel, 6));
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setUserInput('');
    setShowResult(false);
    setIsCorrect(false);
    setAttempts(0);
  }, [currentLevel]);

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Congratulations!</h2>
          <p className="text-base sm:text-xl text-gray-400 mb-4 sm:mb-8">You've completed all logic/code breaking levels!</p>
          <button
            onClick={() => navigateToPage('map')}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 text-base sm:text-lg"
          >
            View Your Map
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const isAnswerCorrect = userInput.trim() === puzzle.code;
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
  {showResult && isCorrect && (
    <div className="text-center p-6 rounded-lg border-2 bg-green-600/20 border-green-400 text-green-400 mb-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl font-bold">You found a piece of the treasure map!</span>
      </div>
      <div className="mt-4 text-yellow-400">
        <div className="animate-spin w-8 h-8 mx-auto">⭐</div>
        <p className="text-sm mt-2">Collecting map piece...</p>
      </div>
    </div>
  )}

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-8">
      <div className="max-w-2xl md:max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <button
            onClick={() => navigateToPage('selection')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            ←
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Level {puzzle.level}
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">Code Breaking Challenge</h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              {puzzle.clue}
            </p>
          </div>
          <div className="mb-6 sm:mb-8 flex flex-col items-center gap-3 sm:gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/\D/g, '').slice(0, puzzle.length))}
              onKeyPress={handleKeyPress}
              placeholder={`Enter ${puzzle.length}-digit code...`}
              className="w-full max-w-xs sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-center text-lg sm:text-xl font-bold tracking-wider focus:border-yellow-400 focus:outline-none transition-colors duration-300"
              disabled={showResult && isCorrect}
            />
            <button
              onClick={handleSubmit}
              disabled={userInput.length !== puzzle.length || (showResult && isCorrect)}
              className="px-5 sm:px-8 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
            >
              Submit Code
            </button>
          </div>
          {showResult && (
            <div className={`text-center p-4 sm:p-6 rounded-lg border-2 ${
              isCorrect 
                ? 'bg-green-600/20 border-green-400 text-green-400' 
                : 'bg-red-600/20 border-red-400 text-red-400'
            }`}>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <span className="text-lg sm:text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-base sm:text-lg">
                {isCorrect 
                  ? 'You cracked the code and found a map piece!' 
                  : `The code was "${puzzle.code}". Try again!`
                }
              </p>
            </div>
          )}
          {attempts > 0 && !isCorrect && (
            <div className="text-center text-gray-400 text-xs sm:text-sm mt-2 sm:mt-4">
              Attempts: {attempts}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogicPuzzleGame;

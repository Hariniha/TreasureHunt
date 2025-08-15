import React, { useState, useEffect } from 'react';

const emojiPuzzles = [
  { level: 1, sequence: ['🌴', '🏝️', '⚓'], question: 'Which emoji comes next?', options: ['🦜', '⚓', '🌴', '🏝️'], answer: '🦜' },
  { level: 2, sequence: ['💎', '🪙', '🗺️'], question: 'Which emoji comes next?', options: ['🧭', '🗺️', '💎', '🪙'], answer: '🧭' },
  { level: 3, sequence: ['🚢', '🦑', '🦈'], question: 'Which emoji comes next?', options: ['🦀', '🦑', '🚢', '🦈'], answer: '🦀' },
  { level: 4, sequence: ['🧜‍♀️', '🦜', '🏆'], question: 'Which emoji comes next?', options: ['🪙', '🏆', '🦜', '🧜‍♀️'], answer: '🪙' },
  { level: 5, sequence: ['🦀', '🧭', '💎'], question: 'Which emoji comes next?', options: ['🗺️', '🦀', '🧭', '💎'], answer: '🗺️' },
  { level: 6, sequence: ['🏝️', '🌴', '🚢'], question: 'Which emoji comes next?', options: ['⚓', '🏝️', '🌴', '🚢'], answer: '⚓' },
];

const EmojiSequenceGame = ({ currentLevel = 1, onLevelComplete, navigateToPage }) => {
  const puzzle = emojiPuzzles.find(e => e.level === Math.min(currentLevel, 6));
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setIsCorrect(false);
    setAttempts(0);
  }, [currentLevel]);

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-xl text-gray-400 mb-8">You've completed all emoji sequence levels!</p>
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
    const isAnswerCorrect = puzzle.options[selected] === puzzle.answer;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 px-2 sm:px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 sm:p-8 flex flex-col gap-4 sm:gap-8">
        <div className="flex items-center gap-2 sm:gap-4 mb-4">
          <button
            onClick={() => navigateToPage('selection')}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            ←
          </button>
          <h1 className="flex-1 text-xl sm:text-2xl font-bold text-orange-700 text-center">Level {puzzle.level}</h1>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-8 mb-4 flex flex-col gap-4">
          <h2 className="text-lg sm:text-2xl font-bold text-center text-orange-700 mb-2">Emoji Sequence</h2>
          <div className="text-3xl sm:text-4xl flex justify-center gap-2 mb-2">
            {puzzle.sequence.map((emoji, idx) => <span key={idx}>{emoji}</span>)}
          </div>
          <p className="text-gray-600 text-base sm:text-lg text-center mb-2">{puzzle.question}</p>
          <div className="flex flex-col gap-2 w-full items-center">
            {puzzle.options.map((option, idx) => (
              <button
                key={option}
                className={`w-full max-w-md px-4 py-2 rounded-lg border text-base sm:text-lg font-semibold transition-all duration-200 focus:outline-none
                  ${selected === idx ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'bg-white text-gray-800 border-gray-300 hover:bg-yellow-100'}
                  ${(showResult && idx === selected && !isCorrect) ? 'border-red-400 text-red-500' : ''}
                  ${(showResult && idx === selected && isCorrect) ? 'border-green-400 text-green-600' : ''}
                `}
                onClick={() => !showResult && setSelected(idx)}
                disabled={showResult}
              >
                {option}
              </button>
            ))}
            <button
              onClick={handleSubmit}
              disabled={selected === null || showResult}
              className="w-full max-w-md px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Submit Answer
            </button>
          </div>
          {showResult && (
            <div className={`text-center p-4 sm:p-6 rounded-lg border-2 mt-2 ${
              isCorrect 
                ? 'bg-green-100 border-green-400 text-green-700' 
                : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-base sm:text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-base sm:text-lg">
                {isCorrect 
                  ? 'You completed the emoji sequence and found a map piece!' 
                  : `The answer was "${puzzle.answer}". Try again!`
                }
              </p>
            </div>
          )}
          {attempts > 0 && !isCorrect && (
            <div className="text-center text-gray-400 text-xs sm:text-sm mt-2">
              Attempts: {attempts}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiSequenceGame;

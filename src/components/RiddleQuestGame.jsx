import React, { useState, useEffect } from 'react';

const riddles = [
  { level: 1, question: 'What has keys but can’t open locks?', answer: 'piano' },
  { level: 2, question: 'What has a heart that doesn’t beat?', answer: 'artichoke' },
  { level: 3, question: 'What can travel around the world while staying in a corner?', answer: 'stamp' },
  { level: 4, question: 'What gets wetter the more it dries?', answer: 'towel' },
  { level: 5, question: 'What has a neck but no head?', answer: 'bottle' },
  { level: 6, question: 'What has hands but can’t clap?', answer: 'clock' },
];

const RiddleQuestGame = ({ currentLevel = 1, onLevelComplete, navigateToPage }) => {
  const puzzle = riddles.find(r => r.level === Math.min(currentLevel, 6));
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-xl text-gray-400 mb-8">You've completed all riddle levels!</p>
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
    const isAnswerCorrect = userInput.trim().toLowerCase() === puzzle.answer;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    if (isAnswerCorrect) {
      setTimeout(() => {
        onLevelComplete(currentLevel);
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
            ←
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Level {puzzle.level}
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Riddle Quest</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {puzzle.question}
            </p>
          </div>
          <div className="mb-8 flex flex-col items-center gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer..."
              className="w-full max-w-md px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-center text-xl font-bold tracking-wider focus:border-yellow-400 focus:outline-none transition-colors duration-300"
              disabled={showResult && isCorrect}
            />
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim() || (showResult && isCorrect)}
              className="px-8 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          </div>
          {showResult && (
            <div className={`text-center p-6 rounded-lg border-2 ${
              isCorrect 
                ? 'bg-green-600/20 border-green-400 text-green-400' 
                : 'bg-red-600/20 border-red-400 text-red-400'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-lg">
                {isCorrect 
                  ? 'You solved the riddle and found a map piece!' 
                  : `The answer was "${puzzle.answer}". Try again!`
                }
              </p>
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

export default RiddleQuestGame;

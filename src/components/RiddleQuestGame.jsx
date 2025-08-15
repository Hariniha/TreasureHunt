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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-2 sm:px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 sm:p-8 flex flex-col gap-4 sm:gap-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-700 mb-2 sm:mb-4">Riddle Quest</h2>
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="text-base sm:text-lg font-medium text-gray-700 text-center break-words">
            {riddles[currentRiddleIndex]?.question}
          </div>
          <input
            type="text"
            className="mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base sm:text-lg w-full"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Type your answer..."
            autoFocus
          />
          <button
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={isAnswerCorrect}
          >
            Submit
          </button>
          {showFeedback && (
            <div className={`mt-2 text-center font-semibold ${isAnswerCorrect ? 'text-green-600' : 'text-red-500'}`}>{feedbackMessage}</div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-4">
          <div className="text-sm sm:text-base text-gray-600">Riddle {currentRiddleIndex + 1} of {riddles.length}</div>
          <div className="flex gap-2">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg text-xs sm:text-sm"
              onClick={handlePrevRiddle}
              disabled={currentRiddleIndex === 0}
            >
              Previous
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg text-xs sm:text-sm"
              onClick={handleNextRiddle}
              disabled={currentRiddleIndex === riddles.length - 1}
            >
              Next
            </button>
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all duration-300"
              style={{ width: `${((currentRiddleIndex + 1) / riddles.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiddleQuestGame;

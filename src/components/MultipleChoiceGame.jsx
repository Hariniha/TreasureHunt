import React, { useState, useEffect } from 'react';

// Mock data: 4 multiple choice questions
const mcqPuzzles = [
  {
    level: 1,
    question: 'Which direction does a compass needle always point?',
    options: ['East', 'West', 'North', 'South'],
    answer: 'North',
  },
  {
    level: 2,
    question: 'What is typically found at the end of a treasure map?',
    options: ['A cave', 'A ship', 'An X', 'A compass'],
    answer: 'An X',
  },
  {
    level: 3,
    question: 'Which of these is NOT a type of gemstone?',
    options: ['Ruby', 'Emerald', 'Sapphire', 'Papaya'],
    answer: 'Papaya',
  },
  {
    level: 4,
    question: 'What do pirates traditionally say?',
    options: ['Meow', 'Arrr!', 'Yippee!', 'Bonjour'],
    answer: 'Arrr!',
  },
  {
    level: 5,
    question: 'Which animal is often seen on a pirate’s shoulder?',
    options: ['Cat', 'Parrot', 'Dog', 'Monkey'],
    answer: 'Parrot',
  },
  {
    level: 6,
    question: 'What do you need to unlock a treasure chest?',
    options: ['A map', 'A key', 'A sword', 'A ship'],
    answer: 'A key',
  },
];

const MultipleChoiceGame = ({ currentLevel = 1, onLevelComplete, navigateToPage }) => {
  const puzzle = mcqPuzzles.find(p => p.level === Math.min(currentLevel, 6));
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
          <p className="text-xl text-gray-400 mb-8">You've completed all multiple choice levels!</p>
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
            <h2 className="text-2xl font-bold text-white mb-4">Multiple Choice Challenge</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {puzzle.question}
            </p>
          </div>
          <div className="mb-8 flex flex-col items-center gap-4">
            {puzzle.options.map((option, idx) => (
              <button
                key={option}
                className={`w-full max-w-md px-4 py-3 rounded-lg border text-lg font-semibold transition-all duration-200 focus:outline-none
                  ${selected === idx ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'bg-gray-800 text-white border-gray-600 hover:bg-yellow-400/20 hover:text-yellow-300'}
                  ${(showResult && idx === selected && !isCorrect) ? 'border-red-400 text-red-400' : ''}
                  ${(showResult && idx === selected && isCorrect) ? 'border-green-400 text-green-400' : ''}
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
              className="px-8 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
                  ? 'You answered correctly and found a map piece!' 
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

export default MultipleChoiceGame;

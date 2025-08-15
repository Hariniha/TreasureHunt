import React, { useState, useEffect } from 'react';


const memoryLevels = [
  {
    level: 1,
    pairs: [
      { id: 1, value: '🌴' },
      { id: 2, value: '🏝️' },
      { id: 3, value: '⚓' },
      { id: 4, value: '🦜' },
    ],
  },
  {
    level: 2,
    pairs: [
      { id: 1, value: '💎' },
      { id: 2, value: '🪙' },
      { id: 3, value: '🗺️' },
      { id: 4, value: '🧭' },
    ],
  },
  {
    level: 3,
    pairs: [
      { id: 1, value: '🚢' },
      { id: 2, value: '🦑' },
      { id: 3, value: '🦈' },
      { id: 4, value: '🦀' },
    ],
  },
  {
    level: 4,
    pairs: [
      { id: 1, value: '🧜‍♀️' },
      { id: 2, value: '🦜' },
      { id: 3, value: '🏆' },
      { id: 4, value: '🪙' },
    ],
  },
  {
    level: 5,
    pairs: [
      { id: 1, value: '🦜' },
      { id: 2, value: '🦀' },
      { id: 3, value: '🧭' },
      { id: 4, value: '💎' },
    ],
  },
  {
    level: 6,
    pairs: [
      { id: 1, value: '🏝️' },
      { id: 2, value: '🗺️' },
      { id: 3, value: '🚢' },
      { id: 4, value: '🌴' },
    ],
  },
];

function shuffle(array) {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...item }) => item);
}

const MemoryMatchGame = ({ currentLevel = 1, onLevelComplete, navigateToPage }) => {
  const levelData = memoryLevels.find((l) => l.level === Math.min(currentLevel, 6)) || memoryLevels[0];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Duplicate and shuffle cards
    const deck = shuffle([...levelData.pairs, ...levelData.pairs].map((card, idx) => ({ ...card, key: idx })));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setCompleted(false);
  setShowResult(false);
  setIsCorrect(false);
  }, [currentLevel]);

  useEffect(() => {
    if (matched.length === levelData.pairs.length * 2 && matched.length > 0) {
      setCompleted(true);
      setShowResult(true);
      setIsCorrect(true);
      setTimeout(() => {
        if (onLevelComplete) onLevelComplete();
        setShowResult(false);
      }, 2000);
    }
  }, [matched, levelData, currentLevel, onLevelComplete]);

  const handleFlip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].id === cards[second].id) {
        setTimeout(() => {
          setMatched((prev) => [...prev, first, second]);
          setFlipped([]);
        }, 700);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-8">
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigateToPage && navigateToPage('selection')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex-1">Memory Match - Level {levelData.level}</h1>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <button
                key={card.key}
                className={`aspect-square w-full text-2xl sm:text-4xl flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                  isFlipped ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : 'bg-gray-800 border-gray-700 text-gray-800'
                } ${matched.includes(idx) ? 'opacity-60' : ''}`}
                onClick={() => handleFlip(idx)}
                disabled={isFlipped || completed}
              >
                {isFlipped ? card.value : '?'}
              </button>
            );
          })}
        </div>
        <div className="text-center text-gray-300 mb-2 sm:mb-4 text-sm sm:text-base">Moves: {moves}</div>
        {completed && (
          <div className="text-center text-green-400 font-bold text-lg sm:text-xl mb-2 sm:mb-4">Level Complete!</div>
        )}
        {currentLevel > 6 || completed && (
          <div className="text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Congratulations!</h2>
            <p className="text-base sm:text-xl text-gray-400 mb-4 sm:mb-8">You've completed all memory match levels!</p>
            <button
              onClick={() => navigateToPage('map')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 text-base sm:text-lg"
            >
              View Your Map
            </button>
          </div>
        )}
        {/* Show result after completion */}
        {showResult && isCorrect && (
          <div className="text-center p-4 sm:p-6 rounded-lg border-2 bg-green-600/20 border-green-400 text-green-400 mb-2 sm:mb-4">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span className="text-base sm:text-xl font-bold">You found a piece of the treasure map!</span>
            </div>
            <div className="mt-2 sm:mt-4 text-yellow-400">
              <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 mx-auto">⭐</div>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Collecting map piece...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatchGame;

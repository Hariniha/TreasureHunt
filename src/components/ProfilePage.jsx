import React from 'react';

const GAME_NAMES = {
  wordPuzzle: 'Word Puzzle',
  memoryMatch: 'Memory Match',
  logicPuzzle: 'Logic Puzzle',
  multipleChoice: 'Multiple Choice',
  riddleQuest: 'Riddle Quest',
  emojiSequence: 'Emoji Sequence',
};

const ProfilePage = ({ userProgress, navigateToPage }) => {
  // Find which game the NFT was claimed for (if you store this info, otherwise fallback to first completed)
  // Here, we assume the NFT is for the first game where all pieces are collected
  let completedGame = null;
  let finalImageHash = null;
  if (userProgress) {
    for (const key of Object.keys(GAME_NAMES)) {
      const pieces = userProgress[`${key}Pieces`];
      if (pieces && pieces.every(p => p.collected)) {
        completedGame = key;
        finalImageHash = userProgress[`${key}FinalImage`];
        break;
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Profile</h1>
        {!userProgress?.hasClaimedNFT ? (
          <div>
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-xl text-orange-400 font-bold mb-2">NFT Not Claimed</div>
            <p className="text-gray-400 mb-6">Complete all levels in a game and claim your NFT to see it here!</p>
          </div>
        ) : (
          <div>
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-2xl text-green-400 font-bold mb-2">NFT Claimed!</div>
            {finalImageHash && (
              <div className="mb-4">
                <img
                  src={`https://ipfs.io/ipfs/${finalImageHash}`}
                  alt="Full Map"
                  className="w-64 h-64 object-contain mx-auto rounded shadow-lg border-4 border-yellow-400 bg-white"
                />
                <div className="text-lg text-white mt-2">Full Map Image</div>
              </div>
            )}
            {/* NFT image could be the same as the map, or a separate field if you have it */}
            {finalImageHash && (
              <div className="mb-4">
                <img
                  src={`https://ipfs.io/ipfs/${finalImageHash}`}
                  alt="NFT"
                  className="w-32 h-32 object-contain mx-auto rounded border-2 border-purple-400 bg-white"
                />
                <div className="text-md text-purple-300 mt-2">NFT Image</div>
              </div>
            )}
            <div className="text-lg text-white font-semibold mt-2">
              Game: {completedGame ? GAME_NAMES[completedGame] : 'Unknown'}
            </div>
          </div>
        )}
        <button
          onClick={() => navigateToPage('home')}
          className="mt-8 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
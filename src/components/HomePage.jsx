import React from 'react';
import { Compass, Trash as Treasure, Sparkles } from 'lucide-react';



const HomePage = ({ navigateToPage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-white mb-6 ">
          Treasure Hunt
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8  mx-auto leading-relaxed text-center">
          🧩 Solve puzzles to find pieces of an old treasure map<br/>🏆Collect all the pieces and prove you completed the quest!
        </p>


        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="flex items-center gap-2 text-white px-4 py-2 bg- rounded-full">
            <Compass className="w-5 h-5" />
            <span>4 Challenging Levels</span>
          </div>
          <div className="flex items-center gap-2 text-white py-2 rounded-full">
            <Sparkles className="w-5 h-5" />
            <span>Collectible Map Pieces</span>
          </div>
          <div className="flex items-center gap-2 text-white py-2 rounded-full">
            <Treasure className="w-5 h-5" />
            <span>Unique NFT Reward</span>
          </div>
        </div>

        <button
          onClick={() => navigateToPage('selection')}
          className="group relative px-12 py-4 bg-yellow-400  text-gray-900 font-bold text-xl rounded-full overflow-hidden transition-all duration-300 hover:from-yellow-300 hover:to-orange-400 hover:shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10">Let's Start the Hunt!</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
        </button>

        <div className="mt-16 text-gray-400 text-sm">
          <p>Powered by Web3 • IPFS Storage • Smart Contracts</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { Compass, Trophy, Sparkles, Map, Star, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: "4 Epic Levels",
    description: "Each level brings unique challenges and hidden secrets",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Map Fragments",
    description: "Collect rare pieces to complete the legendary treasure map",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: Trophy,
    title: "NFT Reward",
    description: "Earn a unique digital treasure as proof of your victory",
    gradient: "from-yellow-400 to-orange-500",
  }
];

const HomePage = ({ navigateToPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden text-white pt-16">
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-emerald-400 opacity-20 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Logo */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 rounded-full blur-3xl opacity-30 animate-pulse w-32 h-32 mx-auto"></div>
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500 shadow-lg shadow-emerald-500/40">
              <Map className="w-12 h-12 text-slate-900" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-green-300 mb-2 tracking-tight">
            TREASURE
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-400 tracking-wide mb-8">
            HUNT
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            🧩 <span className="text-white font-medium">Solve puzzles</span> to uncover ancient map fragments
          </p>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-2 leading-relaxed">
            🏆 <span className="text-white font-medium">Collect all pieces</span> to unlock your legendary NFT
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 my-12 max-w-4xl mx-auto">
            {features.map(({ icon: Icon, title, description, gradient }, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <button
              onClick={() => navigateToPage('selection')}
              className="group relative px-14 py-5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-green-300 text-slate-900 font-black text-xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 border-2 border-emerald-300/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              <span className="relative z-10 flex items-center gap-3">
                Start Your Quest
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-slate-500 text-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span>⚡ Web3 Powered</span>
              <span>•</span>
              <span>IPFS Storage</span>
              <span>•</span>
              <span>Smart Contracts</span>
            </div>
            <p className="text-xs text-slate-600">A journey where cryptography meets adventure</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;

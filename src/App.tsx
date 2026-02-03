import { useState } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Experience } from '@/components/sections/Experience';
import { SkillsInteractive } from '@/components/sections/SkillsInteractive';
import { SocialInteractive } from '@/components/sections/SocialInteractive';
import { Roadmap } from '@/components/sections/Roadmap';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { SystemMonitor } from '@/components/ui/SystemMonitor';
import { ResumeDownloader } from '@/components/ui/ResumeDownloader';
import { LandingOverlay } from '@/components/LandingOverlay';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <div className="min-h-screen bg-grid font-sans selection:bg-term-blue selection:text-white pb-20">
      <AnimatePresence>
        {showLanding && (
          <LandingOverlay onEnter={() => setShowLanding(false)} />
        )}
      </AnimatePresence>
      
      <div className="scanline"></div>
      <CommandPalette />
      <SystemMonitor />
      <ResumeDownloader />
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-[#161b22] border-b border-term-gray flex items-center px-4 z-50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="mx-auto text-xs text-gray-500 font-mono hidden sm:block">linhongji@portfolio:~</div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <Hero />
        <Experience />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div id="skills">
            <SkillsInteractive />
          </div>
          <div id="social">
            <SocialInteractive />
          </div>
        </div>
        
        <Roadmap />
        
        <footer className="text-center text-gray-600 text-sm py-8 border-t border-term-gray/30 mt-20 font-mono">
          <p>© 2026 Lin Hongji. All Systems Operational.</p>
          <p className="text-xs mt-2">Built with React + Tailwind + Framer Motion</p>
        </footer>
      </main>
    </div>
  );
}

export default App;

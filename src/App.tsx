import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Hero } from '@/components/sections/Hero';
import { Experience } from '@/components/sections/Experience';
import { SocialInteractive } from '@/components/sections/SocialInteractive';
import { Roadmap } from '@/components/sections/Roadmap';
import { SkillTree } from '@/components/sections/SkillTree';
import { AchievementsPanel } from '@/components/sections/AchievementsPanel';
import { ProjectArchaeology } from '@/components/sections/ProjectArchaeology';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { SystemMonitor } from '@/components/ui/SystemMonitor';
import { ResumeDownloader } from '@/components/ui/ResumeDownloader';
import { LandingOverlay } from '@/components/LandingOverlay';
import { AnimatePresence } from 'framer-motion';
import { createInitialState, restoreStateFromJSON } from '@/data/skillTreeData';
import { SkillTreeState } from '@/types/skillTree';

function MainContent() {
  const [showLanding, setShowLanding] = useState(true);
  const [skillTreeState, setSkillTreeState] = useState<SkillTreeState>(() => {
    // 初始化为默认状态（开发者等级固定为1）
    const initial = createInitialState();

    // 尝试从 localStorage 读取保存的状态
    const saved = localStorage.getItem('skillTreeState');
    if (saved) {
      try {
        const restored = restoreStateFromJSON(saved);
        // 验证恢复的数据是否有效
        if (restored && restored.skills.size > 0) {
          return restored;
        }
      } catch {
        console.warn('Failed to restore skill tree state, using default');
      }
    }
    return initial;
  });

  // 保存状态到 localStorage
  useEffect(() => {
    localStorage.setItem('skillTreeState', JSON.stringify(skillTreeState));
  }, [skillTreeState]);

  return (
    <>
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

        {/* 技能树系统 - 替代原先的 SkillsInteractive */}
        <div className="grid grid-cols-1 gap-8 mb-20">
          <SkillTree
            gameState={skillTreeState}
            setGameState={setSkillTreeState}
          />
          
          {/* 成就面板 - 紧接技能树 */}
          <AchievementsPanel
            achievements={skillTreeState.achievements}
            unlockedAchievements={skillTreeState.unlockedAchievements}
          />
        </div>

        {/* <Roadmap /> */}

        {/* 连接区域 - 移到页面底部 */}
        <div id="connect">
          <SocialInteractive />
        </div>

        <footer className="text-center text-gray-600 text-sm py-8 border-t border-term-gray/30 mt-20 font-mono">
          <p>© 2026 Lin Hongji. All Systems Operational.</p>
          <p className="text-xs mt-2">Built with React + Tailwind + Framer Motion</p>
        </footer>
      </main>
    </>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-grid font-sans selection:bg-term-blue selection:text-white pb-20">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainContent />} />
          <Route path="/archaeology/:projectId" element={<ProjectArchaeology />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

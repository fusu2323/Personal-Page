import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { SkillNode, SkillTreeState, Achievement } from '@/types/skillTree';
import { getExpForLevel, calculatePlayerLevel } from '@/data/skillTreeData';
import { TerminalWindow } from '../ui/TerminalWindow';
import { cn } from '@/lib/utils';

interface SkillTreeProps {
  gameState: SkillTreeState;
  setGameState: React.Dispatch<React.SetStateAction<SkillTreeState>>;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ gameState, setGameState }) => {
  const [stage, setStage] = useState<'idle' | 'loading' | 'streaming' | 'tree'>('idle');
  const [streamedLines, setStreamedLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [animatingSkill, setAnimatingSkill] = useState<string | null>(null);
  const { playType, playEnter, playExpand } = useSound();

  // 检查技能是否可解锁
  const isSkillUnlocked = useCallback((skill: SkillNode): boolean => {
    if (skill.unlocked) return true;
    if (!skill.prerequisites) return false;
    return skill.prerequisites.every(prereqId => {
      const prereq = gameState.skills.get(prereqId);
      return prereq && prereq.unlocked && prereq.level >= 2;
    });
  }, [gameState.skills]);

  // 添加经验值
  const addExp = useCallback((skillId: string, amount: number) => {
    setAnimatingSkill(skillId);
    playExpand();

    setGameState(prev => {
      const newSkills = new Map(prev.skills);
      const skill = newSkills.get(skillId);

      if (!skill) return prev;

      const newSkill = { ...skill };
      let newTotalExp = prev.totalExp;
      let remaining = amount;

      while (remaining > 0) {
        const expToLevel = newSkill.maxExp - newSkill.currentExp;

        if (remaining >= expToLevel) {
          remaining -= expToLevel;
          newSkill.currentExp = 0;
          newSkill.level++;
          newSkill.maxExp = getExpForLevel(newSkill.level);
          newTotalExp += newSkill.maxExp;
        } else {
          newSkill.currentExp += remaining;
          remaining = 0;
        }
      }

      newSkills.set(skillId, newSkill);

      // 检查是否可以解锁其他技能
      newSkills.forEach((s) => {
        if (!s.unlocked && isSkillUnlocked(s)) {
          s.unlocked = true;
          playEnter();
        }
      });

      // 计算新玩家等级
      const newPlayerLevel = calculatePlayerLevel(newTotalExp);

      // 检查成就 - 检查所有符合条件的成就
      const newAchievements = new Map(prev.achievements);
      let newlyUnlocked: Achievement[] = [];

      for (const achievement of newAchievements.values()) {
        if (!achievement.unlocked && achievement.unlockCondition(newSkills, newPlayerLevel)) {
          achievement.unlocked = true;
          newlyUnlocked.push(achievement);
        }
      }

      const newState: SkillTreeState = {
        ...prev,
        skills: newSkills,
        achievements: newAchievements,
        totalExp: newTotalExp,
        playerLevel: newPlayerLevel,
        unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked.map(a => a.id)],
      };

      return newState;
    });

    setTimeout(() => setAnimatingSkill(null), 1000);
  }, [playExpand, playEnter, isSkillUnlocked]);

  // Loading Effect
  useEffect(() => {
    if (stage === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          // 确保 progress 是有效数字
          const currentProgress = typeof prev === 'number' ? prev : 0;

          if (currentProgress >= 100) {
            clearInterval(interval);
            setStage('streaming');
            return 100;
          }
          playType();
          return currentProgress + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage, playType]);

  // Streaming Effect
  useEffect(() => {
    if (stage === 'streaming') {
      const allLines = [
        "> Loading skill tree database...",
        "> Parsing skill categories...",
        "> Initializing RPG system...",
        "> Loading achievement data...",
        "Done. Ready to start adventure!"
      ];

      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex >= allLines.length) {
          clearInterval(interval);
          setTimeout(() => {
            playExpand();
            setStage('tree');
          }, 500);
          return;
        }
        setStreamedLines(prev => [...prev, allLines[lineIndex]]);
        playEnter();
        lineIndex++;
      }, 250);
      return () => clearInterval(interval);
    }
  }, [stage, playEnter, playExpand]);

  // 监控成就解锁并显示通知 - 支持多个成就同时解锁
  useEffect(() => {
    if (stage === 'tree') {
      // 比较之前和现在的成就状态，找出新解锁的成就
      const previouslyUnlocked = new Set(gameState.unlockedAchievements.slice(-10));
      const currentlyUnlocked = gameState.unlockedAchievements;

      // 找出新解锁的成就
      const newUnlocked = currentlyUnlocked.filter(id => !previouslyUnlocked.has(id));

      // 依次显示新解锁的成就通知
      newUnlocked.forEach((achievementId, index) => {
        setTimeout(() => {
          const achievement = gameState.achievements.get(achievementId);
          if (achievement && achievement.unlocked) {
            setShowAchievement(achievement);
          }
        }, index * 1500); // 每个成就间隔1.5秒显示
      });
    }
  }, [stage, gameState.unlockedAchievements, gameState.achievements]);

  // 显示成就解锁动画
  useEffect(() => {
    if (showAchievement) {
      playExpand();
      const timer = setTimeout(() => setShowAchievement(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement, playExpand]);

  // 渲染进度条（字符风格）
  const renderProgressBar = (current: number, max: number, level: number) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const totalBars = 15; // 总格数
    const filledBars = Math.floor((percentage / 100) * totalBars);
    
    const colorClass = level >= 10 ? 'text-yellow-500' :
                       level >= 7 ? 'text-purple-500' :
                       level >= 5 ? 'text-blue-500' :
                       'text-term-green';

    return (
      <div className={cn("font-mono text-[10px] tracking-tight flex items-center gap-2", colorClass)}>
        <span>[{'#'.repeat(filledBars)}{'.'.repeat(totalBars - filledBars)}]</span>
        <span>{Math.floor(percentage)}%</span>
      </div>
    );
  };

  // 渲染单个技能节点
  const renderSkillNode = (skill: SkillNode, index: number) => {
    const isAnimating = animatingSkill === skill.id;

    // 根据技能等级设置边框颜色
    const getBorderColor = () => {
      if (!skill.unlocked) return 'border-gray-800 border-dashed';
      if (skill.level >= 10) return 'border-yellow-500';
      if (skill.level >= 7) return 'border-purple-500';
      if (skill.level >= 5) return 'border-blue-500';
      return 'border-term-green';
    };

    return (
      <motion.div
        key={skill.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: skill.unlocked ? 1 : 0.5, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        whileHover={skill.unlocked ? { scale: 1.02 } : {}}
        className={cn(
          'relative p-3 border transition-all duration-200 group select-none',
          skill.unlocked
            ? 'bg-black/40 hover:bg-term-gray/20 cursor-pointer'
            : 'bg-black/20 cursor-not-allowed grayscale',
          getBorderColor(),
          isAnimating && 'bg-term-gray/40'
        )}
        onClick={() => skill.unlocked && addExp(skill.id, 20)}
      >
        {/* 角标装饰 */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />

        {/* 技能头部 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{skill.icon}</span>
            <div>
              <div className={cn(
                "font-mono font-bold text-sm",
                skill.unlocked ? "text-gray-200" : "text-gray-600"
              )}>
                {skill.name}
              </div>
              <div className="text-[10px] text-gray-500 font-mono truncate max-w-[120px]">
                {skill.description}
              </div>
            </div>
          </div>
          
          {/* 等级显示 */}
          <div className={cn(
            "font-mono text-xs px-1.5 py-0.5 border",
            skill.unlocked 
              ? "border-current text-current" 
              : "border-gray-700 text-gray-700"
          )}>
            Lv.{String(skill.level).padStart(2, '0')}
          </div>
        </div>

        {/* 进度条与经验值 */}
        {skill.unlocked ? (
          <div className="space-y-1">
            {renderProgressBar(skill.currentExp, skill.maxExp, skill.level)}
            
            {/* 经验值浮动动画 */}
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  initial={{ opacity: 1, y: 0, x: 0 }}
                  animate={{ opacity: 0, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-2 bottom-2 text-xs font-mono text-term-green font-bold z-10"
                >
                  +20 EXP
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* 锁定状态显示前置条件 */
          <div className="mt-2 text-[10px] font-mono text-red-400/80 border border-red-900/30 bg-red-900/10 p-1.5">
            [LOCKED] REQ: {skill.prerequisites?.map(p => gameState.skills.get(p)?.name).join(' & ')}
          </div>
        )}
      </motion.div>
    );
  };

  // 按分类组织技能
  const skillsByCategory = React.useMemo(() => {
    const categories: Record<string, SkillNode[]> = {};
    Array.from(gameState.skills.values()).forEach((skill) => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    return categories;
  }, [gameState.skills]);

  const categoryNames: Record<string, string> = {
    backend: '后端开发',
    middleware: '中间件',
    frontend: '前端开发',
    devops: 'DevOps',
    tools: '开发工具',
  };

  const renderTreeState = () => {
    // 检测状态是否有效
    const isStateValid = gameState.skills.size > 0 && gameState.achievements.size > 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono flex items-center gap-3">
          <div>mode: rpg_system</div>
          {/* 重置按钮 - 仅当状态损坏时显示 */}
          {!isStateValid && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm('确定要重置技能树状态吗？这将清除所有进度。')) {
                  const fresh = createInitialState();
                  setGameState(fresh);
                  localStorage.setItem('skillTreeState', JSON.stringify(fresh));
                }
              }}
              className="px-2 py-1 bg-red-500/20 hover:bg-red-600 text-white text-xs rounded transition-colors"
            >
              🔄 重置
            </motion.button>
          )}
        </div>

        <div className="space-y-6 pt-2">
          {/* 玩家信息 */}
          <div className="bg-term-gray/20 rounded-lg p-3 border border-term-blue/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">开发者等级</span>
                  <span className={cn(
                    'font-mono font-bold text-lg',
                    gameState.playerLevel >= 10 ? 'text-yellow-400' : 'text-term-blue'
                  )}>
                    Lv.{gameState.playerLevel}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {gameState.totalExp} EXP
              </div>
            </div>
          </div>

          {/* 技能树 */}
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, skills]) => {
              const unlockedCount = skills.filter(s => s.unlocked).length;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-term-blue"
                    />
                    <h3 className="text-term-blue font-bold text-sm uppercase tracking-wider">
                      {categoryNames[category] || category}
                      <span className="text-gray-500 ml-2">({unlockedCount}/{skills.length})</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill, index) => renderSkillNode(skill, index))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 操作提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-500 space-y-1 pt-4 border-t border-term-gray/30"
          >
            <p>💡 点击已解锁技能获取 20 EXP</p>
            <p>⚡ 升级技能可解锁新能力</p>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="mb-20">
      <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/skill-tree
      </div>

      <TerminalWindow
        title="user@linhongji: ~/skill-tree"
        className={cn(
          "min-h-[400px] transition-all duration-500",
          stage === 'idle' ? "cursor-pointer hover:border-term-blue" : ""
        )}
      >
        <div onClick={() => stage === 'idle' && setStage('loading')} className="h-full">
          {/* Idle State */}
          {stage === 'idle' && (
            <div className="h-full flex flex-col justify-center items-center text-gray-500 group">
              <span className="text-term-green text-lg mb-2 group-hover:animate-pulse">$ ./start_skill_tree.sh</span>
              <span className="text-xs">[ Click to Execute ]</span>
            </div>
          )}

          {/* Loading State */}
          {stage === 'loading' && (
            <div className="font-mono text-sm">
              <div className="mb-2 text-term-blue">Loading skill tree...</div>
              <div className="text-term-green">
                [{Array(Math.floor(progress / 5)).fill('=').join('')}{Array(20 - Math.floor(progress / 5)).fill(' ').join('')}] {progress}%
              </div>
            </div>
          )}

          {/* Streaming State */}
          {stage === 'streaming' && (
            <div className="font-mono text-sm space-y-0.5">
              {streamedLines.map((line, i) => (
                <div key={i} className="text-gray-300">{line}</div>
              ))}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-term-green inline-block align-middle"
              />
            </div>
          )}

          {/* Tree State */}
          {stage === 'tree' && renderTreeState()}
        </div>
      </TerminalWindow>

      {/* 成就解锁通知 */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-black/95 border-2 border-term-blue rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="text-3xl"
                >
                  {showAchievement.icon}
                </motion.div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider mb-1 text-term-blue">achievement unlocked</div>
                  <div className="font-bold text-white text-sm">{showAchievement.name}</div>
                  <div className="text-gray-300 text-xs">{showAchievement.description}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

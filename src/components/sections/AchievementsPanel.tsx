import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '@/types/skillTree';
import { TerminalWindow } from '../ui/TerminalWindow';
import { cn } from '@/lib/utils';

interface AchievementsPanelProps {
  achievements: Map<string, Achievement>;
  unlockedAchievements: string[];
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  achievements,
  unlockedAchievements
}) => {
  const rarityColors = {
    common: 'from-gray-600 to-gray-700',
    rare: 'from-blue-500 to-blue-700',
    epic: 'from-purple-500 to-purple-700',
    legendary: 'from-yellow-500 to-orange-600',
  };

  const rarityBorders = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500',
  };

  const rarityText = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  };

  const achievementsArray = Array.from(achievements.values());

  // 字符进度条 helper
  const renderProgressBar = (current: number, max: number) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const totalBars = 20;
    const filledBars = Math.floor((percentage / 100) * totalBars);
    return `[${'#'.repeat(filledBars)}${'.'.repeat(totalBars - filledBars)}] ${Math.floor(percentage)}%`;
  };

  return (
    <section className="mb-20">
      <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/achievements
      </div>

      <TerminalWindow title="user@linhongji: ~/achievements" className="min-h-[400px]">
        <div className="p-4">
          {/* 进度统计 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 border border-term-blue mb-6 p-4 font-mono"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="font-bold text-term-blue uppercase tracking-wider">Achievement Progress</div>
                  <div className="text-xs text-gray-500">
                    UNLOCKED: {unlockedAchievements.length} / {achievementsArray.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-term-green text-sm tracking-tight">
              {renderProgressBar(unlockedAchievements.length, achievementsArray.length)}
            </div>
          </motion.div>

          {/* 成就列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievementsArray.map((achievement, index) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isUnlocked ? 1 : 0.5, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  className={cn(
                    'relative p-4 border-2 transition-all duration-200 group select-none',
                    isUnlocked
                      ? 'bg-black/40 cursor-pointer hover:bg-white/5'
                      : 'bg-black/20 opacity-40 grayscale',
                    isUnlocked ? rarityBorders[achievement.rarity] : 'border-gray-800 border-dashed'
                  )}
                >
                  {/* 稀有度标记 */}
                  {isUnlocked && (
                    <div className={cn(
                      "absolute top-0 right-0 px-1.5 py-0.5 text-[10px] uppercase font-bold border-b border-l",
                      rarityBorders[achievement.rarity],
                      rarityText[achievement.rarity]
                    )}>
                      {achievement.rarity}
                    </div>
                  )}

                  {/* 成就图标 */}
                  <div className={cn(
                    'text-3xl mb-3',
                    isUnlocked ? '' : 'opacity-50'
                  )}>
                    {isUnlocked ? achievement.icon : '🔒'}
                  </div>

                  {/* 成就名称 */}
                  <div className={cn(
                    'font-mono font-bold text-sm mb-1',
                    isUnlocked ? rarityText[achievement.rarity] : 'text-gray-600'
                  )}>
                    {achievement.name}
                  </div>

                  {/* 成就描述 */}
                  <div className="text-[10px] text-gray-500 font-mono leading-tight">
                    {isUnlocked ? achievement.description : '??? (LOCKED)'}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 稀有度图例 */}
          <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-mono border-t border-gray-800 pt-4">
            {Object.entries(rarityText).map(([rarity, colorClass]) => (
              <div key={rarity} className="flex items-center gap-2">
                <div className={cn('w-2 h-2', rarity === 'common' ? 'bg-gray-500' : rarity === 'rare' ? 'bg-blue-500' : rarity === 'epic' ? 'bg-purple-500' : 'bg-yellow-500')} />
                <span className={cn('uppercase', colorClass)}>
                  {rarity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>
    </section>
  );
};

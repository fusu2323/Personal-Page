// 技能树等级系统类型定义

export interface SkillNode {
  id: string;
  name: string;
  category: 'backend' | 'middleware' | 'frontend' | 'devops' | 'tools';
  level: number; // 1-10
  currentExp: number;
  maxExp: number;
  icon: string;
  color: string;
  description: string;
  prerequisites?: string[]; // 前置技能ID
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockCondition: (skills: Map<string, SkillNode>, playerLevel: number) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SkillTreeState {
  skills: Map<string, SkillNode>;
  achievements: Map<string, Achievement>;
  totalExp: number;
  playerLevel: number;
  unlockedAchievements: string[];
}

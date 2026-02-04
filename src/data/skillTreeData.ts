import { SkillNode, Achievement, SkillTreeState } from '@/types/skillTree';

// 技能初始数据
export const initialSkills: SkillNode[] = [
  // Backend Skills
  {
    id: 'java',
    name: 'Java',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '☕',
    color: '#f89820',
    description: '企业级后端开发核心语言',
    unlocked: true,
  },
  {
    id: 'spring-cloud',
    name: 'Spring Cloud',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🌥️',
    color: '#6db33f',
    description: '微服务架构解决方案',
    prerequisites: ['java'],
    unlocked: false,
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🍃',
    color: '#6db33f',
    description: '快速应用开发框架',
    prerequisites: ['java'],
    unlocked: false,
  },
  {
    id: 'mybatis-plus',
    name: 'MyBatis-Plus',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🗄️',
    color: '#ba8e00',
    description: '增强版持久层框架',
    prerequisites: ['java', 'spring-boot'],
    unlocked: false,
  },
  {
    id: 'juc',
    name: 'JUC',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '⚡',
    color: '#ff6b6b',
    description: 'Java并发编程工具包',
    prerequisites: ['java'],
    unlocked: false,
  },
  {
    id: 'jvm',
    name: 'JVM',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🔧',
    color: '#f39c12',
    description: 'Java虚拟机与性能调优',
    prerequisites: ['java'],
    unlocked: false,
  },
  {
    id: 'golang',
    name: 'Golang',
    category: 'backend',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🐹',
    color: '#00add8',
    description: '高性能并发编程语言',
    unlocked: true,
  },

  // Middleware Skills
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'middleware',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🐬',
    color: '#4479a1',
    description: '关系型数据库',
    unlocked: true,
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'middleware',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '💾',
    color: '#dc382d',
    description: '高性能内存数据库',
    unlocked: true,
  },
  {
    id: 'kafka',
    name: 'Kafka',
    category: 'middleware',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '📨',
    color: '#231f20',
    description: '分布式消息队列',
    unlocked: true,
  },

  // DevOps Skills
  {
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🐳',
    color: '#2496ed',
    description: '容器化部署技术',
    unlocked: true,
  },
  {
    id: 'k8s',
    name: 'Kubernetes',
    category: 'devops',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '☸️',
    color: '#326ce5',
    description: '容器编排平台',
    prerequisites: ['docker'],
    unlocked: false,
  },

  // Tools
  {
    id: 'linux',
    name: 'Linux',
    category: 'tools',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '🐧',
    color: '#fcc624',
    description: '服务器操作系统',
    unlocked: true,
  },
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    level: 1,
    currentExp: 0,
    maxExp: 100,
    icon: '📚',
    color: '#f05032',
    description: '版本控制系统',
    unlocked: true,
  },
];

// 成就定义
export const achievements: Achievement[] = [
  {
    id: 'backend-master',
    name: '后端大师',
    description: '精通所有后端技术栈',
    icon: '🏆',
    rarity: 'epic',
    unlocked: false,
    unlockCondition: (skills) => {
      const backendSkills = ['java', 'spring-cloud', 'spring-boot', 'mybatis-plus', 'juc', 'jvm'];
      return backendSkills.every(id => skills.get(id)?.level && skills.get(id)!.level >= 5);
    }
  },
  {
    id: 'middleware-ninja',
    name: '中间件忍者',
    description: '所有中间件达到5级',
    icon: '🥷',
    rarity: 'rare',
    unlocked: false,
    unlockCondition: (skills) => {
      const middlewareSkills = ['mysql', 'redis', 'kafka'];
      return middlewareSkills.every(id => skills.get(id)?.level && skills.get(id)!.level >= 5);
    }
  },
  {
    id: 'container-wizard',
    name: '容器巫师',
    description: '掌握容器编排技术',
    icon: '🧙',
    rarity: 'rare',
    unlocked: false,
    unlockCondition: (skills) => {
      return (skills.get('docker')?.level || 0) >= 5 && (skills.get('k8s')?.level || 0) >= 3;
    }
  },
  {
    id: 'first-boost',
    name: '初次突破',
    description: '首次将任意技能升到2级',
    icon: '🌟',
    rarity: 'common',
    unlocked: false,
    unlockCondition: (skills) => {
      return Array.from(skills.values()).some(skill => skill.level >= 2);
    }
  },
  {
    id: 'full-stack',
    name: '全栈开发者',
    description: '解锁并精通所有技能分类',
    icon: '💎',
    rarity: 'legendary',
    unlocked: false,
    unlockCondition: (skills) => {
      const categories = new Set(Array.from(skills.values()).filter(s => s.level >= 5).map(s => s.category));
      return categories.size >= 4;
    }
  },
  {
    id: 'level-5',
    name: '登堂入室',
    description: '玩家等级达到5级',
    icon: '⭐',
    rarity: 'common',
    unlocked: false,
    unlockCondition: (_skills, playerLevel) => playerLevel >= 5
  },
  {
    id: 'legendary-dev',
    name: '传奇开发者',
    description: '拥有10级技能',
    icon: '👑',
    rarity: 'legendary',
    unlocked: false,
    unlockCondition: (skills) => {
      return Array.from(skills.values()).some(skill => skill.level >= 10);
    }
  },
  {
    id: 'polyglot',
    name: '语言大师',
    description: '掌握多种编程语言',
    icon: '🗣️',
    rarity: 'rare',
    unlocked: false,
    unlockCondition: (skills) => {
      return (skills.get('java')?.level || 0) >= 5 && (skills.get('golang')?.level || 0) >= 5;
    }
  },
];

// 初始化技能树状态
export const createInitialState = (): SkillTreeState => {
  const skillsMap = new Map<string, SkillNode>();
  initialSkills.forEach(skill => {
    skillsMap.set(skill.id, { ...skill });
  });

  const achievementsMap = new Map<string, Achievement>();
  achievements.forEach(achievement => {
    achievementsMap.set(achievement.id, { ...achievement });
  });

  return {
    skills: skillsMap,
    achievements: achievementsMap,
    totalExp: 0,
    playerLevel: 1,
    unlockedAchievements: [],
  };
};

// 从 JSON 恢复状态（处理 Map 序列化问题）
export const restoreStateFromJSON = (jsonString: string): SkillTreeState => {
  const parsed = JSON.parse(jsonString);

  // 将普通对象转换回 Map
  const skillsMap = new Map<string, SkillNode>(
    Object.entries(parsed.skills || {})
  );
  const achievementsMap = new Map<string, Achievement>(
    Object.entries(parsed.achievements || {})
  );

  return {
    ...parsed,
    skills: skillsMap,
    achievements: achievementsMap,
  };
};

// 计算升级所需经验
export const getExpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

// 计算玩家等级
export const calculatePlayerLevel = (totalExp: number): number => {
  let level = 1;
  let required = 100;
  while (totalExp >= required) {
    totalExp -= required;
    level++;
    required = Math.floor(100 * Math.pow(1.15, level - 1));
  }
  return level;
};

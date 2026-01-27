import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from '../ui/Typewriter';

export const Hero: React.FC = () => {
  return (
    <header className="mb-20 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-mono text-lg md:text-xl space-y-4"
      >
        <div className="text-term-blue">
          <span className="text-term-green">➜</span> <span className="text-term-blue">~</span> <span className="text-white">whoami</span>
        </div>
        
        <div className="pl-4 border-l-2 border-term-gray space-y-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">Lin Hongji</h1>
            <p className="text-term-blue text-lg">Backend Developer / Distributed Systems Enthusiast</p>
          </div>
          
          <div className="max-w-2xl text-gray-400 font-sans text-base leading-relaxed h-[80px]">
            <span className="text-term-gray mr-2">$</span>
            <Typewriter 
              text="正在构建高性能、高可用的后端架构。来自南京信息工程大学软件工程实验班。专注于 Java, Spring Cloud, 分布式一致性解决方案。" 
              delay={800} 
              speed={40}
            />
            <span className="inline-block w-2 h-5 bg-term-blue align-middle animate-cursor ml-1"></span>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Links / Command Aliases */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="mt-12 font-mono text-sm grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="p-4 border border-term-gray rounded-lg bg-[#161b22] hover:border-term-blue transition-colors group cursor-pointer select-none">
          <span className="text-term-green">$</span> cat ./skills.json
          <div className="mt-2 text-gray-500 group-hover:text-white transition-colors">
            Java, Spring Cloud, MySQL, Redis, Kafka...
          </div>
        </div>
        <div className="p-4 border border-term-gray rounded-lg bg-[#161b22] hover:border-term-blue transition-colors group cursor-pointer select-none">
          <span className="text-term-green">$</span> ls ./social_links/
          <div className="mt-2 text-gray-500 group-hover:text-white transition-colors">
            github.com, bilibili.com, email...
          </div>
        </div>
      </motion.div>
    </header>
  );
};

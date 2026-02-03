import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from '../ui/Typewriter';
import { Macbook } from '../ui/Macbook';
import { socialLinks } from '@/data/resume';
import { FaGithub, FaEnvelope, FaTv } from 'react-icons/fa6';

const iconMap: Record<string, React.ReactNode> = {
  "github": <FaGithub />,
  "bilibili": <FaTv />,
  "mail": <FaEnvelope />
};

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="mb-20 pt-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-mono text-lg md:text-xl space-y-4 flex-1 w-full"
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
                loop={true}
                pauseBeforeRepeat={5000}
              />
              <span className="inline-block w-2 h-5 bg-term-blue align-middle animate-cursor ml-1"></span>
            </div>
          </div>
        </motion.div>

        {/* 3D Macbook Animation */}
        <motion.div
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1.5 }}
           transition={{ delay: 0.5, duration: 1 }}
           className="hidden lg:flex flex-shrink-0 w-[300px] h-[200px] items-center justify-center mr-10"
        >
           <Macbook />
        </motion.div>
      </div>
      
      {/* Quick Links removed as per user request */}
    </header>
  );
};

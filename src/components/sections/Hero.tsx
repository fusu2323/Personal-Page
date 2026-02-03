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
      
      {/* Quick Links / Command Aliases */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="mt-12 font-mono text-sm grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Skills Card */}
        <div 
          onClick={() => scrollToSection('skills')}
          className="p-4 border border-term-gray rounded-lg bg-[#161b22] hover:border-term-blue hover:bg-[#161b22]/80 transition-all duration-300 group cursor-pointer select-none relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-term-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-term-green">$</span> cat ./skills.json
          <div className="mt-2 text-gray-500 group-hover:text-white transition-colors duration-300">
            Java, Spring Cloud, MySQL, Redis, Kafka...
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-term-blue">
            ↵
          </div>
        </div>

        {/* Social Card - Expanded Functionality */}
        <div 
          onClick={() => scrollToSection('social')}
          className="p-4 border border-term-gray rounded-lg bg-[#161b22] hover:border-term-blue transition-colors group cursor-pointer select-none relative overflow-hidden"
        >
          <div className="flex justify-between items-center relative z-10">
             <div>
                <span className="text-term-green">$</span> ls ./social_links/
             </div>
             {/* Icons Preview on Hover */}
             <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                {socialLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-term-blue hover:scale-125 transition-all duration-200"
                    title={link.name}
                    onClick={(e) => e.stopPropagation()} 
                  >
                    {iconMap[link.icon]}
                  </a>
                ))}
             </div>
          </div>
          
          <div className="mt-2 text-gray-500 group-hover:text-gray-400 transition-colors flex items-center justify-between">
            <span className="group-hover:hidden">github.com, bilibili.com, email...</span>
            <span className="hidden group-hover:inline-block text-xs text-term-blue animate-pulse">
               Click icons to connect_
            </span>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

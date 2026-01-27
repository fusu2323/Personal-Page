import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClose?: () => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  children, 
  className, 
  title = "user@linhongji:~",
  onClose
}) => {
  return (
    <div className={cn("terminal-window rounded-xl overflow-hidden font-mono text-sm", className)}>
      {/* Title Bar */}
      <div className="bg-[#161b22] px-4 py-2 border-b border-term-gray flex justify-between items-center select-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer" onClick={onClose}></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-500 hidden sm:block">
          {title}
        </div>
        <div className="w-10"></div> {/* Spacer for layout balance */}
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6 text-gray-300 relative">
        {children}
      </div>
    </div>
  );
};

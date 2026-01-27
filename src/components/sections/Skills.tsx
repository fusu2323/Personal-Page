import React from 'react';
import { skills, socialLinks } from '@/data/resume';
import { TerminalWindow } from '../ui/TerminalWindow';

export const Skills: React.FC = () => {
  return (
    <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Skills */}
      <div>
        <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
          <span className="text-term-green mr-2">➜</span> ~/skills
        </div>
        <TerminalWindow title="cat skills.json">
          <div className="font-mono text-sm">
            <span className="text-yellow-400">{"{"}</span>
            <div className="pl-4">
              <span className="text-term-blue">"backend"</span>: <span className="text-yellow-400">{"["}</span>
              <div className="pl-4 grid grid-cols-1 gap-1">
                {skills.map((skill, index) => (
                  <span key={skill} className="text-orange-300">
                    "{skill}"{index < skills.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
              <span className="text-yellow-400">{"]"}</span>
            </div>
            <span className="text-yellow-400">{"}"}</span>
          </div>
        </TerminalWindow>
      </div>

      {/* Social Links */}
      <div>
        <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
          <span className="text-term-green mr-2">➜</span> ~/connect
        </div>
        <div className="grid gap-4">
          {socialLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <TerminalWindow className="hover:border-term-blue transition-colors flex items-center justify-between p-4 bg-[#161b22]/50">
                <div className="flex items-center space-x-3">
                  <span className="text-term-green font-bold text-lg">./{link.name.toLowerCase()}</span>
                </div>
                <span className="text-gray-500 text-xs group-hover:text-term-blue">EXECUTE ↵</span>
              </TerminalWindow>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';

const GITHUB_USERNAME = "libgophertin";
const PROMPT_USER = "libgophertin";
const PROMPT_HOST = "mint-os";
const BOOT_SEQUENCE = [
  "Initializing kernel...",
  "Loading Linux Mint modules...",
  "Mounting file systems...",
  "Starting network manager...",
  "Checking for Go compiler... Found go1.25.6",
  "Loading user profile: libgophertin...",
  "Access granted.",
  "Welcome to Terminal Portfolio v1.0.0"
];

const TerminalLine = ({ type, content }) => {
  if (type === 'command') {
    return (
      <div className="flex flex-row items-center mb-1">
        <span className="text-mint-green font-bold mr-2">
          {PROMPT_USER}@{PROMPT_HOST}:~$
        </span>
        <span className="text-gray-100">{content}</span>
      </div>
    );
  }
  
  if (type === 'html') {
    return <div className="mb-2 ml-4 text-gray-300" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <div className="mb-1 ml-4 text-gray-300 whitespace-pre-wrap">{content}</div>;
};

export default function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState([]);
  const [repos, setRepos] = useState(null);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let delay = 0;
    BOOT_SEQUENCE.forEach((line, index) => {
      delay += Math.random() * 300 + 200; 
      setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        if (index === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setIsBooting(false), 500);
        }
      }, delay);
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, bootLines]);

  const handleContainerClick = () => {
    if (!isBooting) {
      inputRef.current?.focus();
    }
  };
  
  const fetchProjects = async () => {
    try {
      if (repos) return formatRepos(repos);

      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
      if (!response.ok) throw new Error("Failed to fetch repositories.");
      
      const data = await response.json();
      setRepos(data);
      return formatRepos(data);
    } catch (error) {
      return `<span class="text-red-500">Error: ${error.message}</span>`;
    }
  };

  const formatRepos = (data) => {
    if (data.length === 0) return "No public repositories found.";

    let output = '<div class="grid grid-cols-1 md:grid-cols-12 gap-2 text-sm">';
    
    output += `
      <div class="col-span-3 font-bold text-mint-green underline decoration-1">NAME</div>
      <div class="col-span-2 font-bold text-mint-green underline decoration-1">LANG</div>
      <div class="col-span-1 font-bold text-mint-green underline decoration-1">STARS</div>
      <div class="col-span-6 font-bold text-mint-green underline decoration-1">DESCRIPTION</div>
    `;

    data.forEach(repo => {
      output += `
        <div class="col-span-3 hover:text-white cursor-pointer"><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></div>
        <div class="col-span-2 text-gray-400">${repo.language || 'N/A'}</div>
        <div class="col-span-1 text-yellow-500">${repo.stargazers_count} ★</div>
        <div class="col-span-6 text-gray-500 truncate">${repo.description || 'No description'}</div>
      `;
    });
    output += '</div>';
    return output;
  };

  const handleCommand = async (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const newEntry = { type: 'command', content: trimmedCmd };
    setHistory(prev => [...prev, newEntry]);

    let responseContent = "";
    let responseType = "text";

    const lowerCmd = trimmedCmd.toLowerCase();

    switch (lowerCmd) {
      case 'help':
        responseContent = `Available commands:
  - help      : Show this help message
  - about     : Display developer profile
  - projects  : List GitHub repositories (ls -l style)
  - clear     : Clear the terminal screen`;
        break;

      case 'about':
        responseContent = `
User: ${PROMPT_USER}
Role: Go Developer & Linux Enthusiast
OS:   Linux Mint (Cinnamon)

Bio:
I am a passionate beginner in the world of Go (Golang). 
I love the philosophy: "Done is better than perfect."
My daily driver is Linux Mint, and I spend most of my time in the terminal.

Current Focus:
- Building CLI tools
- Mastering Go concurrency patterns
- Project: DesktopEntryCreator`;
        break;

      case 'projects':
        responseContent = "Fetching repositories from GitHub...";
        responseContent = await fetchProjects();
        responseType = "html";
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        responseContent = `Command not found: ${trimmedCmd}. Type 'help' for available commands.`;
        responseType = "text";
    }

    setHistory(prev => [...prev, { type: responseType, content: responseContent }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div 
      className="w-full max-w-4xl h-[80vh] bg-mint-dark rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono border border-gray-700"
      onClick={handleContainerClick}
    >
      <div className="bg-mint-ui h-8 flex items-center px-4 justify-between border-b border-gray-700 select-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"></div>
        </div>
        <div className="text-gray-400 text-sm font-semibold">
          {PROMPT_USER}@{PROMPT_HOST}: ~
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-mint-dark/95">
        
        {bootLines.map((line, i) => (
          <div key={i} className="text-gray-400 mb-1">
            <span className="text-mint-green mr-2">[OK]</span>
            {line}
          </div>
        ))}

        {!isBooting && (
          <>
            {history.map((entry, i) => (
              <TerminalLine key={i} type={entry.type} content={entry.content} />
            ))}

            <div className="flex flex-row items-center">
              <span className="text-mint-green font-bold mr-2">
                {PROMPT_USER}@{PROMPT_HOST}:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-white flex-1 caret-mint-green"
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </>
        )}
        
        <div ref={endRef} />
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  PlusCircle, 
  Mic, 
  Settings, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  FileDown, 
  History, 
  LayoutGrid, 
  LineChart,
  Info,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatSession, Message } from './services/geminiService';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "안녕하세요! WEBSOLUTE AI 어시스턴트입니다. \n암호화폐 시장 분석, DAO 거버넌스 제안서 검토, 또는 실시간 온체인 데이터에 대해 무엇이든 물어보세요.",
      timestamp: "오전 10:00"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: input });
      const aiMessage: Message = {
        role: "model",
        text: response.text || "죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isReport: input.toLowerCase().includes("분석") || input.toLowerCase().includes("리포트")
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        role: "model",
        text: "API 호출 중 오류가 발생했습니다. 설정을 확인해주세요.",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101622] text-slate-100 font-sans selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#101622]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none font-display">WEBSOLUTE AI</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-slate-400">시스템 정상 작동 중</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow flex flex-col items-center w-full px-4 sm:px-6 relative">
        <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-140px)]">
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto py-8 space-y-8 custom-scrollbar scroll-smooth"
          >
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="px-4 py-1 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                2023년 10월 24일
              </span>
            </div>

            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'flex-col items-end' : 'items-start space-x-4'} max-w-full`}
                >
                  {msg.role === 'model' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Sparkles className="text-primary w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2 ${msg.role === 'user' ? 'max-w-[85%]' : 'max-w-[90%] w-full'}`}>
                    <div className={`flex items-end space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'user' && (
                        <span className="text-[10px] text-slate-500 mb-1">{msg.timestamp}</span>
                      )}
                      
                      <div className={`
                        p-4 rounded-xl shadow-sm
                        ${msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-slate-800/50 border border-slate-700/50 rounded-tl-none'}
                      `}>
                        {msg.isReport ? (
                          <div className="space-y-4">
                            <h3 className="font-bold text-primary flex items-center">
                              <BarChart3 className="mr-2 w-4 h-4" />
                              실시간 시장 분석 리포트
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                              {msg.text}
                            </p>
                            {/* Visual Chart Placeholder */}
                            <div className="relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                              <img 
                                className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
                                src="https://picsum.photos/seed/crypto/800/200?blur=2" 
                                alt="Market Chart"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary tracking-widest uppercase">Market Momentum Graph</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-700">
                              <button className="text-xs font-bold text-primary hover:underline flex items-center">
                                상세 온체인 리포트 다운로드 (.PDF)
                                <FileDown className="w-3 h-3 ml-1" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        )}
                      </div>

                      {msg.role === 'model' && (
                        <span className="text-[10px] text-slate-500 mb-1">{msg.timestamp}</span>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex items-center space-x-1.5 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full self-end">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary">DAO LEVEL 5</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="text-primary w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="w-full py-6 pb-10">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 shadow-xl">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 px-3 text-sm font-medium" 
                  placeholder="메시지를 입력하세요..." 
                />
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between px-2">
              <div className="flex items-center space-x-4">
                <span className="text-[10px] text-slate-600 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  AI는 실수를 할 수 있습니다. 투자 전 데이터를 확인하세요.
                </span>
              </div>
              <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Websolute AI v2.4
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Side Decoration */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col space-y-4">
        {[History, LayoutGrid, LineChart].map((Icon, i) => (
          <div key={i} className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:border-primary transition-colors cursor-pointer group shadow-sm">
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Users,
  ArrowRight,
  MessageSquare,
  Layout,
  Shield,
  FileText,
  Share2,
  Mic,
  PenTool,
  Brain,
  Languages,
  VideoIcon,
  Sparkles,
  Keyboard,
  Wand2,
  VolumeX,
  Gauge,
} from 'lucide-react';

export function Home() {
  const [meetingName, setMeetingName] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigate = useNavigate();

  const createMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const meetingId = meetingName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    navigate(`/meeting/${meetingId}`);
  };

  const joinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingName.trim()) {
      navigate(`/meeting/${meetingName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Smart Meeting Assistant',
      description: 'Automated meeting notes and key points summary',
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: 'Live Captions',
      description: 'Real-time speech-to-text in multiple languages',
    },
    {
      icon: <VideoIcon className="w-6 h-6" />,
      title: 'Adaptive Video',
      description: 'Smart quality adjustment for stable connections',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Background Effects',
      description: 'Professional virtual backgrounds and blur',
    },
    {
      icon: <VolumeX className="w-6 h-6" />,
      title: 'Noise Suppression',
      description: 'Advanced background noise reduction',
    },
    {
      icon: <Keyboard className="w-6 h-6" />,
      title: 'Meeting Transcripts',
      description: 'Searchable meeting records with speaker detection',
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: 'Smart Gestures',
      description: 'Intuitive hand gesture controls',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enhanced Security',
      description: 'Advanced encryption and meeting access controls',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Smart Chat',
      description: 'Contextual responses and message translation',
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: 'Dynamic Views',
      description: 'Intelligent speaker-focused layouts',
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: 'Connection Optimizer',
      description: 'Auto-adjusting quality for best performance',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Enhanced Sharing',
      description: 'High-quality screen sharing with annotations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <span className="font-['Dancing_Script'] text-5xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Airmeet
              </span>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
                <a href="#smart" className="text-gray-600 hover:text-gray-900">Smart Tools</a>
                <a href="#security" className="text-gray-600 hover:text-gray-900">Security</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Smart Meetings Made
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Simple & Powerful
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 animate-slide-up delay-200">
              Experience seamless video meetings enhanced with smart features,
              crystal-clear audio, and intuitive collaboration tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-300">
              <div className="relative">
                <form onSubmit={createMeeting} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter meeting name"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className={`w-72 px-6 py-4 rounded-full border-2 focus:outline-none transition-all duration-200 ${
                      isInputFocused
                        ? 'border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]'
                        : 'border-gray-200'
                    }`}
                  />
                  <button
                    type="submit"
                    className="ml-4 bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <span className="font-medium">Start Meeting</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Image */}
            <div className="relative max-w-5xl mx-auto animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-2xl transform rotate-2" />
              <img
                src="https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Airmeet Interface"
                className="relative rounded-2xl shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </main>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Smart Features
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Powerful tools that make your meetings more productive and engaging
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trusted by teams worldwide
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join thousands of teams that rely on Airmeet for seamless collaboration
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {/* Add company logos here */}
          </div>
        </div>
      </section>
    </div>
  );
}
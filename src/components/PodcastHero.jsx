import { Button } from "@/components/ui/button";
import { AudioWaveform, Sparkles, Zap, Star, ArrowRight } from "lucide-react";

export const PodcastHero = ({ onGetStarted }) => {

  const handleViewExamples = () => {
    // Create sample episodes for demonstration
    const sampleEpisodes = [
      {
        id: 'sample-1',
        title: 'The Future of AI in Education',
        script: 'Welcome to our podcast on artificial intelligence in education. Today we explore how AI is transforming the way we learn and teach, making education more personalized and accessible than ever before.',
        audioUrl: '',
        createdAt: new Date().toISOString(),
        status: 'script'
      },
      {
        id: 'sample-2', 
        title: 'Climate Change Solutions',
        script: 'In this episode, we discuss innovative solutions to combat climate change, from renewable energy breakthroughs to sustainable lifestyle changes that every individual can make.',
        audioUrl: '',
        createdAt: new Date().toISOString(),
        status: 'script'
      }
    ];

    // Store sample episodes in localStorage for demo
    localStorage.setItem('sample_episodes', JSON.stringify(sampleEpisodes));
    
    // Navigate to dashboard
    onGetStarted();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.4),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.3),transparent_50%)]" />
      
      {/* Floating Elements with improved animations */}
      <div className="absolute top-20 left-20 animate-float">
        <div className="p-3 rounded-xl bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
          <AudioWaveform className="w-8 h-8 text-primary" />
        </div>
      </div>
      <div className="absolute top-40 right-32 animate-float animation-delay-300">
        <div className="p-2 rounded-lg bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
          <Sparkles className="w-6 h-6 text-secondary" />
        </div>
      </div>
      <div className="absolute bottom-32 left-32 animate-float animation-delay-700">
        <div className="p-4 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
          <Zap className="w-10 h-10 text-accent" />
        </div>
      </div>
      <div className="absolute top-1/2 right-20 animate-float animation-delay-500">
        <div className="p-2 rounded-full bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-glass backdrop-blur-sm border border-white/20 shadow-soft hover:shadow-elegant transition-smooth">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by OpenAI & ElevenLabs</span>
          </div>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent leading-tight animate-slide-up">
          AI Podcast
          <br />
          <span className="relative">
            Generator
            <div className="absolute -inset-1 bg-gradient-primary blur-lg opacity-30 animate-pulse-glow"></div>
          </span>
        </h1>
        
        <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
          Transform your ideas into professional podcasts with AI-powered script generation 
          and ultra-realistic voice synthesis. From concept to audio in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up animation-delay-400">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="group px-10 py-5 text-xl font-semibold bg-gradient-primary hover:shadow-elegant transition-bounce hover:scale-105 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleViewExamples}
            className="px-10 py-5 text-xl border-white/30 hover:bg-white/10 backdrop-blur-sm bg-white/5 transition-smooth hover:shadow-soft"
          >
            View Examples
          </Button>
        </div>

        {/* Enhanced Feature Pills */}
        <div className="flex flex-wrap justify-center gap-6 text-base animate-slide-up animation-delay-600">
          <div className="group px-6 py-3 rounded-2xl bg-gradient-glass backdrop-blur-md border border-white/20 hover:border-white/40 transition-smooth hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
              <span className="font-medium">AI Script Generation</span>
            </div>
          </div>
          <div className="group px-6 py-3 rounded-2xl bg-gradient-glass backdrop-blur-md border border-white/20 hover:border-white/40 transition-smooth hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary to-accent"></div>
              <span className="font-medium">Natural Voice Synthesis</span>
            </div>
          </div>
          <div className="group px-6 py-3 rounded-2xl bg-gradient-glass backdrop-blur-md border border-white/20 hover:border-white/40 transition-smooth hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-400"></div>
              <span className="font-medium">Episode Management</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up animation-delay-800">
          <div className="text-center p-6 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <div className="text-white/70">Professional Voices</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
            <div className="text-3xl font-bold text-secondary mb-2">60+</div>
            <div className="text-white/70">Languages Supported</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
            <div className="text-3xl font-bold text-accent mb-2">∞</div>
            <div className="text-white/70">Creative Possibilities</div>
          </div>
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-1500"></div>
    </div>
  );
};
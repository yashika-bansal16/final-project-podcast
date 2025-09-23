import { Button } from "@/components/ui/button";
import { Mic, AudioWaveform, Sparkles } from "lucide-react";

interface PodcastHeroProps {
  onGetStarted: () => void;
}

export const PodcastHero = ({ onGetStarted }: PodcastHeroProps) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-pulse">
        <AudioWaveform className="w-8 h-8 text-primary/60" />
      </div>
      <div className="absolute top-40 right-32 animate-bounce">
        <Sparkles className="w-6 h-6 text-secondary/60" />
      </div>
      <div className="absolute bottom-32 left-32 animate-pulse">
        <Mic className="w-10 h-10 text-primary/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-sm border border-border/50">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Powered by OpenAI & ElevenLabs</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent leading-tight">
          AI Podcast
          <br />
          Generator
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Create professional podcasts with AI-generated scripts and realistic voice synthesis. 
          From concept to audio in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-gradient-primary hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Creating
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg border-border/50 hover:bg-card/20 backdrop-blur-sm"
          >
            View Examples
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/30">
            📝 AI Script Generation
          </div>
          <div className="px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/30">
            🎙️ Natural Voice Synthesis
          </div>
          <div className="px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm border border-border/30">
            📊 Episode Management
          </div>
        </div>
      </div>
    </div>
  );
};
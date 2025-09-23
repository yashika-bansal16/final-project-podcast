import { useState } from "react";
import { PodcastHero } from "@/components/PodcastHero";
import { ApiKeyPrompt } from "@/components/ApiKeyPrompt";
import { ScriptGenerator } from "@/components/ScriptGenerator";
import { TextToSpeech } from "@/components/TextToSpeech";
import { AudioPlayer } from "@/components/AudioPlayer";
import { EpisodeManager } from "@/components/EpisodeManager";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings } from "lucide-react";

interface Episode {
  id: string;
  title: string;
  script: string;
  audioUrl?: string;
  createdAt: string;
  status: "script" | "audio" | "complete";
}

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showApiPrompt, setShowApiPrompt] = useState(false);
  const [currentScript, setCurrentScript] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [newEpisode, setNewEpisode] = useState<{script: string; title: string; audioUrl?: string} | undefined>();
  const [activeTab, setActiveTab] = useState("create");

  // Check if API keys exist
  const hasApiKeys = () => {
    return localStorage.getItem("openai_api_key") && localStorage.getItem("elevenlabs_api_key");
  };

  const handleGetStarted = () => {
    if (!hasApiKeys()) {
      setShowApiPrompt(true);
    } else {
      setShowDashboard(true);
    }
  };

  const handleApiKeysSet = () => {
    setShowApiPrompt(false);
    setShowDashboard(true);
  };

  const handleBackToHero = () => {
    setShowDashboard(false);
    setShowApiPrompt(false);
  };

  const handleScriptGenerated = (script: string, title: string) => {
    setCurrentScript(script);
    setCurrentTitle(title);
    setNewEpisode({ script, title });
    setActiveTab("voice");
  };

  const handleAudioGenerated = (audioUrl: string, title: string) => {
    setCurrentAudioUrl(audioUrl);
    setNewEpisode(prev => prev ? { ...prev, audioUrl } : { script: currentScript, title: currentTitle, audioUrl });
    setActiveTab("preview");
  };

  const handleSelectEpisode = (episode: Episode) => {
    setCurrentScript(episode.script);
    setCurrentTitle(episode.title);
    setCurrentAudioUrl(episode.audioUrl || "");
    setActiveTab("preview");
  };

  // Show API key prompt if needed
  if (showApiPrompt) {
    return <ApiKeyPrompt onKeysSet={handleApiKeysSet} />;
  }

  // Show hero page by default
  if (!showDashboard) {
    return <PodcastHero onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-glass backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHero}
              className="gap-2 hover:bg-white/10 transition-smooth"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="h-4 w-px bg-border/50" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Podcast Studio
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("settings")}
              className="hover:bg-white/10 transition-smooth"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-gradient-glass backdrop-blur-sm border border-white/10">
            <TabsTrigger value="create" className="data-[state=active]:bg-primary/20">Create</TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-secondary/20">Voice</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-accent/20">Preview</TabsTrigger>
            <TabsTrigger value="episodes" className="data-[state=active]:bg-green-500/20">Episodes</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-muted/20">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <ScriptGenerator onScriptGenerated={handleScriptGenerated} />
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <AudioPlayer audioUrl={currentAudioUrl} title={currentTitle} />
                  <div className="text-center p-6 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Quick Start Guide
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                        <p className="text-left">Generate a script using AI-powered creativity</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">2</div>
                        <p className="text-left">Convert to speech with ultra-realistic voices</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">3</div>
                        <p className="text-left">Preview, download, and share your podcast</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <TextToSpeech 
                  script={currentScript} 
                  onAudioGenerated={handleAudioGenerated}
                />
              </div>
              <div className="lg:col-span-1">
                <AudioPlayer audioUrl={currentAudioUrl} title={currentTitle} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <AudioPlayer audioUrl={currentAudioUrl} title={currentTitle} />
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="p-8 rounded-2xl bg-gradient-glass backdrop-blur-sm border border-white/10 shadow-soft">
                    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Episode Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Title:</span>
                        <p className="font-medium text-lg mt-1">{currentTitle || "Untitled Episode"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Script Preview:</span>
                        <div className="mt-2 p-4 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-sm text-foreground/80 line-clamp-8 leading-relaxed">
                            {currentScript || "No script available. Generate one in the Create tab to get started."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="episodes" className="space-y-6 animate-fade-in">
            <EpisodeManager 
              onSelectEpisode={handleSelectEpisode}
              newEpisode={newEpisode}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <ApiKeyManager />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
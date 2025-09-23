import { useState } from "react";
import { PodcastHero } from "@/components/PodcastHero";
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
  const [currentScript, setCurrentScript] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [newEpisode, setNewEpisode] = useState<{script: string; title: string; audioUrl?: string} | undefined>();
  const [activeTab, setActiveTab] = useState("create");

  const handleGetStarted = () => {
    setShowDashboard(true);
  };

  const handleBackToHero = () => {
    setShowDashboard(false);
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

  if (!showDashboard) {
    return <PodcastHero onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHero}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Podcast Studio
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <ScriptGenerator onScriptGenerated={handleScriptGenerated} />
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <AudioPlayer audioUrl={currentAudioUrl} title={currentTitle} />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Quick Start Guide</h3>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>1. 📝 Generate a script using AI</p>
                      <p>2. 🎙️ Convert to speech with realistic voices</p>
                      <p>3. 🎧 Preview and download your podcast</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
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

          <TabsContent value="preview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <AudioPlayer audioUrl={currentAudioUrl} title={currentTitle} />
              </div>
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="p-6 rounded-lg bg-gradient-card border border-border/50">
                    <h3 className="text-lg font-semibold mb-4">Episode Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Title:</span>
                        <p className="font-medium">{currentTitle || "Untitled Episode"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Script Preview:</span>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-6">
                          {currentScript || "No script available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="episodes" className="space-y-6">
            <EpisodeManager 
              onSelectEpisode={handleSelectEpisode}
              newEpisode={newEpisode}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
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
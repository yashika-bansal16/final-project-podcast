import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Edit3, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Episode {
  id: string;
  title: string;
  script: string;
  audioUrl?: string;
  createdAt: string;
  status: "script" | "audio" | "complete";
}

interface EpisodeManagerProps {
  onSelectEpisode: (episode: Episode) => void;
  newEpisode?: { script: string; title: string; audioUrl?: string };
}

export const EpisodeManager = ({ onSelectEpisode, newEpisode }: EpisodeManagerProps) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Load episodes from localStorage on mount
  useEffect(() => {
    const savedEpisodes = localStorage.getItem("podcast_episodes");
    if (savedEpisodes) {
      setEpisodes(JSON.parse(savedEpisodes));
    }
  }, []);

  // Save episodes to localStorage whenever episodes change
  useEffect(() => {
    localStorage.setItem("podcast_episodes", JSON.stringify(episodes));
  }, [episodes]);

  // Add new episode when newEpisode prop changes
  useEffect(() => {
    if (newEpisode) {
      const episode: Episode = {
        id: Date.now().toString(),
        title: newEpisode.title,
        script: newEpisode.script,
        audioUrl: newEpisode.audioUrl,
        createdAt: new Date().toISOString(),
        status: newEpisode.audioUrl ? "complete" : "script",
      };
      
      setEpisodes(prev => [episode, ...prev]);
      
      toast({
        title: "Episode Saved",
        description: `"${episode.title}" has been added to your episodes.`,
      });
    }
  }, [newEpisode, toast]);

  const deleteEpisode = (id: string) => {
    setEpisodes(prev => prev.filter(episode => episode.id !== id));
    toast({
      title: "Episode Deleted",
      description: "The episode has been removed.",
    });
  };

  const updateEpisodeAudio = (id: string, audioUrl: string) => {
    setEpisodes(prev => prev.map(episode => 
      episode.id === id 
        ? { ...episode, audioUrl, status: "complete" as const }
        : episode
    ));
  };

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.script.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Episode["status"]) => {
    switch (status) {
      case "script": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "audio": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "complete": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const downloadEpisode = (episode: Episode) => {
    if (!episode.audioUrl) return;
    
    const link = document.createElement("a");
    link.href = episode.audioUrl;
    link.download = `${episode.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Episode Manager</h3>
            <p className="text-sm text-muted-foreground">
              Manage your podcast episodes ({episodes.length} total)
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Episodes List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-2">No Episodes Yet</h4>
              <p className="text-sm text-muted-foreground">
                Create your first episode using the script generator above.
              </p>
            </div>
          ) : (
            filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="border border-border/50 rounded-lg p-4 hover:bg-card/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{episode.title}</h4>
                      <Badge className={getStatusColor(episode.status)}>
                        {episode.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {episode.script.substring(0, 150)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(episode.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectEpisode(episode)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    
                    {episode.audioUrl && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadEpisode(episode)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectEpisode(episode)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEpisode(episode.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
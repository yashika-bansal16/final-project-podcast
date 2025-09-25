import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mic2, Download, Volume2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
  script?: string;
  onAudioGenerated: (audioUrl: string, title: string) => void;
}

export const TextToSpeech = ({ script, onAudioGenerated }: TextToSpeechProps) => {
  const [text, setText] = useState(script || "");
  const [voice, setVoice] = useState("9BWtsMINqrJLrRacOk9x"); // Aria voice ID
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const voices = [
    { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Professional female voice", accent: "American", type: "Premium" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "Mature male voice", accent: "British", type: "Premium" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Clear female voice", accent: "American", type: "Standard" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "Young male voice", accent: "American", type: "Standard" },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Warm female voice", accent: "British", type: "Premium" },
  ];

  const generateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem("elevenlabs_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ElevenLabs API Error:", response.status, errorText);
        throw new Error(`Failed to generate audio: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const title = `Episode ${Date.now()}`;
      onAudioGenerated(audioUrl, title);
      
      toast({
        title: "Audio Generated! 🎉",
        description: "Your podcast audio is ready to preview and download.",
      });
      
    } catch (error) {
      console.error("Error generating audio:", error);
      let errorMessage = "Failed to generate audio. Please check your API key and try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Invalid API key. Please check your ElevenLabs API key.";
        } else if (error.message.includes("403")) {
          errorMessage = "API key doesn't have permission. Please check your ElevenLabs subscription.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please try again in a moment.";
        } else if (error.message.includes("NetworkError") || error.message.includes("CORS")) {
          errorMessage = "Network error. Please check your internet connection.";
        }
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedVoice = voices.find(v => v.id === voice);
  const hasApiKey = !!localStorage.getItem("elevenlabs_api_key");

  return (
    <Card className="group p-8 bg-gradient-glass backdrop-blur-xl border border-white/10 shadow-elegant hover:shadow-glow-secondary transition-all duration-500 hover:border-secondary/30 animate-slide-up animation-delay-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-r from-secondary to-accent shadow-soft group-hover:shadow-glow-secondary transition-all duration-300">
          <Mic2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            AI Voice Synthesis
          </h3>
          <p className="text-base text-muted-foreground">Transform text into realistic speech</p>
        </div>
        <div className="ml-auto">
          {hasApiKey ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-green-400">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">API Key Needed</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="voice" className="text-base font-medium flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-secondary" />
            Voice Selection
          </Label>
          <div className="relative">
            <select
              id="voice"
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-base focus:border-secondary/50 focus:bg-white/10 transition-all duration-300 appearance-none"
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id} className="bg-background">
                  {v.name} - {v.description} ({v.accent})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Badge variant={selectedVoice?.type === "Premium" ? "default" : "secondary"} className="text-xs">
                {selectedVoice?.type}
              </Badge>
            </div>
          </div>
          {selectedVoice && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span>{selectedVoice.accent} accent • {selectedVoice.type} quality</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="text" className="text-base font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-secondary" />
              Script Text
            </span>
            <span className="text-xs text-muted-foreground">
              {text.length} characters
            </span>
          </Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your podcast script here, or generate one first..."
            className="min-h-[200px] text-base bg-white/5 border-white/20 focus:border-secondary/50 focus:bg-white/10 transition-all duration-300 resize-none"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Estimated duration: ~{Math.ceil(text.length / 180)} minutes</span>
            <span>Character limit: 5,000</span>
          </div>
        </div>

        <Button
          onClick={generateAudio}
          disabled={isGenerating || !hasApiKey}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-secondary to-accent hover:shadow-glow-secondary transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          <div className="relative flex items-center justify-center gap-3">
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Audio...</span>
                <div className="ml-2 flex gap-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-100"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce animation-delay-200"></div>
                </div>
              </>
            ) : (
              <>
                <Mic2 className="w-5 h-5" />
                <span>Generate Audio with AI</span>
              </>
            )}
          </div>
        </Button>

        {/* Quality Info */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-secondary mb-1">High-Quality Audio:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Studio-quality 22kHz audio output</li>
                <li>• Natural breathing and emotional inflection</li>
                <li>• 29+ languages and accents available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
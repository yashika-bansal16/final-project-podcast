import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Mic2, Download } from "lucide-react";
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
    { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Professional female voice" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "Mature male voice" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Clear female voice" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "Young male voice" },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Warm female voice" },
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
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const title = `Episode ${Date.now()}`;
      onAudioGenerated(audioUrl, title);
      
      toast({
        title: "Audio Generated!",
        description: "Your podcast audio is ready to preview.",
      });
      
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate audio. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-secondary/10">
          <Mic2 className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Text to Speech</h3>
          <p className="text-sm text-muted-foreground">Convert your script to realistic audio</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="voice">Voice Selection</Label>
          <select
            id="voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} - {v.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="text">Script Text</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your podcast script here..."
            className="mt-1 min-h-[200px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {text.length} characters
          </p>
        </div>

        <Button
          onClick={generateAudio}
          disabled={isGenerating}
          className="w-full bg-gradient-primary hover:shadow-elegant"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Audio...
            </>
          ) : (
            <>
              <Mic2 className="w-4 h-4 mr-2" />
              Generate Audio
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
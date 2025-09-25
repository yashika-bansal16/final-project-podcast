import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Sparkles, Wand2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptGeneratorProps {
  onScriptGenerated: (script: string, title: string) => void;
}

export const ScriptGenerator = ({ onScriptGenerated }: ScriptGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("10");
  const [tone, setTone] = useState("conversational");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateScript = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your podcast episode.",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional podcast script writer. Create engaging, well-structured podcast scripts that are natural to read aloud.`
            },
            {
              role: "user",
              content: `Create a ${duration}-minute podcast episode script about "${topic}". The tone should be ${tone}. Include:
              - Engaging introduction
              - Main content with clear segments
              - Natural transitions
              - Compelling conclusion
              - Sound natural when spoken aloud
              
              Format as a script with clear narration.`
            }
          ],
          max_tokens: parseInt(duration) * 150, // Roughly 150 tokens per minute
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      const script = data.choices[0].message.content;
      
      onScriptGenerated(script, topic);
      
      toast({
        title: "Script Generated! ✨",
        description: "Your podcast script is ready to convert to audio.",
      });
      
      // Clear the form
      setTopic("");
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate script. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="group p-8 bg-gradient-glass backdrop-blur-xl border border-white/10 shadow-elegant hover:shadow-glow-primary transition-all duration-500 hover:border-primary/30 animate-slide-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-primary shadow-soft group-hover:shadow-glow-primary transition-all duration-300">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Script Generator
          </h3>
          <p className="text-base text-muted-foreground">Create professional podcast scripts with AI</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="topic" className="text-base font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Podcast Topic
          </Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Future of Artificial Intelligence"
            className="h-12 text-base bg-white/5 border-white/20 focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="duration" className="text-base font-medium">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="5"
              max="60"
              className="h-12 text-base bg-white/5 border-white/20 focus:border-primary/50"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="tone" className="text-base font-medium">Tone & Style</Label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="h-12 w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-base focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
            >
              <option value="conversational">🗣️ Conversational</option>
              <option value="professional">💼 Professional</option>
              <option value="educational">🎓 Educational</option>
              <option value="entertaining">🎭 Entertaining</option>
              <option value="inspiring">✨ Inspiring</option>
            </select>
          </div>
        </div>

        <Button
          onClick={generateScript}
          disabled={isGenerating}
          className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          <div className="relative flex items-center justify-center gap-3">
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Amazing Script...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Script with AI</span>
              </>
            )}
          </div>
        </Button>

        {/* Tips Section */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">Pro Tips:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Be specific with your topic for better results</li>
                <li>• Try different tones to match your audience</li>
                <li>• Longer episodes work great for deep-dive content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
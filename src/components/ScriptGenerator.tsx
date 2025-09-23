import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Sparkles } from "lucide-react";
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
          model: "gpt-4",
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
        title: "Script Generated!",
        description: "Your podcast script is ready.",
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
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Script Generator</h3>
          <p className="text-sm text-muted-foreground">Generate AI-powered podcast scripts</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">Podcast Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Future of Artificial Intelligence"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="5"
              max="60"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
            >
              <option value="conversational">Conversational</option>
              <option value="professional">Professional</option>
              <option value="educational">Educational</option>
              <option value="entertaining">Entertaining</option>
              <option value="inspiring">Inspiring</option>
            </select>
          </div>
        </div>

        <Button
          onClick={generateScript}
          disabled={isGenerating}
          className="w-full bg-gradient-primary hover:shadow-elegant"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Script...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Script
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
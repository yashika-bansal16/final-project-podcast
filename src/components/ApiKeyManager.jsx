import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ApiKeyManager = () => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showElevenlabsKey, setShowElevenlabsKey] = useState(false);
  const { toast } = useToast();

  // Load API keys on mount
  useEffect(() => {
    const savedOpenaiKey = localStorage.getItem("openai_api_key");
    const savedElevenlabsKey = localStorage.getItem("elevenlabs_api_key");
    
    if (savedOpenaiKey) setOpenaiKey(savedOpenaiKey);
    if (savedElevenlabsKey) setElevenlabsKey(savedElevenlabsKey);
  }, []);

  const saveKeys = () => {
    if (openaiKey.trim()) {
      localStorage.setItem("openai_api_key", openaiKey.trim());
    }
    if (elevenlabsKey.trim()) {
      localStorage.setItem("elevenlabs_api_key", elevenlabsKey.trim());
    }
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely stored locally.",
    });
  };

  const clearKeys = () => {
    localStorage.removeItem("openai_api_key");
    localStorage.removeItem("elevenlabs_api_key");
    setOpenaiKey("");
    setElevenlabsKey("");
    
    toast({
      title: "API Keys Cleared",
      description: "All API keys have been removed.",
    });
  };

  const hasOpenaiKey = !!localStorage.getItem("openai_api_key");
  const hasElevenlabsKey = !!localStorage.getItem("elevenlabs_api_key");

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <Settings className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">API Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure your AI service API keys</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* OpenAI API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="openai-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              OpenAI API Key
            </Label>
            {hasOpenaiKey ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <div className="relative">
            <Input
              id="openai-key"
              type={showOpenaiKey ? "text" : "password"}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowOpenaiKey(!showOpenaiKey)}
            >
              {showOpenaiKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Required for script generation. Get your key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>

        {/* ElevenLabs API Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="elevenlabs-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              ElevenLabs API Key
            </Label>
            {hasElevenlabsKey ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <div className="relative">
            <Input
              id="elevenlabs-key"
              type={showElevenlabsKey ? "text" : "password"}
              value={elevenlabsKey}
              onChange={(e) => setElevenlabsKey(e.target.value)}
              placeholder="Your ElevenLabs API key"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowElevenlabsKey(!showElevenlabsKey)}
            >
              {showElevenlabsKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Required for text-to-speech. Get your key from{" "}
            <a
              href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ElevenLabs
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={saveKeys}
            className="flex-1 bg-gradient-primary hover:shadow-elegant"
            disabled={!openaiKey.trim() && !elevenlabsKey.trim()}
          >
            Save API Keys
          </Button>
          <Button
            onClick={clearKeys}
            variant="outline"
            className="px-6"
          >
            Clear All
          </Button>
        </div>

        {/* Security Note */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground">
            🔒 Your API keys are stored locally in your browser and never sent to our servers.
            They are only used to make direct API calls to OpenAI and ElevenLabs.
          </p>
        </div>
      </div>
    </Card>
  );
};
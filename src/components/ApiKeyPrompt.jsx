import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyPromptProps {
  onKeysSet: () => void;
}

export const ApiKeyPrompt = ({ onKeysSet }: ApiKeyPromptProps) => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const { toast } = useToast();

  const handleSaveKeys = () => {
    if (!openaiKey.trim() || !elevenlabsKey.trim()) {
      toast({
        title: "Both API Keys Required",
        description: "Please enter both OpenAI and ElevenLabs API keys to continue.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem("openai_api_key", openaiKey.trim());
    localStorage.setItem("elevenlabs_api_key", elevenlabsKey.trim());

    toast({
      title: "API Keys Secured! 🔐",
      description: "Your keys are safely stored locally. Let's start creating!",
    });

    onKeysSet();
  };

  const handleQuickSetup = () => {
    // For demo purposes - user should enter their own keys
    if (openaiKey.startsWith("sk-proj-") && elevenlabsKey.startsWith("sk_")) {
      handleSaveKeys();
    } else {
      toast({
        title: "Invalid API Keys",
        description: "Please ensure you're using valid OpenAI and ElevenLabs API keys.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8 bg-gradient-glass backdrop-blur-xl border border-white/10 shadow-elegant animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 p-4 rounded-2xl bg-gradient-primary shadow-elegant">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Secure API Setup
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your API keys to unlock AI-powered podcast generation
          </p>
        </div>

        <div className="space-y-6">
          {/* Security Notice */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-400 mb-1">🔒 Your Security Matters:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• API keys are stored locally in your browser only</li>
                  <li>• Keys are never sent to our servers</li>
                  <li>• Direct API calls are made to OpenAI and ElevenLabs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-3">
            <Label htmlFor="openai-key" className="text-base font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              OpenAI API Key
            </Label>
            <Input
              id="openai-key"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="h-12 text-base bg-white/5 border-white/20 focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Get your key from{" "}
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
          <div className="space-y-3">
            <Label htmlFor="elevenlabs-key" className="text-base font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-secondary" />
              ElevenLabs API Key
            </Label>
            <Input
              id="elevenlabs-key"
              type="password"
              value={elevenlabsKey}
              onChange={(e) => setElevenlabsKey(e.target.value)}
              placeholder="sk_..."
              className="h-12 text-base bg-white/5 border-white/20 focus:border-secondary/50"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              Get your key from{" "}
              <a
                href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                ElevenLabs Dashboard
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSaveKeys}
              className="flex-1 h-12 text-lg font-semibold bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span>Secure & Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </div>

          {/* Warning */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-400 mb-1">⚠️ Important Security Notice:</p>
                <p className="text-muted-foreground">
                  Never share your API keys in chat or with others. Only enter them in secure forms like this one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
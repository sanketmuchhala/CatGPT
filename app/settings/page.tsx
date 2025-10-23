"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { loadSettings, saveSettings } from "@/lib/storage";
import { ALLOWED_MODELS } from "@/lib/types";
import { CAT_MODES } from "@/lib/cat-agent";
import type { AppSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<AppSettings>(loadSettings());

  React.useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const currentModel = ALLOWED_MODELS.find((m) => m.id === settings.defaultModel);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" aria-label="Back to chat">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Customize your CatGPT experience
            </p>
          </div>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Configure general application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="purr-sound" className="text-sm font-medium">
                  Purr Sound
                </label>
                <p className="text-sm text-muted-foreground">
                  Play a purr sound when the assistant completes a message
                </p>
              </div>
              <Switch
                id="purr-sound"
                checked={settings.purrSound}
                onCheckedChange={(value) => updateSetting("purrSound", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="compact-mode" className="text-sm font-medium">
                  Compact Mode
                </label>
                <p className="text-sm text-muted-foreground">
                  Use a more compact message layout
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={settings.compactMode}
                onCheckedChange={(value) => updateSetting("compactMode", value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cat Agent Mode - FREE! */}
        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🐱 Cat Agent Mode
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                FREE • No API calls!
              </span>
            </CardTitle>
            <CardDescription>
              Use a local cat personality instead of paying for API calls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="cat-agent-mode" className="text-sm font-medium">
                  Enable Cat Agent
                </label>
                <p className="text-sm text-muted-foreground">
                  Get free responses from a sassy local cat (no AI needed!)
                </p>
              </div>
              <Switch
                id="cat-agent-mode"
                checked={settings.catAgentMode}
                onCheckedChange={(value) => updateSetting("catAgentMode", value)}
              />
            </div>

            {settings.catAgentMode && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="cat-personality" className="text-sm font-medium">
                    Cat Personality
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Choose your cat&apos;s attitude
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline" className="min-w-[200px] justify-between">
                      <span>
                        {CAT_MODES.find((m) => m.id === settings.catPersonality)?.name ||
                          "Select personality"}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-[200px]">
                    {CAT_MODES.map((mode) => (
                      <DropdownMenuItem
                        key={mode.id}
                        onClick={() => updateSetting("catPersonality", mode.id)}
                        className={
                          mode.id === settings.catPersonality ? "bg-accent/20" : ""
                        }
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{mode.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {mode.description}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Default Conversation Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Default Conversation Settings</CardTitle>
            <CardDescription>
              These settings apply to new conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label htmlFor="default-model" className="text-sm font-medium">
                  Default Model
                </label>
                <p className="text-sm text-muted-foreground">
                  The AI model used for new conversations
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" className="min-w-[200px] justify-between">
                    <span>{currentModel?.name || "Select model"}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px]">
                  {ALLOWED_MODELS.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => updateSetting("defaultModel", model.id)}
                      className={
                        model.id === settings.defaultModel ? "bg-accent/20" : ""
                      }
                    >
                      {model.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label
                  htmlFor="default-meow-only"
                  className="text-sm font-medium"
                >
                  Default Meow-Only Mode
                </label>
                <p className="text-sm text-muted-foreground">
                  Enable meow-only mode for new conversations
                </p>
              </div>
              <Switch
                id="default-meow-only"
                checked={settings.defaultMeowOnly}
                onCheckedChange={(value) =>
                  updateSetting("defaultMeowOnly", value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About CatGPT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              CatGPT is a chat interface with a playful cat personality, powered
              by Claude AI.
            </p>
            <p>Version: 1.0.0</p>
            <p>
              Built with Next.js, TypeScript, and Tailwind CSS.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

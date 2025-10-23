"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings } from "lucide-react";

interface HeaderProps {
  meowOnly: boolean;
  onMeowOnlyChange: (value: boolean) => void;
  onOpenSettings: () => void;
}

export function Header({
  meowOnly,
  onMeowOnlyChange,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Left: App name with cat logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative h-8 w-8 group-hover:scale-110 transition-transform">
          <Image
            src="/cat-logo.svg"
            alt="CatGPT Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-bold">
          Cat<span className="text-accent">GPT</span>
        </h1>
      </Link>

      {/* Center: Tagline */}
      <div className="flex-1 flex justify-center">
        <p className="text-sm text-muted-foreground">
          Free Cat Agent - No API Keys Required
        </p>
      </div>

      {/* Right: Meow-Only toggle + Settings */}
      <div className="flex items-center gap-4">
        {/* Meow-Only Mode */}
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <label
                htmlFor="meow-toggle"
                className="text-sm font-medium cursor-pointer select-none"
              >
                Meow-Only Mode
              </label>
              <Switch
                id="meow-toggle"
                checked={meowOnly}
                onCheckedChange={onMeowOnlyChange}
                aria-label="Toggle meow-only mode"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>When enabled, all responses are translated to cat language</p>
          </TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import { nanoid } from "nanoid";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MessageList } from "@/components/chat/MessageList";
import { Composer } from "@/components/chat/Composer";
import {
  loadChats,
  saveChats,
  loadSettings,
  saveSettings,
  generateChatTitle,
} from "@/lib/storage";
import { playPurrSound } from "@/lib/purr";
import { Switch } from "@/components/ui/switch";
import { getCatResponse } from "@/lib/cat-agent";
import type { Chat, Message, AppSettings } from "@/lib/types";

export default function HomePage() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState<AppSettings>(loadSettings());
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Load chats on mount
  React.useEffect(() => {
    const loaded = loadChats();
    setChats(loaded);
    if (loaded.length > 0) {
      setCurrentChatId(loaded[0].id);
    }
  }, []);

  // Save chats when they change
  React.useEffect(() => {
    if (chats.length > 0) {
      saveChats(chats);
    }
  }, [chats]);

  // Save settings when they change
  React.useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const currentChat = chats.find((c) => c.id === currentChatId);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: nanoid(),
      title: "New Chat",
      createdAt: Date.now(),
      messages: [],
      meowOnly: settings.defaultMeowOnly,
      model: settings.defaultModel,
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      const remaining = chats.filter((c) => c.id !== chatId);
      setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title: newTitle } : c))
    );
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all conversations?")) {
      setChats([]);
      setCurrentChatId(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChat) {
      // Create new chat if none exists
      handleNewChat();
      return;
    }

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    // Update chat with user message
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === currentChatId) {
          const updatedMessages = [...c.messages, userMessage];
          // Update title if this is the first user message
          const newTitle =
            c.messages.length === 0 ? generateChatTitle(content) : c.title;
          return { ...c, messages: updatedMessages, title: newTitle };
        }
        return c;
      })
    );

    setIsStreaming(true);

    // CHECK IF CAT AGENT MODE IS ENABLED (no API calls!)
    if (settings.catAgentMode) {
      // Use local Cat Agent - FREE, no API calls!
      const catResponse = getCatResponse(content, settings.catPersonality);

      // Simulate a tiny delay for realism
      await new Promise(resolve => setTimeout(resolve, 500));

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: catResponse.content,
        createdAt: Date.now(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c
        )
      );

      playPurrSound(settings.purrSound);
      setIsStreaming(false);
      return;
    }

    // Otherwise, use the real AI API (costs money)
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...currentChat.messages, userMessage],
          model: currentChat.model,
          meowOnly: currentChat.meowOnly,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: "",
        createdAt: Date.now(),
      };

      // Add placeholder assistant message
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c
        )
      );

      // Stream the response
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // Update assistant message content
        setChats((prev) =>
          prev.map((c) => {
            if (c.id === currentChatId) {
              const updatedMessages = c.messages.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: assistantContent }
                  : m
              );
              return { ...c, messages: updatedMessages };
            }
            return c;
          })
        );
      }

      // Play purr sound if enabled
      playPurrSound(settings.purrSound);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error streaming message:", error);
        // Show error in chat
        const errorMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: `❌ Error: ${error.message}. Try enabling Cat Agent Mode for free responses!`,
          createdAt: Date.now(),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === currentChatId
              ? { ...c, messages: [...c.messages, errorMessage] }
              : c
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: c.messages.filter((m) => m.id !== messageId),
            }
          : c
      )
    );
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!currentChat) return;

    // Find the message to regenerate
    const messageIndex = currentChat.messages.findIndex(
      (m) => m.id === messageId
    );
    if (messageIndex === -1 || currentChat.messages[messageIndex].role !== "assistant") {
      return;
    }

    // Remove the assistant message we're regenerating
    const messagesUpToUser = currentChat.messages.slice(0, messageIndex);

    // Update chat
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId ? { ...c, messages: messagesUpToUser } : c
      )
    );

    // Find the last user message
    const lastUserMessage = messagesUpToUser
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUserMessage) return;

    // Re-send the last user message
    await handleSendMessage(lastUserMessage.content);
  };

  const handleMeowOnlyChange = (value: boolean) => {
    if (currentChat) {
      setChats((prev) =>
        prev.map((c) => (c.id === currentChatId ? { ...c, meowOnly: value } : c))
      );
    }
  };

  const handleModelChange = (model: string) => {
    if (currentChat) {
      setChats((prev) =>
        prev.map((c) => (c.id === currentChatId ? { ...c, model } : c))
      );
    }
  };

  // If no current chat, create one on first interaction
  if (!currentChat && chats.length === 0) {
    // Show empty state
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        meowOnly={currentChat?.meowOnly || settings.defaultMeowOnly}
        onMeowOnlyChange={handleMeowOnlyChange}
        model={currentChat?.model || settings.defaultModel}
        onModelChange={handleModelChange}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId || undefined}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onClearAll={handleClearAll}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 flex flex-col">
          <MessageList
            messages={currentChat?.messages || []}
            onDeleteMessage={handleDeleteMessage}
            onRegenerateMessage={handleRegenerateMessage}
            isStreaming={isStreaming}
          />

          <Composer
            onSend={handleSendMessage}
            onStop={handleStopStreaming}
            isStreaming={isStreaming}
          />
        </div>
      </div>

      {/* Settings modal - will be implemented in settings page */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

// Temporary settings modal component (to be moved to separate file)
function SettingsModal({
  settings,
  onSettingsChange,
  onClose,
}: {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-80 bg-background border-l border-border p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              Purr Sound
              <Switch
                checked={settings.purrSound}
                onCheckedChange={(value: boolean) =>
                  onSettingsChange({ ...settings, purrSound: value })
                }
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Play a purr sound when assistant completes a message
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              Compact Mode
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(value: boolean) =>
                  onSettingsChange({ ...settings, compactMode: value })
                }
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Use a more compact message layout
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              Default Meow-Only Mode
              <Switch
                checked={settings.defaultMeowOnly}
                onCheckedChange={(value: boolean) =>
                  onSettingsChange({ ...settings, defaultMeowOnly: value })
                }
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Enable meow-only mode for new conversations
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

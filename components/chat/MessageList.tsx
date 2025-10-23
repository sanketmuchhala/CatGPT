"use client";

import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./Message";
import type { Message as MessageType } from "@/lib/types";

interface MessageListProps {
  messages: MessageType[];
  onDeleteMessage?: (id: string) => void;
  onRegenerateMessage?: (id: string) => void;
  isStreaming?: boolean;
}

export function MessageList({
  messages,
  onDeleteMessage,
  onRegenerateMessage,
  isStreaming,
}: MessageListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Filter out system messages for display
  const visibleMessages = messages.filter((m) => m.role !== "system");

  const virtualizer = useVirtualizer({
    count: visibleMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  if (visibleMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="text-6xl">🐱</div>
          <p className="text-lg font-medium">Start a conversation with CatGPT</p>
          <p className="text-sm">Type a message below to begin</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea
      ref={scrollRef}
      className="flex-1 px-4 py-6"
    >
      <div ref={parentRef} className="space-y-4">
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const message = visibleMessages[virtualRow.index];
          return (
            <div
              key={message.id}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              <Message
                message={message}
                onDelete={
                  onDeleteMessage ? () => onDeleteMessage(message.id) : undefined
                }
                onRegenerate={
                  onRegenerateMessage &&
                  message.role === "assistant" &&
                  virtualRow.index === visibleMessages.length - 1
                    ? () => onRegenerateMessage(message.id)
                    : undefined
                }
              />
            </div>
          );
        })}

        {isStreaming && (
          <div className="flex justify-start">
            <div className="flex gap-1 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

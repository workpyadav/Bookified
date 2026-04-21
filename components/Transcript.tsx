'use client';

import React, { useEffect, useRef } from 'react';
import { IconMicrophone } from '@tabler/icons-react';

interface Message {
  role: 'user' | 'assistant' | string;
  content: string;
}

interface TranscriptProps {
  messages: Message[];
  currentMessage?: string;
  currentUserMessage?: string;
}

export default function Transcript({
  messages,
  currentMessage,
  currentUserMessage,
}: TranscriptProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage, currentUserMessage]);

  const hasMessages = messages.length > 0 || currentMessage || currentUserMessage;

  return (
    <div className="transcript-container">
      {!hasMessages ? (
        <div className="transcript-empty w-full max-w-md">
          <div className="bg-[#f8f4e9] p-6 rounded-full mb-4 w- ">
            <IconMicrophone className="w-12 h-12 text-[#663820]" />
          </div>
          <h3 className="transcript-empty-text">No conversation yet</h3>
          <p className="transcript-empty-hint">Click the mic button above to start talking</p>
        </div>
      ) : (
        <div className="transcript-messages">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`transcript-message ${
                  isUser ? 'transcript-message-user' : 'transcript-message-assistant'
                }`}
              >
                <div
                  className={`transcript-bubble ${
                    isUser ? 'transcript-bubble-user' : 'transcript-bubble-assistant'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Streaming Assistant Message */}
          {currentMessage && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}

          {/* Streaming User Message */}
          {currentUserMessage && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

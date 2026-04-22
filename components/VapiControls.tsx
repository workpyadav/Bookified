'use client';
import useVapi from '@/hooks/useVapi';
import { IBook } from '@/types';
import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'
import Image from 'next/image';
import React from 'react';
import Transcript from './Transcript';


const VapiControls = ({book}: {book: IBook}) => {
    const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearErrors, } = useVapi(book)
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
    
          <div className="vapi-main-container space-y-8">
        {/* Header Card */}
        <div className="vapi-header-card w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 w-full">
            {/* Left: Book Cover & Mic Button */}
            <div className="vapi-cover-wrapper">
              <Image
                src={book.coverURL || '/assets/images/book-placeholder.png'}
                alt={book.title}
                width={162}
                height={240}
                className="vapi-cover-image"
              />
              <div className="vapi-mic-wrapper flex items-center justify-center">
                {isActive && (status === 'speaking' || status === 'thinking') && (
                  <span className="vapi-pulse-ring" />
                )}
                <button 
                onClick={isActive ? stop : start} 
                disabled={status == 'connecting'}
                arial-label={isActive ? "Stop voice assistant" : "Start voice assistant"}
                title={isActive ? "Stop voice assistant" : "Start voice assistant"} 
                className="vapi-mic-btn shadow-soft-md relative z-10">
                  {isActive ? (
                    <IconMicrophone className="w-8 h-8 text-[#663820]" />
                  ) : (
                    <IconMicrophoneOff className="w-8 h-8 text-[#663820]" />
                  )}
                </button>
              </div>
            </div>

            {/* Right: Book Details & Badges */}
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left pt-2">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-primary)] mb-1">
                {book.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-6">
                by {book.author}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {/* Status Badge */}
                <div className="vapi-status-indicator shadow-soft-sm">
                  <span className={`vapi-status-dot vapi-status-dot-${status === 'idle' ? 'ready' : status === 'starting' ? 'connecting' : status}`} />
                  <span className="vapi-status-text">
                    {status === 'idle' ? 'Ready' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                {/* Voice Badge */}
                <div className="vapi-badge-ai shadow-soft-sm">
                  <span className="vapi-badge-ai-text">Voice: {book.persona || 'Default'}</span>
                </div>

                {/* Timer Badge */}
                <div className="vapi-status-indicator shadow-soft-sm">
                  <span className="vapi-status-text">{formatTime(duration)}/15:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="vapi-transcript-wrapper shadow-soft rounded-[14px]">
          <Transcript 
            messages={messages} 
            currentMessage={currentMessage} 
            currentUserMessage={currentUserMessage} 
          />
        </div>
    </div>
    </>
  )
}

export default VapiControls
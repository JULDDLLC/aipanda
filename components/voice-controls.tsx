"use client";

import { motion } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useVoice } from '@/hooks/use-voice';
import { useState } from 'react';

interface VoiceControlsProps {
  className?: string;
  compact?: boolean;
}

export function VoiceControls({ className = '', compact = false }: VoiceControlsProps) {
  const { 
    isPlaying, 
    volume, 
    isMuted, 
    toggleMute, 
    changeVolume, 
    stopAudio,
    isConfigured 
  } = useVoice();
  
  const [isExpanded, setIsExpanded] = useState(false);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative ${className}`}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="glass text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
        >
          <Settings className="w-4 h-4" />
        </Button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-12 right-0 glass rounded-2xl p-4 min-w-[250px] border border-white/20"
          >
            <VoiceControlsContent 
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              toggleMute={toggleMute}
              changeVolume={changeVolume}
              stopAudio={stopAudio}
              isConfigured={isConfigured}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-4 border border-white/20 glow ${className}`}
    >
      <VoiceControlsContent 
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        changeVolume={changeVolume}
        stopAudio={stopAudio}
        isConfigured={isConfigured}
      />
    </motion.div>
  );
}

interface VoiceControlsContentProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  toggleMute: () => void;
  changeVolume: (volume: number) => void;
  stopAudio: () => void;
  isConfigured: boolean;
}

function VoiceControlsContent({
  isPlaying,
  volume,
  isMuted,
  toggleMute,
  changeVolume,
  stopAudio,
  isConfigured
}: VoiceControlsContentProps) {
  return (
    <div className="space-y-3">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/70 font-medium">ElevenLabs Voice</span>
          {isConfigured ? (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-400 bg-orange-400/20 px-2 py-1 rounded-full">
                Not Configured
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Voice ID Display */}
      <div className="bg-black/20 rounded-lg p-2">
        <div className="text-xs text-white/60 mb-1">Voice ID:</div>
        <div className="text-xs font-mono text-white/90 bg-black/30 px-2 py-1 rounded">
          E95NigJoVU5BI8HjQeN3
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        {isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Button
              onClick={stopAudio}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
            >
              <Pause className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Mute/Unmute Button */}
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-green-400" />
            )}
          </motion.div>
        </Button>

        {/* Volume Slider */}
        <div className="flex items-center space-x-2 flex-1 min-w-[100px]">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={(value) => changeVolume(value[0] / 100)}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="text-xs text-white/70 w-10 text-right font-mono">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>

      {/* Configuration Help */}
      {!isConfigured && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
          <div className="text-xs text-orange-400 font-semibold mb-1">Setup Required:</div>
          <div className="text-xs text-white/80">
            Add your ElevenLabs API key to environment variables:
          </div>
          <div className="text-xs font-mono text-orange-300 mt-1 bg-black/30 px-2 py-1 rounded">
            NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key_here
          </div>
        </div>
      )}
    </div>
  );
}
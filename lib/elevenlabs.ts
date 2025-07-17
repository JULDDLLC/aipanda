// ElevenLabs API configuration and utilities

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
// Always use the specific voice ID you requested
const ELEVENLABS_VOICE_ID = 'E95NigJoVU5BI8HjQeN3';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export const elevenLabsConfig = {
  apiKey: ELEVENLABS_API_KEY,
  voiceId: ELEVENLABS_VOICE_ID,
  apiUrl: ELEVENLABS_API_URL,
};

export const isElevenLabsConfigured = (): boolean => {
  return Boolean(
    ELEVENLABS_API_KEY && 
    typeof ELEVENLABS_API_KEY === 'string' &&
    ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key' &&
    ELEVENLABS_API_KEY.length > 10
  );
};

export const generateSpeech = async (text: string): Promise<Blob | null> => {
  if (!isElevenLabsConfigured()) {
    console.warn('ElevenLabs not configured');
    return null;
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: text.substring(0, 500), // Limit text length
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      return null;
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
};

export const playAudio = (audioBlob: Blob, volume: number = 1.0) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.volume = Math.max(0, Math.min(1, volume)); // Clamp volume between 0 and 1
  
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
  });
  
  // Clean up the URL after playing
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(audioUrl);
  });

  return audio;
};
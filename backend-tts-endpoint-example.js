// Backend TTS Endpoint Example
// This should be implemented in your backend service (Python/Node.js/Express)

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ElevenLabs API configuration (securely stored in backend)
const ELEVENLABS_API_KEY = 'sk_8e3e26b39a9246efaa91e9fb1538f4f24810c334223dfe25';
const ELEVENLABS_VOICE_ID = 'zubqz6JC54rePKNCKZLG';

/**
 * POST /api/tts/speak
 * Generate speech using ElevenLabs API
 */
app.post('/api/tts/speak', async (req, res) => {
  try {
    const { text, voiceMeta } = req.body;
    
    console.log('🎤 Backend TTS Request:', { text: text.substring(0, 50), voiceMeta });
    
    // Check ElevenLabs subscription first
    const userResponse = await axios.get('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': ELEVENLABS_API_KEY }
    });
    
    const subscription = userResponse.data.subscription;
    const tier = subscription.tier.toLowerCase();
    
    // Check if TTS is available on current plan
    if (tier === 'free') {
      console.log('❌ ElevenLabs free tier - TTS not available');
      return res.status(402).json({
        error: 'ElevenLabs TTS unavailable on current plan (free tier limitation)',
        available: false,
        reason: 'free tier limitation'
      });
    }
    
    if (subscription.character_count >= subscription.character_limit) {
      console.log('❌ ElevenLabs quota exceeded');
      return res.status(402).json({
        error: 'ElevenLabs character quota exceeded',
        available: false,
        reason: 'quota exceeded'
      });
    }
    
    // Generate speech
    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('✅ ElevenLabs TTS Success:', ttsResponse.data.byteLength, 'bytes');
    
    // Return audio buffer
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': ttsResponse.data.byteLength
    });
    
    res.send(ttsResponse.data);
    
  } catch (error) {
    console.error('❌ Backend TTS Error:', error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({
        error: 'TTS unavailable - backend authentication issue',
        available: false
      });
    } else if (error.response?.status === 429) {
      res.status(429).json({
        error: 'TTS temporarily unavailable - rate limited',
        available: false
      });
    } else {
      res.status(500).json({
        error: 'TTS service unavailable',
        available: false
      });
    }
  }
});

/**
 * GET /api/tts/status
 * Check TTS service availability
 */
app.get('/api/tts/status', async (req, res) => {
  try {
    const userResponse = await axios.get('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': ELEVENLABS_API_KEY }
    });
    
    const subscription = userResponse.data.subscription;
    const tier = subscription.tier.toLowerCase();
    
    let available = true;
    let reason = 'TTS available';
    
    if (tier === 'free') {
      available = false;
      reason = 'ElevenLabs TTS unavailable on current plan (free tier limitation)';
    } else if (subscription.character_count >= subscription.character_limit) {
      available = false;
      reason = 'ElevenLabs character quota exceeded';
    }
    
    res.json({ available, reason, tier, subscription });
    
  } catch (error) {
    res.json({ 
      available: false, 
      reason: 'Unable to check TTS service status' 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🎤 Backend TTS Service running on port ${PORT}`);
});

module.exports = app;

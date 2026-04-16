import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { screenService } from '../services/screen-service';
import { useMascotSpeech } from './MascotCenterStage';
import { backendService } from '../services/backend-service';
import { VoiceService } from '../services/VoiceService';

interface EmotionChatInterfaceProps {
  className?: string;
  placeholder?: string;
  showVoiceControls?: boolean;
  maxHistoryItems?: number;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: any) => void;
}

export const EmotionChatInterface: React.FC<EmotionChatInterfaceProps> = ({
  className = '',
  placeholder = 'Ask Mavis anything...',
  showVoiceControls = true,
  maxHistoryItems = 5,
  onMessageSent,
  onResponseReceived
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const clearError = () => setError(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { speak } = useMascotSpeech();
  const inputRef = useRef<HTMLInputElement>(null);

  // Chat functions
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await backendService.sendMessage(message);
      setLastResponse(response);
      setChatHistory(prev => [...prev, { message, response, timestamp: Date.now() }]);
      onResponseReceived?.(response);
      
      // Optional TTS (non-blocking)
      if (voiceEnabled && response?.replyText) {
        console.log('🗣️ TTS TRIGGER: AI response received, speaking:', response.replyText);
        VoiceService.getInstance().speak(response.replyText);
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = () => {
    if (lastResponse) {
      sendMessage(inputMessage);
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
    setLastResponse(null);
  };

  // Speech recognition setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('🎤 Speech recognition started');
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputMessage(transcript);
        console.log('🎤 Speech result:', transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        console.log('🎤 Speech recognition ended');
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSendMessage = async () => {
    console.log('🔍 handleSendMessage called:', { inputMessage, isLoading });
    if (!inputMessage.trim() || isLoading) {
      console.log('🔍 Message not sent:', { 
        hasInput: !!inputMessage.trim(), 
        isLoading,
        inputLength: inputMessage.length 
      });
      return;
    }

    const message = inputMessage.trim();
    console.log('🔍 Sending message:', message);
    setInputMessage('');
    clearError();

    try {
      onMessageSent?.(message);
      await sendMessage(message);
      
      onResponseReceived?.(lastResponse);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('🔍 Key pressed:', { key: e.key, shiftKey: e.shiftKey });
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('🔍 Enter key detected, calling handleSendMessage');
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const toggleListening = () => {
    if (!recognition) {
      screenService.showError('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleRetry = async () => {
    try {
      await retryLastMessage();
    } catch (error) {
      console.error('❌ Failed to retry message:', error);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    screenService.showSuccess('Chat history cleared');
  };

  return (
    <div className={`emotion-chat-interface ${className}`}>
      {/* Chat History */}
      <div className="chat-history mb-4 max-h-96 overflow-y-auto space-y-3">
        <AnimatePresence>
          {chatHistory.slice(-maxHistoryItems).map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md bg-blue-600 text-white rounded-2xl px-4 py-2 shadow-lg">
                  <p className="text-sm">{chat.message}</p>
                  <span className="text-xs opacity-75">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 shadow-lg">
                  <p className="text-sm">{chat.response.replyText}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {chat.response.emotion} • {chat.response.mascotAction}
                    </span>
                    {voiceEnabled && (
                      <button
                        onClick={() => {
                          // Trigger TTS for this response
                          window.dispatchEvent(new CustomEvent('speakText', {
                            detail: { text: chat.response.replyText, voice: chat.response.voiceMeta }
                          }));
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                   
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
                <button
                  onClick={handleRetry}
                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Controls */}
      <div className="input-controls space-y-3">
        {/* Voice Status Indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-2 bg-red-50 rounded-lg"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-700">Listening... Speak now!</span>
          </motion.div>
        )}

        {/* Input Field */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => {
              console.log('🔍 Input changed:', e.target.value);
              setInputMessage(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening..." : placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500 disabled:opacity-50"
          />

          {/* Voice Controls */}
          {showVoiceControls && (
            <>
              {/* Voice Toggle */}
              <button
                onClick={toggleVoice}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  voiceEnabled 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                } disabled:opacity-50`}
                title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Microphone */}
              <button
                onClick={toggleListening}
                disabled={isLoading || !recognition}
                className={`p-2 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </>
          )}

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>{chatHistory.length} messages</span>
            {lastResponse && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Last: {lastResponse.emotion}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {chatHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="hover:text-gray-700 transition-colors"
              >
                Clear History
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

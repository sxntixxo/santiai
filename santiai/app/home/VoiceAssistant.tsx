import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/VoiceAssistant/VoiceAssistant.styles';
import ElevenLabsService from '../../services/ElevenLabsService';
import { useAudioManager } from '../../hooks/useAudioManager';

export const options = { headerShown: false };

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const VoiceAssistant = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const elevenLabsService = useRef<ElevenLabsService | null>(null);
  const audioManager = useAudioManager();
  
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'Conectando con tu asistente médico virtual...',
      timestamp: new Date(),
    },
  ]);

  // Inicializar ElevenLabs al montar el componente
  useEffect(() => {
    initializeElevenLabs();
    
    return () => {
      // Limpiar al desmontar
      if (elevenLabsService.current) {
        elevenLabsService.current.disconnect();
      }
    };
  }, []);

  // Scroll automático cuando se agregan mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeElevenLabs = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
      const agentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;

      if (!apiKey || !agentId) {
        setConnectionError('Configuración de ElevenLabs no encontrada. Verifica tus variables de entorno.');
        return;
      }

      // Crear servicio de ElevenLabs
      elevenLabsService.current = new ElevenLabsService({
        apiKey,
        agentId,
      });

      // Configurar callbacks
      elevenLabsService.current.onConnected(() => {
        setIsConnected(true);
        setConnectionError(null);
        setMessages([{
          id: '1',
          role: 'assistant',
          text: '¡Hola! Soy SANTIAI, tu asistente médico virtual. Presiona el micrófono para comenzar tu consulta médica.',
          timestamp: new Date(),
        }]);
      });

      elevenLabsService.current.onMessage((message) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: message.role,
          text: message.text,
          timestamp: message.timestamp,
        };
        setMessages(prev => [...prev, newMessage]);
      });

      elevenLabsService.current.onError((error) => {
        setConnectionError(error);
        setIsProcessing(false);
      });

      // Conectar
      await elevenLabsService.current.connect();

    } catch (error) {
      console.error('Error initializing ElevenLabs:', error);
      setConnectionError('Error al conectar con el asistente. Intenta nuevamente.');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleChatVisibility = () => setIsChatVisible((prev) => !prev);

  const handleMicPress = async () => {
    if (!isConnected) {
      Alert.alert('Error', 'No hay conexión con el asistente. Intenta nuevamente.');
      return;
    }

    if (elevenLabsService.current?.inConversation) {
      if (audioManager.state.isRecording) {
        // Detener grabación y enviar audio
        try {
          setIsProcessing(true);
          const audioUri = await audioManager.stopRecording();
          
          if (audioUri && elevenLabsService.current) {
            // Enviar audio a ElevenLabs
            await elevenLabsService.current.sendAudio(audioUri);
          }
          setIsProcessing(false);
        } catch (error) {
          console.error('Error sending audio:', error);
          setIsProcessing(false);
        }
      } else {
        // Iniciar grabación dentro de la conversación
        try {
          await audioManager.startRecording();
          
          const listeningMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: 'Escuchando...',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, listeningMessage]);
        } catch (error) {
          console.error('Error starting recording:', error);
        }
      }
    } else {
      // Iniciar conversación continua
      try {
        if (!audioManager.state.hasPermission) {
          const granted = await audioManager.requestPermissions();
          if (!granted) return;
        }

        await elevenLabsService.current?.startConversation();
        
        const conversationMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: 'Conversación iniciada - Presiona el micrófono para hablar...',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, conversationMessage]);
        
      } catch (error) {
        console.error('Error starting conversation:', error);
        Alert.alert('Error', 'No se pudo iniciar la conversación');
      }
    }
  };

  const getConnectionStatus = () => {
    if (connectionError) {
      return { text: 'Error de conexión', color: '#EF4444' };
    }
    if (!isConnected) {
      return { text: 'Conectando...', color: '#F59E0B' };
    }
    return { text: 'Conectado', color: '#10B981' };
  };

  const getMicButtonState = () => {
    if (!isConnected) return 'mic-off';
    if (isProcessing) return 'hourglass';
    if (elevenLabsService.current?.inConversation) {
      if (audioManager.state.isRecording) return 'mic';
      return 'mic-circle';
    }
    return 'mic-outline';
  };

  return (
    <View style={[styles.container, { flex: 1, paddingTop: StatusBar.currentHeight || 44 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Asistente por Voz</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={toggleChatVisibility}>
          <Ionicons
            name={isChatVisible ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      <View style={styles.statusBar}>
        <View style={[styles.statusIndicator, { backgroundColor: getConnectionStatus().color }]} />
        <Text style={styles.statusText}>{getConnectionStatus().text}</Text>
        {elevenLabsService.current?.inConversation && (
          <Text style={styles.recordingTime}>
            {audioManager.state.isRecording 
              ? `${Math.floor(audioManager.state.duration / 60)}:${(audioManager.state.duration % 60).toString().padStart(2, '0')}`
              : 'En conversación - Toca para hablar'
            }
          </Text>
        )}
      </View>

      {/* Error Message */}
      {connectionError && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={20} color="#EF4444" />
          <Text style={styles.errorText}>{connectionError}</Text>
          <TouchableOpacity onPress={initializeElevenLabs} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat or Minimalist View */}
      {isChatVisible ? (
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={message.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText}>
                {message.text}
              </Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          ))}
          
          {isProcessing && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <Text style={styles.assistantBubbleText}>
                SANTIAI está procesando tu consulta...
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.minimalistContainer}>
          <Text style={styles.minimalistTitle}>Habla con SANTIAI</Text>
          <Text style={styles.minimalistSubtitle}>
            {!isConnected 
              ? 'Conectando con tu asistente médico...' 
              : 'Presiona el micrófono para hablar'
            }
          </Text>
          {elevenLabsService.current?.inConversation && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                {audioManager.state.isRecording ? 'Grabando...' : 'En conversación - Toca para hablar'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom Bar with Microphone */}
      <BlurView intensity={80} tint="light" style={styles.bottomBar}>
        {elevenLabsService.current?.inConversation && (
          <TouchableOpacity 
            style={[styles.micButton, { backgroundColor: '#EF4444', marginRight: 20 }]} 
            onPress={async () => {
              try {
                await elevenLabsService.current?.stopConversation();
                const endMessage: Message = {
                  id: Date.now().toString(),
                  role: 'assistant',
                  text: 'Conversación terminada.',
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, endMessage]);
              } catch (error) {
                console.error('Error ending conversation:', error);
              }
            }}
          >
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.micButton,
            !isConnected && styles.micButtonDisabled,
            (elevenLabsService.current?.inConversation && audioManager.state.isRecording) && styles.micButtonRecording
          ]} 
          onPress={handleMicPress}
          disabled={!isConnected && !connectionError}
        >
          <Ionicons 
            name={getMicButtonState()} 
            size={32} 
            color={!isConnected ? '#9CA3AF' : '#fff'} 
          />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

export default VoiceAssistant;

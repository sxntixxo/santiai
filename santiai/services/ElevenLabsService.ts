import { Audio } from 'expo-av';

interface ElevenLabsConfig {
  apiKey: string;
  agentId: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private conversationId: string | null = null;
  private onMessageCallback?: (message: ConversationMessage) => void;
  private onErrorCallback?: (error: string) => void;
  private onConnectedCallback?: () => void;
  private audioQueue: string[] = [];
  private currentSound: Audio.Sound | null = null;

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  // Conectar al agente conversacional
  async connect(): Promise<void> {
    try {
      // Incluir la API key en la URL como parámetro de consulta
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${this.config.agentId}&xi-api-key=${this.config.apiKey}`;

      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('Connected to ElevenLabs Conversational AI');
        this.isConnected = true;
        this.onConnectedCallback?.();
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onErrorCallback?.('Error de conexión con el asistente');
      };

      this.websocket.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      this.onErrorCallback?.('No se pudo conectar al asistente');
    }
  }

  // Manejar mensajes del WebSocket
  private handleWebSocketMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data.type);

      switch (data.type) {
        case 'conversation_initiation_metadata':
          this.conversationId = data.conversation_initiation_metadata_event?.conversation_id;
          console.log('Conversation initiated:', this.conversationId);
          break;

        case 'audio':
          // Recibir audio del asistente
          if (data.audio_event?.audio_base_64) {
            this.handleAudioResponse(data.audio_event.audio_base_64);
          }
          break;

        case 'user_transcript':
          // Transcripción del usuario
          if (data.user_transcript_event?.user_transcript) {
            const userMessage: ConversationMessage = {
              role: 'user',
              text: data.user_transcript_event.user_transcript,
              timestamp: new Date(),
            };
            this.onMessageCallback?.(userMessage);
          }
          break;

        case 'agent_response':
          // Respuesta del agente en texto
          if (data.agent_response_event?.agent_response) {
            const agentMessage: ConversationMessage = {
              role: 'assistant',
              text: data.agent_response_event.agent_response,
              timestamp: new Date(),
            };
            this.onMessageCallback?.(agentMessage);
          }
          break;

        case 'ping':
          // Responder al ping para mantener conexión
          if (this.websocket) {
            this.websocket.send(JSON.stringify({ type: 'pong' }));
          }
          break;

        default:
          console.log('Unknown message type:', data.type);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Manejar respuesta de audio del asistente
  private async handleAudioResponse(audioBase64: string) {
    try {
      // Convertir base64 a blob y crear URL
      const audioBlob = this.base64ToBlob(audioBase64, 'audio/mpeg');
      const audioUrl = URL.createObjectURL(audioBlob);

      // Agregar a la cola de reproducción
      this.audioQueue.push(audioUrl);

      // Si no hay audio reproduciéndose, empezar reproducción
      if (!this.currentSound) {
        await this.playNextAudio();
      }
    } catch (error) {
      console.error('Error handling audio response:', error);
    }
  }

  // Reproducir siguiente audio en la cola
  private async playNextAudio() {
    if (this.audioQueue.length === 0) {
      this.currentSound = null;
      return;
    }

    const audioUrl = this.audioQueue.shift()!;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      this.currentSound = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          this.playNextAudio(); // Reproducir siguiente en la cola
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNextAudio(); // Intentar con el siguiente
    }
  }

  // Enviar audio del usuario
  async sendAudio(audioUri: string): Promise<void> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('No conectado al asistente');
    }

    try {
      // Leer el archivo de audio
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();
      const audioBase64 = await this.blobToBase64(audioBlob);

      // Remover el prefijo data:audio/...;base64, si existe
      const base64Data = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;

      // Enviar audio al WebSocket según la documentación de ElevenLabs
      const message = {
        user_audio_chunk: base64Data,
      };

      this.websocket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending audio:', error);
      throw error;
    }
  }

  // Desconectar
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.isConnected = false;
    this.conversationId = null;

    // Limpiar audio
    if (this.currentSound) {
      this.currentSound.unloadAsync();
      this.currentSound = null;
    }
    this.audioQueue = [];
  }

  // Callbacks para eventos
  onMessage(callback: (message: ConversationMessage) => void): void {
    this.onMessageCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  onConnected(callback: () => void): void {
    this.onConnectedCallback = callback;
  }

  // Utilidades
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Getters
  get connected(): boolean {
    return this.isConnected;
  }
}

export default ElevenLabsService;
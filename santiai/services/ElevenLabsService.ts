import { Audio } from 'expo-av';

interface ElevenLabsConfig {
  apiKey: string;
  agentId: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private isInConversation: boolean = false;
  private onMessageCallback?: (message: ConversationMessage) => void;
  private onErrorCallback?: (error: string) => void;
  private onConnectedCallback?: () => void;
  private currentSound: Audio.Sound | null = null;

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${this.config.agentId}&xi-api-key=${this.config.apiKey}`;
      
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('Connected to ElevenLabs Conversational AI');
        this.isConnected = true;
        this.onConnectedCallback?.();
      };

      this.websocket.onmessage = (event) => {
        this.handleMessage(event);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onErrorCallback?.('Error de conexión');
      };

      this.websocket.onclose = () => {
        console.log('WebSocket closed');
        this.isConnected = false;
        this.isInConversation = false;
      };

    } catch (error) {
      console.error('Failed to connect:', error);
      this.onErrorCallback?.('No se pudo conectar');
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'conversation_initiation_metadata':
          console.log('Conversation initiated');
          break;

        case 'audio':
          if (data.audio_event?.audio_base_64) {
            this.playAudio(data.audio_event.audio_base_64);
          }
          break;

        case 'user_transcript':
          if (data.user_transcript_event?.user_transcript) {
            this.onMessageCallback?.({
              role: 'user',
              text: data.user_transcript_event.user_transcript,
              timestamp: new Date(),
            });
          }
          break;

        case 'agent_response':
          if (data.agent_response_event?.agent_response) {
            this.onMessageCallback?.({
              role: 'assistant',
              text: data.agent_response_event.agent_response,
              timestamp: new Date(),
            });
          }
          break;

        case 'ping':
          this.websocket?.send(JSON.stringify({ type: 'pong' }));
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  private async playAudio(audioBase64: string) {
    try {
      if (this.currentSound) {
        await this.currentSound.unloadAsync();
      }

      // Crear blob URL para el audio
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      this.currentSound = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          URL.revokeObjectURL(audioUrl);
        }
      });

    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback: intentar con data URI
      try {
        const audioUri = `data:audio/mp3;base64,${audioBase64}`;
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );
        this.currentSound = sound;
      } catch (fallbackError) {
        console.error('Fallback audio error:', fallbackError);
      }
    }
  }

  async startConversation(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('No conectado');
    }
    this.isInConversation = true;
    console.log('Conversación iniciada');
  }

  async stopConversation(): Promise<void> {
    this.isInConversation = false;
    console.log('Conversación terminada');
  }

  async sendAudio(audioUri: string): Promise<void> {
    if (!this.websocket || !this.isConnected) {
      throw new Error('No conectado');
    }

    try {
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();
      const audioBase64 = await this.blobToBase64(audioBlob);
      const base64Data = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;

      this.websocket.send(JSON.stringify({
        user_audio_chunk: base64Data,
      }));
    } catch (error) {
      console.error('Error sending audio:', error);
      throw error;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  disconnect(): void {
    this.stopConversation();
    this.websocket?.close();
    this.websocket = null;
    this.isConnected = false;
    
    if (this.currentSound) {
      this.currentSound.unloadAsync();
    }
  }

  onMessage(callback: (message: ConversationMessage) => void): void {
    this.onMessageCallback = callback;
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  onConnected(callback: () => void): void {
    this.onConnectedCallback = callback;
  }

  get connected(): boolean {
    return this.isConnected;
  }

  get inConversation(): boolean {
    return this.isInConversation;
  }
}

export default ElevenLabsService;
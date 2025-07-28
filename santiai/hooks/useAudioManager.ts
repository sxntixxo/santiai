import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

interface AudioManagerState {
    isRecording: boolean;
    isPlaying: boolean;
    hasPermission: boolean;
    recordingUri: string | null;
    duration: number;
}

interface UseAudioManagerReturn {
    state: AudioManagerState;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<string | null>;
    playAudio: (uri: string) => Promise<void>;
    stopAudio: () => Promise<void>;
    requestPermissions: () => Promise<boolean>;
}

export const useAudioManager = (): UseAudioManagerReturn => {
    const [state, setState] = useState<AudioManagerState>({
        isRecording: false,
        isPlaying: false,
        hasPermission: false,
        recordingUri: null,
        duration: 0,
    });

    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const durationInterval = useRef<number | null>(null);

    useEffect(() => {
        // Configurar audio al montar el componente
        const initializeAudio = async () => {
            await setupAudio();
            // Verificar permisos iniciales sin solicitar
            try {
                const { status } = await Audio.getPermissionsAsync();
                setState(prev => ({ ...prev, hasPermission: status === 'granted' }));
            } catch (error) {
                console.error('Error checking initial permissions:', error);
            }
        };

        initializeAudio();

        return () => {
            // Limpiar al desmontar
            cleanup();
        };
    }, []);

    const setupAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: false,
            });
        } catch (error) {
            console.error('Error setting up audio:', error);
        }
    };

    const cleanup = async () => {
        if (recordingRef.current) {
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (error) {
                console.error('Error cleaning up recording:', error);
            }
        }

        if (soundRef.current) {
            try {
                await soundRef.current.unloadAsync();
            } catch (error) {
                console.error('Error cleaning up sound:', error);
            }
        }

        if (durationInterval.current) {
            clearInterval(durationInterval.current);
        }
    };

    const requestPermissions = async (): Promise<boolean> => {
        try {
            // Primero verificar permisos actuales
            const { status: currentStatus } = await Audio.getPermissionsAsync();

            if (currentStatus === 'granted') {
                setState(prev => ({ ...prev, hasPermission: true }));
                return true;
            }

            // Si no están otorgados, solicitarlos
            const { status } = await Audio.requestPermissionsAsync();
            const hasPermission = status === 'granted';

            setState(prev => ({ ...prev, hasPermission }));

            if (!hasPermission) {
                Alert.alert(
                    'Permisos necesarios',
                    'SANTIAI necesita acceso al micrófono para poder escucharte. Por favor, otorga los permisos en la configuración.',
                    [{ text: 'OK' }]
                );
            }

            return hasPermission;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            setState(prev => ({ ...prev, hasPermission: false }));
            return false;
        }
    };

    const startRecording = async (): Promise<void> => {
        try {
            // Verificar permisos
            if (!state.hasPermission) {
                const granted = await requestPermissions();
                if (!granted) return;
            }

            // Limpiar grabación anterior si existe
            if (recordingRef.current) {
                await recordingRef.current.stopAndUnloadAsync();
                recordingRef.current = null;
            }

            // Configurar opciones de grabación optimizadas para ElevenLabs
            const recordingOptions: Audio.RecordingOptions = {
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 64000,
                },
                ios: {
                    extension: '.m4a',
                    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 64000,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 64000,
                },
            };

            // Crear nueva grabación
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(recordingOptions);
            await recording.startAsync();

            recordingRef.current = recording;

            setState(prev => ({
                ...prev,
                isRecording: true,
                duration: 0
            }));

            // Iniciar contador de duración
            durationInterval.current = setInterval(() => {
                setState(prev => ({ ...prev, duration: prev.duration + 1 }));
            }, 1000) as unknown as number;

        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Error', 'No se pudo iniciar la grabación');
        }
    };

    const stopRecording = async (): Promise<string | null> => {
        try {
            if (!recordingRef.current) {
                return null;
            }

            // Detener grabación
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();

            recordingRef.current = null;

            // Limpiar estado
            setState(prev => ({
                ...prev,
                isRecording: false,
                recordingUri: uri
            }));

            // Limpiar intervalo
            if (durationInterval.current) {
                clearInterval(durationInterval.current);
                durationInterval.current = null;
            }

            return uri;
        } catch (error) {
            console.error('Error stopping recording:', error);
            Alert.alert('Error', 'No se pudo detener la grabación');
            return null;
        }
    };

    const playAudio = async (uri: string): Promise<void> => {
        try {
            // Detener audio anterior si existe
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            // Crear y reproducir nuevo audio
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );

            soundRef.current = sound;

            setState(prev => ({ ...prev, isPlaying: true }));

            // Configurar callback para cuando termine
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setState(prev => ({ ...prev, isPlaying: false }));
                    sound.unloadAsync();
                    soundRef.current = null;
                }
            });

        } catch (error) {
            console.error('Error playing audio:', error);
            Alert.alert('Error', 'No se pudo reproducir el audio');
        }
    };

    const stopAudio = async (): Promise<void> => {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            setState(prev => ({ ...prev, isPlaying: false }));
        } catch (error) {
            console.error('Error stopping audio:', error);
        }
    };

    return {
        state,
        startRecording,
        stopRecording,
        playAudio,
        stopAudio,
        requestPermissions,
    };
};
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { styles } from '../../styles/VoiceAssistant/VoiceAssistant.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const options = { headerShown: false };

export default function VoiceAssistant() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('Aquí aparecerá lo que digas...');
  const [aiResponse, setAiResponse] = useState('Presiona el micrófono para comenzar tu consulta médica virtual.');

  // Simulación de grabación y respuesta
  const handleMicPress = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscription('Escuchando...');
      setTimeout(() => {
        setTranscription('Doctor, he estado sintiendo dolor de cabeza constante desde hace tres días, especialmente en las mañanas. También tengo un poco de náuseas y sensibilidad a la luz.');
      }, 2000);
      setTimeout(() => {
        setIsRecording(false);
        setAiResponse('Basándome en los síntomas que describes (dolor de cabeza persistente, náuseas y fotofobia), podrían indicar una migraña o cefalea tensional. Te recomiendo: 1) Descansar en un lugar oscuro y silencioso, 2) Aplicar compresas frías en la frente, 3) Mantenerte hidratado, 4) Si los síntomas persisten más de 24 horas o empeoran, consulta con un médico presencialmente. ¿Has tenido episodios similares antes?');
      }, 5000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente por Voz</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.centeredText}>
          <Text style={styles.title}>Habla con SANTIAI</Text>
          <Text style={styles.subtitle}>Presiona el micrófono y describe tus síntomas</Text>
        </View>

        {/* Mic Button */}
        <View style={styles.micContainer}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={handleMicPress}
            activeOpacity={0.8}
          >
            <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={64} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Estado de grabación */}
        {isRecording && (
          <View style={styles.recordingStatus}>
            <View style={styles.pulseDot} />
            <Text style={styles.recordingText}>Escuchando...</Text>
          </View>
        )}

        {/* Transcripción */}
        <View style={styles.cardSecondary}>
          <Text style={styles.cardTitle}>Transcripción:</Text>
          <Text style={styles.cardText}>{transcription}</Text>
        </View>

        {/* Respuesta del asistente */}
        <View style={styles.cardPrimary}>
          <Text style={styles.cardTitle}>Respuesta de SANTIAI:</Text>
          <Text style={styles.cardText}>{aiResponse}</Text>
        </View>

        {/* Instrucciones */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Tip: Sé específico sobre tus síntomas, duración y cualquier información relevante
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

 
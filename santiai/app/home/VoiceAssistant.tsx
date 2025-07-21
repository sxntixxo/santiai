import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  headerBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  centeredText: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    alignSelf: 'center',
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  micButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    marginRight: 8,
  },
  recordingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  cardSecondary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardPrimary: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    minHeight: 32,
  },
  instructionsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
}); 
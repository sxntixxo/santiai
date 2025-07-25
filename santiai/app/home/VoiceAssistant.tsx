import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/VoiceAssistant/VoiceAssistant.styles';

export const options = { headerShown: false };

const VoiceAssistant = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Presiona el micrófono para comenzar tu consulta médica virtual.',
    },
  ]);

  const toggleChatVisibility = () => setIsChatVisible((prev) => !prev);

  const handleMicPress = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setMessages((prev) => [...prev, { role: 'user', text: 'Escuchando...' }]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                role: 'user',
                text: 'Doctor, he estado sintiendo dolor de cabeza constante desde hace tres días, especialmente en las mañanas. También tengo un poco de náuseas y sensibilidad a la luz.',
              }
            : msg
        )
      );

      setTimeout(() => {
        setIsRecording(false);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Basándome en los síntomas que describes (dolor de cabeza persistente, náuseas y fotofobia), podrían indicar una migraña o cefalea tensional. Te recomiendo: 1) Descansar en un lugar oscuro y silencioso, 2) Aplicar compresas frías en la frente, 3) Mantenerte hidratado, 4) Si los síntomas persisten más de 24 horas o empeoran, consulta con un médico presencialmente. ¿Has tenido episodios similares antes?',
          },
        ]);
      }, 2000);
    }, 2000);
  };

  return (
    <View style={[styles.container, { flex: 1, paddingTop: StatusBar.currentHeight || 44 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Asistente por Voz</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={toggleChatVisibility}>
          <Ionicons
            name={isChatVisible ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {isChatVisible ? (
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={message.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText}>
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.minimalistContainer}>
          <Text style={styles.minimalistTitle}>Habla con SANTIAI</Text>
          <Text style={styles.minimalistSubtitle}>Presiona el micrófono para hablar</Text>
        </View>
      )}

      <BlurView intensity={80} tint="light" style={styles.bottomBar}>
        <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
          <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={32} color="#fff" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

export default VoiceAssistant;

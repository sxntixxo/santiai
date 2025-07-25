import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { styles } from '../../styles/HomeScreen/HomeScreen.styles';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const HomeScreen = () => {
  return (
    <View style={[styles.container, { flex: 1, paddingTop: StatusBar.currentHeight || 44 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <FontAwesome name="stethoscope" size={20} color="#000" />
          </View>
          <Text style={styles.headerTitle}>SANTIAI</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenido a SANTIAI</Text>
          <Text style={styles.welcomeSubtitle}>Tu asistente médico virtual inteligente</Text>
        </View>

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Asistente por Voz Card */}
          <TouchableOpacity style={styles.card} onPress={() => router.push('/home/VoiceAssistant')}>
            <View style={styles.cardIconContainer}>
              <FontAwesome name="microphone" size={32} color="#fff" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Asistente por Voz</Text>
              <Text style={styles.cardSubtitle}>Consulta médica mediante comandos de voz inteligentes</Text>
            </View>
            <View style={styles.arrowContainer}>
              <FontAwesome name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Asistente con Cámara Card */}
          <TouchableOpacity style={styles.card} onPress={() => router.push('/home/CameraAssistant')}>
            <View style={styles.cardIconContainer}>
              <FontAwesome name="camera" size={32} color="#fff" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Asistente con Cámara</Text>
              <Text style={styles.cardSubtitle}>Análisis médico visual mediante inteligencia artificial</Text>
            </View>
            <View style={styles.arrowContainer}>
              <FontAwesome name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* How it works section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.howItWorksTitle}>¿Cómo funciona SANTIAI?</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepText}>Describe tus síntomas por voz o mediante imágenes</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.stepText}>Nuestra IA analiza la información médica</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <Text style={styles.stepText}>Recibe recomendaciones y orientación médica</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
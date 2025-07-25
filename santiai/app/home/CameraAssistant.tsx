import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform, ScrollView, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import { styles } from '../../styles/CameraAssistant/CameraAssistant.styles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export const options = { headerShown: false };

export default function CameraAssistant() {
  const router = useRouter();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showResponsePanel, setShowResponsePanel] = useState(false);
  const cameraRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();

  const handleToggleFlash = () => setFlashEnabled((prev) => !prev);

  const handleSwitchCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleCapturePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Simular captura de foto
        const mockImageUri = 'https://via.placeholder.com/400x300/cccccc/666666?text=Imagen+Capturada';
        setCapturedImage(mockImageUri);
        setShowResponsePanel(true);
        setProcessing(true);
        setShowResults(false);

        // Animar el panel hacia arriba
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Simular procesamiento
        setTimeout(() => {
          setProcessing(false);
          setShowResults(true);
        }, 3000);
      } catch (error) {
        console.error('Error capturando foto:', error);
      }
    }
  };

  const handleOpenGallery = async () => {
    try {
      // Solicitar permisos primero
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Se necesita permiso para acceder a la galería de fotos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Optimizar calidad para mejor rendimiento
        exif: false, // No necesitamos datos EXIF
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setShowResponsePanel(true);
        setProcessing(true);
        setShowResults(false);

        // Animar el panel hacia arriba
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Simular procesamiento
        setTimeout(() => {
          setProcessing(false);
          setShowResults(true);
        }, 3000);
      }
    } catch (error) {
      console.error('Error abriendo galería:', error);
      alert('Error al acceder a la galería');
    }
  };

  const handleRetakePhoto = () => {
    setShowResponsePanel(false);
    setCapturedImage(null);
    setProcessing(false);
    setShowResults(false);

    // Animar el panel hacia abajo
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleShareResults = () => {
    // Implementar funcionalidad de compartir
    console.log('Compartir resultados');
  };

  // Mostrar mensaje especial en plataformas no móviles
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return (
      <View style={[styles.container, { paddingTop: StatusBar.currentHeight || 44 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>La cámara solo está disponible en dispositivos móviles.</Text>
        </View>
      </View>
    );
  }

  // Mostrar estado de permisos
  if (!permission) {
    return (
      <View style={[styles.container, { paddingTop: StatusBar.currentHeight || 44 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Solicitando permiso de cámara...</Text>
        </View>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: StatusBar.currentHeight || 44 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Necesitamos tu permiso para mostrar la cámara</Text>
          <TouchableOpacity onPress={requestPermission} style={{ marginTop: 16, backgroundColor: '#000', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Conceder permiso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header flotante */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.floatingHeaderBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.floatingHeaderBtn} onPress={handleToggleFlash}>
            <Ionicons name={flashEnabled ? 'flash' : 'flash-outline'} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingHeaderBtn} onPress={handleSwitchCamera}>
            <MaterialCommunityIcons name="camera-switch" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Área de cámara a pantalla completa */}
      <View style={styles.fullScreenCamera}>
        {(Platform.OS === 'ios' || Platform.OS === 'android') && (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={cameraType}
            enableTorch={flashEnabled}
          />
        )}

        {/* Overlay de guías */}
        <View style={styles.guideOverlay} pointerEvents="none">
          <View style={styles.guideBox} />
        </View>

        {/* Controles inferiores */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.sideControlBtn} onPress={handleOpenGallery}>
            <Ionicons name="image-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureBtn} onPress={handleCapturePhoto}>
            <View style={styles.captureInnerBtn} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideControlBtn}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Panel de respuesta deslizable */}
      {showResponsePanel && (
        <Animated.View
          style={[
            styles.responsePanel,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                })
              }]
            }
          ]}
        >
          <ScrollView style={styles.responsePanelContent} showsVerticalScrollIndicator={false}>
            {/* Indicador de arrastre */}
            <View style={styles.dragIndicator} />

            {/* Imagen capturada */}
            {capturedImage && (
              <View style={styles.capturedImageContainer}>
                <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
              </View>
            )}

            {/* Estado de procesamiento */}
            {processing && (
              <View style={styles.processingState}>
                <View style={styles.spinner} />
                <Text style={styles.processingText}>Analizando con SANTIAI...</Text>
              </View>
            )}

            {/* Resultados del análisis */}
            {showResults && (
              <View style={styles.analysisResults}>
                <Text style={styles.analysisTitle}>Análisis de SANTIAI</Text>

                {/* Análisis visual completado */}
                <View style={styles.analysisCompletedBox}>
                  <View style={styles.analysisIconContainer}>
                    <Ionicons name="medical" size={16} color="#fff" />
                  </View>
                  <View style={styles.analysisCompletedContent}>
                    <Text style={styles.analysisCompletedTitle}>Análisis Visual Completado</Text>
                    <Text style={styles.analysisCompletedText}>
                      He detectado una lesión cutánea que requiere evaluación profesional. Los patrones observados sugieren características que deben ser examinadas por un dermatólogo.
                    </Text>
                  </View>
                </View>

                {/* Observaciones detectadas */}
                <View style={styles.observationsSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="search" size={16} color="#6b7280" />
                    <Text style={styles.sectionTitle}>Observaciones Detectadas</Text>
                  </View>
                  <View style={styles.observationsList}>
                    <View style={styles.observationItem}>
                      <View style={[styles.observationDot, { backgroundColor: '#f59e0b' }]} />
                      <Text style={styles.observationText}>Forma irregular detectada</Text>
                    </View>
                    <View style={styles.observationItem}>
                      <View style={[styles.observationDot, { backgroundColor: '#f59e0b' }]} />
                      <Text style={styles.observationText}>Variación en coloración</Text>
                    </View>
                    <View style={styles.observationItem}>
                      <View style={[styles.observationDot, { backgroundColor: '#ef4444' }]} />
                      <Text style={styles.observationText}>Tamaño mayor a 6mm</Text>
                    </View>
                  </View>
                </View>

                {/* Recomendaciones inmediatas */}
                <View style={styles.recommendationsSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="bulb" size={16} color="#6b7280" />
                    <Text style={styles.sectionTitle}>Recomendaciones Inmediatas</Text>
                  </View>

                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationNumber, { backgroundColor: '#10b981' }]}>
                      <Text style={styles.recommendationNumberText}>1</Text>
                    </View>
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Consulta dermatológica urgente</Text>
                      <Text style={styles.recommendationSubtitle}>Programa una cita dentro de las próximas 48 horas</Text>
                    </View>
                  </View>

                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationNumber, { backgroundColor: '#f59e0b' }]}>
                      <Text style={styles.recommendationNumberText}>2</Text>
                    </View>
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Protección solar</Text>
                      <Text style={styles.recommendationSubtitle}>Evita exposición directa al sol en el área</Text>
                    </View>
                  </View>

                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationNumber, { backgroundColor: '#3b82f6' }]}>
                      <Text style={styles.recommendationNumberText}>3</Text>
                    </View>
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Monitoreo continuo</Text>
                      <Text style={styles.recommendationSubtitle}>Documenta cualquier cambio en tamaño o color</Text>
                    </View>
                  </View>
                </View>

                {/* Aviso médico importante */}
                <View style={styles.importantNotice}>
                  <Ionicons name="warning" size={16} color="#dc2626" />
                  <View style={styles.importantNoticeContent}>
                    <Text style={styles.importantNoticeTitle}>Aviso Médico Importante</Text>
                    <Text style={styles.importantNoticeText}>
                      Este análisis es una herramienta de apoyo y no reemplaza la evaluación médica profesional. Siempre consulta con un especialista para obtener un diagnóstico preciso y tratamiento adecuado.
                    </Text>
                  </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={handleRetakePhoto}>
                    <Ionicons name="camera" size={16} color="#000" />
                    <Text style={styles.secondaryButtonText}>Nueva foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryButton} onPress={handleShareResults}>
                    <Ionicons name="share" size={16} color="#fff" />
                    <Text style={styles.primaryButtonText}>Compartir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

 
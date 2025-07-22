import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView, Image, Animated } from 'react-native';
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>La cámara solo está disponible en dispositivos móviles.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar estado de permisos
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Solicitando permiso de cámara...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Necesitamos tu permiso para mostrar la cámara</Text>
          <TouchableOpacity onPress={requestPermission} style={{ marginTop: 16, backgroundColor: '#000', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Conceder permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

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

const styles = StyleSheet.create({
  // Estilos originales para compatibilidad
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: '100%',
  },

  // Nuevos estilos para la interfaz mejorada
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  floatingHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerControls: {
    flexDirection: 'row',
    gap: 16,
  },

  fullScreenCamera: {
    flex: 1,
    position: 'relative',
  },

  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },

  guideBox: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },

  bottomControls: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    zIndex: 4,
  },

  sideControlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },

  captureInnerBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },

  responsePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    zIndex: 40,
  },

  responsePanelContent: {
    flex: 1,
  },

  dragIndicator: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 24,
  },

  capturedImageContainer: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },

  capturedImage: {
    width: '100%',
    height: 192,
    borderRadius: 20,
  },

  processingState: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  spinner: {
    width: 48,
    height: 48,
    borderWidth: 4,
    borderColor: '#000',
    borderTopColor: 'transparent',
    borderRadius: 24,
    marginBottom: 16,
  },

  processingText: {
    fontSize: 14,
    color: '#6b7280',
  },

  analysisResults: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },

  analysisCompletedBox: {
    backgroundColor: '#dbeafe',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  analysisIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  analysisCompletedContent: {
    flex: 1,
  },

  analysisCompletedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },

  analysisCompletedText: {
    fontSize: 14,
    color: '#1d4ed8',
    lineHeight: 20,
  },

  observationsSection: {
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  observationsList: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },

  observationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  observationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  observationText: {
    fontSize: 14,
    color: '#374151',
  },

  recommendationsSection: {
    marginBottom: 16,
  },

  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },

  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },

  recommendationNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },

  recommendationContent: {
    flex: 1,
  },

  recommendationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },

  recommendationSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  importantNotice: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  importantNoticeContent: {
    flex: 1,
  },

  importantNoticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },

  importantNoticeText: {
    fontSize: 14,
    color: '#b91c1c',
    lineHeight: 20,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#000',
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
}); 
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export const options = { headerShown: false };

export default function CameraAssistant() {
  const router = useRouter();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const cameraRef = useRef(null);

  // Permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();

  const handleToggleFlash = () => setFlashEnabled((prev) => !prev);

  const handleSwitchCamera = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const handleCapturePhoto = async () => {
    // CameraView no expone takePictureAsync directamente, esto es solo placeholder
    setProcessing(true);
    setShowResults(false);
    setTimeout(() => {
      setProcessing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleOpenGallery = () => {
    handleCapturePhoto(); // Simulación
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente con Cámara</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleToggleFlash}>
          <Ionicons name={flashEnabled ? 'flash' : 'flash-outline'} size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Camera Preview real */}
      <View style={styles.cameraPreview}>
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
        {/* Controles de cámara */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlBtn} onPress={handleSwitchCamera}>
            <MaterialCommunityIcons name="camera-switch" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapturePhoto}>
            <View style={styles.captureInnerBtn} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={handleOpenGallery}>
            <Ionicons name="image-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Área de instrucciones y resultados */}
      <View style={styles.bottomArea}>
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instrucciones</Text>
          <View style={{ marginTop: 8 }}>
            <Text style={styles.instructionsText}>• Asegúrate de que la imagen esté bien iluminada</Text>
            <Text style={styles.instructionsText}>• Mantén la cámara estable al tomar la foto</Text>
            <Text style={styles.instructionsText}>• Enfoca el área de interés dentro del marco</Text>
          </View>
        </View>

        {/* Estado de procesamiento */}
        {processing && (
          <View style={styles.processingState}>
            <View style={styles.spinner} />
            <Text style={styles.processingText}>Analizando imagen...</Text>
          </View>
        )}

        {/* Resultados del análisis */}
        {showResults && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Análisis de SANTIAI</Text>
            <View style={{ marginTop: 8 }}>
              <View style={styles.observationBox}>
                <Text style={styles.observationTitle}>Observaciones Detectadas</Text>
                <Text style={styles.observationText}>Se observa una lesión cutánea con características que requieren evaluación médica profesional.</Text>
              </View>
              <Text style={styles.resultsSubtitle}>Recomendaciones:</Text>
              <Text style={styles.resultsText}>1. Consulta con un dermatólogo lo antes posible</Text>
              <Text style={styles.resultsText}>2. Evita la exposición solar directa en el área</Text>
              <Text style={styles.resultsText}>3. No apliques productos sin supervisión médica</Text>
              <Text style={styles.resultsText}>4. Monitorea cualquier cambio en tamaño o color</Text>
              <View style={styles.importantBox}>
                <Text style={styles.importantText}>⚠️ Importante: Este análisis es orientativo. Siempre consulta con un profesional médico para un diagnóstico preciso.</Text>
              </View>
            </View>
          </View>
        )}
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
  cameraPreview: {
    width: '100%',
    height: 320,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'dashed',
    borderRadius: 16,
    opacity: 0.5,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  captureBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  captureInnerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
  },
  bottomArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  instructionsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  processingState: {
    alignItems: 'center',
    marginVertical: 24,
  },
  spinner: {
    width: 48,
    height: 48,
    borderWidth: 4,
    borderColor: '#000',
    borderTopColor: 'transparent',
    borderRadius: 24,
    marginBottom: 12,
    alignSelf: 'center',
    // Animación de giro se puede agregar con una librería o Animated
  },
  processingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
    marginBottom: 4,
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  observationBox: {
    backgroundColor: '#fef9c3',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  observationTitle: {
    fontWeight: '600',
    color: '#b45309',
    marginBottom: 2,
  },
  observationText: {
    color: '#b45309',
    fontSize: 13,
  },
  importantBox: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
  },
  importantText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
  },
}); 
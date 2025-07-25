import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingTop: 60, // Increased to account for status bar
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
    bottom: 50, // Increased to ensure visibility on all devices
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

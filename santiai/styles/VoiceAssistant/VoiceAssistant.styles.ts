import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Back to space-between to separate title and icon
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 16,
    paddingBottom: 140, // Increased space to avoid overlap with bottom bar
  },
  messageBubble: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#000',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubbleText: {
    color: '#fff',
    fontSize: 16,
  },
  assistantBubbleText: {
    color: '#000',
    fontSize: 16,
  },
  minimalistContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 140, // Increased to ensure no overlap with bottom bar
  },
  minimalistTitle: {
    fontSize: 32, // Increased font size for better readability
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12, // Adjusted margin for spacing
  },
  minimalistSubtitle: {
    fontSize: 16, // Reduced font size to ensure full text visibility
    color: '#6b7280',
    textAlign: 'center', // Center-align text for better layout
    paddingHorizontal: 20, // Added padding to prevent text cutoff
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 40, // Increased padding for better spacing on all devices
    alignItems: 'center',
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

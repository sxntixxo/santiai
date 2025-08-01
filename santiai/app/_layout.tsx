import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="auth/LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="auth/RegisterScreen" options={{ headerShown: false }} />
          <Stack.Screen name="home/HomeScreen" options={{ headerShown: false }} />
          <Stack.Screen name="home/VoiceAssistant" options={{ headerShown: false }} />
          <Stack.Screen name="home/CameraAssistant" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" translucent={true} />
      </View>
    </ThemeProvider>
  );
}

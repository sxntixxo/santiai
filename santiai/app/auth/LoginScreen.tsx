import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <FontAwesome name="stethoscope" size={32} color="#000" />
          </View>
          <Text style={styles.title}>SANTIAI</Text>
          <Text style={styles.subtitle}>Asistente Médico Virtual</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              selectionColor="#000"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              selectionColor="#000"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/home/HomeScreen')}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <FontAwesome name="google" size={18} color="#000" />
              <Text style={styles.googleButtonText}>Continuar con Google</Text>
            </View>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/RegisterScreen')}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
    width: '100%',
    flexWrap: 'wrap',
  },
  formSection: {
    width: '100%',
    maxWidth: 384,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  googleButton: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 
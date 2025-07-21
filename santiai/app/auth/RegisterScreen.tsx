import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const RegisterScreen = () => {
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
          <Text style={styles.subtitle}>Crear nueva cuenta</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#9CA3AF"
              selectionColor="#000"
            />
          </View>

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

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              selectionColor="#000"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/home/HomeScreen')}>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerTextContainer}>
              <Text style={styles.dividerText}>o regístrate con</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <FontAwesome name="google" size={18} color="#000" />
              <Text style={styles.googleButtonText}>Registrarse con Google</Text>
            </View>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/LoginScreen')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
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
    lineHeight: 28,
    marginBottom: 24,
    paddingHorizontal: 10,
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
  registerButton: {
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
  registerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 30, // Añade esto
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerTextContainer: {
    paddingHorizontal: 20, // Aumenta de 16 a 20
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150, // Añade esto para dar más espacio
  },
  dividerText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center', // Añade esto
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen; 
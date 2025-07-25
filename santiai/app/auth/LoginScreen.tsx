import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { styles } from '../../styles/LoginScreen/LoginScreen.styles';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const LoginScreen = () => {
  return (
    <View style={[styles.container, { paddingTop: StatusBar.currentHeight || 44 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
    </View>
  );
};



export default LoginScreen; 
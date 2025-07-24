import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { styles } from '../../styles/RegisterScreen/RegisterScreen.styles';
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



export default RegisterScreen; 
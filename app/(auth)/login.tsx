import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, Mail, Lock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

export default function LoginScreen() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    setError(null);
    try {
      await login(values.email, values.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/3775042/pexels-photo-3775042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
              style={styles.logo} 
            />
            <Text style={styles.appName}>BookVenue</Text>
            <Text style={styles.tagline}>Find and book venues with ease</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Formik
            initialValues={{ email: 'shivamnegi2207@gmail.com', password: '123' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.validationError}>{errors.email}</Text>
                )}

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.validationError}>{errors.password}</Text>
                )}

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <LogIn size={20} color="#FFFFFF" />
                      <Text style={styles.loginButtonText}>Login</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  keyboardAvoid: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 8
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280'
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8
  },
  formContainer: {
    marginBottom: 24
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 56
  },
  inputIcon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937'
  },
  validationError: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#EF4444',
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB'
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 24
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280'
  },
  registerLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 4
  }
});
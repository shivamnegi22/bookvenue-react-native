import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '@/types/booking';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingApi = {
  getBookings: async () => {
    try {
      const response = await api.get('/my-bookings');
      return response.data.bookings.map((booking: any) => ({
        id: booking.id.toString(),
        venue: {
          id: booking.facility.id.toString(),
          slug: booking.facility.slug,
          name: booking.facility.name,
          location: booking.facility.address,
          images: booking.facility.images?.split(',') || [],
          coordinates: {
            latitude: parseFloat(booking.facility.latitude || '0'),
            longitude: parseFloat(booking.facility.longitude || '0')
          }
        },
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        totalAmount: parseFloat(booking.total_amount),
        status: booking.status.toLowerCase()
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },
  
  getBookingById: async (id: string) => {
    try {
      const response = await api.get('/my-bookings');
      const booking = response.data.bookings.find((b: any) => b.id.toString() === id);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return {
        id: booking.id.toString(),
        venue: {
          id: booking.facility.id.toString(),
          slug: booking.facility.slug,
          name: booking.facility.name,
          location: booking.facility.address,
          images: booking.facility.images?.split(',') || [],
          coordinates: {
            latitude: parseFloat(booking.facility.latitude || '0'),
            longitude: parseFloat(booking.facility.longitude || '0')
          }
        },
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        totalAmount: parseFloat(booking.total_amount),
        status: booking.status.toLowerCase()
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },
  
  createBooking: async (bookingData: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.post('/booking', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.booking;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  }
};
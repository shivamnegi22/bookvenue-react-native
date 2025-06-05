import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '@/types/booking';

const API_URL = 'https://admin.bookvenue.app/api';

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
      console.log('Fetched bookings:', response.data.bookings);
      return response.data.bookings.map((booking: any) => ({
        id: booking.id || Math.random().toString(),
        venue: {
          id: booking.id || Math.random().toString(),
          name: booking.facility,
          type: booking.court,
          location: booking.location || 'Location not available',
          images: ['https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2']
        },
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        totalAmount: parseFloat(booking.price),
        status: booking.status.toLowerCase()
      }));
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },
  
  getBookingById: async (id: string) => {
    try {
      const response = await api.get('/my-bookings');
      const booking = response.data.bookings.find((b: any) => b.id === id);
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      return {
        id: booking.id || Math.random().toString(),
        venue: {
          id: booking.id || Math.random().toString(),
          name: booking.facility,
          type: booking.court,
          location: booking.location || 'Location not available',
          images: ['https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2']
        },
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        totalAmount: parseFloat(booking.price),
        status: booking.status.toLowerCase()
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },
  
  createBooking: async (bookingData: any) => {
    try {
      const response = await api.post('/booking', bookingData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  }
};
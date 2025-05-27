import axios from 'axios';
import { Booking } from '@/types/booking';

// In a real app, this would connect to a Laravel backend
// For demo purposes, we're using simulated responses

const mockBookings: Booking[] = [
  {
    id: '1',
    venue: {
      id: '1',
      name: 'Central Football Ground',
      location: 'Downtown, San Francisco',
      images: [
        'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      coordinates: {
        latitude: 37.78825,
        longitude: -122.4324
      }
    },
    date: '2025-04-25',
    startTime: '14:00',
    endTime: '16:00',
    totalAmount: 80,
    status: 'confirmed'
  },
  {
    id: '2',
    venue: {
      id: '2',
      name: 'Golden Gate Tennis Club',
      location: 'Marina District, San Francisco',
      images: [
        'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/2352251/pexels-photo-2352251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      coordinates: {
        latitude: 37.80136,
        longitude: -122.4431
      }
    },
    date: '2025-04-26',
    startTime: '10:00',
    endTime: '12:00',
    totalAmount: 60,
    status: 'pending'
  },
  {
    id: '3',
    venue: {
      id: '3',
      name: 'Urban Basketball Court',
      location: 'Mission District, San Francisco',
      images: [
        'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      ],
      coordinates: {
        latitude: 37.7599,
        longitude: -122.4148
      }
    },
    date: '2025-03-15',
    startTime: '18:00',
    endTime: '20:00',
    totalAmount: 45,
    status: 'confirmed'
  }
];

export const bookingApi = {
  getBookings: async () => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockBookings;
  },
  
  getBookingById: async (id: string) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  },
  
  createBooking: async (bookingData: any) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send the booking data to the server
    // and return the created booking
    
    const newBooking = {
      id: (mockBookings.length + 1).toString(),
      ...bookingData,
      venue: mockBookings[0].venue, // For demo purposes
      status: 'confirmed'
    };
    
    // In a real app, this would be saved to the database
    mockBookings.push(newBooking as Booking);
    
    return newBooking;
  },
  
  cancelBooking: async (id: string) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    // In a real app, this would update the booking in the database
    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      status: 'cancelled'
    };
    
    return mockBookings[bookingIndex];
  }
};
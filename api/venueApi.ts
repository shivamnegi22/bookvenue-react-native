import axios from 'axios';
import { Venue } from '@/types/venue';

// In a real app, this would connect to a Laravel backend
// For demo purposes, we're using simulated responses

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Central Football Ground',
    description: 'A premium football ground located in the heart of the city. Features a well-maintained natural grass pitch, floodlights for evening games, and changing rooms with shower facilities.',
    location: 'Downtown, San Francisco',
    type: 'Football',
    pricePerHour: 40,
    openingTime: '09:00',
    closingTime: '22:00',
    rating: 4.7,
    amenities: ['Parking', 'Changing Rooms', 'Showers', 'Lighting'],
    images: [
      'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    coordinates: {
      latitude: 37.78825,
      longitude: -122.4324
    }
  },
  {
    id: '2',
    name: 'Golden Gate Tennis Club',
    description: 'Premium tennis courts with beautiful views of the Golden Gate Bridge. Features 6 professional-grade hard courts, all well-maintained and with proper lighting for evening games.',
    location: 'Marina District, San Francisco',
    type: 'Tennis',
    pricePerHour: 30,
    openingTime: '08:00',
    closingTime: '20:00',
    rating: 4.5,
    amenities: ['Parking', 'Equipment Rental', 'Changing Rooms', 'Refreshments'],
    images: [
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2352251/pexels-photo-2352251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1103828/pexels-photo-1103828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    coordinates: {
      latitude: 37.80136,
      longitude: -122.4431
    }
  },
  {
    id: '3',
    name: 'Urban Basketball Court',
    description: 'Modern indoor basketball court with professional flooring and equipment. Perfect for team practice or friendly games.',
    location: 'Mission District, San Francisco',
    type: 'Basketball',
    pricePerHour: 25,
    openingTime: '10:00',
    closingTime: '23:00',
    rating: 4.3,
    amenities: ['Changing Rooms', 'Lighting', 'Seating', 'WiFi'],
    images: [
      'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    coordinates: {
      latitude: 37.7599,
      longitude: -122.4148
    }
  },
  {
    id: '4',
    name: 'Bay Area Cricket Field',
    description: 'Full-sized cricket field with well-maintained pitch. Includes practice nets and pavilion seating for spectators.',
    location: 'Richmond District, San Francisco',
    type: 'Cricket',
    pricePerHour: 45,
    openingTime: '09:00',
    closingTime: '19:00',
    rating: 4.6,
    amenities: ['Parking', 'Equipment Rental', 'Changing Rooms', 'Refreshments'],
    images: [
      'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3659173/pexels-photo-3659173.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  },
  {
    id: '5',
    name: 'Pacific Swimming Center',
    description: 'Modern swimming facility with Olympic-sized pool, diving boards, and heated water. Professional lifeguards on duty at all times.',
    location: 'Sunset District, San Francisco',
    type: 'Swimming',
    pricePerHour: 35,
    openingTime: '07:00',
    closingTime: '21:00',
    rating: 4.8,
    amenities: ['Changing Rooms', 'Showers', 'Lockers', 'Equipment Rental'],
    images: [
      'https://images.pexels.com/photos/260598/pexels-photo-260598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    coordinates: {
      latitude: 37.7517,
      longitude: -122.4880
    }
  },
  {
    id: '6',
    name: 'City Badminton Courts',
    description: 'Professional badminton facility with 8 courts featuring BWF-standard maple wood flooring and proper lighting.',
    location: 'South of Market, San Francisco',
    type: 'Badminton',
    pricePerHour: 20,
    openingTime: '10:00',
    closingTime: '22:00',
    rating: 4.4,
    amenities: ['Equipment Rental', 'Changing Rooms', 'Refreshments', 'WiFi'],
    images: [
      'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3659993/pexels-photo-3659993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    coordinates: {
      latitude: 37.7785,
      longitude: -122.4056
    }
  }
];

export const venueApi = {
  getVenues: async () => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockVenues;
  },
  
  getVenueById: async (id: string) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const venue = mockVenues.find(v => v.id === id);
    
    if (!venue) {
      throw new Error('Venue not found');
    }
    
    return venue;
  },
  
  createVenue: async (venueData: any) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send the venue data to the server
    // and return the created venue
    
    const newVenue = {
      id: (mockVenues.length + 1).toString(),
      ...venueData,
      rating: 0
    };
    
    // In a real app, this would be saved to the database
    mockVenues.push(newVenue as Venue);
    
    return newVenue;
  },
  
  updateVenue: async (id: string, venueData: any) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const venueIndex = mockVenues.findIndex(v => v.id === id);
    
    if (venueIndex === -1) {
      throw new Error('Venue not found');
    }
    
    // In a real app, this would update the venue in the database
    mockVenues[venueIndex] = {
      ...mockVenues[venueIndex],
      ...venueData
    };
    
    return mockVenues[venueIndex];
  },
  
  deleteVenue: async (id: string) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const venueIndex = mockVenues.findIndex(v => v.id === id);
    
    if (venueIndex === -1) {
      throw new Error('Venue not found');
    }
    
    // In a real app, this would delete the venue from the database
    const deletedVenue = mockVenues.splice(venueIndex, 1)[0];
    
    return deletedVenue;
  }
};
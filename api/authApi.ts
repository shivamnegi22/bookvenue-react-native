import axios from 'axios';

// In a real app, this would connect to a Laravel backend
// For demo purposes, we're using simulated responses

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isVenueOwner: false,
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isVenueOwner: true,
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export const authApi = {
  login: async (email: string, password: string) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  register: async (name: string, email: string, password: string, isVenueOwner: boolean) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password,
      isVenueOwner,
      profileImage: isVenueOwner
        ? 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        : 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };
    
    // In a real app, this would be saved to the database
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  updateProfile: async (userData: any) => {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the user in the database
    const userIndex = mockUsers.findIndex(u => u.id === userData.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      password: mockUsers[userIndex].password // Keep the existing password
    };
    
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  }
};
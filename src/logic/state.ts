import React, { createContext, useState, useEffect, useContext } from 'react';

// --- 1. Mock Data Service (simulates API calls) ---

const mockData = {
  teams: [
    { id: 't1', name: 'Marketing Team', description: 'Handles all marketing campaigns.', members: ['m1', 'm2'], projects: ['p1'] },
    { id: 't2', name: 'Development Team', description: 'Focuses on software and app development.', members: ['m3', 'm4'], projects: ['p2', 'p4'] },
    { id: 't3', name: 'Sales Team', description: 'Manages all sales activities and client relationships.', members: ['m5'], projects: ['p3'] },
  ],
  members: [
    { id: 'm1', name: 'John Doe', email: 'john.doe@example.com', role: 'member', profilePictureUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=JD', teams: ['t1'], activeProjects: ['p1'] },
    { id: 'm2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'manager', profilePictureUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=JS', teams: ['t1'], activeProjects: ['p1'] },
    { id: 'm3', name: 'Mike Johnson', email: 'mike.j@example.com', role: 'admin', profilePictureUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=MJ', teams: ['t2'], activeProjects: ['p2', 'p4'] },
    { id: 'm4', name: 'Emily White', email: 'emily.w@example.com', role: 'member', profilePictureUrl: 'https://via.placeholder.com/150/FF33A1/FFFFFF?text=EW', teams: ['t2'], activeProjects: ['p2'] },
    { id: 'm5', name: 'David Lee', email: 'david.l@example.com', role: 'manager', profilePictureUrl: 'https://via.placeholder.com/150/33FFA1/FFFFFF?text=DL', teams: ['t3'], activeProjects: ['p3'] },
  ],
  projects: [
    { id: 'p1', name: 'Website Redesign', description: 'Complete overhaul of the company website.', teamId: 't1', dueDate: '2023-12-31', status: 'active', assignedMembers: ['m1', 'm2'], tasks: ['tk1'] },
    { id: 'p2', name: 'Mobile App Development', description: 'Developing a new mobile application for iOS and Android.', teamId: 't2', dueDate: '2024-03-15', status: 'inProgress', assignedMembers: ['m3', 'm4'], tasks: ['tk2'] },
    { id: 'p3', name: 'Q1 Sales Campaign', description: 'Strategy and execution for Q1 sales targets.', teamId: 't3', dueDate: '2023-09-30', status: 'completed', assignedMembers: ['m5'], tasks: [] },
    { id: 'p4', name: 'Internal Tool Build', description: 'Building a new internal management tool.', teamId: 't2', dueDate: '2024-06-01', status: 'onHold', assignedMembers: ['m3'], tasks: [] },
  ],
  tasks: [
    { id: 'tk1', name: 'Design UI Mockups', description: 'Create wireframes and high-fidelity mockups.', projectId: 'p1', assignedToId: 'm1', dueDate: '2023-11-15', status: 'inProgress', priority: 'high' },
    { id: 'tk2', name: 'Backend API Integration', description: 'Integrate the mobile app with existing backend services.', projectId: 'p2', assignedToId: 'm2', dueDate: '2024-02-01', status: 'pending', priority: 'medium' },
  ],
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const dataService = {
  // Generic list/details fetches
  async fetchAll(type) {
    await delay(500);
    // Deep copy to prevent direct modification of mockData
    return JSON.parse(JSON.stringify(mockData[type]));
  },
  async fetchById(type, id) {
    await delay(300);
    const item = mockData[type].find(i => i.id === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  },

  // Specific operations (example for teams)
  async createTeam(teamData) {
    await delay(700);
    const newTeam = { id: `t${Date.now()}`, ...teamData };
    mockData.teams.push(newTeam);
    return JSON.parse(JSON.stringify(newTeam));
  },
  async updateTeam(id, updatedData) {
    await delay(700);
    const index = mockData.teams.findIndex(t => t.id === id);
    if (index !== -1) {
      mockData.teams[index] = { ...mockData.teams[index], ...updatedData };
      return JSON.parse(JSON.stringify(mockData.teams[index]));
    }
    return null;
  },
  async deleteTeam(id) {
    await delay(500);
    mockData.teams = mockData.teams.filter(t => t.id !== id);
    return true;
  },

  // Authentication
  async login(email, password) {
    await delay(1000);
    if (email === 'test@example.com' && password === 'password') {
      return { token: 'mock-jwt-token', user: { id: 'u1', name: 'Test User', email: 'test@example.com' } };
    }
    throw new Error('Invalid credentials');
  },
  async signup(userData) {
    await delay(1000);
    if (userData.email === 'existing@example.com') {
      throw new Error('Email already registered');
    }
    return { token: 'mock-jwt-token', user: { id: `u${Date.now()}`, ...userData } };
  },

  // Helpers for options data
  async getAllMembersAsOptions() {
    await delay(200);
    return mockData.members.map(m => ({ label: m.name, value: m.id }));
  },
  async getAllTeamsAsOptions() {
    await delay(200);
    return mockData.teams.map(t => ({ label: t.name, value: t.id }));
  },
  async getProjectMembersAsOptions(projectId) {
    await delay(200);
    const project = mockData.projects.find(p => p.id === projectId);
    if (!project) return [];
    return project.assignedMembers.map(memberId => {
      const member = mockData.members.find(m => m.id === memberId);
      return member ? { label: member.name, value: member.id } : null;
    }).filter(Boolean);
  },
};

// --- 2. Auth Context ---

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a stored token on app start
    const checkAuthStatus = async () => {
      try {
        await delay(500); // Simulate async storage access
        const storedToken = 'mock-stored-token'; // Replace with AsyncStorage.getItem('userToken')
        if (storedToken) {
          // Validate token and fetch user data
          setIsAuthenticated(true);
          setUser({ id: 'u1', name: 'Test User', email: 'test@example.com' }); // Replace with actual user data
        }
      } catch (error) {
        console.error('Failed to load auth status', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await dataService.login(email, password);
      // Save token to AsyncStorage
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await dataService.signup(userData);
      // Save token, log in user immediately or redirect to login
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    // Clear token from AsyncStorage
    await delay(300); // Simulate async storage removal
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// --- 3. App Root Component (integrates AuthProvider and Navigation) ---

import AppNavigator from './navigationCode'; // Assuming navigationCode exports AppNavigator
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthContext.Consumer>
          {({ isAuthenticated, loading }) => {
            if (loading) {
              // Render a loading screen while auth status is being determined
              return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' }}>
                  <Text style={{ fontSize: 18, color: '#333' }}>Loading app...</Text>
                </View>
              );
            }
            return <AppNavigator isAuthenticated={isAuthenticated} />;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 

// You would typically define data models as TypeScript interfaces or classes.
// For JavaScript, you can think of them as object structures.
/*
interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[]; // Array of Member IDs
  projects: string[]; // Array of Project IDs
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  profilePictureUrl?: string;
  teams: string[]; // Array of Team IDs
  activeProjects: string[]; // Array of Project IDs
}

interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string; // Team ID
  dueDate: string; // ISO Date string
  status: 'active' | 'completed' | 'onHold';
  assignedMembers: string[]; // Array of Member IDs
  tasks: string[]; // Array of Task IDs
}

interface Task {
  id: string;
  name: string;
  description?: string;
  projectId: string; // Project ID
  assignedToId?: string; // Member ID
  dueDate: string; // ISO Date string
  status: 'pending' | 'inProgress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
}
*/

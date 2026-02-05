import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import all screens
import {
  LoginScreen,
  SignupScreen,
  DashboardScreen,
  TeamsScreen,
  TeamDetailsScreen,
  TeamFormScreen,
  MembersScreen,
  MemberDetailsScreen,
  MemberFormScreen,
  ProjectsScreen,
  ProjectDetailsScreen,
  ProjectFormScreen,
  TaskDetailsScreen,
  TaskFormScreen,
} from './uiCode'; // Assuming uiCode exports all screen components

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Auth Stack ---
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// --- Main App Stacks (nested within tabs) ---

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} />
  </Stack.Navigator>
);

const TeamsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TeamsHome" component={TeamsScreen} />
    <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
    <Stack.Screen name="TeamForm" component={TeamFormScreen} />
    <Stack.Screen name="MemberDetails" component={MemberDetailsScreen} /> {/* Navigable from TeamDetails */}
    <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} /> {/* Navigable from TeamDetails */}
  </Stack.Navigator>
);

const MembersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MembersHome" component={MembersScreen} />
    <Stack.Screen name="MemberDetails" component={MemberDetailsScreen} />
    <Stack.Screen name="MemberForm" component={MemberFormScreen} />
    <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} /> {/* Navigable from MemberDetails (teams list) */}
    <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} /> {/* Navigable from MemberDetails (projects list) */}
  </Stack.Navigator>
);

const ProjectsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProjectsHome" component={ProjectsScreen} />
    <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
    <Stack.Screen name="ProjectForm" component={ProjectFormScreen} />
    <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    <Stack.Screen name="TaskForm" component={TaskFormScreen} />
    <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} /> {/* Navigable from ProjectDetails */}
    <Stack.Screen name="MemberDetails" component={MemberDetailsScreen} /> {/* Navigable from ProjectDetails/TaskDetails */}
  </Stack.Navigator>
);

// --- Main Tab Navigator ---
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#3F51B5',
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') {
          iconName = 'home-outline';
        } else if (route.name === 'Teams') {
          iconName = 'people-outline';
        } else if (route.name === 'Members') {
          iconName = 'person-outline';
        } else if (route.name === 'Projects') {
          iconName = 'briefcase-outline';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarStyle: { paddingBottom: 5, height: 60 },
      tabBarLabelStyle: { fontSize: 12 },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardStack} />
    <Tab.Screen name="Teams" component={TeamsStack} />
    <Tab.Screen name="Members" component={MembersStack} />
    <Tab.Screen name="Projects" component={ProjectsStack} />
  </Tab.Navigator>
);

// --- Root Navigator ---
// This assumes a simple check for authentication status
// In a real app, you'd use a context/global state to determine if a user is logged in.
const RootNavigator = ({ isAuthenticated }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {isAuthenticated ? (
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    ) : (
      <Stack.Screen name="Auth" component={AuthStack} />
    )}
  </Stack.Navigator>
);

export default function AppNavigator({ isAuthenticated }) {
  return (
    <NavigationContainer>
      <RootNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}
// navigation/AppNavigator.tsx

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AIInsights from '../app/AIInsights';
import HomeScreen from '../app/HomeScreen';
import ProfileScreen from '../app/Profile'; // ✅ Add this

export type RootStackParamList = {
  Home: undefined;
  AIInsights: undefined;
  Profile: undefined; // ✅ Add this
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '💼 Budget Tracker' }} />
        <Stack.Screen name="AIInsights" component={AIInsights} options={{ title: '📊 AI Insights' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '👤 Profile' }} /> {/* ✅ Add this */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

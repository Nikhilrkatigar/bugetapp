import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usersData } from '../utils/usersData';

const ProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract username safely
  const usernameParam = params?.username;
  const loggedInUser = Array.isArray(usernameParam)
    ? usernameParam[0]
    : usernameParam || 'guest';

  // Delete user data safely
  const handleDeleteData = () => {
    if (!usersData[loggedInUser]) {
      Alert.alert('Error', 'User data not found.');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            usersData[loggedInUser].data = [];
            Alert.alert('Deleted', 'Your data has been successfully deleted.');
          },
        },
      ]
    );
  };

  // Logout and go to login screen
  const handleLogout = () => {
    router.replace('/Login'); // or use router.push() if you don't want to clear history
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.info}>{loggedInUser}</Text>
      </View>

      <TouchableOpacity style={styles.buttonDanger} onPress={handleDeleteData}>
        <Text style={styles.buttonText}>🗑️ Delete My Data</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>ℹ️ About Us</Text>
        <Text style={styles.aboutText}>
          This app is built for budget tracking and user task management. It helps you manage daily expenses and plan your tasks more effectively.
        </Text>
      </View>

      <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.buttonText}>🚪 Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  info: {
    fontSize: 16,
    color: '#222',
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  buttonDanger: {
    backgroundColor: '#ff4d4d',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonLogout: {
    backgroundColor: '#555',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

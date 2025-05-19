// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../usersData';

const USERS_KEY = 'APP_USERS';

export const saveUsers = async (users: Record<string, User>) => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users', e);
  }
};

export const getUsers = async (): Promise<Record<string, User>> => {
  try {
    const json = await AsyncStorage.getItem(USERS_KEY);
    return json != null ? JSON.parse(json) : {};
  } catch (e) {
    console.error('Error fetching users', e);
    return {};
  }
};

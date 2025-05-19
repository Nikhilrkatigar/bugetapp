import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ✅ Define navigation types
type RootStackParamList = {
  Home: undefined;
  AIInsights: undefined;
  Login: undefined;
  Profile: undefined;
};

// ✅ Correct type for useNavigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Transaction {
  id: number;
  desc: string;
  amount: number;
  type: 'income' | 'expense' | 'pending';
  category: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'pending'>('income');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [maxTarget, setMaxTarget] = useState<number | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('@transactions');
      const target = await AsyncStorage.getItem('@maxTarget');
      if (stored) setTransactions(JSON.parse(stored));
      if (target) setMaxTarget(parseFloat(target));
    } catch (e) {
      console.error('Load failed', e);
    }
  };

  const saveTransactions = async (data: Transaction[]) => {
    try {
      await AsyncStorage.setItem('@transactions', JSON.stringify(data));
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  const addTransaction = () => {
    if (!desc || !amount || !category) {
      Alert.alert('Please fill all fields');
      return;
    }

    const newTx: Transaction = {
      id: Date.now(),
      desc,
      amount: parseFloat(amount),
      type,
      category,
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setDesc('');
    setAmount('');
    setCategory('');
  };

  const removeTransaction = (id: number) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logged out', 'You have been successfully logged out.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const pending = transactions.filter((t) => t.type === 'pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Text style={styles.header}>💰 Smart Budget Tracker</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Income: ₹{income.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Expense: ₹{expense.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Pending: ₹{pending.toFixed(2)}</Text>
        {maxTarget !== null && (
          <Text
            style={[
              styles.summaryText,
              expense > maxTarget && { color: 'red', fontWeight: 'bold' },
            ]}
          >
            🎯 Max Target: ₹{maxTarget}
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
          placeholder="Description"
        />
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Amount"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Category"
        />
        <View style={styles.typeRow}>
          {['income', 'expense', 'pending'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t as any)}
              style={[
                styles.typeButton,
                type === t && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  type === t && styles.selectedText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Add Transaction" onPress={addTransaction} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.listHeader}>📋 Transactions</Text>}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <Text style={styles.txText}>
              {item.desc} - ₹{item.amount} ({item.category}) [{item.type}]
            </Text>
            <Button title="🗑️" color="crimson" onPress={() => removeTransaction(item.id)} />
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="View AI Insights 📈" onPress={() => navigation.navigate('AIInsights')} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: { fontSize: 22, fontWeight: 'bold' },
  profileText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  summary: { marginBottom: 16 },
  summaryText: { fontSize: 16, marginBottom: 4 },
  inputGroup: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  typeButton: {
    flex: 1,
    margin: 2,
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedButton: { backgroundColor: '#3b82f6' },
  typeText: { color: '#111' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  listHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
    marginBottom: 6,
  },
  txText: { flex: 1, fontSize: 14 },
});

export default HomeScreen;

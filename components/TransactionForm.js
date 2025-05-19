import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

const incomeCategories = ['Salary', 'Investments', 'Business', 'Other Income'];
const expenseCategories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health & Wellness',
  'Other Expenses',
];
const pendingCategories = ['To Pay', 'To Receive'];

const TransactionForm = ({ addTransaction, saveTarget, maxTarget }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [mainType, setMainType] = useState('income');
  const [subCategory, setSubCategory] = useState(incomeCategories[0]);
  const [targetInput, setTargetInput] = useState(maxTarget.toString());

  useEffect(() => {
    setSubCategory(
      mainType === 'income'
        ? incomeCategories[0]
        : mainType === 'expense'
        ? expenseCategories[0]
        : pendingCategories[0]
    );
  }, [mainType]);

  const handleAdd = () => {
    if (!desc || !amount) {
      Alert.alert('Error', 'Please enter valid details.');
      return;
    }
    const transaction = {
      id: Date.now().toString(),
      desc,
      amount: parseFloat(amount),
      type: mainType,
      category: subCategory,
    };
    addTransaction(transaction);
    setDesc('');
    setAmount('');
  };

  const handleSaveTarget = () => {
    const target = parseFloat(targetInput);
    if (isNaN(target) || target <= 0) {
      Alert.alert('Error', 'Enter a valid max target amount.');
      return;
    }
    saveTarget(target);
  };

  const getCategories = () => {
    if (mainType === 'income') return incomeCategories;
    if (mainType === 'expense') return expenseCategories;
    return pendingCategories;
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={mainType}
        onValueChange={(itemValue) => setMainType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
        <Picker.Item label="Pending" value="pending" />
      </Picker>
      <Picker
        selectedValue={subCategory}
        onValueChange={(itemValue) => setSubCategory(itemValue)}
        style={styles.picker}
      >
        {getCategories().map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      <Button title="Add Transaction" onPress={handleAdd} />
      <TextInput
        style={styles.input}
        placeholder="Set Max Spend Target ₹"
        value={targetInput}
        onChangeText={setTargetInput}
        keyboardType="numeric"
      />
      <Button title="Save Target" onPress={handleSaveTarget} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
  },
  picker: {
    marginTop: 10,
  },
});

export default TransactionForm;

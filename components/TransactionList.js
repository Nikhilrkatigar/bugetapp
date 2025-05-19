import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

const TransactionList = ({ transactions, updateTransaction, deleteTransaction }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>
        {item.desc} - ₹{item.amount}
      </Text>
      <View style={styles.buttons}>
        <Button title="Edit" onPress={() => updateTransaction(item.id)} />
        <Button title="Delete" color="red" onPress={() => deleteTransaction(item.id)} />
      </View>
    </View>
  );

  return <FlatList data={transactions} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />;
};

export default TransactionList;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

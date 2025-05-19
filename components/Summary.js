import { StyleSheet, Text, View } from 'react-native';

const Summary = ({ transactions, maxTarget }) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const categorySpend = {};
  transactions.forEach((t) => {
    if (t.type === 'expense') {
      categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
    }
  });
  const topCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];

  return (
    <View style={styles.summary}>
      <Text>Income: ₹{income.toFixed(2)}</Text>
      <Text>Expense: ₹{expense.toFixed(2)}</Text>
      <Text>Balance: ₹{balance.toFixed(2)}</Text>
      {maxTarget && expense > maxTarget && (
        <Text style={styles.warning}>
          ⚠️ You've exceeded your max spending target of ₹{maxTarget}. Current spending: ₹
          {expense.toFixed(2)}
        </Text>
      )}
      <Text style={styles.insight}>
        {topCategory && topCategory[1] > 1000
          ? `📊 High spending alert: ₹${topCategory[1].toFixed(2)} on ${topCategory[0]}. Monitor this category.`
          : '✅ You\'re spending wisely. Keep it up!'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    marginBottom: 20,
  },
  warning: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: 10,
    borderRadius: 6,
    marginTop: 15,
  },
  insight: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#d1fae5',
    borderLeftWidth: 5,
    borderLeftColor: '#10b981',
    color: '#065f46',
    borderRadius: 6,
  },
});

export default Summary;

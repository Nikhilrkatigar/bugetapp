import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  BarChart,
  LineChart,
  PieChart,
} from 'react-native-chart-kit';
import {
  Button,
  Card,
  Text,
  TextInput,
  ToggleButton
} from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

interface Transaction {
  id: number;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date?: string;
}

const STORAGE_KEYS = {
  transactions: '@transactions',
  maxTarget: '@maxTarget',
};

const AIAdvisor = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [maxTarget, setMaxTarget] = useState<number | null>(null);
  const [newTarget, setNewTarget] = useState('');
  const [insight, setInsight] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(STORAGE_KEYS.transactions);
      const storedTarget = await AsyncStorage.getItem(STORAGE_KEYS.maxTarget);

      const parsedTransactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
      setTransactions(parsedTransactions);

      if (storedTarget) setMaxTarget(parseFloat(storedTarget));

      generateInsight(parsedTransactions);
      generateSavingTips(parsedTransactions);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const saveTarget = async () => {
    const val = parseFloat(newTarget);
    if (!isNaN(val)) {
      await AsyncStorage.setItem(STORAGE_KEYS.maxTarget, val.toString());
      setMaxTarget(val);
      setNewTarget('');
    }
  };

  const generateInsight = (data: Transaction[]) => {
    const catSpend: { [key: string]: number } = {};
    data.forEach((t) => {
      if (t.type === 'expense') {
        catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
      }
    });

    const top = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] > 1000) {
      setInsight(`🔍 Alert: You spent ₹${top[1].toFixed(2)} on ${top[0]}. Consider reducing it.`);
    } else {
      setInsight("✅ You're spending reasonably across categories.");
    }
  };

  const generateSavingTips = (data: Transaction[]) => {
    const income = data
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = data
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categorySpending: { [key: string]: number } = {};
    data
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    const generatedTips: string[] = [];

    for (const [category, amount] of Object.entries(categorySpending)) {
      const percent = (amount / income) * 100;
      if (percent > 30) {
        generatedTips.push(
          `⚠️ High spending alert: You are spending ${percent.toFixed(1)}% of your income on "${category}". Try reducing it to below 25% to save more.`
        );
      } else if (percent > 20) {
        generatedTips.push(
          `📌 Consider monitoring "${category}" expenses — currently at ${percent.toFixed(1)}%. Keep it under 20% for better savings.`
        );
      }
    }

    if (expense > income) {
      generatedTips.push(`🚨 Your expenses (₹${expense}) exceed your income (₹${income}). Consider reducing non-essential spending.`);
    } else {
      generatedTips.push(`✅ Good job! You're spending within your income limit. Keep tracking for long-term savings.`);
    }

    if (income > 0 && expense / income < 0.4) {
      generatedTips.push(`🎯 Excellent savings ratio! You're saving more than 60% of your income.`);
    }

    if (generatedTips.length === 0) {
      generatedTips.push('🧠 Add more transactions to get intelligent financial insights.');
    }

    setTips(generatedTips);
  };

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const catLabels: string[] = [];
  const catValues: number[] = [];
  const catPieData: any[] = [];

  const grouped: { [key: string]: number } = {};
  transactions.forEach((t) => {
    if (t.type === 'expense') {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    }
  });

  for (let [key, value] of Object.entries(grouped)) {
    catLabels.push(key);
    catValues.push(value);
    catPieData.push({
      name: key,
      amount: value,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      legendFontColor: '#333',
      legendFontSize: 12,
    });
  }

  // Simple predictive analytics (linear projection)
  const estimatedNextMonthSpending = Math.round(
    catValues.reduce((a, b) => a + b, 0) * 1.1 // 10% increase assumption
  );

  const chartConfig = {
    backgroundGradientFrom: '#f3f4f6',
    backgroundGradientTo: '#f3f4f6',
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: () => '#000',
    strokeWidth: 2,
    barPercentage: 0.7,
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="📊 AI Insights & Analytics" />
        <Card.Content>
          <Text style={styles.insightText}>{insight}</Text>
          <Text style={{ marginTop: 8 }}>
            🤖 Estimated Spending Next Month: ₹{estimatedNextMonthSpending}
          </Text>
        </Card.Content>
      </Card>

      <ToggleButton.Row
        onValueChange={setChartType}
        value={chartType}
        style={styles.toggleGroup}
      >
        <ToggleButton icon="chart-bar" value="bar" />
        <ToggleButton icon="chart-line" value="line" />
        <ToggleButton icon="chart-pie" value="pie" />
      </ToggleButton.Row>

      <View style={styles.chartWrapper}>
        {chartType === 'bar' && (
          <BarChart
            data={{
              labels: ['Income', 'Expense'],
              datasets: [{ data: [income, expense] }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={chartConfig}
            fromZero
            style={styles.chart}
          />
        )}

        {chartType === 'line' && (
          <LineChart
            data={{
              labels: ['Income', 'Expense'],
              datasets: [{ data: [income, expense] }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="₹"
            chartConfig={chartConfig}
            bezier
            fromZero
            style={styles.chart}
          />
        )}

        {chartType === 'pie' && (
          <PieChart
            data={catPieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </View>

      <Card style={styles.card}>
        <Card.Title title="🎯 Set Max Spending Target" />
        <Card.Content>
          <Text style={{ marginBottom: 10 }}>
            Current Target: ₹{maxTarget ?? 'Not Set'}
          </Text>
          <TextInput
            label="New Target (₹)"
            value={newTarget}
            onChangeText={setNewTarget}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <Button mode="contained" onPress={saveTarget}>Save Target</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="💡 Smart Saving Tips" />
        <Card.Content>
          {tips.map((tip, index) => (
            <Text key={index} style={{ marginBottom: 10, fontSize: 16 }}>
              {tip}
            </Text>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  card: { marginBottom: 16, backgroundColor: '#ffffff' },
  insightText: {
    backgroundColor: '#e0f2f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  chartWrapper: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  toggleGroup: {
    justifyContent: 'center',
    marginTop: 10,
  }
});
export default AIAdvisor;

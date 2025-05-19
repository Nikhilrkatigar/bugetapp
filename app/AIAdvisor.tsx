// app/AIAdvisor.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';

type Transaction = {
  id: number;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date?: string;
};

const STORAGE_KEY = '@transactions';

const AIAdvisor = () => {
  const [tips, setTips] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = async () => {
    try {
      const rawData = await AsyncStorage.getItem(STORAGE_KEY);
      const data: Transaction[] = rawData ? JSON.parse(rawData) : [];

      const income = data
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

      const expense = data
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

      setTotalIncome(income);
      setTotalExpense(expense);
      setTransactions(data);

      const generatedTips = generateSavingTips(data, income, expense);
      setTips(generatedTips);
    } catch (error) {
      console.error('Error loading AI tips:', error);
    }
  };

  const generateSavingTips = (
    transactions: Transaction[],
    income: number,
    expense: number
  ): string[] => {
    const categorySpending: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    const tips: string[] = [];

    for (const [category, amount] of Object.entries(categorySpending)) {
      const percent = (amount / income) * 100;
      if (percent > 30) {
        tips.push(
          `⚠️ High spending alert: You are spending ${percent.toFixed(1)}% of your income on "${category}". Try reducing it to below 25% to save more.`
        );
      } else if (percent > 20) {
        tips.push(
          `📌 Consider monitoring "${category}" expenses — currently at ${percent.toFixed(1)}%. Keep it under 20% for better savings.`
        );
      }
    }

    if (expense > income) {
      tips.push(`🚨 Your expenses (₹${expense}) exceed your income (₹${income}). Consider reducing non-essential spending.`);
    } else {
      tips.push(`✅ Good job! You're spending within your income limit. Keep tracking for long-term savings.`);
    }

    if (income > 0 && expense / income < 0.4) {
      tips.push(`🎯 Excellent savings ratio! You're saving more than 60% of your income.`);
    }

    if (tips.length === 0) {
      tips.push('🧠 Add more transactions to get intelligent financial insights.');
    }

    return tips;
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#f6f8fa' }}>
      <Card style={{ marginBottom: 16, backgroundColor: '#e3f2fd' }}>
        <Card.Title title="📊 AI Financial Advisor" subtitle="Personalized saving insights" />
        <Card.Content>
          <Title>Total Income: ₹{totalIncome}</Title>
          <Title>Total Expense: ₹{totalExpense}</Title>
        </Card.Content>
      </Card>

      <Card style={{ backgroundColor: '#ffffff' }}>
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

export default AIAdvisor;

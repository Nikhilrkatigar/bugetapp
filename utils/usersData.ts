// utils/usersData.ts

export interface User {
  password: string;
  data: string[];
  maxTarget: number; // 🆕 Add this field
}

export const usersData: Record<string, User> = {
  user1: {
    password: '1234',
    data: ['User1 Note 1', 'User1 Note 2'],
    maxTarget: 5,
  },
  user2: {
    password: '5678',
    data: ['User2 Task A', 'User2 Task B'],
    maxTarget: 3,
  },
};

export interface Task {
  id?: number;
  title: string;
  date: string;
  completed: boolean;
  users: number[];
}

export interface User {
  userId: number;
  name: string;
  age: number;
  skills: string[];
}

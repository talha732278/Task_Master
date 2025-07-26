import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

const TASKS_KEY = 'tasks';
const CATEGORIES_KEY = 'categories';

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#3B82F6', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#10B981', icon: 'user' },
  { id: '3', name: 'Study', color: '#8B5CF6', icon: 'book-open' },
  { id: '4', name: 'Health', color: '#EF4444', icon: 'heart' },
  { id: '5', name: 'Shopping', color: '#F59E0B', icon: 'shopping-cart' },
];

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        return tasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  static async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const tasks = await this.getTasks();
    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    await this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  static async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    await this.saveTasks(filteredTasks);
    return true;
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (categoriesJson) {
        return JSON.parse(categoriesJson);
      }
      // Initialize with default categories
      await this.saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error loading categories:', error);
      return DEFAULT_CATEGORIES;
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
      throw error;
    }
  }
}
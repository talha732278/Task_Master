import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Category } from '@/types/task';
import { TaskService } from '@/services/taskService';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskComplete: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const [loadedTasks, loadedCategories] = await Promise.all([
        TaskService.getTasks(),
        TaskService.getCategories(),
      ]);
      setTasks(loadedTasks);
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask = await TaskService.addTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTask = await TaskService.updateTask(id, updates);
    if (updatedTask) {
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    }
    return updatedTask;
  };

  const deleteTask = async (id: string) => {
    const success = await TaskService.deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
    return success;
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const value: TaskContextType = {
    tasks,
    categories,
    loading,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
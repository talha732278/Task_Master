import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Task } from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';
import { Check, Clock, Trash2, CreditCard as Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { deleteTask, toggleTaskComplete, categories } = useTaskContext();

  const category = categories.find(cat => cat.id === task.category);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = new Date() > task.dueDate && !task.completed;

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/(tabs)/add-task',
      params: { taskId: task.id },
    });
  };

  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      {/* Priority indicator */}
      <View style={[styles.priorityBar, { backgroundColor: getPriorityColor(task.priority) }]} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.checkbox, task.completed && styles.checkedBox]}
          onPress={() => toggleTaskComplete(task.id)}
        >
          {task.completed && <Check size={16} color="#fff" />}
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>
          
          <View style={styles.categoryContainer}>
            {category && (
              <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
                <Text style={[styles.categoryText, { color: category.color }]}>
                  {category.name}
                </Text>
              </View>
            )}
            <Text style={[styles.priority, { color: getPriorityColor(task.priority) }]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      {task.description && (
        <Text style={[styles.description, task.completed && styles.completedText]}>
          {task.description}
        </Text>
      )}

      {/* Date and Actions */}
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Clock size={14} color={isOverdue ? '#EF4444' : '#6B7280'} />
          <Text style={[styles.dueDate, isOverdue && styles.overdueText]}>
            {formatDate(task.dueDate)}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit3 size={18} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  completedCard: {
    opacity: 0.7,
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priority: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  overdueText: {
    color: '#EF4444',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
});
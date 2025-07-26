import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTaskContext } from '@/context/TaskContext';
import { CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export const TaskStats: React.FC = () => {
  const { tasks } = useTaskContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date() > task.dueDate
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statsData = [
    {
      icon: CheckCircle2,
      color: '#10B981',
      value: completedTasks,
      label: 'Completed',
    },
    {
      icon: Clock,
      color: '#3B82F6',
      value: pendingTasks,
      label: 'Pending',
    },
    {
      icon: AlertTriangle,
      color: '#EF4444',
      value: overdueTasks,
      label: 'Overdue',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Overall Progress</Text>
        <Text style={styles.progressPercentage}>{Math.round(completionRate)}%</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${completionRate}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressSubtitle}>
          {completedTasks} of {totalTasks} tasks completed
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {statsData.map(({ icon: Icon, color, value, label }) => (
          <View key={label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
              <Icon size={20} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
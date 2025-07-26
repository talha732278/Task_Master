import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskContext } from '@/context/TaskContext';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { tasks, categories } = useTaskContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = tasks.filter(task => 
    !task.completed && new Date() > task.dueDate
  ).length;

  const tasksByPriority = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  };

  const tasksByCategory = categories.map(category => ({
    ...category,
    count: tasks.filter(task => task.category === category.id).length,
    completed: tasks.filter(task => task.category === category.id && task.completed).length,
  }));

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= weekAgo;
  }).length;

  const insights = [
    {
      icon: TrendingUp,
      color: '#10B981',
      title: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      subtitle: `${completedTasks} of ${totalTasks} tasks completed`,
    },
    {
      icon: Calendar,
      color: '#3B82F6',
      title: 'This Week',
      value: thisWeekTasks.toString(),
      subtitle: 'New tasks created',
    },
    {
      icon: Target,
      color: overdueTasks > 0 ? '#EF4444' : '#10B981',
      title: 'Overdue Tasks',
      value: overdueTasks.toString(),
      subtitle: overdueTasks === 0 ? 'Great job!' : 'Need attention',
    },
    {
      icon: Award,
      color: '#8B5CF6',
      title: 'Most Active',
      value: tasksByCategory.sort((a, b) => b.count - a.count)[0]?.name || 'None',
      subtitle: 'Category with most tasks',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Track your productivity</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Insights */}
        <View style={styles.insightsGrid}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                <insight.icon size={24} color={insight.color} />
              </View>
              <Text style={styles.insightValue}>{insight.value}</Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightSubtitle}>{insight.subtitle}</Text>
            </View>
          ))}
        </View>

        {/* Priority Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks by Priority</Text>
          <View style={styles.priorityContainer}>
            {Object.entries(tasksByPriority).map(([priority, count]) => {
              const color = priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981';
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              
              return (
                <View key={priority} style={styles.priorityItem}>
                  <View style={styles.priorityHeader}>
                    <View style={styles.priorityLabel}>
                      <View style={[styles.priorityDot, { backgroundColor: color }]} />
                      <Text style={styles.priorityText}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </Text>
                    </View>
                    <Text style={styles.priorityCount}>{count}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${percentage}%`, backgroundColor: color }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks by Category</Text>
          <View style={styles.categoryContainer}>
            {tasksByCategory.map((category) => {
              const completionRate = category.count > 0 ? (category.completed / category.count) * 100 : 0;
              
              return (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryStats}>
                        {category.completed}/{category.count} completed
                      </Text>
                    </View>
                    <Text style={styles.categoryPercentage}>
                      {Math.round(completionRate)}%
                    </Text>
                  </View>
                  <View style={styles.categoryProgress}>
                    <View 
                      style={[
                        styles.categoryProgressFill, 
                        { 
                          width: `${completionRate}%`, 
                          backgroundColor: category.color 
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: (width - 44) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  insightSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  priorityContainer: {
    gap: 16,
  },
  priorityItem: {
    gap: 8,
  },
  priorityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  priorityCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryContainer: {
    gap: 16,
  },
  categoryCard: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  categoryStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  categoryProgress: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 52,
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
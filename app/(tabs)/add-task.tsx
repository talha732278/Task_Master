import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar, ChevronDown, Save, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskScreen() {
  const { addTask, updateTask, tasks, categories } = useTaskContext();
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  
  const isEditing = !!taskId;
  const existingTask = isEditing ? tasks.find(t => t.id === taskId) : null;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    existingTask?.priority || 'medium'
  );
  const [categoryId, setCategoryId] = useState(existingTask?.category || categories[0]?.id || '1');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setDueDate(existingTask.dueDate);
      setPriority(existingTask.priority);
      setCategoryId(existingTask.category);
    }
  }, [existingTask]);

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        category: categoryId,
        completed: existingTask?.completed || false,
      };

      if (isEditing && existingTask) {
        await updateTask(existingTask.id, taskData);
      } else {
        await addTask(taskData);
      }

      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: '#10B981' },
    { value: 'medium', label: 'Medium Priority', color: '#F59E0B' },
    { value: 'high', label: 'High Priority', color: '#EF4444' },
  ] as const;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <X size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Save size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add description..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Due Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.pickerButtonText}>{formatDate(dueDate)}</Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Priority */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowPriorityPicker(!showPriorityPicker)}
          >
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: priorityOptions.find(p => p.value === priority)?.color },
              ]}
            />
            <Text style={styles.pickerButtonText}>
              {priorityOptions.find(p => p.value === priority)?.label}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
          
          {showPriorityPicker && (
            <View style={styles.pickerDropdown}>
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.pickerOption,
                    priority === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setPriority(option.value);
                    setShowPriorityPicker(false);
                  }}
                >
                  <View style={[styles.priorityIndicator, { backgroundColor: option.color }]} />
                  <Text style={styles.pickerOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: selectedCategory?.color },
              ]}
            />
            <Text style={styles.pickerButtonText}>{selectedCategory?.name}</Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
          
          {showCategoryPicker && (
            <View style={styles.pickerDropdown}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.pickerOption,
                    categoryId === category.id && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setCategoryId(category.id);
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={[styles.priorityIndicator, { backgroundColor: category.color }]} />
                  <Text style={styles.pickerOptionText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickerDropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  selectedOption: {
    backgroundColor: '#F3F4F6',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#111827',
  },
});
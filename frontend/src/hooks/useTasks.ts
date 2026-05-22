import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    const { data } = await api.get('/tasks');
    setTasks(data);
    setLoading(false);
  }

  async function createTask(payload: Partial<Task>) {
    const { data } = await api.post('/tasks', payload);
    setTasks(prev => [...prev, data]);
    return data;
  }

  async function updateTask(id: string, payload: Partial<Task>) {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    setTasks(prev => prev.map(t => t.id === id ? data : t));
    return data;
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  useEffect(() => { fetchTasks(); }, []);

  return { tasks, loading, createTask, updateTask, deleteTask };
}
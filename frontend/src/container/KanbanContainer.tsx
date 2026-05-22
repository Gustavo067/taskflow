import { useState } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskStatus } from '../types';
import { Kanban } from '../pages/Kanban';

export function KanbanContainer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creatingInColumn, setCreatingInColumn] = useState<TaskStatus | null>(null);

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    await updateTask(draggableId, { status: newStatus });
  }

  async function handleSave(data: Partial<Task>) {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
    } else if (creatingInColumn) {
      await createTask({ ...data, status: creatingInColumn });
    }
    setSelectedTask(null);
    setCreatingInColumn(null);
  }

  async function handleDelete() {
    if (selectedTask) {
      await deleteTask(selectedTask.id);
      setSelectedTask(null);
    }
  }

  
  return (
    <Kanban
      tasks={tasks}
      user={user}
      loading={loading}
      logout={logout}
      navigate={navigate}
      selectedTask={selectedTask}
      setSelectedTask={setSelectedTask}
      creatingInColumn={creatingInColumn}
      setCreatingInColumn={setCreatingInColumn}
      handleDragEnd={handleDragEnd}
      handleSave={handleSave}
      handleDelete={handleDelete}
    />
  );
}
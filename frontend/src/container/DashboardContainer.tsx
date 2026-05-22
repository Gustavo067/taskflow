import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';
import { COLUMNS } from '../types';
import { Dashboard } from '../pages/Dashboard';

export function DashboardContainer() {
  const { tasks, loading } = useTasks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tasksByStatus = useMemo(() =>
    COLUMNS.map(col => ({
      name: col.label,
      total: tasks.filter(t => t.status === col.id).length,
    })), [tasks]);

  const tasksByAssignee = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach(t => {
      const name = t.assignee?.name ?? 'Sem responsável';
      map[name] = (map[name] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }));
  }, [tasks]);

  const overdueTasks = useMemo(() =>
    tasks.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== 'done'
    ), [tasks]);

  const completionOverTime = useMemo(() => {
    const map: Record<string, number> = {};
    tasks
      .filter(t => t.status === 'done')
      .forEach(t => {
        const date = new Date(t.updatedAt).toLocaleDateString('pt-BR');
        map[date] = (map[date] ?? 0) + 1;
      });
    return Object.entries(map)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tasks]);

  if (loading) return <div style={{ padding: 32 }}>Carregando...</div>;

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 12, padding: 24,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  };

  return <Dashboard
    tasks={tasks}
    user={user}
    logout={logout}
    navigate={navigate}
    tasksByStatus={tasksByStatus}
    tasksByAssignee={tasksByAssignee}
    overdueTasks={overdueTasks}
    completionOverTime={completionOverTime}
    card={card}
    />
}
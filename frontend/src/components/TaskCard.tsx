import type { Task } from '../types';

const priorityColors = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

interface Props {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: Props) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div onClick={onClick} style={{
      background: '#fff',
      borderRadius: 8,
      padding: '12px 14px',
      marginBottom: 8,
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${priorityColors[task.priority]}`,
    }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{task.title}</p>

      {task.description && (
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 99,
          background: priorityColors[task.priority] + '22',
          color: priorityColors[task.priority], fontWeight: 600,
        }}>
          {priorityLabels[task.priority]}
        </span>

        {task.assignee && (
          <span style={{ fontSize: 11, color: '#888' }}>
            👤 {task.assignee.name}
          </span>
        )}

        {task.dueDate && (
          <span style={{ fontSize: 11, color: isOverdue ? '#ef4444' : '#888' }}>
            📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {task.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 99,
              background: '#e0e7ff', color: '#4f46e5',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
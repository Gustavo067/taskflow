import { useState, useEffect } from 'react';
import type { Task, TaskPriority, User } from '../types';
import api from '../api/axios';

interface Props {
  task?: Task | null;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
  onDelete?: () => void;
}

export function TaskModal({ task, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority);
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
      setTags(task.tags?.join(', ') ?? '');
      setAssigneeId(task.assignee?.id ?? '');
    }
  }, [task]);

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      assigneeId: assigneeId || undefined,
    } as Partial<Task> & { assigneeId?: string });
    onClose();
  }

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
    backdropFilter: 'blur(4px)',
  };

  const modal: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: 32,
    width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxHeight: '90vh', overflowY: 'auto',
  };

  const input: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 8, marginBottom: 16,
    border: '1px solid #e0e0e0', fontSize: 14, boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 600, color: '#1a1a1a' }}>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>

        <input style={input} placeholder="Título *" value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
          onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'} />

        <textarea style={{ ...input, height: 100, resize: 'vertical' }}
          placeholder="Descrição" value={description}
          onChange={e => setDescription(e.target.value)}
          onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#667eea'}
          onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#e0e0e0'} />

        <select style={input} value={priority}
          onChange={e => setPriority(e.target.value as TaskPriority)}
          onFocus={(e) => (e.target as HTMLSelectElement).style.borderColor = '#667eea'}
          onBlur={(e) => (e.target as HTMLSelectElement).style.borderColor = '#e0e0e0'}>
          <option value="low">Prioridade: Baixa</option>
          <option value="medium">Prioridade: Média</option>
          <option value="high">Prioridade: Alta</option>
        </select>

        {/* ✅ Seletor de responsável */}
        <select style={input} value={assigneeId}
          onChange={e => setAssigneeId(e.target.value)}
          onFocus={(e) => (e.target as HTMLSelectElement).style.borderColor = '#667eea'}
          onBlur={(e) => (e.target as HTMLSelectElement).style.borderColor = '#e0e0e0'}>
          <option value="">Sem responsável</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>

        <input style={input} type="date" value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
          onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'} />

        <input style={input} placeholder="Tags (separadas por vírgula)"
          value={tags} onChange={e => setTags(e.target.value)}
          onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
          onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e0e0e0'} />

        {task?.history && task.history.length > 0 && (
          <div style={{ marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#1a1a1a' }}>Histórico</p>
            {task.history.map((h, i) => {
              const statusMap: Record<string, string> = {
                'todo': 'A Fazer',
                'in_progress': 'Em Progresso',
                'done': 'Concluído',
                'To Do': 'A Fazer',
                'In Progress': 'Em Progresso',
                'Done': 'Concluído',
              };
              const fromStatus = statusMap[h.from] || h.from;
              const toStatus = statusMap[h.to] || h.to;
              return (
                <p key={i} style={{ fontSize: 13, color: '#666', margin: '4px 0', padding: '4px 0', borderBottom: '1px solid #e5e7eb' }}>
                  {fromStatus} → {toStatus} • {new Date(h.date).toLocaleString('pt-BR')}
                </p>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
          {onDelete && (
            <button onClick={onDelete} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontWeight: 500,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = '#fecaca'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = '#fee2e2'}>
              Excluir
            </button>
          )}
          <button onClick={onClose} style={{
            padding: '10px 20px', borderRadius: 8,
            border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = '#f8fafc'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = '#fff'}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{
            padding: '10px 24px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', cursor: 'pointer', fontWeight: 600,
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
          }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
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
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
  };

  const modal: React.CSSProperties = {
    background: '#fff', borderRadius: 12, padding: 28,
    width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    maxHeight: '90vh', overflowY: 'auto',
  };

  const input: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 6, marginBottom: 12,
    border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box',
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px' }}>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>

        <input style={input} placeholder="Título *" value={title}
          onChange={e => setTitle(e.target.value)} />

        <textarea style={{ ...input, height: 80, resize: 'vertical' }}
          placeholder="Descrição" value={description}
          onChange={e => setDescription(e.target.value)} />

        <select style={input} value={priority}
          onChange={e => setPriority(e.target.value as TaskPriority)}>
          <option value="low">Prioridade: Baixa</option>
          <option value="medium">Prioridade: Média</option>
          <option value="high">Prioridade: Alta</option>
        </select>

        {/* ✅ Seletor de responsável */}
        <select style={input} value={assigneeId}
          onChange={e => setAssigneeId(e.target.value)}>
          <option value="">Sem responsável</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>

        <input style={input} type="date" value={dueDate}
          onChange={e => setDueDate(e.target.value)} />

        <input style={input} placeholder="Tags (separadas por vírgula)"
          value={tags} onChange={e => setTags(e.target.value)} />

        {task?.history && task.history.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Histórico</p>
            {task.history.map((h, i) => (
              <p key={i} style={{ fontSize: 12, color: '#666', margin: '2px 0' }}>
                {h.from} → {h.to} • {new Date(h.date).toLocaleString('pt-BR')}
              </p>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {onDelete && (
            <button onClick={onDelete} style={{
              padding: '8px 16px', borderRadius: 6, border: 'none',
              background: '#fee2e2', color: '#ef4444', cursor: 'pointer',
            }}>
              Excluir
            </button>
          )}
          <button onClick={onClose} style={{
            padding: '6px 14px', borderRadius: 6,
            border: '1px solid #ddd', background: '#fff', cursor: 'pointer',
          }}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{
            padding: '8px 16px', borderRadius: 6, border: 'none',
            background: '#4f46e5', color: '#fff', cursor: 'pointer',
          }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
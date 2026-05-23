import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { COLUMNS } from '../types';
import type { Task, TaskStatus } from '../types';

interface KanbanProps {
  tasks: Task[];
  loading: boolean;
  user: any;
  logout: () => void;
  navigate: (path: string) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  creatingInColumn: TaskStatus | null;
  setCreatingInColumn: (status: TaskStatus | null) => void;
  handleDragEnd: (result: DropResult) => void;
  handleSave: (data: Partial<Task>) => void;
  handleDelete: () => void;
}

export function Kanban({ tasks, loading, user, logout, navigate, selectedTask, setSelectedTask, creatingInColumn, setCreatingInColumn, handleDragEnd, handleSave, handleDelete }: KanbanProps) {
  return (
    <div style={{  background: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        background: '#4f46e5', padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 20 }}>TaskFlow</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#c7d2fe', fontSize: 14 }}>Olá, {user?.name}</span>
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fff', cursor: 'pointer',
          }}>
            Dashboard
          </button>
          <button onClick={logout} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none',
            background: '#818cf8', color: '#fff', cursor: 'pointer',
          }}>
            Sair
          </button>
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{
          display: 'flex', gap: 16, padding: 24,
          overflowX: 'auto', alignItems: 'flex-start',
          height: 'calc(100vh - 100px)',
        }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} style={{
                background: '#e2e8f0', borderRadius: 10,
                padding: 12, minWidth: 260, width: 260, flexShrink: 0,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 12,
                }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    {col.label}
                    <span style={{
                      marginLeft: 8, background: '#94a3b8', color: '#fff',
                      borderRadius: 99, padding: '1px 8px', fontSize: 12,
                    }}>
                      {colTasks.length}
                    </span>
                  </h3>
                  <button onClick={() => setCreatingInColumn(col.id)} style={{
                    background: 'none', border: 'none', fontSize: 20,
                    cursor: 'pointer', color: '#64748b', lineHeight: 1,
                  }}>+</button>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      style={{ minHeight: 40 }}>
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => setSelectedTask(task)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal */}
      {(selectedTask || creatingInColumn) && (
        <TaskModal
          task={selectedTask}
          onClose={() => { setSelectedTask(null); setCreatingInColumn(null); }}
          onSave={handleSave}
          onDelete={selectedTask ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
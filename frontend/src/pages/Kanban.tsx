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
    <div style={{  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 600 }}>TaskFlow</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#e0e7ff', fontSize: 15, fontWeight: 500 }}>Olá, {user?.name}</span>
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: 'rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer',
            fontWeight: 500, transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)'}>
            Dashboard
          </button>
          <button onClick={logout} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: 'rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer',
            fontWeight: 500, transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)'}>
            Sair
          </button>
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{
          display: 'flex', gap: 20, padding: 32,
          overflowX: 'auto', alignItems: 'flex-start',
          height: 'calc(100vh - 80px)',
        }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} style={{
                background: 'rgba(255, 255, 255, 0.95)', borderRadius: 12,
                padding: 16, minWidth: 280, width: 280, flexShrink: 0,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 16,
                }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                    {col.label}
                    <span style={{
                      marginLeft: 8, background: '#667eea', color: '#fff',
                      borderRadius: 99, padding: '2px 10px', fontSize: 12, fontWeight: 600,
                    }}>
                      {colTasks.length}
                    </span>
                  </h3>
                  <button onClick={() => setCreatingInColumn(col.id)} style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', fontSize: 20,
                    cursor: 'pointer', color: '#fff', lineHeight: 1, width: 32, height: 32,
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(102, 126, 234, 0.2)'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(102, 126, 234, 0.1)'}>+</button>
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
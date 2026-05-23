import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import { COLUMNS } from '../types';

const COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#22c55e'];

interface DashboardProps {
  tasks: any[];
  user: any;
  logout: () => void;
  navigate: (path: string) => void;
  tasksByStatus: any[];
  tasksByAssignee: any[];
  overdueTasks: any[];
  completionOverTime: any[];
  card: React.CSSProperties;
}

export function Dashboard({
  tasks,
  user,
  logout,
  navigate,
  tasksByStatus,
  tasksByAssignee,
  overdueTasks,
  completionOverTime,
  card,
}: DashboardProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 600 }}>TaskFlow — Dashboard</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#e0e7ff', fontSize: 15, fontWeight: 500 }}>Olá, {user?.name}</span>
          <button onClick={() => navigate('/kanban')} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: 'rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer',
            fontWeight: 500, transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)'}>
            Kanban
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

      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {COLUMNS.map((col, i) => (
            <div key={col.id} style={{
              ...card,
              borderTop: `4px solid ${COLORS[i]}`,
              borderRadius: 12,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              backgroundColor: '#ffffff',
            }}>
              <p style={{ margin: 0, fontSize: 14, color: '#64748b', fontWeight: 500 }}>{col.label}</p>
              <p style={{ margin: '8px 0 0', fontSize: 36, fontWeight: 700, color: COLORS[i] }}>
                {tasks.filter(t => t.status === col.id).length}
              </p>
            </div>
          ))}
        </div>

        {/* Tarefas atrasadas */}
        {overdueTasks.length > 0 && (
          <div style={{ ...card, borderLeft: '4px solid #ef4444', borderRadius: 12, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', backgroundColor: '#ffffff' }}>
            <h3 style={{ margin: '0 0 16px', color: '#ef4444', fontSize: 16, fontWeight: 600 }}>
              ⚠️ Tarefas Atrasadas ({overdueTasks.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {overdueTasks.map(t => (
                <div key={t.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, padding: '6px 0', borderBottom: '1px solid #fee2e2',
                }}>
                  <span>{t.title}</span>
                  <span style={{ color: '#ef4444' }}>
                    {new Date(t.dueDate!).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Tarefas por status */}
          <div style={{ ...card, borderRadius: 12, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', backgroundColor: '#ffffff' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Tarefas por Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tasksByStatus}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {tasksByStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tarefas por responsável */}
          <div style={{ ...card, borderRadius: 12, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', backgroundColor: '#ffffff' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Tarefas por Responsável</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={tasksByAssignee}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, payload }) => `${name}: ${payload?.total}`}
                >
                  {tasksByAssignee.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fluxo de conclusão */}
        <div style={{ ...card, borderRadius: 12, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)', backgroundColor: '#ffffff' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Fluxo de Conclusão</h3>
          {completionOverTime.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13 }}>
              Nenhuma tarefa concluída ainda.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={completionOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#667eea' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}
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
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        background: '#4f46e5', padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 20 }}>TaskFlow — Dashboard</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#c7d2fe', fontSize: 14 }}>Olá, {user?.name}</span>
          <button onClick={() => navigate('/kanban')} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none',
            background: '#6366f1', color: '#fff', cursor: 'pointer',
          }}>
            Kanban
          </button>
          <button onClick={logout} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none',
            background: '#818cf8', color: '#fff', cursor: 'pointer',
          }}>
            Sair
          </button>
        </div>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {COLUMNS.map((col, i) => (
            <div key={col.id} style={{
              ...card,
              borderTop: `4px solid ${COLORS[i]}`,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{col.label}</p>
              <p style={{ margin: '4px 0 0', fontSize: 32, fontWeight: 700, color: COLORS[i] }}>
                {tasks.filter(t => t.status === col.id).length}
              </p>
            </div>
          ))}
        </div>

        {/* Tarefas atrasadas */}
        {overdueTasks.length > 0 && (
          <div style={{ ...card, borderLeft: '4px solid #ef4444' }}>
            <h3 style={{ margin: '0 0 12px', color: '#ef4444' }}>
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
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>Tarefas por Status</h3>
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
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>Tarefas por Responsável</h3>
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
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>Fluxo de Conclusão</h3>
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
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { DashboardContainer } from './container/DashboardContainer';
import { KanbanContainer } from './container/KanbanContainer';
import { LoginContainer } from './container/LoginContainer';
import { RegisterContainer } from './container/RegisterContainer';


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/register" element={<RegisterContainer />} />
            <Route path="/kanban" element={
            <PrivateRoute><KanbanContainer /></PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute><DashboardContainer /></PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
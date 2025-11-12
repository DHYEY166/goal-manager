import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoalsProvider } from './contexts/GoalsContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import TestGoals from './pages/TestGoals';
import TestGoalsWithHook from './pages/TestGoalsWithHook';
import MinimalGoals from './pages/MinimalGoals';
import SimpleGoals from './pages/SimpleGoals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <GoalsProvider>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/goals" element={<SimpleGoals />} />
              <Route path="/goals-original" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </GoalsProvider>
    </Router>
  );
}

export default App;
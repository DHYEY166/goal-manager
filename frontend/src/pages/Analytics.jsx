import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Target,
  Flame
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30');
  const [exportType, setExportType] = useState('all');
  const { dashboardData, loading, exportData } = useAnalytics();

  const handleExport = () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = subDays(new Date(), parseInt(dateRange)).toISOString().split('T')[0];
    exportData(exportType, startDate, endDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">Start completing goals to see your analytics!</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Insights into your goal completion patterns and progress
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Data</option>
              <option value="goals">Goals Only</option>
              <option value="progress">Progress Only</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Completion"
          value={`${dashboardData.todayStats.completion_rate}%`}
          subtitle={`${dashboardData.todayStats.completed_goals}/${dashboardData.todayStats.total_goals} goals`}
          icon={Target}
          color="blue"
          trend={dashboardData.todayStats.completion_rate > 0 ? 'up' : 'neutral'}
        />
        
        <MetricCard
          title="Active Streaks"
          value={dashboardData.activeStreaks.length}
          subtitle="goals on fire"
          icon={Flame}
          color="orange"
          trend="up"
        />
        
        <MetricCard
          title="Week Average"
          value={`${Math.round(dashboardData.weeklyTrend.reduce((sum, day) => sum + day.completion_rate, 0) / Math.max(dashboardData.weeklyTrend.length, 1))}%`}
          subtitle="completion rate"
          icon={Calendar}
          color="green"
          trend="up"
        />
        
        <MetricCard
          title="Total Achievements"
          value={dashboardData.achievements.length}
          subtitle="milestones reached"
          icon={Award}
          color="purple"
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Progress Trend</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          {dashboardData.weeklyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dashboardData.weeklyTrend}>
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                  labelFormatter={(value) => format(new Date(value), 'EEEE, MMM dd')}
                />
                <Area
                  type="monotone"
                  dataKey="completion_rate"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCompletion)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No weekly data available</p>
            </div>
          )}
        </div>

        {/* Category Performance */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          {dashboardData.categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={dashboardData.categoryStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completed_instances"
                  label={(entry) => `${entry.category_name}: ${entry.completion_rate}%`}
                >
                  {dashboardData.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.category_color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, 'Completed Goals']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No category data available</p>
            </div>
          )}
        </div>

        {/* Completion Heatmap */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Activity Heatmap</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          {dashboardData.heatmapData.length > 0 ? (
            <div className="grid grid-cols-7 gap-2">
              {dashboardData.heatmapData.slice(-35).map((day, index) => {
                const intensity = Math.round(day.completion_rate / 25);
                const intensityClass = [
                  'bg-gray-100',
                  'bg-green-200',
                  'bg-green-300',
                  'bg-green-400',
                  'bg-green-500'
                ][intensity] || 'bg-gray-100';
                
                return (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded ${intensityClass} flex items-center justify-center text-xs font-medium tooltip`}
                    title={`${format(new Date(day.date), 'MMM dd')}: ${day.completion_rate}%`}
                  >
                    {day.completion_rate > 0 && (
                      <span className="text-white">{day.completed_goals}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <p>No activity data available</p>
            </div>
          )}
        </div>

        {/* Top Streaks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Goals</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          {dashboardData.activeStreaks.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.activeStreaks.slice(0, 5).map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{goal.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${goal.category_color}20`,
                          color: goal.category_color 
                        }}
                      >
                        {goal.category_name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-orange-600">
                      <Flame className="h-4 w-4" />
                      <span className="font-bold text-lg">{goal.streak_count}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Best: {goal.longest_streak} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <p>Complete goals to see streaks!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Achievements */}
      {dashboardData.achievements.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.achievements.slice(0, 6).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <Award className="h-10 w-10 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.goal_title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(achievement.achieved_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className={`text-sm mt-1 ${trendColors[trend]}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
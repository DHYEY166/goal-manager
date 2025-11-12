import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  Flame,
  Target,
  Calendar,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { useGoalsContext } from '../contexts/GoalsContext';
import { useAnalytics } from '../hooks/useAnalytics';
import GoalCard from '../components/GoalCard';
import SimpleCreateGoalModal from '../components/SimpleCreateGoalModal';
import ProgressChart from '../components/ProgressChart';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  console.log('Dashboard rendering, showCreateModal:', showCreateModal);
  
  const { todayGoals, loading: goalsLoading, addProgress } = useGoalsContext();
  const { dashboardData, loading: analyticsLoading } = useAnalytics();
  
  console.log('Dashboard data:', { todayGoals, goalsLoading, analyticsLoading });

  const completedToday = todayGoals.filter(goal => goal.is_completed).length;
  const totalToday = todayGoals.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Get week view data
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });

  const getMotivationalMessage = () => {
    if (completionRate === 100) return "🎉 Perfect day! You're on fire!";
    if (completionRate >= 80) return "🔥 Almost there! Keep pushing!";
    if (completionRate >= 50) return "💪 Good progress! Stay focused!";
    if (completionRate > 0) return "🌟 Great start! Keep going!";
    return "🎯 Ready to conquer your goals?";
  };

  if (goalsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
          </h1>
          <p className="text-lg text-gray-600 mt-1">{getMotivationalMessage()}</p>
          <p className="text-sm text-gray-500 mt-2">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Goal</span>
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Progress"
          value={`${completedToday}/${totalToday}`}
          icon={Target}
          color="primary"
          subtitle={`${completionRate}% complete`}
          trend={dashboardData?.todayStats?.completion_rate > 0 ? 'up' : 'neutral'}
        />
        <StatCard
          title="Active Streaks"
          value={dashboardData?.activeStreaks?.length || 0}
          icon={Flame}
          color="orange"
          subtitle="goals on fire"
          trend="up"
        />
        <StatCard
          title="This Week"
          value={dashboardData?.weeklyTrend?.reduce((sum, day) => sum + day.completed_goals, 0) || 0}
          icon={Calendar}
          color="green"
          subtitle="goals completed"
          trend="up"
        />
        <StatCard
          title="Achievements"
          value={dashboardData?.achievements?.length || 0}
          icon={Trophy}
          color="purple"
          subtitle="total earned"
          trend="up"
        />
      </motion.div>

      {/* Today's Goals */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Today's Goals</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Updated just now</span>
          </div>
        </div>

        {todayGoals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center"
          >
            <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No goals for today</h3>
            <p className="text-gray-500 mb-6">Create your first goal to start tracking your progress!</p>
            <button
              onClick={() => {
                console.log('Create Goal button clicked!');
                alert('Button clicked! Modal should open...');
                setShowCreateModal(true);
              }}
              className="btn-primary"
            >
              Create Your First Goal
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onProgress={addProgress}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Stats Section */}
      {!analyticsLoading && dashboardData && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <ProgressChart data={dashboardData.weeklyTrend} />
          </div>

          {/* Top Streaks */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Streaks</h3>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            {dashboardData.activeStreaks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active streaks yet. Complete your goals to start building streaks!</p>
            ) : (
              <div className="space-y-4">
                {dashboardData.activeStreaks.slice(0, 5).map((streak) => (
                  <div key={streak.title} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{streak.title}</p>
                      <p className="text-sm text-gray-500">{streak.category_name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-600">{streak.streak_count}</span>
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recent Achievements */}
      {dashboardData?.achievements?.length > 0 && (
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.achievements.slice(0, 6).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Trophy className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.goal_title}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(achievement.achieved_at), 'MMM d')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create Goal Modal */}
      <SimpleCreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle, trend }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
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
      className="card p-6 cursor-pointer"
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
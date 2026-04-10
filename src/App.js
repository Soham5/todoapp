import React, { useEffect, useState, useCallback } from 'react';
import PlannerBoard from './components/PlannerBoard';
import ProgressBar from './components/ProgressBar';
import AllDailyTasks from './components/AllDailyTasks';
import YearlyGoals from './components/YearlyGoals';
import MonthlyGoals from './components/MonthlyGoals';
import WeeklyGoals from './components/WeeklyGoals';
import DailyTodoList from './components/DailyTodoList';
import { getGoalProgress, getYearlyProgress, getMonthlyProgress, getWeeklyProgress, genId } from './utils/progressCalculator';
import './App.css';

const STORAGE_KEY = 'goalData';

function App() {
  const [yearlyGoals, setYearlyGoals] = useState([]);
  const [activeLevel, setActiveLevel] = useState('all-daily');
  const [selectedYearly, setSelectedYearly] = useState(null);
  const [selectedMonthly, setSelectedMonthly] = useState(null);
  const [selectedWeekly, setSelectedWeekly] = useState(null);

  // Persistence
  const save = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  // Clear all completedTasks across the goal tree
  const clearAllCompleted = useCallback((data) => {
    return data.map((yg) => ({
      ...yg,
      monthlyGoals: (yg.monthlyGoals || []).map((mg) => ({
        ...mg,
        weeklyGoals: (mg.weeklyGoals || []).map((wg) => ({
          ...wg,
          completedTasks: [],
        })),
      })),
    }));
  }, []);

  useEffect(() => {
    let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      // Check if day changed — clear completed tasks
      const savedDate = localStorage.getItem('goalDate');
      const todayStr = new Date().toDateString();
      if (savedDate !== todayStr) {
        saved = clearAllCompleted(saved);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        localStorage.setItem('goalDate', todayStr);
      }
      setYearlyGoals(saved);
    } else {
      localStorage.setItem('goalDate', new Date().toDateString());
    }
  }, [clearAllCompleted]);

  // Midnight auto-clear while app is open
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timer = setTimeout(() => {
      setYearlyGoals((prev) => {
        const cleared = clearAllCompleted(prev);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared));
        localStorage.setItem('goalDate', new Date().toDateString());
        return cleared;
      });
    }, tomorrow - now);
    return () => clearTimeout(timer);
  }, [clearAllCompleted]);

  // Helper to get nested objects
  const getYearlyGoal = () => yearlyGoals.find((g) => g.id === selectedYearly);
  const getMonthlyGoal = () => {
    const yg = getYearlyGoal();
    return yg?.monthlyGoals?.find((g) => g.id === selectedMonthly);
  };
  const getWeeklyGoal = () => {
    const mg = getMonthlyGoal();
    return mg?.weeklyGoals?.find((g) => g.id === selectedWeekly);
  };

  // === YEARLY ===
  const addYearlyGoal = (title) => {
    const updated = [...yearlyGoals, { id: genId(), title, monthlyGoals: [] }];
    setYearlyGoals(updated);
    save(updated);
  };

  const deleteYearlyGoal = (id) => {
    const updated = yearlyGoals.filter((g) => g.id !== id);
    setYearlyGoals(updated);
    save(updated);
    if (selectedYearly === id) {
      setSelectedYearly(null);
      setActiveLevel('yearly');
    }
  };

  const selectYearly = (id) => {
    setSelectedYearly(id);
    setSelectedMonthly(null);
    setSelectedWeekly(null);
    setActiveLevel('monthly');
  };

  // === MONTHLY ===
  const addMonthlyGoal = (title) => {
    const updated = yearlyGoals.map((yg) =>
      yg.id === selectedYearly
        ? { ...yg, monthlyGoals: [...(yg.monthlyGoals || []), { id: genId(), title, weeklyGoals: [] }] }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
  };

  const deleteMonthlyGoal = (id) => {
    const updated = yearlyGoals.map((yg) =>
      yg.id === selectedYearly
        ? { ...yg, monthlyGoals: (yg.monthlyGoals || []).filter((g) => g.id !== id) }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
    if (selectedMonthly === id) {
      setSelectedMonthly(null);
      setActiveLevel('monthly');
    }
  };

  const selectMonthly = (id) => {
    setSelectedMonthly(id);
    setSelectedWeekly(null);
    setActiveLevel('weekly');
  };

  // === WEEKLY ===
  const addWeeklyGoal = (title) => {
    const updated = yearlyGoals.map((yg) =>
      yg.id === selectedYearly
        ? {
            ...yg,
            monthlyGoals: (yg.monthlyGoals || []).map((mg) =>
              mg.id === selectedMonthly
                ? { ...mg, weeklyGoals: [...(mg.weeklyGoals || []), { id: genId(), title, dailyTasks: [], completedTasks: [] }] }
                : mg
            ),
          }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
  };

  const deleteWeeklyGoal = (id) => {
    const updated = yearlyGoals.map((yg) =>
      yg.id === selectedYearly
        ? {
            ...yg,
            monthlyGoals: (yg.monthlyGoals || []).map((mg) =>
              mg.id === selectedMonthly
                ? { ...mg, weeklyGoals: (mg.weeklyGoals || []).filter((g) => g.id !== id) }
                : mg
            ),
          }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
    if (selectedWeekly === id) {
      setSelectedWeekly(null);
      setActiveLevel('weekly');
    }
  };

  const selectWeekly = (id) => {
    setSelectedWeekly(id);
    setActiveLevel('daily');
  };

  // === DAILY TASKS (inside a weekly goal) ===
  const updateWeeklyData = (updater) => {
    const updated = yearlyGoals.map((yg) =>
      yg.id === selectedYearly
        ? {
            ...yg,
            monthlyGoals: (yg.monthlyGoals || []).map((mg) =>
              mg.id === selectedMonthly
                ? {
                    ...mg,
                    weeklyGoals: (mg.weeklyGoals || []).map((wg) =>
                      wg.id === selectedWeekly ? updater(wg) : wg
                    ),
                  }
                : mg
            ),
          }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
  };

  const addDailyTask = (newItem) => {
    updateWeeklyData((wg) => ({
      ...wg,
      dailyTasks: [...(wg.dailyTasks || []), newItem],
    }));
  };

  const deleteDailyTask = (index) => {
    updateWeeklyData((wg) => ({
      ...wg,
      dailyTasks: (wg.dailyTasks || []).filter((_, i) => i !== index),
    }));
  };

  const completeDailyTask = (index) => {
    const wg = getWeeklyGoal();
    if (!wg) return;
    const task = wg.dailyTasks[index];
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    updateWeeklyData((wg) => ({
      ...wg,
      dailyTasks: (wg.dailyTasks || []).filter((_, i) => i !== index),
      completedTasks: [...(wg.completedTasks || []), { ...task, completedAt: time }],
    }));
  };

  const deleteCompletedTask = (index) => {
    updateWeeklyData((wg) => ({
      ...wg,
      completedTasks: (wg.completedTasks || []).filter((_, i) => i !== index),
    }));
  };

  // === CROSS-GOAL operations (for AllDailyTasks view) ===
  const completeTaskByPath = (ygId, mgId, wgId, taskIndex) => {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updated = yearlyGoals.map((yg) =>
      yg.id === ygId
        ? {
            ...yg,
            monthlyGoals: (yg.monthlyGoals || []).map((mg) =>
              mg.id === mgId
                ? {
                    ...mg,
                    weeklyGoals: (mg.weeklyGoals || []).map((wg) =>
                      wg.id === wgId
                        ? {
                            ...wg,
                            dailyTasks: (wg.dailyTasks || []).filter((_, i) => i !== taskIndex),
                            completedTasks: [
                              ...(wg.completedTasks || []),
                              { ...(wg.dailyTasks || [])[taskIndex], completedAt: time },
                            ],
                          }
                        : wg
                    ),
                  }
                : mg
            ),
          }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
  };

  const deleteTaskByPath = (ygId, mgId, wgId, taskIndex, isCompleted) => {
    const updated = yearlyGoals.map((yg) =>
      yg.id === ygId
        ? {
            ...yg,
            monthlyGoals: (yg.monthlyGoals || []).map((mg) =>
              mg.id === mgId
                ? {
                    ...mg,
                    weeklyGoals: (mg.weeklyGoals || []).map((wg) =>
                      wg.id === wgId
                        ? {
                            ...wg,
                            ...(isCompleted
                              ? { completedTasks: (wg.completedTasks || []).filter((_, i) => i !== taskIndex) }
                              : { dailyTasks: (wg.dailyTasks || []).filter((_, i) => i !== taskIndex) }),
                          }
                        : wg
                    ),
                  }
                : mg
            ),
          }
        : yg
    );
    setYearlyGoals(updated);
    save(updated);
  };

  // Navigation
  const navigateTo = (level) => {
    setActiveLevel(level);
    if (level === 'all-daily' || level === 'yearly') {
      setSelectedYearly(null);
      setSelectedMonthly(null);
      setSelectedWeekly(null);
    } else if (level === 'monthly') {
      setSelectedMonthly(null);
      setSelectedWeekly(null);
    } else if (level === 'weekly') {
      setSelectedWeekly(null);
    }
  };

  // Breadcrumbs — only for goals view
  const buildBreadcrumbs = () => {
    const crumbs = [{ level: 'yearly', label: 'Yearly Goals' }];
    if (selectedYearly) {
      const yg = getYearlyGoal();
      crumbs.push({ level: 'monthly', label: yg?.title || 'Monthly' });
    }
    if (selectedMonthly) {
      const mg = getMonthlyGoal();
      crumbs.push({ level: 'weekly', label: mg?.title || 'Weekly' });
    }
    if (selectedWeekly) {
      const wg = getWeeklyGoal();
      crumbs.push({ level: 'daily', label: wg?.title || 'Daily' });
    }
    return crumbs;
  };

  // Progress — scoped to current level
  const wg = getWeeklyGoal();
  const getLevelProgress = () => {
    switch (activeLevel) {
      case 'all-daily': return { stats: getGoalProgress(yearlyGoals), label: "Today's Tasks" };
      case 'yearly': return { stats: getGoalProgress(yearlyGoals), label: 'Overall Goal Progress' };
      case 'monthly': return { stats: getYearlyProgress(getYearlyGoal()), label: 'Yearly Goal Progress' };
      case 'weekly': return { stats: getMonthlyProgress(getMonthlyGoal()), label: 'Monthly Goal Progress' };
      case 'daily': return { stats: getWeeklyProgress(wg), label: 'Weekly Goal Progress' };
      default: return { stats: getGoalProgress(yearlyGoals), label: 'Overall Progress' };
    }
  };
  const { stats: currentProgress, label: progressLabel } = getLevelProgress();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">Goal Planner</h1>
          <p className="app-date">{today}</p>
        </div>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${activeLevel === 'all-daily' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => navigateTo('all-daily')}
          >
            Tasks
          </button>
          <button
            className={`view-toggle-btn ${activeLevel !== 'all-daily' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => navigateTo('yearly')}
          >
            Goals
          </button>
        </div>
      </header>

      <main className="app-main">
        <ProgressBar stats={currentProgress} label={progressLabel} />

        {activeLevel === 'all-daily' && (
          <AllDailyTasks
            yearlyGoals={yearlyGoals}
            onComplete={completeTaskByPath}
            onDelete={deleteTaskByPath}
          />
        )}

        {activeLevel !== 'all-daily' && (
          <PlannerBoard
            activeLevel={activeLevel}
            breadcrumbs={buildBreadcrumbs()}
            onNavigate={navigateTo}
          />
        )}

        {activeLevel === 'yearly' && (
          <YearlyGoals
            goals={yearlyGoals}
            onAdd={addYearlyGoal}
            onDelete={deleteYearlyGoal}
            onSelect={selectYearly}
            selectedId={selectedYearly}
          />
        )}

        {activeLevel === 'monthly' && selectedYearly && (
          <MonthlyGoals
            goals={getYearlyGoal()?.monthlyGoals || []}
            parentTitle={getYearlyGoal()?.title}
            onAdd={addMonthlyGoal}
            onDelete={deleteMonthlyGoal}
            onSelect={selectMonthly}
            selectedId={selectedMonthly}
          />
        )}

        {activeLevel === 'weekly' && selectedMonthly && (
          <WeeklyGoals
            goals={getMonthlyGoal()?.weeklyGoals || []}
            parentTitle={getMonthlyGoal()?.title}
            onAdd={addWeeklyGoal}
            onDelete={deleteWeeklyGoal}
            onSelect={selectWeekly}
            selectedId={selectedWeekly}
          />
        )}

        {activeLevel === 'daily' && selectedWeekly && (
          <DailyTodoList
            allTodos={wg?.dailyTasks || []}
            completedTodos={wg?.completedTasks || []}
            parentTitle={wg?.title}
            onAdd={addDailyTask}
            onDelete={deleteDailyTask}
            onComplete={completeDailyTask}
            onDeleteCompleted={deleteCompletedTask}
            showCompletion={false}
          />
        )}
      </main>

      <footer className="copyright">
        <p>&copy; 2025 <a href="https://www.sohamsur.com/">Soham Sur</a></p>
      </footer>
    </div>
  );
}

export default App;

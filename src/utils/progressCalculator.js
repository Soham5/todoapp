export const calculateProgress = (totalTasks, completedTasks) => {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

export const getProgressStats = (allTodos, completedTodos) => {
  const total = allTodos.length + completedTodos.length;
  const completed = completedTodos.length;
  const pending = allTodos.length;
  const percentage = calculateProgress(total, completed);

  return { total, completed, pending, percentage };
};

export const getStreakMessage = (percentage) => {
  if (percentage === 100) return "All done! You're a productivity machine!";
  if (percentage >= 75) return "Almost there — keep pushing!";
  if (percentage >= 50) return "Halfway through — solid progress!";
  if (percentage >= 25) return "Good start — keep the momentum!";
  if (percentage > 0) return "You've begun — every step counts!";
  return "Add some tasks to get started!";
};

export const getGoalProgress = (yearlyGoals) => {
  let totalTasks = 0;
  let completedTasks = 0;

  yearlyGoals.forEach((yg) => {
    (yg.monthlyGoals || []).forEach((mg) => {
      (mg.weeklyGoals || []).forEach((wg) => {
        const daily = wg.dailyTasks || [];
        const done = wg.completedTasks || [];
        totalTasks += daily.length + done.length;
        completedTasks += done.length;
      });
    });
  });

  return {
    total: totalTasks,
    completed: completedTasks,
    pending: totalTasks - completedTasks,
    percentage: calculateProgress(totalTasks, completedTasks),
  };
};

export const getYearlyProgress = (yearlyGoal) => {
  if (!yearlyGoal) return { total: 0, completed: 0, pending: 0, percentage: 0 };
  let totalTasks = 0;
  let completedTasks = 0;
  (yearlyGoal.monthlyGoals || []).forEach((mg) => {
    (mg.weeklyGoals || []).forEach((wg) => {
      totalTasks += (wg.dailyTasks || []).length + (wg.completedTasks || []).length;
      completedTasks += (wg.completedTasks || []).length;
    });
  });
  return { total: totalTasks, completed: completedTasks, pending: totalTasks - completedTasks, percentage: calculateProgress(totalTasks, completedTasks) };
};

export const getMonthlyProgress = (monthlyGoal) => {
  if (!monthlyGoal) return { total: 0, completed: 0, pending: 0, percentage: 0 };
  let totalTasks = 0;
  let completedTasks = 0;
  (monthlyGoal.weeklyGoals || []).forEach((wg) => {
    totalTasks += (wg.dailyTasks || []).length + (wg.completedTasks || []).length;
    completedTasks += (wg.completedTasks || []).length;
  });
  return { total: totalTasks, completed: completedTasks, pending: totalTasks - completedTasks, percentage: calculateProgress(totalTasks, completedTasks) };
};

export const getWeeklyProgress = (weeklyGoal) => {
  if (!weeklyGoal) return { total: 0, completed: 0, pending: 0, percentage: 0 };
  const daily = weeklyGoal.dailyTasks || [];
  const done = weeklyGoal.completedTasks || [];
  const total = daily.length + done.length;
  return { total, completed: done.length, pending: daily.length, percentage: calculateProgress(total, done.length) };
};

let _idCounter = Date.now();
export const genId = () => String(_idCounter++);

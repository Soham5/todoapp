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

import React, { useEffect, useState } from 'react';
import ProgressBar from './components/ProgressBar';
import DailyTodoList from './components/DailyTodoList';
import { getProgressStats } from './utils/progressCalculator';
import './App.css';

function App() {
  const [allTodos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const clearDaily = () => {
    setTodos([]);
    setCompletedTodos([]);
    localStorage.removeItem('todolist');
    localStorage.removeItem('completedTodolist');
    localStorage.setItem('todoDate', new Date().toDateString());
  };

  useEffect(() => {
    const savedDate = localStorage.getItem('todoDate');
    const today = new Date().toDateString();

    if (savedDate !== today) {
      clearDaily();
      return;
    }

    const savedTodo = JSON.parse(localStorage.getItem('todolist'));
    const savedCompleted = JSON.parse(localStorage.getItem('completedTodolist'));
    if (savedTodo) setTodos(savedTodo);
    if (savedCompleted) setCompletedTodos(savedCompleted);
  }, []);

  // Check for midnight rollover while the app is open
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow - now;

    const timer = setTimeout(() => {
      clearDaily();
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  });

  const addTodo = (newItem) => {
    const updated = [...allTodos, newItem];
    setTodos(updated);
    localStorage.setItem('todolist', JSON.stringify(updated));
    if (!localStorage.getItem('todoDate')) {
      localStorage.setItem('todoDate', new Date().toDateString());
    }
  };

  const deleteTodo = (index) => {
    const updated = allTodos.filter((_, i) => i !== index);
    setTodos(updated);
    localStorage.setItem('todolist', JSON.stringify(updated));
  };

  const completeTodo = (index) => {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const completed = { ...allTodos[index], completedAt: time };

    const updatedCompleted = [...completedTodos, completed];
    setCompletedTodos(updatedCompleted);
    localStorage.setItem('completedTodolist', JSON.stringify(updatedCompleted));

    deleteTodo(index);
  };

  const deleteCompleted = (index) => {
    const updated = completedTodos.filter((_, i) => i !== index);
    setCompletedTodos(updated);
    localStorage.setItem('completedTodolist', JSON.stringify(updated));
  };

  const stats = getProgressStats(allTodos, completedTodos);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">Daily Planner</h1>
          <p className="app-date">{today}</p>
        </div>
      </header>

      <main className="app-main">
        <ProgressBar stats={stats} />
        <DailyTodoList
          allTodos={allTodos}
          completedTodos={completedTodos}
          onAdd={addTodo}
          onDelete={deleteTodo}
          onComplete={completeTodo}
          onDeleteCompleted={deleteCompleted}
        />
      </main>

      <footer className="copyright">
        <p>&copy; 2025 <a href="https://www.sohamsur.com/">Soham Sur</a></p>
      </footer>
    </div>
  );
}

export default App;

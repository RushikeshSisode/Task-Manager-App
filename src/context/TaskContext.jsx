import { createContext, useContext, useEffect, useState } from "react";
import {
  addTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
  subscribeToTasks
} from "../services/taskService";
import { useAuth } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Real-time listener (ONLY this)
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTasks(user.uid, (data) => {
      setTasks(data);
      setLoading(false);
    });

    return () => unsubscribe();  // cleanup on unmount
  }, [user]);

  // 📌 Add Task
  const createTask = async (taskData) => {
    try {
      setError(null);

      await addTask({
        ...taskData,
        userId: user.uid,
        createdAt: new Date(),
        order: tasks.length
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add task");
    }
  };

  // 📌 Update Task 
  const editTask = async (id, updatedData) => {
    try {
      setError(null);
      await updateTask(id, updatedData);
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  // 📌 Delete Task
  const removeTask = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

    // 📌 Delete All Tasks - NEW
  const removeAllTasks = async () => {
    try {
      setError(null);
      await deleteAllTasks(user.uid);
    } catch (err) {
      console.error(err);
      setError("Failed to delete all tasks");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        createTask,
        editTask,
        removeTask,
        removeAllTasks  // ← Expose new function
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
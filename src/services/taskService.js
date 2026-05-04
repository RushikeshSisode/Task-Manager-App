import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from "firebase/firestore";

// 📌 Get tasks
export const getTasks = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return []; // safe fallback
  }
};

// 📌 Add task
export const addTask = async (task) => {
  console.log("Writing to Firestore", task); // 👈 add this
  try {
    if (!task || !task.title) {
      throw new Error("Task title is required");
    }

    const docRef = await addDoc(collection(db, "tasks"), task);
    console.log("Task added with ID:", docRef.id); // 👈 add this

    return { id: docRef.id, ...task };

  } catch (err) {
    console.error("Error adding task:", err);
    throw err; // rethrow so UI can handle it
  }
};

// 📌 Update task
export const updateTask = async (id, updatedData) => {
  try {
    if (!id) throw new Error("Task ID is required");

    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, updatedData);
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
};

// 📌 Delete task
export const deleteTask = async (id) => {
  try {
    if (!id) throw new Error("Task ID is required");

    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
};



// 📌 Delete all tasks for a user
export const deleteAllTasks = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const q = query(collection(db, "tasks"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    // Delete all tasks in batch
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`Deleted ${snapshot.docs.length} tasks`);
  } catch (err) {
    console.error("Error deleting all tasks:", err);
    throw err;
  }
};

export const subscribeToTasks = (userId, callback) => {
  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    // orderBy("status"),
    // orderBy("order")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    },
    (error) => {
      console.error("Realtime error:", error);
    }
  );

  return unsubscribe;
};
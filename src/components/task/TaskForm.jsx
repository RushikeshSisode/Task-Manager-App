import { useState } from "react";
import { useTasks } from "../../context/TaskContext";

const TaskForm = () => {
  const { createTask } = useTasks();
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    createTask({ title, status: "todo" });
    setTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className={`flex items-center gap-2 bg-white rounded-xl border transition-all duration-200 shadow-sm overflow-hidden pr-1.5 pl-4 py-1.5
      ${focused ? "border-indigo-300 ring-2 ring-indigo-100" : "border-gray-200 hover:border-gray-300"}`}>
      
      {/* Plus icon */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400 shrink-0">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Add a new task..."
        className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none py-1 min-w-0"
      />

      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
          ${title.trim()
            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        Add
      </button>
    </div>
  );
};

export default TaskForm;
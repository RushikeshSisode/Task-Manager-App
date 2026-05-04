import { useState, useMemo } from "react";
import TaskColumn from "../../components/task/TaskColumn";
import TaskForm from "../../components/task/TaskForm";
import { DragDropContext } from "@hello-pangea/dnd";
import Navbar from "../../components/layout/Navbar";
import { useTasks } from "../../hooks/useTasks";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const StatCard = ({ label, value, color }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
    <div className={`w-2 h-8 rounded-full ${color}`} />
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { tasks, editTask, removeAllTasks } = useTasks();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ New state for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "todo" | "inprogress" | "done"

  // ✅ Filtered tasks derived from raw tasks — no Firestore calls
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ? true : t.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, activeFilter]);

  // ✅ Split filtered tasks into columns
  const todo = filteredTasks.filter((t) => t.status === "todo");
  const inProgress = filteredTasks.filter((t) => t.status === "inprogress");
  const done = filteredTasks.filter((t) => t.status === "done");

  // Stats always use raw tasks, not filtered
  const completionRate =
    tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100) : 0;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    editTask(draggableId, { status: destination.droppableId });
  };

  const handleDeleteAll = async () => {
    await removeAllTasks();
    setShowDeleteModal(false);
  };

  const filterButtons = [
    { label: "All", value: "all" },
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "inprogress" },
    { label: "Done", value: "done" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tasks.length === 0
              ? "No tasks yet — add your first one below"
              : `${tasks.filter(t => t.status === "done").length} of ${tasks.length} tasks completed`}
          </p>
        </div>

        {/* Stats row */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard label="Total" value={tasks.length} color="bg-gray-300" />
            <StatCard label="To Do" value={tasks.filter(t => t.status === "todo").length} color="bg-blue-400" />
            <StatCard label="In Progress" value={tasks.filter(t => t.status === "inprogress").length} color="bg-amber-400" />
            <StatCard label="Done" value={tasks.filter(t => t.status === "done").length} color="bg-emerald-400" />
          </div>
        )}

        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</span>
              <span className="text-xs font-bold text-gray-700">{completionRate}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Toolbar — TaskForm + Search + Filter */}
        <div className="flex flex-col gap-3 mb-6">

          {/* Row 1: Add task + Clear all */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[260px] max-w-sm">
              <TaskForm />
            </div>

            {tasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-rose-200"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
                Clear all ({tasks.length})
              </Button>
            )}
          </div>

          {/* Row 2: Search + Status filter */}
          {tasks.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">

              {/* ✅ Search input */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg
                    placeholder:text-gray-400 text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300
                    hover:border-gray-300 transition-all"
                />
                {/* ✅ Clear search button */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {/* ✅ Filter pills */}
              <div className="flex items-center gap-1.5">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setActiveFilter(btn.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                      ${activeFilter === btn.value
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                      }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* ✅ No results message */}
          {tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              No tasks match <span className="font-medium text-gray-700">"{searchQuery}"</span>
              <button
                onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
                className="ml-auto text-indigo-500 font-medium text-xs hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

        </div>

        {/* Kanban columns */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-4">
            <TaskColumn title="To Do" tasks={todo} status="todo" />
            <TaskColumn title="In Progress" tasks={inProgress} status="inprogress" />
            <TaskColumn title="Done" tasks={done} status="done" />
          </div>
        </DragDropContext>
      </main>

      {/* Delete all modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Clear all tasks"
      >
        <p className="text-sm text-gray-600 mb-5">
          This will permanently delete all{" "}
          <span className="font-semibold text-gray-900">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>.
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAll}>Delete all</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
import { Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../../context/TaskContext";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useState } from "react";

const statusConfig = {
  todo: { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-600 border-blue-100" },
  inprogress: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-600 border-amber-100" },
  done: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-600 border-emerald-100" },
};

const TaskCard = ({ task, index }) => {
  const { removeTask, editTask } = useTasks();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEditSave = () => {
    if (!editedTitle.trim()) return;
    editTask(task.id, { title: editedTitle });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  const config = statusConfig[task.status] || statusConfig.todo;

  const formatDate = (createdAt) => {
    try {
      const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`
              group bg-white rounded-xl border border-gray-100
              transition-all duration-200
              ${snapshot.isDragging
                ? "shadow-xl rotate-1 scale-[1.02] border-indigo-200 ring-2 ring-indigo-100"
                : "shadow-sm hover:shadow-md hover:border-gray-200"
              }
            `}
            style={provided.draggableProps.style}
          >
            {/* Drag handle strip */}
            <div
              {...provided.dragHandleProps}
              className="flex items-center justify-center h-5 rounded-t-xl cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="flex gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-0.5 h-2 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              {/* Title row */}
              <div className="mb-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full text-sm font-medium text-gray-900 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                ) : (
                  <p
                    className={`text-sm font-medium text-gray-800 leading-snug ${
                      task.status === "done" ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                )}
              </div>

              {/* Meta row */}
              {!isEditing && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-gray-400">
                    {formatDate(task.createdAt)}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.badge}`}>
                    {task.status === "inprogress" ? "In Progress" : task.status === "todo" ? "To Do" : "Done"}
                  </span>
                </div>
              )}

              {/* Actions */}
              {isEditing ? (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="primary" onClick={handleEditSave} className="flex-1">
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setEditedTitle(task.title); setIsEditing(false); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  {/* Delete */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    title="Delete"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => { setEditedTitle(task.title); setIsEditing(true); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                    title="Edit"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Progress button */}
                  {task.status !== "done" && (
                    <Button
                      size="sm"
                      variant={task.status === "todo" ? "secondary" : "success"}
                      onClick={() =>
                        editTask(task.id, {
                          status: task.status === "todo" ? "inprogress" : "done",
                        })
                      }
                    >
                      {task.status === "todo" ? (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Start
                        </>
                      ) : (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Done
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete task">
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete <span className="font-medium text-gray-900">"{task.title}"</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => { removeTask(task.id); setShowDeleteModal(false); }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TaskCard;
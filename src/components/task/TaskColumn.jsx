import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const columnConfig = {
  todo: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    iconBg: "bg-blue-50 text-blue-500",
    accent: "border-t-blue-400",
    badgeBg: "bg-blue-50 text-blue-600",
    dropBg: "bg-blue-50/50",
  },
  inprogress: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    iconBg: "bg-amber-50 text-amber-500",
    accent: "border-t-amber-400",
    badgeBg: "bg-amber-50 text-amber-600",
    dropBg: "bg-amber-50/50",
  },
  done: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    iconBg: "bg-emerald-50 text-emerald-500",
    accent: "border-t-emerald-400",
    badgeBg: "bg-emerald-50 text-emerald-600",
    dropBg: "bg-emerald-50/50",
  },
};

const TaskColumn = ({ title, tasks, status }) => {
  const config = columnConfig[status] || columnConfig.todo;

  return (
    <div className="flex-1 min-w-[280px] max-w-sm flex flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${config.iconBg}`}>
            {config.icon}
          </div>
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 min-h-[480px] rounded-2xl border-2 border-t-4 p-3 transition-all duration-200
              ${config.accent}
              ${snapshot.isDraggingOver
                ? `${config.dropBg} border-dashed border-gray-300`
                : "border-gray-100 bg-gray-50/60"
              }
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex flex-col items-center justify-center h-32 mt-6 text-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">No tasks yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {tasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
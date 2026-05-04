const Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  label,
  error,
  icon,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 text-sm text-gray-800 bg-white border rounded-lg
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
            transition-all duration-150
            ${error ? "border-rose-400 focus:ring-rose-400" : "border-gray-200 hover:border-gray-300"}
            ${icon ? "pl-9" : ""}
            ${className}`}
        />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default Input;
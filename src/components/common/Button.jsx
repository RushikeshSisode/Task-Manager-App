const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  size = "md",
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none";

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2",
  };

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-sm",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 focus:ring-gray-300 shadow-sm",
    danger:
      "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 focus:ring-rose-400 shadow-sm",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 focus:ring-emerald-400 shadow-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
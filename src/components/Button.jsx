export default function Button({
  children,
  type = "button",
  bgcolor = "bg-blue-600",
  textcolor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${bgcolor} ${textcolor} ${className}`}
      type={`${type}`}
      {...props}
    >
      {children}
    </button>
  );
}

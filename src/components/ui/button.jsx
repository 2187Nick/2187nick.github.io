import React from 'react';

const Button = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
      transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };

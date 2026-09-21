import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'purple' | 'danger';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  size = 'sm',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';

  const variantStyles = {
    neutral: 'bg-neutral-800/80 text-neutral-300 border border-neutral-700/60',
    accent: 'bg-sky-950/70 text-sky-400 border border-sky-800/60',
    success: 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60',
    warning: 'bg-amber-950/70 text-amber-400 border border-amber-800/60',
    purple: 'bg-purple-950/70 text-purple-400 border border-purple-800/60',
    danger: 'bg-rose-950/70 text-rose-400 border border-rose-800/60',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md whitespace-nowrap transition-colors ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

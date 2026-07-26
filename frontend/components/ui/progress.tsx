import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, max = 100, variant = 'default', ...props }, ref) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div ref={ref} className={cn('w-full h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-edge/50', className)} {...props}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          variant === 'default' && 'bg-cyber-cyan',
          variant === 'success' && 'bg-cyber-green',
          variant === 'warning' && 'bg-cyber-amber',
          variant === 'danger' && 'bg-cyber-red',
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'
export { Progress }

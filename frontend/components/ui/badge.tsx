import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'cyber-tag',
        variant === 'default' && 'bg-cyber-panel/50 text-cyber-muted border border-cyber-edge',
        variant === 'success' && 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30',
        variant === 'warning' && 'bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/30',
        variant === 'danger' && 'bg-cyber-red/10 text-cyber-red border border-cyber-red/30',
        variant === 'info' && 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30',
        variant === 'purple' && 'bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30',
        variant === 'pink' && 'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/30',
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'
export { Badge }

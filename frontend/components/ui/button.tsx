import { cn } from '@/lib/utils'
import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-mono text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/20 hover:shadow-lg hover:shadow-cyber-green/10',
          variant === 'default' && 'bg-cyber-panel border border-cyber-edge text-cyber-text hover:border-cyber-cyan/30 hover:text-cyber-cyan',
          variant === 'ghost' && 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50',
          variant === 'danger' && 'bg-cyber-red/10 border border-cyber-red/30 text-cyber-red hover:bg-cyber-red/20',
          variant === 'outline' && 'border border-cyber-edge text-cyber-text hover:border-cyber-cyan/50',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-8 py-3.5 text-base',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
export { Button }

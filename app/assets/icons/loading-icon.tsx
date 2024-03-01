import { cn } from '@/lib/utils/misc'
import React from 'react'

const LoadingIcon = React.forwardRef<
  HTMLOrSVGElement,
  React.SVGAttributes<SVGElement>
>(({ className, ...props }, ref) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
    {...props}
  >
    <g clipPath="url(#clip0_2628_67946)">
      <path
        d="M6 1.125V2.375M6 9V11M2.875 6H1.125M10.625 6H9.875M9.22855 9.22855L8.875 8.875M9.33211 2.70789L8.625 3.415M2.46079 9.53921L3.875 8.125M2.56434 2.60434L3.625 3.665"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2628_67946">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
))

LoadingIcon.displayName = 'LoadingIcon'
export default LoadingIcon

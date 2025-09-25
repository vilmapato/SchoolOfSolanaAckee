// src/components/ui/Button.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils"; // assumes you have cn() utility for conditional classes

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const buttonVariants = {
  default:
    "bg-purple-600 text-white hover:bg-purple-700 font-medium rounded px-4 py-2 transition-colors",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 rounded px-4 py-2 transition-colors",
  outline:
    "border border-gray-300 text-gray-800 hover:bg-gray-100 rounded px-4 py-2",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 rounded px-4 py-2",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800 px-4 py-2",
  link: "text-purple-600 hover:underline px-4 py-2",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-lg",
  icon: "h-10 w-10 p-0",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants[variant], sizeVariants[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };


import React from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ThumbButtonProps = {
  type: "up" | "down";
  className?: string;
};

const ThumbButton = ({ type, className }: ThumbButtonProps) => {
  const isThumbsUp = type === "up";
  const path = isThumbsUp ? "/thank-you" : "/feedback";
  
  return (
    <Link to={path}>
      <button 
        className={cn(
          "w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-transform hover:scale-105",
          isThumbsUp ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
          className
        )}
      >
        {isThumbsUp ? (
          <ThumbsUp size={64} className="text-white" />
        ) : (
          <ThumbsDown size={64} className="text-white" />
        )}
      </button>
    </Link>
  );
};

export default ThumbButton;

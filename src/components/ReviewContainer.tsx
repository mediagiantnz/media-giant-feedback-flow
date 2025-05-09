
import React, { ReactNode } from "react";

type ReviewContainerProps = {
  children: ReactNode;
};

const ReviewContainer = ({ children }: ReviewContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10">
        {children}
      </div>
    </div>
  );
};

export default ReviewContainer;

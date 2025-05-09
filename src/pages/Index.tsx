
import React from "react";
import Logo from "@/components/Logo";
import ThumbButton from "@/components/ThumbButton";
import ReviewContainer from "@/components/ReviewContainer";

const Index = () => {
  return (
    <ReviewContainer>
      <Logo />
      
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-medium mb-4 text-gray-800">
          Thanks heaps for choosing Media Giant — how was the service?
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Tap 👍 or 👎 to let us know.
        </p>
      </div>
      
      <div className="flex justify-center gap-8 md:gap-16 mt-8">
        <ThumbButton type="up" />
        <ThumbButton type="down" />
      </div>
    </ReviewContainer>
  );
};

export default Index;

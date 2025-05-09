
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ReviewContainer from "@/components/ReviewContainer";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <ReviewContainer>
      <Logo />
      
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-medium mb-4 text-gray-800">
          Thank you for your positive feedback!
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          We're glad you enjoyed our service. Would you mind sharing your experience on Google?
        </p>
        
        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg"
            asChild
          >
            <a 
              href="https://g.page/r/CUdcCKHfJIQHEAI/review" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Leave a Google Review
            </a>
          </Button>
        </div>
        
        <div className="mt-6">
          <Link to="/" className="text-blue-500 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    </ReviewContainer>
  );
};

export default ThankYou;

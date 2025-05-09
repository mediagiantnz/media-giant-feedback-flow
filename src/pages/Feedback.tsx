
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo";
import ReviewContainer from "@/components/ReviewContainer";
import { Link } from "react-router-dom";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve our service.",
      });
      setFeedback("");
    }, 1000);
  };

  return (
    <ReviewContainer>
      <Logo />
      
      {isSubmitted ? (
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium mb-4 text-gray-800">
            Thank you for your feedback!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We appreciate you taking the time to help us improve our service.
          </p>
          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Return to homepage
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-medium mb-4 text-gray-800">
              We're sorry to hear that
            </h1>
            <p className="text-lg text-gray-600">
              Please let us know how we can improve our service.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Textarea
                placeholder="What could we have done better?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                className="w-full resize-none"
                required
              />
            </div>
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isSubmitting || !feedback.trim()} 
                className="bg-blue-500 hover:bg-blue-600 px-8 py-2"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-500 hover:underline">
              Return to homepage
            </Link>
          </div>
        </>
      )}
    </ReviewContainer>
  );
};

export default Feedback;

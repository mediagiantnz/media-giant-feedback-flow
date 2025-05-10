import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/components/Logo"; // Will be updated in a later step
import ReviewContainer from "@/components/ReviewContainer";

// Finalized Client Configuration Interface
interface ClientConfig {
  clientID: string;
  isActive: boolean;
  clientName: string;
  logoUrl: string; // URL for the client's logo from S3
  customPageText?: {
    welcomeMessage?: string;
    positiveFeedbackPrompt?: string;
    negativeFeedbackPrompt?: string;
    thankYouMessageTitle?: string;
    thankYouMessageBody?: string;
    submitButtonText?: string;
    // Add more customizable text fields as needed
  };
  googleReviewUrl: string;
  themeColors?: {
    primary?: string;
    secondary?: string;
    pageBackground?: string;
    textColor?: string;
    buttonTextColor?: string;
    // Add more theme color options as needed
  };
  fontPreferences?: {
    primaryFont?: string;
    secondaryFont?: string;
  };
  // negativeFeedbackRecipientEmail: string; // This is for backend use, not directly used in frontend rendering logic here
}

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientConfig, setClientConfig] = useState<ClientConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  const getQueryParam = (param: string) => {
    return new URLSearchParams(location.search).get(param);
  };

  const clientID = getQueryParam("clientID");
  const contactID = getQueryParam("contactID"); // To be used in form submission

  useEffect(() => {
    if (clientID) {
      setIsLoading(true);
      setError(null);
      // Placeholder for actual API endpoint - will be replaced by API Gateway URL
      fetch(`https://bw4agz6xn4.execute-api.ap-southeast-2.amazonaws.com/prod/client-config/${clientID}`) 
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: "Failed to parse error response" }));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: ClientConfig) => {
          setClientConfig(data);
          if (!data.isActive) {
            setError("This service is currently unavailable. Please contact support if you believe this is an error.");
          }
        })
        .catch((err) => {
          console.error("Error fetching client config:", err);
          setError(err.message || "Oops! We couldn't load the page settings. Please check the link or try again a bit later.");
          toast({
            title: "Configuration Error",
            description: err.message || "Could not load page settings.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("Client ID is missing from the URL. Cannot load page configuration.");
      toast({
        title: "Error",
        description: "Client ID is missing. Cannot load page configuration.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [clientID, toast]);

  const handleSubmitNegativeFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !clientConfig || !contactID || !clientConfig.isActive) {
      toast({
        title: "Cannot Submit Feedback",
        description: "Feedback cannot be empty, client configuration must be loaded, service must be active, and contact ID must be present.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // Placeholder for actual API endpoint for submitting negative feedback
      const response = await fetch("/api/feedback/negative", { // This will be an API Gateway endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientID: clientConfig.clientID,
          contactID: contactID, 
          // name: "User Name", // Potentially get name from contactID lookup or add form fields
          // phone: "", // Potentially add form fields
          feedbackText: feedback,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse submission error" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setIsSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: clientConfig.customPageText?.thankYouMessageBody || "Thank you for your feedback! We appreciate you taking the time to help us improve.",
      });
      setFeedback("");
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      toast({
        title: "Submission Error",
        description: err.message || "Could not submit your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePositiveFeedback = () => {
    if (!clientConfig || !contactID || !clientConfig.isActive) {
        toast({ title: "Error", description: "Client configuration not loaded or service inactive.", variant: "destructive" });
        return;
    }
    // Optional: Log positive feedback to backend (placeholder API call)
    fetch("/api/feedback/positive", { // This will be an API Gateway endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientID: clientConfig.clientID, contactID: contactID })
    }).then(res => {
        if(res.ok) console.log("Positive feedback action logged (placeholder).");
        else console.error("Failed to log positive feedback action (placeholder).");
    }).catch(err => console.error("Error logging positive feedback action (placeholder):", err));

    if (clientConfig.googleReviewUrl) {
      window.location.href = clientConfig.googleReviewUrl;
    } else {
        toast({ title: "Configuration Issue", description: "Google Review URL not configured for this client.", variant: "destructive" });
    }
  };

  // Apply dynamic styles
  const pageStyle: React.CSSProperties = {
    backgroundColor: clientConfig?.themeColors?.pageBackground || '#FFFFFF', // Default white
    color: clientConfig?.themeColors?.textColor || '#333333', // Default dark grey
    fontFamily: clientConfig?.fontPreferences?.primaryFont || 'sans-serif',
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: clientConfig?.themeColors?.primary || '#007bff', // Default blue
    color: clientConfig?.themeColors?.buttonTextColor || '#FFFFFF',
  };
  
  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: clientConfig?.themeColors?.secondary || '#6c757d', // Default grey
    color: clientConfig?.themeColors?.buttonTextColor || '#FFFFFF',
  };

  if (isLoading) {
    return (
      <ReviewContainer style={pageStyle}>
        <div className="text-center">
          <p className="text-lg">Loading your personalized experience...</p>
          {/* Consider adding a more visually appealing spinner/loader component */}
        </div>
      </ReviewContainer>
    );
  }

  if (error || !clientConfig) { // Covers clientID missing, fetch error, or clientConfig still null after load
    return (
      <ReviewContainer style={pageStyle}>
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Access Issue</h1>
          <p>{error || "Could not load the necessary information for this page."}</p>
          <Link to="/">
            <Button className="mt-4" style={primaryButtonStyle}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </ReviewContainer>
    );
  }
  
  if (!clientConfig.isActive) {
    return (
      <ReviewContainer style={pageStyle}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Unavailable</h1>
          <p>This service is currently unavailable. Please contact support if you believe this is an error.</p>
           <Link to="/">
            <Button className="mt-4" style={primaryButtonStyle}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </ReviewContainer>
    );
  }

  // Default texts if not provided by clientConfig
  const welcomeMessage = clientConfig.customPageText?.welcomeMessage || `Feedback for ${clientConfig.clientName}`;
  const positiveFeedbackPrompt = clientConfig.customPageText?.positiveFeedbackPrompt || "Enjoying our service? Let others know!";
  const negativeFeedbackPrompt = clientConfig.customPageText?.negativeFeedbackPrompt || "How can we improve?";
  const thankYouTitle = clientConfig.customPageText?.thankYouMessageTitle || "Thank You!";
  const thankYouBody = clientConfig.customPageText?.thankYouMessageBody || "Your feedback has been submitted.";
  const submitButtonText = clientConfig.customPageText?.submitButtonText || "Submit Feedback";

  return (
    <ReviewContainer style={pageStyle}>
      <Logo logoUrl={clientConfig.logoUrl} altText={`${clientConfig.clientName} Logo`} />
      
      {isSubmitted ? (
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium mb-4">
            {thankYouTitle}
          </h1>
          <p className="text-lg mb-8">
            {thankYouBody}
          </p>
          {/* Optionally, redirect or offer a link back to client's main site */}
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-medium mb-4">
              {welcomeMessage}
            </h1>
            {/* Thumbs Up / Thumbs Down section */}
            {/* This UI part needs to be aligned with your existing structure or designed */}
            <p className="text-lg mb-2">{positiveFeedbackPrompt}</p>
            <Button onClick={handlePositiveFeedback} className="bg-green-500 hover:bg-green-600 px-6 py-3 text-lg mb-4" style={primaryButtonStyle}>
              👍 Yes, I'm happy!
            </Button>
            
            <p className="text-lg mt-6 mb-2">{negativeFeedbackPrompt}</p>
            {/* The button below would typically reveal the form, or this IS the form page */}
            {/* For now, let's assume this page directly shows the form if chosen */}
             <Button className="bg-red-500 hover:bg-red-600 px-6 py-3 text-lg" style={secondaryButtonStyle} onClick={() => { /* Logic to show form if hidden */ }}>
              👎 No, I have some feedback.
            </Button>
          </div>

          {/* Negative Feedback Form - assuming it's always shown or toggled */}
          <form onSubmit={handleSubmitNegativeFeedback} className="space-y-6 mt-8">
            <div>
              <Textarea
                placeholder="Please share your experience or suggestions..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                className="w-full resize-none"
                style={{fontFamily: clientConfig?.fontPreferences?.secondaryFont || 'sans-serif'}}
                required
              />
            </div>
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={isSubmitting || !feedback.trim()}
                className="px-8 py-2" // Base classes, style overrides with primaryButtonStyle
                style={primaryButtonStyle}
              >
                {isSubmitting ? "Submitting..." : submitButtonText}
              </Button>
            </div>
          </form>
        </>
      )}
    </ReviewContainer>
  );
};

export default Feedback;


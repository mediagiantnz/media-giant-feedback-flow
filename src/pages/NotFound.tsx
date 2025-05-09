
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReviewContainer from "@/components/ReviewContainer";
import Logo from "@/components/Logo";

const NotFound = () => {
  return (
    <ReviewContainer>
      <Logo />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist
        </p>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </ReviewContainer>
  );
};

export default NotFound;

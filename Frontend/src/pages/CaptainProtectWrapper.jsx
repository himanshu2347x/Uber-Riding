import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("captainToken");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      if (!token) {
        navigate("/captain-login");
        return;
      }

    
    const fetchCaptainProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://ridenow-od3s.onrender.com/captains/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCaptain(response.data.captain);
          navigate("/captain-home");
        } else {
          localStorage.removeItem("captainToken");
        }
      } catch (err) {
        console.error("Error fetching captain profile:", err);
        localStorage.removeItem("captainToken");
      } finally {
        setIsLoading(false); // Ensure loading state is updated after the API call
      }
    };

    fetchCaptainProfile();
  }, [token, navigate]); // Added navigate and setCaptain to dependency array

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;

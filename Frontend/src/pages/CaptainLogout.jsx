import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem("captainToken");

        // Correct the URL string
        const response = await axios.get(
          "https://ridenow-od3s.onrender.com/captains/logout",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("captainToken");
          navigate("/login");
        }
      } catch (error) {
        console.error("Logout failed:", error.message);
        navigate("/login");
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default CaptainLogout;

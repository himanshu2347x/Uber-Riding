import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          `https://ridenow-od3s.onrender.com/users/logout`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          localStorage.removeItem("userToken");
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

export default UserLogout;

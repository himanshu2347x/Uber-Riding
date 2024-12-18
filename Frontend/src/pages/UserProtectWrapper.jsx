import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token ) {
      navigate("/login");
    }

    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://ridenow-od3s.onrender.com/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setUser(response.data);
        } else {
          localStorage.removeItem("userToken");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        localStorage.removeItem("userToken");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;

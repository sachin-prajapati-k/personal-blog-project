import { useEffect, useState } from "react";
import "./App.css";
import authService from "./appwrite/services/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (!userData) {
          dispatch(logout());
        } else {
          dispatch(login(userData));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {!loading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          loading...
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;

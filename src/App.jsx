import { useEffect, useState } from "react";
import "./App.css";
import authService from "./appwrite/services/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import { Outlet } from "react-router-dom";

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
        <div className="min-h-screen w-full flex flex-wrap content-between bg-gray-400">
          <div className="w-full block">
            <Header />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <div>null</div>
      )}
    </>
  );
}

export default App;

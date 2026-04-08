import { useDispatch } from "react-redux";
import authService from "../../appwrite/services/auth";
import { logout } from "../../store/authSlice";
export default function LogoutButton() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService.userLogout().then(() => dispatch(logout()));
  };
  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

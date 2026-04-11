import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import LogoutButton from "./LogoutButton";
import Container from "../container/Container";
import { Link } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "LogIn",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "SignUp",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-post",
      active: !authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: !authStatus,
    },
  ];

  return (
    <>
      <header className="py-3 shadow bg-gray-600">
        <Container>
          <nav className="flex">
            <div className="mr-4">
              <Link to="/">
                <Logo width="70px" />
              </Link>
            </div>
            <ul className="flex ml-auto">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
                    >
                      {" "}
                      {item.name}
                    </button>
                  </li>
                ) : null,
              )}
              {authStatus && (
                <li>
                  <LogoutButton />
                </li>
              )}
            </ul>
          </nav>
        </Container>
      </header>
    </>
  );
}

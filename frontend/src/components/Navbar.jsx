import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-lg">
        Food App
      </Link>
      <div>
        {!token ? (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user", // Default role is "user"
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint =
      formData.role === "user" ? "/register/user" : "/register/vendor";

    try {
      await axios.post(`http://localhost:5000${endpoint}`, formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="w-80 border p-4 rounded">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
          required
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
        <button className="bg-blue-600 text-white p-2 w-full">Register</button>
      </form>
    </div>
  );
}

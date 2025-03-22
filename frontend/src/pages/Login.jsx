import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formData.role === "user" ? "/login/user" : "/login/vendor";

    try {
      const res = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData
      );
      localStorage.setItem("token", res.data.token);
      const user = jwtDecode(res.data.token);
      navigate(user.role === "vendor" ? "/vendor" : "/");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="w-80 border p-4 rounded">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
        <button className="bg-blue-600 text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function VendorDashboard() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/food")
      .then((res) => setFoods(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFood = async () => {
    await axios.post("http://localhost:5000/food", form, {
      headers: { Authorization: token },
    });
    setFoods([...foods, form]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <div className="border p-4 rounded">
        <input
          name="name"
          placeholder="Food Name"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />
        <input
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        />
        <button
          onClick={addFood}
          className="bg-green-600 text-white p-2 w-full"
        >
          Add Food
        </button>
      </div>
    </div>
  );
}

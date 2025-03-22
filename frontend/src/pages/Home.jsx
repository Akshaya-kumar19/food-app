import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/food")
      .then((res) => setFoods(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Food Menu</h1>
      {foods.map((food) => (
        <div key={food.id} className="border p-4 rounded mb-3">
          <h2 className="font-semibold">
            {food.name} - ${food.price}
          </h2>
          <p>{food.description}</p>
        </div>
      ))}
    </div>
  );
}

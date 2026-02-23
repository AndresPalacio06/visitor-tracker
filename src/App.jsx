import { useEffect, useState } from "react";
import { saveVisitor } from "./services/firebaseService";
import { getBrowser } from "./utils/getBrowser";

function App() {
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        const visitorData = {
          ip: data.ip,
          country: data.country_name,
          region: data.region,
          city: data.city,
          browser: getBrowser(),
          date: new Date().toISOString(),
        };

        setVisitor(visitorData);

        await saveVisitor(visitorData);

      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    fetchVisitorData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      {!visitor ? (
        <p className="text-xl">Detectando visitante...</p>
      ) : (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Visitor Tracker 🔥</h1>
          <p><strong>IP:</strong> {visitor.ip}</p>
          <p><strong>País:</strong> {visitor.country}</p>
          <p><strong>Departamento:</strong> {visitor.region}</p>
          <p><strong>Ciudad:</strong> {visitor.city}</p>
          <p><strong>Navegador:</strong> {visitor.browser}</p>
        </div>
      )}
    </div>
  );
}

export default App;
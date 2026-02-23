import { useEffect, useState } from "react";
import { saveVisitor } from "./services/firebaseService";
import { getBrowser } from "./utils/getBrowser";

function App() {
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        // 1️⃣ Obtener datos por IP (respaldo)
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        let latitude = null;
        let longitude = null;
        let precision = "IP";

        // 2️⃣ Intentar obtener GPS real
        if (navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                precision = "GPS";
                resolve();
              },
              () => resolve(),
              { timeout: 5000 }
            );
          });
        }

        const visitorData = {
          ip: data.ip,
          country: data.country_name,
          region: data.region,
          city: data.city,
          latitude,
          longitude,
          precision,
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
          <p><strong>Departamento (IP):</strong> {visitor.region}</p>
          <p><strong>Ciudad (IP):</strong> {visitor.city}</p>
          <p><strong>Latitud:</strong> {visitor.latitude || "No permitido"}</p>
          <p><strong>Longitud:</strong> {visitor.longitude || "No permitido"}</p>
          <p><strong>Precisión:</strong> {visitor.precision}</p>
          <p><strong>Navegador:</strong> {visitor.browser}</p>
        </div>
      )}
    </div>
  );
}

export default App;
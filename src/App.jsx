import { useEffect, useState } from "react";
import { saveVisitor } from "./services/firebaseService";
import { getBrowser } from "./utils/getBrowser";

function App() {
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        // ==============================
        // 1️⃣ Obtener datos por IP (respaldo)
        // ==============================
        const ipResponse = await fetch("https://ipapi.co/json/");
        const ipData = await ipResponse.json();

        let latitude = null;
        let longitude = null;
        let realCity = null;
        let realRegion = null;
        let precision = "IP";

        // ==============================
        // 2️⃣ Intentar obtener GPS real
        // ==============================
        if (navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                precision = "GPS";

                try {
                  // ==============================
                  // 3️⃣ Reverse Geocoding (OpenStreetMap)
                  // ==============================
                  const geoResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                  );
                  const geoData = await geoResponse.json();

                  realCity =
                    geoData.address.city ||
                    geoData.address.town ||
                    geoData.address.village ||
                    null;

                  realRegion = geoData.address.state || null;
                } catch (geoError) {
                  console.error("Error en reverse geocoding:", geoError);
                }

                resolve();
              },
              () => resolve(),
              { timeout: 8000 }
            );
          });
        }

        const visitorData = {
          ip: ipData.ip,
          country: ipData.country_name,
          ip_region: ipData.region,
          ip_city: ipData.city,
          latitude,
          longitude,
          gps_city: realCity,
          gps_region: realRegion,
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-6">
      {!visitor ? (
        <p className="text-xl">Detectando visitante...</p>
      ) : (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Visitor Tracker 🔥
          </h1>

          <p><strong>IP:</strong> {visitor.ip}</p>
          <p><strong>País:</strong> {visitor.country}</p>

          <hr className="my-3 border-gray-600" />

          <p><strong>Ciudad (IP):</strong> {visitor.ip_city}</p>
          <p><strong>Departamento (IP):</strong> {visitor.ip_region}</p>

          <hr className="my-3 border-gray-600" />

          <p><strong>Ciudad (GPS):</strong> {visitor.gps_city || "No disponible"}</p>
          <p><strong>Departamento (GPS):</strong> {visitor.gps_region || "No disponible"}</p>

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
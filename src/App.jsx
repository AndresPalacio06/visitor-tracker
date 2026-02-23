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
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-6 text-white">
    {!visitor ? (
      <div className="animate-pulse text-xl">Detectando visitante...</div>
    ) : (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Visitor Tracker 🔥
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              🌍 Datos IP
            </h2>
            <p><span className="font-semibold">IP:</span> {visitor.ip}</p>
            <p><span className="font-semibold">País:</span> {visitor.country}</p>
            <p><span className="font-semibold">Ciudad:</span> {visitor.ip_city}</p>
            <p><span className="font-semibold">Departamento:</span> {visitor.ip_region}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h2 className="text-lg font-semibold mb-3 text-green-400">
              📍 Datos GPS
            </h2>
            <p><span className="font-semibold">Ciudad:</span> {visitor.gps_city || "No disponible"}</p>
            <p><span className="font-semibold">Departamento:</span> {visitor.gps_region || "No disponible"}</p>
            <p><span className="font-semibold">Lat:</span> {visitor.latitude || "No permitido"}</p>
            <p><span className="font-semibold">Lng:</span> {visitor.longitude || "No permitido"}</p>
            <p><span className="font-semibold">Precisión:</span> {visitor.precision}</p>
          </div>

        </div>

        <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-gray-300">
            Navegador: <span className="font-semibold text-white">{visitor.browser}</span>
          </p>
        </div>

      </div>
    )}
  </div>
)}

export default App;
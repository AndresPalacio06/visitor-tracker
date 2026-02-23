export const getBrowser = () => {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome")) return "Google Chrome";
  if (userAgent.includes("Firefox")) return "Mozilla Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Microsoft Edge";

  return "Desconocido";
};
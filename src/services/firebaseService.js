import { db } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const saveVisitor = async (visitorData) => {
  try {
    await addDoc(collection(db, "visitors"), visitorData);
  } catch (error) {
    console.error("Error guardando visitante:", error);
  }
};
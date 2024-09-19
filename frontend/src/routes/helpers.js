import { redirect } from "react-router-dom";

export const isAuthenticated = async () => {
  const token = localStorage.getItem("isValied");
  if (token) throw redirect("/home");
  return null;
};
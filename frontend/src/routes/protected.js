import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const token = localStorage.getItem("isValied");

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default Protected;
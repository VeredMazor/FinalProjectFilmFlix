import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
  } from "react-router-dom";
import Protected from "./protected";
import { isAuthenticated } from "./helpers";

import SignInPage from '../pages/Auth/SignInPage';
import SignUpPage from '../pages/Auth/SignUpPage';
import HomePage from '../pages/Home/HomePage';
import MovieInfo from '../pages/MovieDetails/MovieInfoPage';

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<Protected />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/MovieInfo/:id" element={<MovieInfo />} />
            {/* All other routes that you want to protect will go inside here */}
        </Route>   
        <Route index element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>
    )
  );
  
  const Index = () => {
    return <RouterProvider router={router} />;
  };
  
  export default Index;
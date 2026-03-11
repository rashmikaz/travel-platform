import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyListings from "./pages/MyListings";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateListing />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditListing />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <PrivateRoute>
                <MyListings />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'Raleway', sans-serif",
            borderRadius: 10,
            background: "#0f172a",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.3,
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

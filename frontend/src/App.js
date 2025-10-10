import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Marketing Pages
import LandingPage from "./pages/marketing/LandingPage";
import FeaturesPage from "./pages/marketing/FeaturesPage";
import PricingPage from "./pages/marketing/PricingPage";
import BlogHomePage from "./pages/marketing/BlogHomePage";
import BlogArticlePage from "./pages/marketing/BlogArticlePage";
import AboutPage from "./pages/marketing/AboutPage";
import ContactPage from "./pages/marketing/ContactPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// App Pages (Protected)
import Dashboard from "./pages/app/Dashboard";
import MyGarden from "./pages/app/MyGarden";
import TaskManager from "./pages/app/TaskManager";
import PlantDiagnosis from "./pages/app/PlantDiagnosis";
import PlantDatabase from "./pages/app/PlantDatabase";
import CommunityForum from "./pages/app/CommunityForum";
import WeatherAlerts from "./pages/app/WeatherAlerts";
import ComingSoonPage from "./pages/app/ComingSoonPage";

// Layout Components
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
        <Routes>
          {/* Marketing Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogHomePage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* App Pages (After Login) - Wrapped in AppLayout */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/my-garden" element={<AppLayout><MyGarden /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><TaskManager /></AppLayout>} />
          <Route path="/diagnosis" element={<AppLayout><PlantDiagnosis /></AppLayout>} />
          <Route path="/database" element={<AppLayout><PlantDatabase /></AppLayout>} />
          <Route path="/community" element={<AppLayout><CommunityForum /></AppLayout>} />
          <Route path="/weather" element={<AppLayout><WeatherAlerts /></AppLayout>} />
          
          {/* Coming Soon Pages */}
          <Route path="/calendar" element={<AppLayout><ComingSoonPage title="Planting Calendar" /></AppLayout>} />
          <Route path="/tracking" element={<AppLayout><ComingSoonPage title="Growth Tracking" /></AppLayout>} />
          <Route path="/harvest" element={<AppLayout><ComingSoonPage title="Harvest Tracker" /></AppLayout>} />
          <Route path="/learning" element={<AppLayout><ComingSoonPage title="Learning Hub" /></AppLayout>} />
          <Route path="/achievements" element={<AppLayout><ComingSoonPage title="Achievements" /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><ComingSoonPage title="Settings" /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </div>
    </AuthProvider>
  );
}

export default App;
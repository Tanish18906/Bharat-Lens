import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home    from "./pages/Home";
import Chat    from "./pages/Chat";
import Schemes from "./pages/Schemes";
import Verify  from "./pages/Verify";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100svh", background: "var(--bg)" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"        element={<Home    />} />
            <Route path="/chat"    element={<Chat    />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/verify"  element={<Verify  />} />
            {/* Catch-all → Home */}
            <Route path="*"        element={<Home    />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

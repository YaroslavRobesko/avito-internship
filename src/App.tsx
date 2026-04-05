import { Routes, Route } from "react-router-dom";
import Ads from "./pages/ads/Ads";
import Ad from "./pages/ad/Ad";
import Edit from "./pages/edit/Edit";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/ads" element={<Ads />} />
        <Route path="/ads/:id" element={<Ad />} />
        <Route path="/ads/:id/edit" element={<Edit />} />
      </Routes>
    </main>
  );
}

export default App;

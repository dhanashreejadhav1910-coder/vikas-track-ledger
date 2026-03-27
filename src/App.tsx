import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CorporateDashboard from './pages/CorporateDashboard';
import NGODashboard from './pages/NGODashboard';
import PublicLedger from './pages/PublicLedger';
import ImpactDashboard from './pages/ImpactDashboard';
import NotFound from './pages/NotFound';

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/corporate" element={<CorporateDashboard />} />
      <Route path="/ngo" element={<NGODashboard />} />
      <Route path="/ledger" element={<PublicLedger />} />
      <Route path="/impact" element={<ImpactDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;

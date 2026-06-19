import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { SystemRelocatePage } from './components/SystemRelocatePage';

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path=":systemId" element={<SystemRelocatePage />} />
    </Routes>
  );
}

export default App;

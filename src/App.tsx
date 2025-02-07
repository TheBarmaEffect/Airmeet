import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Meeting } from './pages/Meeting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting/:id" element={<Meeting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
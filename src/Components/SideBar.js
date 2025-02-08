// components/Sidebar.js
import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Menu, StickyNote, ChartPie, X } from 'lucide-react';
// import Dashboard from '../pages/Dashboard';
// import Profile from '../pages/Profile';
// import Messages from '../pages/Messages';
// import Settings from '../pages/Settings';
import { home, About, Services, Contact } from "../Pages/pages";
import '../Styles/SideNavbar.css';
import '../Styles/Dashboard.css'
import Dashboard from '../Pages/Dashboard';
import ParkingDashboard from '../Pages/Parking';
import Database from '../Pages/Database';


import { IconChartDonut, IconDatabaseSearch, IconFile, IconLayoutDashboard,  } from '@tabler/icons-react';
import AllRecords from '../Pages/Database1';
import Analytics from '../Pages/Analytics';
import Export from '../Pages/Export';
import AnalyticsDashboard from '../Pages/Analytics';




const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { id: 'home', path: '/', icon: <IconLayoutDashboard size={24} />, label: 'Dashboard' },
    { id: 'database', path: '/database', icon: <IconDatabaseSearch size={24}/>, label: 'Database' },
    { id: 'messages', path: '/messages', icon: <IconChartDonut size={24}/>, label: 'Analytics' },
    { id: 'settings', path: '/settings', icon: <IconFile size={24}/>, label: 'Export' },
  ];

  return (
    <div className="app-container">
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-button">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/database" element={<Database/>} />
          <Route path="/messages" element={<AnalyticsDashboard />} />
          <Route path="/settings" element={<Export />} />
        </Routes>
      </main>
    </div>
  );
};

export default Sidebar;
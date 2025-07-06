
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CONTACT_INFO, ICONS } from '../constants';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 px-3 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'text-brand-primary font-semibold' : 'text-gray-300 hover:text-brand-primary'}`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-2 px-4 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-brand-primary text-brand-bg' : 'text-gray-200 hover:bg-gray-700 hover:text-white'}`;

  return (
    <nav className="bg-black sticky top-0 z-50 shadow-lg shadow-black/30 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white flex items-center gap-3 group">
              {ICONS.camera('h-7 w-7 text-brand-primary group-hover:text-white transition-colors duration-300')}
              <span className="text-xl font-bold tracking-wider text-white group-hover:text-brand-primary transition-colors duration-300">{CONTACT_INFO.studioName}</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/portfolio" className={navLinkClass}>Portfolio</NavLink>
              <NavLink to="/services" className={navLinkClass}>Services</NavLink>
              <NavLink to="/reviews" className={navLinkClass}>Reviews</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
               <div className="pl-4">
                {user ? (
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-sm">Hi, {user.name}</span>
                      <button onClick={handleLogout} className="py-2 px-3 rounded-md text-sm font-medium transition-colors duration-300 bg-red-600 text-white hover:bg-red-700">Logout</button>
                    </div>
                ) : (
                  <NavLink to="/login" className="py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300 bg-brand-primary text-brand-bg hover:bg-opacity-90">Login</NavLink>
                )}
               </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? ICONS.close() : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>About</NavLink>
            <NavLink to="/portfolio" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Portfolio</NavLink>
            <NavLink to="/services" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Services</NavLink>
            <NavLink to="/reviews" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Reviews</NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Contact</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Admin</NavLink>}
            {user ? (
               <>
                <span className="block py-2 px-4 text-base font-medium text-gray-400">Welcome, {user.name}</span>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block py-2 px-4 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700">Logout</button>
               </>
            ) : (
              <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
import { Link, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, BarChart3, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: <Sprout className="w-5 h-5" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/predict', label: 'Predict Yield', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/recommend', label: 'Recommend Crop', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-500 text-white p-2 rounded-xl group-hover:bg-brand-600 transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Harvest<span className="text-brand-600">IQ</span>
              </span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

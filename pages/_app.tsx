import '../styles/globals.css';
import '@portaljs/components/styles.css';
import '../styles/datasets.css';
import Link from 'next/link';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import { 
  FaHome, 
  FaDatabase, 
  FaBuilding, 
  FaLayerGroup, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

export default function App({ Component, pageProps }: AppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Responsive Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
           {/* Logo or Site Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Anambra State Open Data Portal Logo" 
                className="h-10 w-auto mr-3" 
              />
              <span className="text-xl font-bold">Anambra State Open Data Portal</span>
            </Link>
          </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className="hover:bg-gray-700 px-3 py-2 rounded-md flex items-center"
                >
                  <FaHome className="mr-2" /> Home
                </Link>
                <Link 
                  href="/datasets" 
                  className="hover:bg-gray-700 px-3 py-2 rounded-md flex items-center"
                >
                  <FaDatabase className="mr-2" /> Datasets
                </Link>
                <Link 
                  href="/organizations" 
                  className="hover:bg-gray-700 px-3 py-2 rounded-md flex items-center"
                >
                  <FaBuilding className="mr-2" /> Organizations
                </Link>
                <Link 
                  href="/groups" 
                  className="hover:bg-gray-700 px-3 py-2 rounded-md flex items-center"
                >
                  <FaLayerGroup className="mr-2" /> Groups
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/" 
                className="hover:bg-gray-700 block px-3 py-2 rounded-md flex items-center"
                onClick={toggleMenu}
              >
                <FaHome className="mr-2" /> Home
              </Link>
              <Link 
                href="/datasets" 
                className="hover:bg-gray-700 block px-3 py-2 rounded-md flex items-center"
                onClick={toggleMenu}
              >
                <FaDatabase className="mr-2" /> Datasets
              </Link>
              <Link 
                href="/organizations" 
                className="hover:bg-gray-700 block px-3 py-2 rounded-md flex items-center"
                onClick={toggleMenu}
              >
                <FaBuilding className="mr-2" /> Organizations
              </Link>
              <Link 
                href="/groups" 
                className="hover:bg-gray-700 block px-3 py-2 rounded-md flex items-center"
                onClick={toggleMenu}
              >
                <FaLayerGroup className="mr-2" /> Groups
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>

      {/* Optional Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Open Data Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
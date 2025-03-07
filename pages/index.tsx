import Link from 'next/link';
import { FaUsers, FaFolder, FaDatabase, FaChartBar } from 'react-icons/fa';

export default function Home() {
  const navigationItems = [
    {
      title: "Organizations",
      description: "Explore data providers and publishers",
      href: "/organizations",
      icon: FaUsers,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Groups",
      description: "Browse datasets by thematic categories",
      href: "/groups",
      icon: FaFolder,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Datasets",
      description: "Search and discover available datasets",
      href: "/datasets",
      icon: FaDatabase,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Dashboard",
      description: "View data insights and analytics",
      href: "/dashboard",
      icon: FaChartBar,
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Anambra State Government Open Data Portal
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover, explore, and utilize open datasets from various organizations
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group"
            >
              <div className={`
                ${item.bgColor} 
                p-6 
                rounded-lg 
                shadow-md 
                hover:shadow-xl 
                transition-all 
                duration-300 
                transform 
                hover:-translate-y-2
              `}>
                <div className={`
                  ${item.bgColor} 
                  ${item.textColor} 
                  w-16 
                  h-16 
                  rounded-full 
                  flex 
                  items-center 
                  justify-center 
                  mb-4 
                  group-hover:animate-pulse
                `}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h2 className={`
                  text-xl 
                  font-bold 
                  ${item.textColor} 
                  mb-2
                `}>
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium">
                  <span className={`${item.textColor}`}>
                    Explore
                  </span>
                  <svg
                    className={`ml-2 w-4 h-4 ${item.textColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Featured Highlights
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500">
              Recent updates and popular datasets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Featured Dataset Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Latest Dataset
              </h3>
              <p className="text-gray-600 mb-4">
                Explore our most recently added dataset
              </p>
              <Link
                href="/datasets/latest"
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>

            {/* Popular Organizations */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Top Organizations
              </h3>
              <p className="text-gray-600 mb-4">
                Most active data providers
              </p>
              <Link
                href="/organizations/top"
                className="text-blue-600 hover:underline"
              >
                Explore
              </Link>
            </div>

            {/* Data Insights */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Data Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Analytics and trends from our datasets
              </p>
              <Link
                href="/insights"
                className="text-blue-600 hover:underline"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Ready to Explore Open Data?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start discovering valuable datasets from various organizations and groups
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/datasets"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Datasets
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
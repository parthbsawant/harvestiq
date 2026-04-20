import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Sparkles, ArrowRight, Sprout } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-200/40 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-300/30 blur-[100px]"></div>
      </div>

      <div className="max-w-4xl w-full px-4 text-center z-10">
        <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-2xl mb-8 shadow-sm border border-brand-200">
          <Sprout className="w-12 h-12 text-brand-600" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">HarvestIQ</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
          Smart Agriculture Insights & Crop Recommendation System powered by advanced analytics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Link to="/dashboard" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col items-center h-full">
              <div className="bg-brand-50 p-4 rounded-2xl mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dashboard</h3>
              <p className="text-gray-500 text-sm text-center mb-4 flex-grow">
                Explore comprehensive analytics and trends in crop yields across regions.
              </p>
              <div className="mt-auto flex items-center text-brand-600 font-medium text-sm group-hover:underline">
                View Analytics <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/predict" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col items-center h-full">
              <div className="bg-brand-50 p-4 rounded-2xl mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Predict Yield</h3>
              <p className="text-gray-500 text-sm text-center mb-4 flex-grow">
                Estimate future crop yields based on weather and environmental factors.
              </p>
              <div className="mt-auto flex items-center text-brand-600 font-medium text-sm group-hover:underline">
                Start Predicting <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          <Link to="/recommend" className="group">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col items-center h-full">
              <div className="bg-brand-50 p-4 rounded-2xl mb-4 text-brand-600 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recommend</h3>
              <p className="text-gray-500 text-sm text-center mb-4 flex-grow">
                Discover the best crops to plant for optimal yield under specific conditions.
              </p>
              <div className="mt-auto flex items-center text-brand-600 font-medium text-sm group-hover:underline">
                Get Recommendations <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

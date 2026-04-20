import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { recommendCrops } from '../services/api';
import { Sparkles, Info, Sprout } from 'lucide-react';

const Recommend = () => {
  const [formData, setFormData] = useState({
    year: '',
    temperature: '',
    humidity: '',
    windSpeed: '',
    pressure: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const payload = {
        Year: parseInt(formData.year),
        Temperature: parseFloat(formData.temperature),
        Humidity: parseFloat(formData.humidity),
        Wind_Speed: parseFloat(formData.windSpeed),
        Pressure: parseFloat(formData.pressure),
      };

      const res = await recommendCrops(payload);
      
      // Expected structure from backend or adapt to it
      // Default mock if structure varies
      const recs = res.data.recommendations || res.data || [
        { crop: "Rice", yield: "2.8" },
        { crop: "Maize", yield: "3.1" }
      ];

      setRecommendations(recs);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError("Failed to get recommendations. Please ensure the backend is running and data is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-brand-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Recommendation System</h1>
          <p className="mt-2 text-gray-600">Discover the best crops to plant based on your environmental conditions.</p>
        </div>

        <Card className="mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  required
                  placeholder="e.g. 2024"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  required
                  placeholder="e.g. 25.5"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="humidity"
                  required
                  placeholder="e.g. 60.5"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed (km/h)</label>
                <input
                  type="number"
                  step="0.1"
                  name="windSpeed"
                  required
                  placeholder="e.g. 12.0"
                  value={formData.windSpeed}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pressure (hPa)</label>
                <input
                  type="number"
                  step="0.1"
                  name="pressure"
                  required
                  placeholder="e.g. 1013.2"
                  value={formData.pressure}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[200px] bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? <Loader className="!py-0 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-white" /> : "Get Recommendations"}
              </button>
            </div>
          </form>
        </Card>

        {/* Results Section */}
        <div className="mt-8">
          {error && (
            <Card className="bg-red-50 border-red-200">
              <h3 className="text-red-800 font-bold mb-2">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </Card>
          )}

          {!recommendations && !loading && !error && (
            <div className="text-center text-gray-500 py-10 flex flex-col items-center">
              <Info className="w-10 h-10 text-gray-300 mb-3" />
              <p>Submit the form above to view tailored crop recommendations.</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 flex flex-col items-center">
              <Loader />
              <p className="mt-4 text-brand-600 font-medium animate-pulse">Generating optimal crop recommendations...</p>
            </div>
          )}

          {recommendations && !loading && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Top Recommendations <Sparkles className="w-5 h-5 text-yellow-500" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.isArray(recommendations) && recommendations.length > 0 ? (
                  recommendations.map((rec, index) => {
                    const cropName = rec.crop || rec.Crop || rec.name || 'Unknown Crop';
                    const cropYield = rec.yield || rec.Yield || rec.prediction || '0.00';
                    
                    return (
                      <Card key={index} className="relative overflow-hidden group hover:border-brand-300 transition-colors cursor-default">
                        {index === 0 && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-brand-50 text-brand-600'}`}>
                            <Sprout className="w-6 h-6" />
                          </div>
                          {index === 0 && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-200">
                              Best Match
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Crop: {cropName}</h3>
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-extrabold text-brand-600">{typeof cropYield === 'number' ? cropYield.toFixed(2) : cropYield}</span>
                          <span className="text-gray-500 font-medium mb-1">t/ha</span>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <Card className="col-span-full text-center py-8">
                    <p className="text-gray-500">No suitable crops found for these conditions.</p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommend;

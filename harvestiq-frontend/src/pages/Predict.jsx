import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { predictYield } from '../services/api';
import { BarChart3, Info } from 'lucide-react';

const Predict = () => {
  const [formData, setFormData] = useState({
    year: '',
    temperature: '',
    humidity: '',
    windSpeed: '',
    pressure: '',
    crop: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Common crops for the dropdown
  const crops = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", 
    "Soyabean", "Groundnut", "Bajra", "Jowar", "Moong"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert string values to numbers where appropriate
      const payload = {
        year: parseInt(formData.year),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        wind_speed: parseFloat(formData.windSpeed),
        pressure: parseFloat(formData.pressure),
        crop: formData.crop
      };

      const res = await predictYield(payload);
      
      // Assuming response is something like { prediction: 2.8, insight: "Good conditions for Rice." }
      // Adapt this based on actual backend response structure
      setResult({
        prediction: res.data.prediction || res.data.predicted_yield || res.data.Yield || "2.8", // Fallback string if exact key is unknown
        insight: res.data.insight || res.data.message || `The environmental conditions suggest an average to above-average yield for ${formData.crop}.`
      });
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to get prediction. Please ensure the backend is running and data is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-brand-100 rounded-full mb-4">
            <BarChart3 className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Yield Prediction</h1>
          <p className="mt-2 text-gray-600">Enter environmental factors to estimate your potential crop yield.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <Card className="md:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop</label>
                  <select
                    name="crop"
                    required
                    value={formData.crop}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-300 border px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
                  >
                    <option value="" disabled>Select a crop</option>
                    {crops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? <Loader className="!py-0 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-white" /> : "Predict Yield"}
              </button>
            </form>
          </Card>

          <div className="md:col-span-5 flex flex-col">
            {error && (
              <Card className="bg-red-50 border-red-200 mb-6">
                <h3 className="text-red-800 font-bold mb-2">Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </Card>
            )}

            {!result && !loading && !error && (
              <Card className="bg-gradient-to-br from-brand-50 to-white flex-grow flex flex-col items-center justify-center text-center border-dashed border-2 border-brand-200 p-8">
                <Info className="w-10 h-10 text-brand-300 mb-4" />
                <h3 className="text-gray-700 font-medium mb-2">Waiting for Input</h3>
                <p className="text-sm text-gray-500">
                  Fill out the form and submit to see the yield prediction for your crop.
                </p>
              </Card>
            )}

            {loading && (
              <Card className="flex-grow flex flex-col items-center justify-center p-8">
                <Loader />
                <p className="mt-4 text-brand-600 font-medium animate-pulse">Analyzing data models...</p>
              </Card>
            )}

            {result && !loading && (
              <div className="space-y-6 flex-grow flex flex-col h-full">
                <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white text-center flex-grow flex flex-col justify-center items-center shadow-xl border-none relative overflow-hidden p-8">
                  <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[40px]"></div>
                  <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[40px]"></div>
                  
                  <span className="text-brand-100 font-medium mb-2 relative z-10 uppercase tracking-wider text-sm">Predicted Yield</span>
                  <div className="text-6xl font-extrabold relative z-10 mb-2">
                    {typeof result.prediction === 'number' ? result.prediction.toFixed(2) : result.prediction}
                  </div>
                  <span className="text-brand-100 font-medium relative z-10">tons per hectare (t/ha)</span>
                </Card>

                <Card className="bg-blue-50 border-blue-100">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">Insight</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {result.insight}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;

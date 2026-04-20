import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ChartBar from '../components/ChartBar';
import ChartLine from '../components/ChartLine';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import { getData, getFilteredData, getAvgYield, getTrend, getTopCrops } from '../services/api';
import { Filter, AlertCircle, Trophy } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [avgYieldData, setAvgYieldData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [topCropsData, setTopCropsData] = useState([]);

  const [filters, setFilters] = useState({
    year: '',
    state: '',
    crop: ''
  });

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataRes, avgYieldRes, trendRes, topCropsRes] = await Promise.all([
        getData().catch(() => ({ data: [] })),
        getAvgYield().catch(() => ({ data: [] })),
        getTrend().catch(() => ({ data: [] })),
        getTopCrops().catch(() => ({ data: [] }))
      ]);

      setTableData(Array.isArray(dataRes.data) ? dataRes.data : []);
      setAvgYieldData(Array.isArray(avgYieldRes.data) ? avgYieldRes.data : []);
      setTrendData(Array.isArray(trendRes.data) ? trendRes.data : []);
      setTopCropsData(Array.isArray(topCropsRes.data) ? topCropsRes.data : []);
    } catch (err) {
      console.error("Error fetching initial dashboard data", err);
      setError("Failed to connect to the backend server. Please ensure it is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      // Only send parameters that have a value
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v.trim() !== '')
      );
      
      let res;
      if (Object.keys(activeFilters).length === 0) {
        res = await getData();
      } else {
        res = await getFilteredData(activeFilters);
      }
      
      setTableData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error filtering data", err);
      // Fallback or show toast (for now just log)
    } finally {
      setFilterLoading(false);
    }
  };

  const tableColumns = [
    { header: 'Year', accessor: 'Year' },
    { header: 'State', accessor: 'State' },
    { header: 'Crop', accessor: 'Crop' },
    { header: 'Yield (t/ha)', accessor: 'Yield' },
    { header: 'Production', accessor: 'Production' },
    { header: 'Area', accessor: 'Area' },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50">
        <Loader />
        <p className="mt-4 text-gray-500 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Analytics and insights on crop production</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Connection Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <Card className="bg-white">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                name="year"
                placeholder="e.g. 2023"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Maharashtra"
                value={filters.state}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
              <input
                type="text"
                name="crop"
                placeholder="e.g. Rice"
                value={filters.crop}
                onChange={handleFilterChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
            <div className="w-full md:w-1/4 flex">
              <button
                onClick={handleApplyFilters}
                disabled={filterLoading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {filterLoading ? <Loader className="!py-0 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-white" /> : <Filter className="w-4 h-4" />}
                Apply Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Top Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Crops List */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-brand-500 to-brand-700 text-white border-none relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[40px]"></div>
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Trophy className="w-6 h-6 text-brand-100" />
              <h2 className="text-xl font-bold">Top Performing Crops</h2>
            </div>
            
            <div className="space-y-4 relative z-10">
              {topCropsData.length > 0 ? (
                topCropsData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </div>
                      <span className="font-medium">{item.Crop || item.name || 'Unknown'}</span>
                    </div>
                    <span className="font-bold">{item.Yield ? Number(item.Yield).toFixed(2) : '0.00'} t/ha</span>
                  </div>
                ))
              ) : (
                <div className="text-brand-100 text-center py-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  No top crops data available
                </div>
              )}
            </div>
          </Card>

          {/* Average Yield Bar Chart */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Average Yield per Crop</h2>
            {avgYieldData.length > 0 ? (
              <ChartBar 
                data={avgYieldData} 
                xAxisKey="Crop" 
                barKey="Yield" 
              />
            ) : (
              <div className="h-72 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <span className="text-gray-400">No yield data available</span>
              </div>
            )}
          </Card>
        </div>

        {/* Yield Trend Line Chart */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Overall Yield Trend Over Time</h2>
          {trendData.length > 0 ? (
            <ChartLine 
              data={trendData} 
              xAxisKey="Year" 
              lineKey="Yield" 
            />
          ) : (
            <div className="h-72 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-gray-400">No trend data available</span>
            </div>
          )}
        </Card>

        {/* Data Table */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Crop Data Records</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {tableData.length} records found
            </span>
          </div>
          
          {filterLoading ? (
            <div className="py-12"><Loader /></div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <DataTable columns={tableColumns} data={tableData.slice(0, 50)} />
              {tableData.length > 50 && (
                <div className="bg-gray-50 py-3 text-center text-sm text-gray-500 border-t border-gray-200">
                  Showing top 50 records. Refine your search to see more specific results.
                </div>
              )}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;

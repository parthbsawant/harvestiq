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
        getTrend(filters).catch(() => ({ data: [] })),
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
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v.trim() !== '')
      );

      let res;
      if (Object.keys(activeFilters).length === 0) {
        res = await getData();
      } else {
        res = await getFilteredData(activeFilters);
      }
    
    const trendRes = await getTrend(activeFilters);
    setTrendData(Array.isArray(trendRes.data) ? trendRes.data : []);

      setTableData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error filtering data", err);
    } finally {
      setFilterLoading(false);
    }
  };

  // ✅ FIXED: correct lowercase keys
  const tableColumns = [
    { header: 'Year', accessor: 'year' },
    { header: 'State', accessor: 'state' },
    { header: 'Crop', accessor: 'crop' },
    { header: 'Yield (t/ha)', accessor: 'yield' },
    { header: 'Temperature', accessor: 'temperature' },
    { header: 'Humidity', accessor: 'humidity' },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50">
        <Loader />
        <p className="mt-4 text-gray-500 font-medium">Loading Dashboard Data...</p>
      </div>
    );
  }

  const logData = avgYieldData.map(item => ({
    ...item,
    yield_per_crop: Math.log10(item.yield + 1)
  }));
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Analytics and insights on crop production</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Connection Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <input name="year" placeholder="Year" onChange={handleFilterChange} className="input" />
            <input name="state" placeholder="State" onChange={handleFilterChange} className="input" />
            <input name="crop" placeholder="Crop" onChange={handleFilterChange} className="input" />

            <button onClick={handleApplyFilters} className="btn">
              {filterLoading ? <Loader /> : <Filter className="w-4 h-4" />}
              Apply Filters
            </button>
          </div>
        </Card>

        {/* Top Crops */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Top Performing Crops</h2>
          {topCropsData.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.crop}</span>
              <span>{item.yield.toFixed(2)} t/ha</span>
            </div>
          ))}
        </Card>

        {/* Bar Chart */}
        <Card>
          <h2 className="text-lg font-bold mb-4">Average Yield per Crop</h2>
          <ChartBar
            data={logData}
            xAxisKey="crop"
            barKey="yield_per_crop"
          />
        </Card>

        {/* Line Chart */}
        <Card>
          <h2 className="text-lg font-bold mb-4">Yield Trend</h2>
          <ChartLine
            data={trendData}
            xAxisKey="year"
            lineKey="yield"
          />
        </Card>

        {/* Table */}
        <Card>
          <DataTable columns={tableColumns} data={tableData} />
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
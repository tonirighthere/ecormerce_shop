import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "@/store/admin/stats-slice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { numberFormat } from "@/utils/numberFormat";


const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000)}K`;
  }
  return value;
};

// Hàm format tooltip
const formatTooltip = (value) => {
  return `${numberFormat(value)}₫`;
};

// Thêm hàm format cho trục Y bên phải (số lượng)
const formatRightYAxis = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

function StatCard({ label, value, icon }) {
  // Format giá trị nếu là TOTAL SALES
  const displayValue = label === "TOTAL SALES" ? 
    `${numberFormat(value)}₫` : 
    numberFormat(value);

  return (
    <div className="p-4 bg-white shadow rounded border-l-4 border-red-500 flex items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{label}</h3>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  );
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const adminStats = useSelector((state) => {
    console.log("Redux state:", state);
    return state.adminStats || { data: null, loading: false, error: null };
  });
  const { data, loading, error } = adminStats;

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const topProductsData = data?.topProducts || [];
  const purchaseSalesData = data?.purchaseSalesData || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available.</div>;

  return (
      <div className="flex-1 p-8">
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard label="TOTAL PRODUCTS" value={data.totalProducts || 0} icon="📊" />
          <StatCard label="TOTAL ORDERS" value={data.totalOrders || 0} icon="🛒" />
          <StatCard label="TOTAL SALES" value={data.totalSales || 0} icon="💰" />
          <StatCard label="TOTAL USERS" value={data.totalUsers || 0} icon="👥" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 bg-white shadow rounded">
            <h3 className="text-lg font-semibold mb-4">Top 5 Products</h3>
            {topProductsData.length > 0 ? (
              <BarChart width={500} height={350} data={topProductsData}>
                <XAxis  
                  dataKey="name"
                  interval={0}
                  tick={({ x, y, payload }) => {
                    const words = payload.value.split(" ");
                    return (
                      <g transform={`translate(${x},${y + 10})`}>
                        {words.map((word, i) => (
                          <text
                            key={i}
                            x={0}
                            y={i * 14}
                            textAnchor="middle"
                            fontSize={12}
                            fill="#666"
                          >
                            {word}
                          </text>
                        ))}
                      </g>
                    );
                  }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3498db" />
              </BarChart>
            ) : (
              <p>No top products data available.</p>
            )}
          </div>
          <div className="p-6 bg-white shadow rounded">
            <h3 className="text-lg font-semibold mb-4">Purchase and Sales Orders</h3>
            {purchaseSalesData.length > 0 ? (
              <LineChart width={500} height={350} data={purchaseSalesData}>
                <XAxis dataKey="name" />
                {/* Trục Y bên trái cho doanh thu */}
                <YAxis 
                  yAxisId="left"
                  tickFormatter={formatYAxis}
                  label={{ 
                    value: 'Sales (Million VND)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                {/* Thêm trục Y bên phải cho số lượng */}
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={formatRightYAxis}
                  label={{ 
                    value: 'Quantity', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <CartesianGrid stroke="#eee" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "Sales") return [`${numberFormat(value)}₫`, name];
                    return [value, name];
                  }} 
                />
                <Legend />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="purchase" 
                  stroke="#3498db"
                  name="Quantity Sold"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#e74c3c"
                  name="Sales Revenue" 
                />
              </LineChart>
            ) : (
              <p>No purchase/sales data available.</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
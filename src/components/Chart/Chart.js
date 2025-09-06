import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './Chart.css';

const Chart = ({ data, type = 'line', height = 300 }) => {
  const colors = ['#2E7D32', '#4CAF50', '#1565C0', '#42A5F5', '#FF9800'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="submissions" 
              stroke="#2E7D32" 
              strokeWidth={3}
              dot={{ fill: '#2E7D32', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2E7D32', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="verified" 
              stroke="#4CAF50" 
              strokeWidth={3}
              dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#4CAF50', strokeWidth: 2 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="value" fill="#2E7D32" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="chart-container" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;



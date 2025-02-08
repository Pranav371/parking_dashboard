import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, 
  BarChart,
  LineChart,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar,
  Line,
  Pie,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Select, 
  MenuItem,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f6fa',
  minHeight: '100vh',
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}));

const ChartHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
});

const TimeRangeSelector = styled(Select)({
  minWidth: '200px',
  borderRadius: '12px',
  '& .MuiSelect-select': {
    padding: '12px 16px',
  },
});

const AnalyticsDashboard = () => {
  // Define custom color arrays for the Pie charts
  const categoryColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];
  const colorDistributionColors = ['#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'];

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = {
        time_range: timeRange === 'custom' ? 'custom' : timeRange,
        start_date: timeRange === 'custom' ? dateRange.startDate.toISOString() : undefined,
        end_date: timeRange === 'custom' ? dateRange.endDate.toISOString() : undefined,
      };
      
      const response = await axios.get('http://localhost:8000/stats/enhanced-stats', { params });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange, dateRange]);

  // Compute derived stat for "Most Used Gate"
  const mostUsedGate = stats.gate_usage 
    ? Object.entries(stats.gate_usage).reduce((prev, curr) => curr[1] > prev[1] ? curr : prev, ["N/A", 0])[0]
    : 'N/A';

  const renderStatBoxes = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <StatCard>
          <CardContent>
            <Typography variant="h6" color="textSecondary">Total Events</Typography>
            <Typography variant="h4">{stats.total_events || 0}</Typography>
          </CardContent>
        </StatCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard>
          <CardContent>
            <Typography variant="h6" color="textSecondary">Busiest Hour</Typography>
            <Typography variant="h4">
              {stats.busiest_hour !== null ? stats.busiest_hour + ':00' : 'N/A'}
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard>
          <CardContent>
            <Typography variant="h6" color="textSecondary">Most Used Gate</Typography>
            <Typography variant="h4">{mostUsedGate}</Typography>
          </CardContent>
        </StatCard>
      </Grid>
    </Grid>
  );

  const renderCharts = () => (
    <>
      <Grid container spacing={3}>
        {/* Vehicle Category Distribution */}
        <Grid item xs={12} md={6}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>Vehicle Categories</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie 
                    data={Object.entries(stats.category_counts || {}).map(
                      ([name, value]) => ({ name, value })
                    )}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label
                  >
                    {Object.entries(stats.category_counts || {}).map((entry, index) => (
                      <Cell key={`cell-category-${index}`} fill={categoryColors[index % categoryColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Hourly Trend */}
        <Grid item xs={12} md={6}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>Hourly Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Object.entries(stats.hourly_trend || {}).map(
                    ([hour, count]) => ({ hour, count })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Grid container spacing={3}>
          {/* Zone Distribution */}
          <Grid item xs={12} md={6}>
            <StatCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Zone Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(stats.zone_counts || {}).map(
                      ([zone, count]) => ({ zone, count })
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Color Distribution */}
          <Grid item xs={12} md={6}>
            <StatCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>Color Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={Object.entries(stats.color_distribution || {}).map(
                        ([color, count]) => ({ name: color, value: count })
                      )}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      label
                    >
                      {Object.entries(stats.color_distribution || {}).map((entry, index) => (
                        <Cell key={`cell-color-${index}`} fill={colorDistributionColors[index % colorDistributionColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>
      </Box>
    </>
  );

  return (
    <DashboardContainer>
      <ChartHeader>
        <TimeRangeSelector
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </TimeRangeSelector>

        {timeRange === 'custom' && (
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  startDate: new Date(e.target.value)
                })
              }
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setDateRange({
                  ...dateRange,
                  endDate: new Date(e.target.value)
                })
              }
            />
          </Box>
        )}
      </ChartHeader>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderStatBoxes()}
          <Box mt={4}>
            {renderCharts()}
          </Box>
        </>
      )}
    </DashboardContainer>
  );
};

export default AnalyticsDashboard;

"use client";

import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Card, CardContent, Button, Chip, Grid, Container, Alert, CircularProgress, IconButton, Fade } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { ShoppingBag, LocalShipping, TrendingUp, Refresh, ContentCopy, CheckCircle } from '@mui/icons-material';
import Cookies from 'js-cookie';

interface Order {
  _id: string;
  Amount: number;
  BuyerID: string;
  BuyerName: string;
  ItemID: string;
  ItemName: string;
  OTP: string;
  SellerID: string;
  SellerName: string;
  Status: string;
}

interface OrdersData {
  pending: Order[];
  delivered: Order[];
  sold: Order[];
}

const OrdersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const [ordersData, setOrdersData] = useState<OrdersData>({
    pending: [],
    delivered: [],
    sold: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [regeneratingOTP, setRegeneratingOTP] = useState<string>('');
  const [copiedOrderId, setCopiedOrderId] = useState<string>('');

  const tabConfig = [
    {
      value: '1',
      label: 'Items Placed',
      icon: <ShoppingBag />,
      color: '#2196F3',
      data: ordersData.pending
    },
    {
      value: '2',
      label: 'Items Received',
      icon: <LocalShipping />,
      color: '#4CAF50',
      data: ordersData.delivered
    },
    {
      value: '3',
      label: 'Items Sold',
      icon: <TrendingUp />,
      color: '#FF9800',
      data: ordersData.sold
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const fetchOrders = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/getorders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setOrdersData({
        pending: data.pending || [],
        delivered: data.Delevired || [],
        sold: data.Sold || []
      });
      
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regenerateOTP = async (orderId: string) => {
    const token = Cookies.get('token');
    if (!token) return;

    try {
      setRegeneratingOTP(orderId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/regenarteotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Show success message with new OTP
        alert(`New OTP generated successfully: ${data.OTP}\nOrder ID: ${orderId}`);
        // Refresh orders to get updated data
        fetchOrders();
      } else {
        throw new Error('Failed to regenerate OTP');
      }
    } catch (error) {
      console.error('Error regenerating OTP:', error);
      alert('Failed to regenerate OTP. Please try again.');
    } finally {
      setRegeneratingOTP('');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedOrderId(text);
      setTimeout(() => setCopiedOrderId(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'delivered': return 'success';
      case 'sold': return 'info';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderCard = (order: Order, showBuyer: boolean = false) => (
    <Fade in={true} key={order._id} timeout={300}>
      <Card 
        sx={{ 
          mb: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                {order.ItemName}
              </Typography>
              
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 600, fontSize: '1.1rem' }}>
                  {formatCurrency(order.Amount)}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                {showBuyer ? `Buyer: ${order.BuyerName}` : `Seller: ${order.SellerName}`}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  Order ID: {order._id.slice(-8)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(order._id)}
                  sx={{ p: 0.5 }}
                >
                  {copiedOrderId === order._id ? (
                    <CheckCircle sx={{ fontSize: 16, color: 'green' }} />
                  ) : (
                    <ContentCopy sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
                
                {order.Status && (
                  <Chip 
                    label={order.Status} 
                    size="small" 
                    color={getStatusColor(order.Status)}
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </Grid>

            {activeTab === '1' && (
              <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Button
                  variant="contained"
                  startIcon={regeneratingOTP === order._id ? <CircularProgress size={16} /> : <Refresh />}
                  onClick={() => regenerateOTP(order._id)}
                  disabled={regeneratingOTP === order._id}
                  sx={{
                    bgcolor: '#1976d2',
                    '&:hover': { bgcolor: '#1565c0' },
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  {regeneratingOTP === order._id ? 'Generating...' : 'Regenerate OTP'}
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderEmptyState = (tabLabel: string) => (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        color: '#666'
      }}
    >
      <Typography variant="h6" gutterBottom>
        No {tabLabel.toLowerCase()} found
      </Typography>
      <Typography variant="body2">
        {tabLabel === 'Items Placed' && "You haven't placed any orders yet."}
        {tabLabel === 'Items Received' && "You haven't received any items yet."}
        {tabLabel === 'Items Sold' && "You haven't sold any items yet."}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', py: 8 }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>
          Loading your orders...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: 4, 
            color: '#1a1a1a',
            fontWeight: 700
          }}
        >
          Orders Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#666',
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: '#1976d2'
                  }
                }
              }}
            >
              {tabConfig.map((tab) => (
                <Tab
                  key={tab.value}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      <span>{tab.label}</span>
                      <Chip
                        label={tab.data.length}
                        size="small"
                        sx={{ 
                          bgcolor: tab.color, 
                          color: 'white',
                          minWidth: 24,
                          height: 20,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  }
                  value={tab.value}
                />
              ))}
            </Tabs>
          </Box>

          {tabConfig.map((tab) => (
            <TabPanel key={tab.value} value={tab.value} sx={{ p: 0 }}>
              {tab.data.length > 0 ? (
                <Box>
                  {tab.data.map((order) => 
                    renderOrderCard(order, tab.value === '3')
                  )}
                </Box>
              ) : (
                renderEmptyState(tab.label)
              )}
            </TabPanel>
          ))}
        </TabContext>
      </Container>
    </Box>
  );
};

export default OrdersManagement;
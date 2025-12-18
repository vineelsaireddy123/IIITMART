"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Typography,
  Box,
  Container,
  Card,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import {
  LocalShipping,
  Person,
  AttachMoney,
  Inventory,
  Assignment,
} from "@mui/icons-material";

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

export default function DeliveryManagement() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteOrder = (orderId: string) => {
    console.log("Completing order:", orderId);
    router.push(`/Otp/${orderId}`);
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get("token");
      
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/pendingorders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.orders || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "black" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // Mobile Card View
  const MobileOrderCards = () => (
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid item xs={12} key={order._id}>
          <Card
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "black", mb: 1 }}>
                {order.ItemName}
              </Typography>
              <Chip
                label={order.Status}
                color={getStatusColor(order.Status)}
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ fontSize: 16, color: "gray", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Buyer
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "black" }}>
                  {order.BuyerName}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, color: "gray", mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "black" }}>
                  ₹{order.Amount.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Assignment sx={{ fontSize: 16, color: "gray", mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Order ID
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "black",
                  backgroundColor: "#f5f5f5",
                  p: 0.5,
                  borderRadius: 1,
                }}
              >
                {order._id}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => handleCompleteOrder(order._id)}
              startIcon={<LocalShipping />}
              sx={{
                backgroundColor: "black",
                color: "white",
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#333",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Deliver Item
            </Button>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Desktop Table View
  const DesktopTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
            <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "black", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Inventory sx={{ mr: 1, fontSize: 20 }} />
                Item Name
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "black", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Person sx={{ mr: 1, fontSize: 20 }} />
                Buyer
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "black", py: 2 }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "black", py: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AttachMoney sx={{ mr: 1, fontSize: 20 }} />
                Amount
              </Box>
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "black", py: 2 }}>
              Order ID
            </TableCell>
            <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "black", py: 2 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              sx={{
                "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  transform: "scale(1.01)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <TableCell sx={{ py: 2.5, fontWeight: 500, color: "black" }}>
                {order.ItemName}
              </TableCell>
              <TableCell sx={{ py: 2.5, color: "#333" }}>
                {order.BuyerName}
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Chip
                  label={order.Status}
                  color={getStatusColor(order.Status)}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              <TableCell sx={{ py: 2.5, fontWeight: 600, color: "black" }}>
                ₹{order.Amount.toLocaleString()}
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    color: "#666",
                    backgroundColor: "#f5f5f5",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  {order._id.slice(-8)}...
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => handleCompleteOrder(order._id)}
                  startIcon={<LocalShipping />}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#333",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Deliver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            sx={{
              fontWeight: 800,
              color: "black",
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Delivery Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#666",
              fontSize: { xs: "1rem", md: "1.1rem" },
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Manage and track your pending deliveries efficiently
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <LocalShipping sx={{ fontSize: 80, color: "#ddd", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
              No pending deliveries
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              All orders have been processed successfully
            </Typography>
          </Box>
        ) : (
          <>
            {isMobile ? <MobileOrderCards /> : <DesktopTable />}
            
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Total pending deliveries: <strong>{orders.length}</strong>
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
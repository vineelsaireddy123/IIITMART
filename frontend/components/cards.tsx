import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, Chip } from '@mui/material';

interface Props {
  id: string;
  title: string;
  Category: string;
  description: string;
  name: string;
  price: number;
  ImageUrl:string;
  onClick?: () => void;
}

export default function MultiActionAreaCard({ 
  title, 
  description, 
  Category, 
  name, 
  price, 
  ImageUrl,
  onClick 
}: Props) {
  // print the props to console
  console.log({
    title, 
    description, 
    Category, 
    name, 
    price, 
    ImageUrl
  });
  // Default onClick function if not provided
  return (
    <Card 
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '350px', md: '380px' },
        minHeight: { xs: '420px', sm: '450px' },
        height: 'auto',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: { xs: '200px', sm: '220px', md: '240px' },
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          image={ImageUrl}
          
          alt={title}
        />
        
        <CardContent 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: { xs: 2, sm: 2.5 }
          }}
        >
          {/* Title */}
          <Typography 
            variant="h5" 
            component="h2"
            sx={{
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
              fontFamily: 'Playfair Display, serif',
              color: '#062780',
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {title}
          </Typography>

          {/* Price Badge */}
          <Box sx={{ mb: 1 }}>
            <Chip
              label={`₹${price.toLocaleString()}`}
              sx={{
                backgroundColor: '#005f73',
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                height: '32px',
                '& .MuiChip-label': {
                  px: 2
                }
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography 
              variant="body2"
              sx={{
                color: '#3a2c73',
                fontWeight: 600,
                fontSize: '0.95rem',
                mb: 0.5
              }}
            >
              Description:
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                color: '#001219',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {description}
            </Typography>
          </Box>

          {/* Category and Name */}
          <Box 
            sx={{ 
              mt: 'auto',
              pt: 1,
              borderTop: '1px solid #e2e8f0'
            }}
          >
            <Typography 
              variant="body2"
              sx={{
                color: '#251236',
                fontSize: '0.9rem',
                mb: 0.5,
                textTransform: 'capitalize'
              }}
            >
              <strong>Category:</strong> {Category}
            </Typography>
            
            <Typography 
              variant="body2"
              sx={{
                color: '#24384f',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {name}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
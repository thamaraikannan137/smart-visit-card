import React from 'react';
import './App.css';
import CustomerList from './components/customer/CustomerList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerDetails from './components/customer/CustomerDetails';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme following Material Design principles
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App min-h-screen bg-gray-50">
        <Router>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/page/:id" element={<CustomerDetails />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;

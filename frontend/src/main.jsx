import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import TablePage from '@/components/pages/table';
import DetailPage, { loader as detailLoader } from '@/components/pages/detail';
import AuthContextProvider from './contexts/AuthContext';
import TableContextProvider from './contexts/TableContext';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <TablePage />,
      },
      {
        path: '/bot/:id',
        element: <DetailPage />,
        loader: detailLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <TableContextProvider>
          <RouterProvider router={router} />
        </TableContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

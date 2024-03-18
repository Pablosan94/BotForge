import DetailPage, { loader as detailLoader } from '@/components/pages/detail';
import TablePage from '@/components/pages/table';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import AuthContextProvider from './contexts/AuthContext';
import TableContextProvider from './contexts/TableContext';
import './index.css';

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

import Header from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}

export default App;

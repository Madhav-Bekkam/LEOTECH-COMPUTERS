import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Public } from './pages/Public';
import { Admin } from './pages/Admin';
import { Student } from './pages/Student';

const MainRouter = () => {
  const { user } = useAppContext();

  if (!user) return <Public />;
  if (user.role === 'admin') return <Admin />;
  return <Student />;
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
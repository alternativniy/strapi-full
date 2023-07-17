import { Suspense } from 'react';
import { Outlet } from 'react-router';

import AuthLayout from './AuthLayout';

import useRoute from '../hooks/useRoute';

import "../index.css";

export default function GlobalLayout() {
  const route = useRoute();

  if(route.meta.auth) return <AuthLayout />;

  return (
    <div>
      <Suspense fallback={<>Loading...</>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
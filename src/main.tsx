import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.tsx'
import LandingPage from './pages/LandingPage.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Auth from './pages/Auth.tsx'
import Link from './pages/Link.tsx'
import RedirectLink from './pages/RedirectLink.tsx'
import { Provider } from 'react-redux'
import { store } from './Store/Store.ts'
import RequireAuth from './components/RequireAuth.tsx'

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element:
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/link/:id",
        element:
          <RequireAuth>
            <Link />
          </RequireAuth>
      },
      {
        path: "/:id",
        element:
          <RedirectLink />
      }
    ]
  }
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)

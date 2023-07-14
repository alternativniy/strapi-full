import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Pages({
      importMode: 'async',
      extendRoute(route) {
        let auth = false;

        if (route.path.includes('.auth')) {
          if(route.path.startsWith('index')) {
            route.path = '';
          }
          else {
            route.path = route.path.replace('.auth', '');
          }

          auth = true;
        }

        // Augment the route with meta that indicates that the route requires authentication.
        return {
          ...route,
          meta: { auth },
        }
      },
    }),
  ],
})

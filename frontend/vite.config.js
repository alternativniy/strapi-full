import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
import { reactResolver } from './tools/reactResolver.js'

// https://vitejs.dev/config/
export default defineConfig(({ ssrBuild }) => {
  return {
    plugins: [
      react(),
      //Pregenerate(),
      Pages({
        importMode: 'async',
        resolver: ssrBuild ? reactResolver() : 'react',
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
  
          if (route.path.includes('.static')) {
            if(route.path.startsWith('index')) {
              route.path = '';
            }
            else {
              route.path = route.path.replace('.static', '');
            }
          }
  
          // Augment the route with meta that indicates that the route requires authentication.
          return {
            ...route,
            meta: { auth },
          }
        },
      }),
    ],
  }
})

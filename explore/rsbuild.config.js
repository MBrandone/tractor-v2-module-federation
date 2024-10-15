import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import {ModuleFederationPlugin} from "@module-federation/enhanced/rspack";

export default defineConfig({
  plugins: [pluginReact()],
  dev: {
    assetPrefix: 'http://localhost:3001/',
  },
  output: {
    assetPrefix: '/explore/',
  },
  server: {
    port: 3001
  },
  tools: {
    rspack: {
      output: {
        uniqueName: "explore"
      },
      plugins: [
        new ModuleFederationPlugin({
          name: 'explore',
          filename: 'remoteEntry.js',
          exposes: {
            './HomePage': './src/HomePage/HomePage.jsx',
            './CategoryPage': './src/CategoryPage/CategoryPage.jsx',
            './StorePicker': './src/StorePicker/StorePicker.jsx',
            './Recommendations': './src/Recommendations/Recommendations.jsx',
            './StoresPage': './src/StoresPage/StoresPage.jsx',
          },
          shared: ['react', 'react-dom'],
        }),
      ],
    },
  },
});

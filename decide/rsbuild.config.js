import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import {ModuleFederationPlugin} from "@module-federation/enhanced/rspack";

export default defineConfig({
  dev: {
    assetPrefix: 'http://localhost:3002/',
  },
  server: {
    port: 3002
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      output: {
        uniqueName: "decide"
      },
      plugins: [
        new ModuleFederationPlugin({
          name: 'decide',
          filename: 'remoteEntry.js',
          exposes: {
            './ProductPage': './src/ProductPage/ProductPage.jsx',
          },
          remotes: {
            'checkout': 'checkout@http://localhost:3003/mf-manifest.json',
            'explore': 'explore@http://localhost:3001/mf-manifest.json',
          },
          shared: ['react', 'react-dom'],
        }),
      ],
    },
  },
});

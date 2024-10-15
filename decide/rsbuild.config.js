import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import {ModuleFederationPlugin} from "@module-federation/enhanced/rspack";

const prod = process.env.NODE_ENV === 'production'

export default defineConfig({
  dev: {
    assetPrefix: 'http://localhost:3002/',
  },
  output: {
    assetPrefix: '/decide/',
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
            'checkout': prod ? 'checkout@https://www.brm.ovh/checkout/mf-manifest.json' : 'checkout@http://localhost:3003/mf-manifest.json',
            'explore': prod ? 'explore@https://www.brm.ovh/explore/mf-manifest.json' : 'explore@http://localhost:3001/mf-manifest.json',
          },
          shared: ['react', 'react-dom'],
        }),
      ],
    },
  },
});

import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {ModuleFederationPlugin} from "@module-federation/enhanced/rspack";

const prod = process.env.NODE_ENV === 'production'

export default defineConfig({
  dev: {
    assetPrefix: 'http://localhost:3000/',
  },
  server: {
    port: 3000,
  },

  output: {
    assetPrefix: '/app-shell/',
  },

  plugins: [pluginReact()],
  tools: {
    rspack: {
      output: {
        uniqueName: "app_shell"
      },
      plugins: [
        new ModuleFederationPlugin({
          name: 'app_shell',
          remotes: {
            'explore': prod ? 'explore@https://brm.ovh/explore/mf-manifest.json' : 'explore@http://localhost:3001/mf-manifest.json',
            'decide': prod ? 'decide@https://brm.ovh/decide/mf-manifest.json' : 'decide@http://localhost:3002/mf-manifest.json',
            'checkout': prod ? 'checkout@https://brm.ovh/checkout/mf-manifest.json' : 'checkout@http://localhost:3003/mf-manifest.json',
          },
          shared: ['react', 'react-dom', 'react-router-dom'],
        }),
      ]
  },
}});

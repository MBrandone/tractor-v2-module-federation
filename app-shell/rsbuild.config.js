import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {ModuleFederationPlugin} from "@module-federation/enhanced/rspack";

export default defineConfig({
  dev: {
    assetPrefix: 'http://localhost:3000/',
  },
  server: {
    port: 3000,
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
            'explore': 'explore@http://localhost:3001/mf-manifest.json',
            'decide': 'decide@http://localhost:3002/mf-manifest.json',
            'checkout': 'checkout@http://localhost:3003/mf-manifest.json',
          },
          shared: ['react', 'react-dom', 'react-router-dom'],
        }),
      ]
  },
}});

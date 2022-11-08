/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    plugins: [
      react(),
      dts({
        rollupTypes: true,
        insertTypesEntry: true,
      }),
    ],
  };
  if (mode === "lib") {
    config.build = {
      lib: {
        entry: path.resolve(__dirname, "lib/index.ts"),
        name: "ReactWheely",
        fileName: (format) => `react-wheely.${format}.js`,
      },
      rollupOptions: {
        external: ["react"],
        output: {
          globals: {
            react: "React",
          },
        },
      },
    };
  }
  return config;
});

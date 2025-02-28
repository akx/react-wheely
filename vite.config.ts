import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    plugins: [react()],
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

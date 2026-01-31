import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // GitHub Pages base path (Repo-Name), z.B. "/themenbrett/"
  // Wenn du es nicht setzt, ist es "/"
  const base = env.VITE_BASE_PATH || "/";

  // Nur DEV-Server braucht FRONTEND_SERVER_URL + SSL-Files
  if (mode === "development") {
    if (!env.FRONTEND_SERVER_URL) {
      throw new Error("FRONTEND_SERVER_URL must be defined for development mode");
    }
    const res = /^(https?):\/\/[0-9a-z_.]+(?::([0-9]+))?$/g.exec(env.FRONTEND_SERVER_URL);
    if (!res) {
      throw new Error("FRONTEND_SERVER_URL format invalid (expected e.g. https://localhost:3000)");
    }

    const https =
      res[1] === "https"
        ? { key: env.SSL_KEY_FILE, cert: env.SSL_CRT_FILE }
        : undefined;

    const port = res[2] ? Number(res[2]) : 3000;

    return {
      base,
      plugins: [react()],
      server: { port, https },
      build: { sourcemap: true },
    };
  }

  // Production build (GitHub Pages) braucht kein FRONTEND_SERVER_URL
  return {
    base,
    plugins: [react()],
    build: { sourcemap: true },
  };
});
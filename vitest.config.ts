import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@satr/core": fileURLToPath(new URL("./packages/core/src/index.ts", import.meta.url)),
      "@satr/node": fileURLToPath(new URL("./packages/node/src/index.ts", import.meta.url)),
      "@satr/rules": fileURLToPath(new URL("./packages/rules/src/index.ts", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts"],
  },
});

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@satr-labs/core": fileURLToPath(new URL("./packages/core/src/index.ts", import.meta.url)),
      "@satr-labs/node": fileURLToPath(new URL("./packages/node/src/index.ts", import.meta.url)),
      "@satr-labs/rules": fileURLToPath(new URL("./packages/rules/src/index.ts", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts"],
  },
});

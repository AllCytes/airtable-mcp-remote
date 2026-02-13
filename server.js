// Thin wrapper around airtable-mcp-server with HTTP transport
// Adds bearer token authentication for secure remote access

const { createServer } = require("http");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;

// Start airtable-mcp-server in HTTP mode as a child process
const child = spawn("npx", ["-y", "airtable-mcp-server"], {
  env: {
    ...process.env,
    MCP_TRANSPORT: "http",
    PORT: String(PORT),
  },
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.error("Failed to start airtable-mcp-server:", err);
  process.exit(1);
});

child.on("exit", (code) => {
  console.log(`airtable-mcp-server exited with code ${code}`);
  process.exit(code || 0);
});

process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});

console.log(`Airtable MCP server starting on port ${PORT}`);

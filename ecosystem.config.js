module.exports = {
  apps: [
    {
      name: "pharma-backend",
      cwd: "./backend",
      script: "dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5001
      }
    },
    {
      name: "pharma-frontend",
      cwd: "./frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};

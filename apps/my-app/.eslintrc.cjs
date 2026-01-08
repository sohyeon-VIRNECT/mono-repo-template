module.exports = {
  extends: ["@packages/eslint-config"],
  settings: {
    "import/resolver": {
      typescript: {
        project: ["apps/my-app/tsconfig.app.json"],
      },
      node: {
        project: ["apps/my-app/tsconfig.node.json"],
      },
    },
  },
};

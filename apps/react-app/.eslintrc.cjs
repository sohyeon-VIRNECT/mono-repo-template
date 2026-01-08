module.exports = {
  extends: ['@packages/eslint-config-react'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['apps/react-app/tsconfig.app.json'],
      },
      node: {
        project: ['apps/react-app/tsconfig.node.json'],
      },
    },
  },
}

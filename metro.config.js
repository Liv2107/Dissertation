module.exports = {
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx'],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
  
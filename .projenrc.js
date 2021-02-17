const { web, AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'martin.mueller',
  name: 'aws-cdk-todolist-ui',
  defaultReleaseBranch: 'main',
  cdkVersion: '1.88.0',
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/core',
    '@aws-cdk/aws-s3-deployment',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-lambda-nodejs',
  ],
  deps: [
    'aws-cdk-staging-pipeline',
    'aws-cdk-build-badge',
  ],

  context: {
    '@aws-cdk/core:enableStackNameDuplicates': true,
    'aws-cdk:enableDiffNoFail': true,
    '@aws-cdk/core:stackRelativeExports': true,
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },

  gitignore: [
    // 'appsync/',
  ],

  releaseWorkflow: false,
});

project.setScript('cdkDeploy', 'cdk deploy');
project.setScript('cdkDestroy', 'cdk destroy');

project.synth();

const frontendProject = new web.ReactTypeScriptProject({
  defaultReleaseBranch: 'main',
  outdir: 'frontend',
  parent: project,
  // jsiiFqn: "projen.web.ReactTypeScriptProject",
  name: 'aws-cdk-todolist-ui-frontend',
  deps: [
    '@aws-amplify/auth',
    '@aws-amplify/ui-components',
    '@aws-amplify/ui-react',
    'aws-amplify',
    'react-query@^2', // I have an open PR for react-query v3 support
    'react-router',
    'react-router-dom',
    '@types/react-router-dom',
  ],
  devDeps: [
    '@graphql-codegen/cli',
    '@graphql-codegen/typescript',
    '@graphql-codegen/typescript-operations',
    '@graphql-codegen/typescript-react-query@alpha',
    'amplify-graphql-docs-generator',
    'aws-sdk@^2',
    'graphql',
  ],

  gitignore: [
    'aws-exports/aws-exports.js',
  ],

  tsconfig: {
    compilerOptions: {
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: false,
      module: 'esnext',
      moduleResolution: 'node',
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strictNullChecks: false,
    },
  },

  releaseWorkflow: false,
});

frontendProject.addTask('dev', {
  description: 'Runs the application locally',
  exec: 'react-scripts start',
});

frontendProject.addTask('generate-exports', {
  description: 'Generates aws-exports.js',
  exec: 'node bin/generateExports.js dev && node bin/generateExports.js prod',
});

// project.addTask('copy-schema', {
//   exec: 'cp appsync/schema.graphql ./schema.graphql',
// });

frontendProject.addTask('generate-statements', {
  exec: 'node bin/generateStatements.js',
});


frontendProject.addTask('codegen', {
  description: 'Copies the backend schema and generates frontend code',
  // exec: 'yarn run copy-schema && yarn run generate-statements && graphql-codegen --config codegen.yml && rm schema.graphql',
  exec: 'yarn run generate-statements && graphql-codegen --config codegen.yml',
});

frontendProject.synth();
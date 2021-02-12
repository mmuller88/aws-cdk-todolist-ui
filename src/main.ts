import * as core from '@aws-cdk/core';
import { PipelineStack } from 'aws-cdk-staging-pipeline';
import { StaticSite } from './static-site';

const app = new core.App();

new PipelineStack(app, 'todolist-pipeline-ui', {
  stackName: 'todolist-pipeline-ui',
  // Account and region where the pipeline will be build
  env: {
    account: '981237193288',
    region: 'eu-central-1',
  },
  // Staging Accounts e.g. dev qa prod
  stageAccounts: [{
    account: {
      id: '981237193288',
      region: 'eu-central-1',
    },
    stage: 'dev',
  }],
  branch: 'main',
  repositoryName: 'aws-cdk-todolist-ui',
  badges: { synthBadge: false },
  buildCommand: 'cd frontend && yarn install && yarn build && yarn generate-exports',
  // installCommand: 'npm ci',
  customStack: (scope, stageAccount) => {
    const staticSite = new StaticSite(scope, `todolist-ui-stack-${stageAccount.stage}`, {
      stackName: `todolist-ui-stack-${stageAccount.stage}`,
      stage: stageAccount.stage,
    });
    return staticSite;
  },
  // all stages need manual approval
  manualApprovals: (stageAccount) => stageAccount.stage === 'prod',
  // not much test magic here yet. Will soon setup some Postman integration tests Check the property for instructions!
  testCommands: (stageAccount) => [
    `echo "${stageAccount.stage} stage"`,
    `echo ${stageAccount.account.id} id + ${stageAccount.account.region} region`,
  ],
  gitHub: {
    owner: 'mmuller88',
    oauthToken: core.SecretValue.secretsManager('alfcdk', {
      jsonField: 'muller88-github-token',
    }),
  },
});

// new BuildBadge(stack, 'BuildBadge', { hideAccountID: 'no' });

app.synth();
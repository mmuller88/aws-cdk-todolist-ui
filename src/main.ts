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
  }, {
    account: {
      id: '991829251144',
      region: 'eu-central-1',
    },
    stage: 'prod',
  }],
  branch: 'main',
  repositoryName: 'aws-cdk-todolist-ui',
  badges: { synthBadge: true },
  buildCommand: 'cd frontend && yarn install && yarn build && cd ..',
  customStack: (scope, stageAccount) => {
    const staticSite = new StaticSite(scope, `todolist-ui-stack-${stageAccount.stage}`, {
      stackName: `todolist-ui-stack-${stageAccount.stage}`,
      stage: stageAccount.stage,
    });
    return staticSite;
  },
  // which stage needs a manual approval. Here is only prod
  manualApprovals: (stageAccount) => stageAccount.stage === 'prod',
  // not much test magic here yet. Will soon setup some Postman integration tests Check the property for instructions!
  testCommands: (stageAccount) => [
    `echo "${stageAccount.stage} stage"`,
    'STATUSCODE=$(curl --silent --output /dev/stderr --write-out "%{http_code}" $appsyncGraphQLEndpointOutput)',
    'echo Statuscode = $STATUSCODE',
    'if test $STATUSCODE -ne 200; then exit 1; fi',
  ],
  gitHub: {
    owner: 'mmuller88',
    oauthToken: core.SecretValue.secretsManager('alfcdk', {
      jsonField: 'muller88-github-token',
    }),
  },
});

app.synth();
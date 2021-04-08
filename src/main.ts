import { App } from '@aws-cdk/core';
import { StaticSite } from './static-site';

// for development, use account/region from cdk cli
const devEnv = {
  account: '981237193288',
  region: 'eu-central-1',
};

const app = new App();

new StaticSite(app, 'static-site-dev', {
  env: devEnv,
  stage: 'dev',
});
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();
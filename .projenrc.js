const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'martin.mueller',
  name: 'aws-cdk-todolist-ui',
  defaultReleaseBranch: 'main',
  cdkVersion: '1.93.0',
  cdkVersionPinning: true,
});

project.synth();

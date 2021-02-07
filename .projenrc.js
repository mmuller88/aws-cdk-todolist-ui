const { web } = require('projen');

const project = new web.ReactTypeScriptProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  defaultReleaseBranch: 'main',
  jsiiFqn: "projen.web.ReactTypeScriptProject",
  name: 'aws-cdk-todolist-ui',

});

project.synth();

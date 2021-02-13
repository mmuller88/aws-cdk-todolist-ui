
const fs = require('fs');
const path = require('path');

const REGION = process.env.REGION || 'eu-central-1'

const AWS = require('aws-sdk');
AWS.config.update({region:'eu-central-1'});

const appsyncGraphQLURLOutputKey = 'appsyncGraphQLEndpointOutput';
const userPoolIdOutputKey = 'awsUserPoolId';
const userPoolClientOutputKey = 'awsUserPoolWebClientId';
const identityPoolOutputKey = 'awsIdentityPoolId';
const authenticationTypeOutputKey = 'awsAppsyncAuthenticationType';

let config = {
    stage: '',
    aws_project_region: REGION,
    aws_appsync_graphqlEndpoint: '',
    aws_appsync_region: REGION,
    aws_appsync_authenticationType: 'AWS_IAM',
    aws_cognito_region: REGION,
    aws_user_pools_id: '',
    aws_user_pools_web_client_id: '',
    aws_cognito_identity_pool_id: ''
};

main();

async function main() {
    var myArgs = process.argv.slice(2);
    var stage = myArgs[0] || 'dev';
    var STACK_NAME = `todolist-stack-${stage}`

    if(stage === 'prod'){
        process.env.AWS_SDK_LOAD_CONFIG=1;
        var credentials = new AWS.SharedIniFileCredentials({profile: 'prod', filename: '~/.aws/credentials'});
        AWS.config.credentials = credentials;
    }
    
    const cloudformation = new AWS.CloudFormation();

    const exportFileName = `config/${stage}/config.js`;
    console.log('Generating config.js')

    var describeStackParams = {
        StackName: STACK_NAME
    };
    const stackResponse = await cloudformation.describeStacks(describeStackParams).promise()
    const stack = stackResponse.Stacks[0];

    const appsyncGraphQLEndpoint = stack.Outputs.find(output => {
        return output.OutputKey === appsyncGraphQLURLOutputKey;
    })

    const userPoolId = stack.Outputs.find(output => {
        return output.OutputKey === userPoolIdOutputKey;
    })

    const userPoolWebClientId = stack.Outputs.find(output => {
        return output.OutputKey === userPoolClientOutputKey;
    })

    const identityPoolId = stack.Outputs.find(output => {
        return output.OutputKey === identityPoolOutputKey;
    })

    const authenticationType = stack.Outputs.find(output => {
        return output.OutputKey === authenticationTypeOutputKey;
    })

    config.stage = stage;
    config.aws_appsync_graphqlEndpoint = appsyncGraphQLEndpoint.OutputValue;
    config.aws_appsync_authenticationType = authenticationType.OutputValue;
    config.aws_user_pools_id = userPoolId.OutputValue;
    config.aws_user_pools_web_client_id = userPoolWebClientId.OutputValue;
    config.aws_cognito_identity_pool_id = identityPoolId.OutputValue;

    let awsExportsPath = path.join(__dirname, '..', 'src', exportFileName);

    let data = `window.ENV = ${JSON.stringify(config, null, 4)}`
    
    // export default awsmobile;`.replace(/^    export default awsmobile/gm, 'export default awsmobile');

    fs.writeFileSync(awsExportsPath, data);
    console.log(`Wrote exports to ${awsExportsPath}`);
}
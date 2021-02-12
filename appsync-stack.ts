import * as appsync from '@aws-cdk/aws-appsync';
import * as cognito from '@aws-cdk/aws-cognito';
import * as db from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import { CustomStack } from 'aws-cdk-staging-pipeline/lib/custom-stack';
// import { AppSyncTransformer } from 'cdk-appsync-transformer';


export interface AppSyncStackProps extends core.StackProps {
  readonly stage: string;
}

export class AppSyncStack extends CustomStack {
  constructor(scope: core.Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'demo-user-pool', {
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true,
        },
        phoneNumber: {
          mutable: true,
          required: true,
        },
      },
      signInAliases: {
        username: true,
      },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'demo-user-pool-client', {
      userPool,
      generateSecret: false,
    });

    const identityPool = new cognito.CfnIdentityPool(this, id, {
      identityPoolName: 'demo-identity-pool',
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: `cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
        },
      ],
      allowUnauthenticatedIdentities: true,
    });

    const unAuthPrincipal = new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com')
      .withConditions({
        'StringEquals': { 'cognito-identity.amazonaws.com:aud': `${identityPool.ref}` },
        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' },
      });

    const unauthRole = new iam.Role(this, 'demo-identity-unauth-role', {
      assumedBy: unAuthPrincipal,
    });

    new cognito.CfnIdentityPoolRoleAttachment(this, `${id}-role-map`, {
      identityPoolId: identityPool.ref,
      roles: {
        unauthenticated: unauthRole.roleArn,
      },
    });

    const todoTable = new db.Table(this, 'TodoTable', {
      removalPolicy: core.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: db.AttributeType.STRING,
      },
    });

    const graphQlApi = new appsync.GraphqlApi(this, 'GraphQlApi', {
      name: 'TodoList',
      schema: appsync.Schema.fromAsset('schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: userPool,
            defaultAction: appsync.UserPoolDefaultAction.ALLOW,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        ],
      },
    });

    // const appSyncTransformer = new AppSyncTransformer(this, 'GraphQlApi', {
    //   schemaPath: './schema.graphql',
    //   apiName: 'demo-appsync-api',
    //   authorizationConfig: {
    //     defaultAuthorization: {
    //       authorizationType: appsync.AuthorizationType.USER_POOL,
    //       userPoolConfig: {
    //         userPool,
    //         defaultAction: appsync.UserPoolDefaultAction.ALLOW,
    //       },
    //     },
    //     additionalAuthorizationModes: [
    //       {
    //         authorizationType: appsync.AuthorizationType.IAM,
    //       },
    //     ],
    //   },
    // });

    // Add allowed queries to the unauthorized identity pool role
    unauthRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'appsync:GraphQL',
        ],
        resources: [
          // Queries
          `arn:aws:appsync:${this.region}:${this.account}:apis/${graphQlApi.apiId}/types/Query/fields/listPosts`,
          `arn:aws:appsync:${this.region}:${this.account}:apis/${graphQlApi.apiId}/types/Query/fields/getPost`,
        ],
      }),
    );

    const todoDS = graphQlApi.addDynamoDbDataSource('todoDataSource', todoTable);

    todoDS.createResolver({
      typeName: 'Query',
      fieldName: 'todoList',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    todoDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'todoAdd',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(appsync.PrimaryKey.partition('id').auto(), appsync.Values.attribute('body').is('$ctx.args.body').attribute('username').is('$ctx.args.username')),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    todoDS.createResolver({
      typeName: 'Mutation',
      fieldName: 'todoRemove',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    // Outputs
    new core.CfnOutput(this, 'appsyncGraphQLEndpointOutput', {
      description: 'GraphQL Endpoint',
      value: graphQlApi.graphqlUrl,
    });

    new core.CfnOutput(this, 'awsUserPoolId', {
      description: 'userPoolID value for amplify exports',
      value: userPool.userPoolId,
    });

    new core.CfnOutput(this, 'awsUserPoolWebClientId', {
      description: 'userPoolClientID value for amplify exports',
      value: userPoolClient.userPoolClientId,
    });

    new core.CfnOutput(this, 'awsIdentityPoolId', {
      description: 'identityPoolID value for amplify exports',
      value: identityPool.ref,
    });

    new core.CfnOutput(this, 'awsAppsyncAuthenticationType', {
      value: appsync.AuthorizationType.IAM,
    });
  }
}
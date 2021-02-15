import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as core from '@aws-cdk/core';
import { CustomStack } from 'aws-cdk-staging-pipeline/lib/custom-stack';


export interface StaticSiteProps extends core.StackProps {
  readonly stage: string;
}

export class StaticSite extends CustomStack {
  constructor(scope: core.Construct, id: string, props: StaticSiteProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag', 'x-amz-meta-custom-header', 'Authorization', 'Content-Type', 'Accept'],
        },
      ],
      removalPolicy: core.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'BucketDeployment', {
      sources: [s3deploy.Source.asset('./frontend/build'), s3deploy.Source.asset(`./frontend/src/config/${props.stage}`)],
      destinationBucket: siteBucket,
    });

    new core.CfnOutput(this, 'bucketWebsiteUrl', {
      value: siteBucket.bucketWebsiteUrl,
    });
  }
}

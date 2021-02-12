import { HttpMethods } from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as core from '@aws-cdk/core';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
import { CustomStack } from 'aws-cdk-staging-pipeline/lib/custom-stack';


export interface StaticSiteProps {
  // readonly stage: string;
}

export class StaticSite extends CustomStack {
  constructor(scope: core.Construct, id: string, props: StaticSiteProps) {
    super(scope, id, props);

    const siteBucket = new AutoDeleteBucket(this, 'SiteBucket', {
      // bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag', 'x-amz-meta-custom-header', 'Authorization', 'Content-Type', 'Accept'],
        },
      ],
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'BucketDeployment', {
      sources: [s3deploy.Source.asset('./frontend/build')],
      destinationBucket: siteBucket,
    });
  }
}

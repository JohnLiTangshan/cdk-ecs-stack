import { Construct } from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

/**
 * Create S3 bucket, cloudfront to serve static contents.
 */
export class StaticAsset extends Construct {

    constructor(scope: Construct, id: string) {
        super(scope, id);
        const myBucket = new Bucket(this, 'StaticBucket', {
            versioned: true
        });

        new cloudfront.Distribution(this, 'myDist', {
            defaultBehavior: { origin: new origins.S3Origin(myBucket) },
        });
    }
}
import { Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';
import { StaticAsset } from '../lib/static-asset';

test('it should create a bucket', () => {
    const stack = new Stack();
    new StaticAsset(stack, 'staticAsset');
    expect(stack).to(haveResource('AWS::S3::Bucket', {
        'VersioningConfiguration': {
            'Status': 'Enabled'
        }
    }));
});

test('it should create a cloudfront distribution', () => {
    const stack = new Stack();
    new StaticAsset(stack, 'staticAsset');
    expect(stack).to(haveResourceLike('AWS::CloudFront::Distribution', {
        'DistributionConfig': {
            "DefaultCacheBehavior": {
                "ForwardedValues": {
                  "QueryString": false
                },
                "ViewerProtocolPolicy": "allow-all"
            },
            "Enabled": true,
        }
    }));
});
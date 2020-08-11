import '@aws-cdk/assert/jest';
import { expect, haveResource, countResources, countResourcesLike, arrayWith } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';
import { DemoApplicationStack } from '../lib/demo-application-stack';
import { Stack, App } from '@aws-cdk/core';

test('a vpc is created with default value', () => {
    // GIVEN
    const app = new App();
    const stack = new DemoApplicationStack(app, 'demo');
    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPC'));
});
test('a vpc with Nat gateway is created with context', () => {
    // GIVEN
    const app = new App({
        context: {
            natGateways: 2,
            maxAzs: 3
        }
    });
    const stack = new DemoApplicationStack(app, 'demo', {
        env: {
            region: 'ap-northeast-1',
            account: '123'
        }
    });
    // THEN
    expect(stack).to(countResources('AWS::EC2::NatGateway', 2));
    expect(stack).to(countResourcesLike('AWS::EC2::Subnet', 3, {
        'Tags': arrayWith({
            "Key": "aws-cdk:subnet-type",
            "Value": "Public"
          })
    }));
})
test('a cluster is created', () => {
    // GIVEN
    const app = new App();
    const stack = new DemoApplicationStack(app, 'demo');
    // THEN
    expect(stack).to(haveResource('AWS::ECS::Cluster'));
});

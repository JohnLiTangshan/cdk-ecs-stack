import '@aws-cdk/assert/jest';
import { expect, haveResource } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';
import { DemoApplicationStack } from '../lib/demo-application-stack';
import { Stack, App } from '@aws-cdk/core';

test('a vpc is created', () => {
    // GIVEN
    const app = new App();
    const stack = new DemoApplicationStack(app, 'demo');
    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPC'));
});

test('a cluster is created', () => {
    // GIVEN
    const app = new App();
    const stack = new DemoApplicationStack(app, 'demo');
    // THEN
    expect(stack).to(haveResource('AWS::ECS::Cluster'));
});

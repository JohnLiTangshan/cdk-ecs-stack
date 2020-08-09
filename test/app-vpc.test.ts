import { Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { AppVpc } from '../lib/app-vpc';
import { arrayWith, countResources, countResourcesLike, expect, haveResource } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';

test('vpc is created', () => {
    // WHEN
    const stack = new Stack();
    new AppVpc(stack, 'AppVpc');
    // THEN
    expect(stack).to(haveResource('AWS::EC2::VPC', {
        'EnableDnsHostnames': true,
        'EnableDnsSupport': true
    }));
});

test('it has 4 subnets', () => {
    // WHEN
    const stack = new Stack();
    new AppVpc(stack, 'AppVpc');
    // THEN
    expect(stack).to(countResources('AWS::EC2::Subnet', 4));

});

test('it creates 2 public subnets', () => {
    // WHEN
    const stack = new Stack();
    new AppVpc(stack, 'AppVpc');
    // THEN
    expect(stack).to(countResourcesLike('AWS::EC2::Subnet', 2, {
        'Tags': arrayWith({
            "Key": "aws-cdk:subnet-type",
            "Value": "Public"
          })
    }));
});

test('it creates 2 private subnets', () => {
    // WHEN
    const stack = new Stack();
    new AppVpc(stack, 'AppVpc');
   // THEN
   expect(stack).to(countResourcesLike('AWS::EC2::Subnet', 2, {
    'Tags': arrayWith({
        "Key": "aws-cdk:subnet-type",
        "Value": "Private"
      })
    }));
});

test('it create a internet gateway', () => {
    // WHEN
    const stack = new Stack();
    new AppVpc(stack, 'AppVpc');
    // THEN
    expect(stack).to(haveResource('AWS::EC2::InternetGateway'));
});

test('1 nat gateway is created', () => {
    // WHEN
    const stack = new Stack();
    new AppVpc(stack, 'AppVpc');
    // THEN
    expect(stack).to(countResources('AWS::EC2::NatGateway', 1));
});

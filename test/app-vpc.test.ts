import { Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { AppVpc } from '../lib/app-vpc';
import { arrayWith, countResources, countResourcesLike, expect as cdkExpect, haveResource } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';

let stack: Stack;
beforeEach(() => {
    // WHEN
    stack = new Stack();
    new AppVpc(stack, 'AppVpc');
})

test('vpc is created', () => {
    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::VPC', {
        'EnableDnsHostnames': true,
        'EnableDnsSupport': true
    }));
});

test('it has 4 subnets', () => {
    // THEN
    cdkExpect(stack).to(countResources('AWS::EC2::Subnet', 4));

});

test('it creates 2 public subnets', () => {
    // THEN
    cdkExpect(stack).to(countResourcesLike('AWS::EC2::Subnet', 2, {
        'Tags': arrayWith({
            "Key": "aws-cdk:subnet-type",
            "Value": "Public"
          })
    }));
});

test('it creates 2 isolated subnets', () => {
   // THEN
   cdkExpect(stack).to(countResourcesLike('AWS::EC2::Subnet', 2, {
    'Tags': arrayWith({
        "Key": "aws-cdk:subnet-type",
        "Value": "Isolated"
      })
    }));
});

test('it create a internet gateway', () => {
    // THEN
    cdkExpect(stack).to(haveResource('AWS::EC2::InternetGateway'));
});

test('no nat gateway is created', () => {
    // THEN
    cdkExpect(stack).to(countResources('AWS::EC2::NatGateway', 0));
});

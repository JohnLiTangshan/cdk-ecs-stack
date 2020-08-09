import { Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Database } from '../lib/database';

test('it create a database cluster', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBCluster', {
        "Engine": "aurora-mysql",
        "DBClusterParameterGroupName": "default.aurora-mysql5.7",
        "EngineVersion": "5.7.12",
    }));
});

test('it create a database instance', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBInstance', {
        "DBInstanceClass": "db.t2.small",
        "Engine": "aurora-mysql",
        "EngineVersion": "5.7.12",
        "PubliclyAccessible": false
    }));
});

test('it create a db subnet group', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::RDS::DBSubnetGroup'));
});
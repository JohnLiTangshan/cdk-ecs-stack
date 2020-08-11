import { Stack, App } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { expect, haveResource, haveResourceLike, countResourcesLike } from '@aws-cdk/assert';
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

test('it create 2 database instance with default value', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(countResourcesLike('AWS::RDS::DBInstance', 2, {
        "DBInstanceClass": "db.t2.small",
        "Engine": "aurora-mysql",
        "EngineVersion": "5.7.12",
        "PubliclyAccessible": false
    }));
});

test('it create a database instance with context', () => {
    // GIVEN
    const app = new App({
        context: {
            dbInstanceClass: 't3',
            dbInstanceSize: 'large',
            dbInstances: 3
        }
    })
    const stack = new Stack(app);
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(countResourcesLike('AWS::RDS::DBInstance', 3, {
        "DBInstanceClass": "db.t3.large",
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

test('it create a db autoscaling target with default values', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
        "MaxCapacity": 3,
        "MinCapacity": 1,
        "ScalableDimension": "rds:cluster:ReadReplicaCount",
        "ServiceNamespace": "rds"
    }));
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
        "PolicyType": "TargetTrackingScaling",
        "TargetTrackingScalingPolicyConfiguration": {
            "PredefinedMetricSpecification": {
              "PredefinedMetricType": "RDSReaderAverageCPUUtilization"
            },
            "TargetValue": 50
          }
    }));
});

test('it create a db autoscaling target with context', () => {
    // GIVEN
    const app = new App({
        context: {
            dbMinCapacity: 2,
            dbMaxCapacity: 5,
            dbCpuTarget: 80
        }
    })
    const stack = new Stack(app);
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new Database(stack, 'database', {
        vpc
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
        "MaxCapacity": 5,
        "MinCapacity": 2,
        "ScalableDimension": "rds:cluster:ReadReplicaCount",
        "ServiceNamespace": "rds"
    }));
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
        "PolicyType": "TargetTrackingScaling",
        "TargetTrackingScalingPolicyConfiguration": {
            "PredefinedMetricSpecification": {
              "PredefinedMetricType": "RDSReaderAverageCPUUtilization"
            },
            "TargetValue": 80
          }
    }));
});
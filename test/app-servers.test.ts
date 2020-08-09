import { Stack } from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import'@aws-cdk/assert/lib';
import { Vpc } from '@aws-cdk/aws-ec2';
import { AppServers } from '../lib/app-servers';

test('cluster is created', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::ECS::Cluster'));
});

test('it should create a launch configuration', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::LaunchConfiguration', {
        'InstanceType': 't2.micro',
        'SpotPrice': '0.1',
    }));
});

test('it should create a autoscaling group', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::AutoScalingGroup', {
        'MaxSize': '3',
        'MinSize': '0',
        'DesiredCapacity': '1',
    }));
});

test('it should create a sns topic', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::SNS::Topic'));
});

test('it should create a autoscaling policy', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::AutoScaling::ScalingPolicy', {
        'PolicyType': 'TargetTrackingScaling',
        'TargetTrackingConfiguration': {
            'PredefinedMetricSpecification': {
              'PredefinedMetricType': 'ASGAverageCPUUtilization'
            },
            'TargetValue': 60
          }
    }));
});

test('it should create a ALB', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        'Scheme': 'internet-facing',
        'Type': 'application'
    }));
});

test('ALB has listener on port 80', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
        'Port': 80,
        'Protocol': 'HTTP'
    }));
});

test('it create a target group', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
        'Port': 80,
        'Protocol': 'HTTP',
        'TargetType': 'instance',
    }));
});

test('it create a task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        'NetworkMode': 'bridge',
        'RequiresCompatibilities': [
            'EC2'
          ],
        'ContainerDefinitions': [
        {
            'Essential': true,
            'Image': 'amazon/amazon-ecs-sample',
            'LogConfiguration': {
                'LogDriver': 'awslogs',
            },
            'Memory': 256,
            'Name': 'web',
            'PortMappings': [
            {
                'ContainerPort': 80,
                'HostPort': 0,
                'Protocol': 'tcp'
            }
            ]
        }
        ],
    }));
});

test('it create a ECS service', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'vpc', {
        maxAzs: 2
    });
    new AppServers(stack, 'AppServers', {
        vpc
    });
    // THEN
    expect(stack).to(haveResource('AWS::ECS::Service', {
        "DesiredCount": 1,
        "LaunchType": "EC2",
        "SchedulingStrategy": "REPLICA",
    }));
});
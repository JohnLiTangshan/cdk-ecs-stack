
import { IVpc, Instance, InstanceType, InstanceClass, InstanceSize } from "@aws-cdk/aws-ec2";
import { Cluster, ContainerImage, PlacementStrategy } from "@aws-cdk/aws-ecs";
import { Construct } from "@aws-cdk/core";

import { ApplicationLoadBalancedEc2Service } from '@aws-cdk/aws-ecs-patterns';
export interface AppServersProps {
    vpc: IVpc
}
/**
 * AppServers will create a ECS cluster, EC2 autoscaling groups, application containers
 */
export class AppServers extends Construct {
    constructor(scope: Construct, id: string, props: AppServersProps) {
        super(scope, id);

        const cluster = new Cluster(this, 'AppCluster', {
            vpc: props.vpc,
            clusterName: 'DemoCluster'
        });
        const instanceClass = this.node.tryGetContext('appInstanceClass') ?? 't2';
        const instanceSize = this.node.tryGetContext('appInstanceSize') ?? "micro";
        const instanceMinCapacity = this.node.tryGetContext('instanceMinCapacity') ?? 1;
        const instanceMaxCapacity = this.node.tryGetContext('instanceMaxCapacity') ?? 3;
        const instanceDesiredCapacity = this.node.tryGetContext('instanceDesiredCapacity') ?? 1;
        const instanceAutoScalingTargetCpuUtilizationPercent = this.node.tryGetContext('instanceAutoScalingTargetCpuUtilizationPercent') ?? 60;

        const autoscalingGroup = cluster.addCapacity('clusterCapacity', {
            instanceType: InstanceType.of(instanceClass, instanceSize),
            minCapacity: instanceMinCapacity,
            maxCapacity: instanceMaxCapacity,
            desiredCapacity: instanceDesiredCapacity
        });
        
        autoscalingGroup.scaleOnCpuUtilization('ScaleOnCpu', {
            targetUtilizationPercent: instanceAutoScalingTargetCpuUtilizationPercent
        });
        
        const taskMemoryLimit = this.node.tryGetContext('taskMemoryLimit') ?? 512;
        const taskCpu = this.node.tryGetContext('taskCpu') ?? 256;
        const taskDesiredCount = this.node.tryGetContext('taskDesiredCount') ?? 1;
        const taskMinCapacity = this.node.tryGetContext('taskMinCapacity') ?? 1;
        const taskMaxCapacity = this.node.tryGetContext('taskMaxCapacity') ?? 3;
        const taskCpuTargetUtilizationPercent = this.node.tryGetContext('taskCpuTargetUtilizationPercent') ?? 60;
        
        const loadBalancedEcsService = new ApplicationLoadBalancedEc2Service(this, 'Service', {
            cluster,
            memoryLimitMiB: taskMemoryLimit,
            cpu: taskCpu,
            taskImageOptions: {
              image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample')
            },
            desiredCount: taskDesiredCount,
          });
        loadBalancedEcsService.service.addPlacementStrategies(PlacementStrategy.packedByCpu())
        const scalableTarget = loadBalancedEcsService.service.autoScaleTaskCount({
            minCapacity: taskMinCapacity,
            maxCapacity: taskMaxCapacity
        });
        scalableTarget.scaleOnCpuUtilization('CpuScaling', {
            targetUtilizationPercent: taskCpuTargetUtilizationPercent,
        });
        
    }
}

import { IVpc, Instance, InstanceType, InstanceClass, InstanceSize } from "@aws-cdk/aws-ec2";
import { Cluster, ContainerImage } from "@aws-cdk/aws-ecs";
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
        const autoscalingGroup = cluster.addCapacity('clusterCapacity', {
            instanceType: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
            minCapacity: 0,
            maxCapacity: 3,
            desiredCapacity: 1,
            spotInstanceDraining: true,
            spotPrice: '0.1'
        });
        
        autoscalingGroup.scaleOnCpuUtilization('ScaleOnCpu', {
            targetUtilizationPercent: 60
        });
        
        const loadBalancedEcsService = new ApplicationLoadBalancedEc2Service(this, 'Service', {
            cluster,
            memoryLimitMiB: 256,
            taskImageOptions: {
              image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample')
            },
            desiredCount: 1,
          });
        
    }
}
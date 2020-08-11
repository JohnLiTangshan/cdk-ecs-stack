import * as rds from '@aws-cdk/aws-rds';
import { Construct, RemovalPolicy } from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { IVpc } from '@aws-cdk/aws-ec2';
import * as applicationautoscaling from '@aws-cdk/aws-applicationautoscaling';

/**
 * The properties for database
 */
export interface DatabaseProps {
    vpc: IVpc
}

/**
 * Create a aurora database cluster
 */
export class Database extends Construct {
    constructor(scope: Construct, id: string, props: DatabaseProps) {
        super(scope, id);
        const dbInstanceClass = this.node.tryGetContext('dbInstanceClass') ?? 't2';
        const dbInstanceSize = this.node.tryGetContext('dbInstanceSize') ?? 'small';
        const dbMinCapacity = this.node.tryGetContext('dbMinCapacity') ?? 1;
        const dbMaxCapacity = this.node.tryGetContext('dbMaxCapacity') ?? 3;
        const dbCpuTarget = this.node.tryGetContext('dbCpuTarget') ?? 50;
        const cluster = new rds.DatabaseCluster(this, 'Database', {
            engine: rds.DatabaseClusterEngine.auroraMysql({
                version: rds.AuroraMysqlEngineVersion.VER_5_7_12
            }),
            masterUser: {
              username: 'clusteradmin'
            },
            instances: 1,
            instanceProps: {
              instanceType: ec2.InstanceType.of(dbInstanceClass, dbInstanceSize),
              vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE,
              },
              vpc: props.vpc,
            },
            removalPolicy: RemovalPolicy.DESTROY
          });

        const target = new applicationautoscaling.ScalableTarget(this, 'DBScalableTarget', {
            minCapacity: dbMinCapacity,
            maxCapacity: dbMaxCapacity,
            serviceNamespace: applicationautoscaling.ServiceNamespace.RDS,
            resourceId: `cluster:${cluster.clusterIdentifier}`,
            scalableDimension: 'rds:cluster:ReadReplicaCount'
        });
        target.scaleToTrackMetric('DBCpuTracking', {
            targetValue: dbCpuTarget,
            predefinedMetric: applicationautoscaling.PredefinedMetric.RDS_READER_AVERAGE_CPU_UTILIZATION
        });
    }
}
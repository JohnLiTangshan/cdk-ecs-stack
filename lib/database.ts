import * as rds from '@aws-cdk/aws-rds';
import { Construct, RemovalPolicy } from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { IVpc } from '@aws-cdk/aws-ec2';

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
        const cluster = new rds.DatabaseCluster(this, 'Database', {
            engine: rds.DatabaseClusterEngine.auroraMysql({
                version: rds.AuroraMysqlEngineVersion.VER_5_7_12
            }),
            masterUser: {
              username: 'clusteradmin'
            },
            instances: 1,
            instanceProps: {
              instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
              vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE,
              },
              vpc: props.vpc,
            },
            removalPolicy: RemovalPolicy.DESTROY
          });
    }
}
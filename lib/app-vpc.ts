import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from '@aws-cdk/core';

export interface AppVpcProps {
    natGateways: number;
    maxAzs: number;
}
/**
 * Create a vpc in 2 AZs, with 1 NAT gateway. It will create 2 public subnets, 2 private subnets.
 */
export class AppVpc extends Construct {
    public readonly vpc: ec2.IVpc;
    constructor(scope: Construct, id: string, props: AppVpcProps) {
        super(scope, id);

        this.vpc = new ec2.Vpc(this, 'VPC', {
            natGateways: props.natGateways,
            maxAzs: props.maxAzs
        });

    }
}
import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from '@aws-cdk/core';

export class AppVpc extends Construct {
    public readonly vpc: ec2.IVpc;
    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.vpc = new ec2.Vpc(this, 'VPC', {
            natGateways: 0
        });

    }
}
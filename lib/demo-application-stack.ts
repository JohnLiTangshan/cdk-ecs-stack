import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { AppVpc } from './app-vpc';
import { AppServers } from "./app-servers";
import { StaticAsset } from "./static-asset";
import { Database } from "./database";

/**
 * DemoApplicationStack will create the whole demo application stack, including Cloudfront distribution, S3 bucket,
 * ECS Cluster, Aurora cluster.
 */
export class DemoApplicationStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const appVpc = new AppVpc(this, 'AppVpc');
        new AppServers(this, 'AppServers', {
            vpc: appVpc.vpc
        });
        new StaticAsset(this, 'StaticAsset');
        new Database(this, 'Database', {
            vpc: appVpc.vpc
        })
    }
}
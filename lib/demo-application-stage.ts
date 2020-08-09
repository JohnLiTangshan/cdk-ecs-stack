import { Stage, Construct, StageProps } from "@aws-cdk/core";
import { DemoApplicationStack } from "./demo-application-stack";

/**
 * Create a application stage and it will be added to CDK pipeline, in this stage, it will deploy DemoApplicationStack.
 */
export class DemoApplicationStage extends Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props);
        new DemoApplicationStack(this, 'DemoApplication');
    }
}
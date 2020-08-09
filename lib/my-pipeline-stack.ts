import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { AppVpc } from './app-vpc'
import { DemoApplicationStage } from './demo-application-stage';

/**
 * This stack will create a codepipeline, it will deploy DemoApplication
 */
export class MyPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    
    const OWNER = this.node.tryGetContext("repoOwner");
    const REPO = this.node.tryGetContext("repo");

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();


    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'MyAppPipeline',
      cloudAssemblyArtifact,

      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('githubToken'),
        trigger: codepipeline_actions.GitHubTrigger.POLL,
        // Replace these with your actual GitHub project info
        owner: OWNER,
        repo: REPO,
      }),
      synthAction: SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'yarn run build',
      })
    });
    const demoApplicationStage = new DemoApplicationStage(this, 'DemoApplicationStage', {
      env: props.env
    });
    pipeline.addApplicationStage(demoApplicationStage);

  }
}

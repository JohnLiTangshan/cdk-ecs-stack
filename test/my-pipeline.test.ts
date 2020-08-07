import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as MyPipeline from '../lib/my-pipeline-stack';

let app: cdk.App;
let stack: MyPipeline.MyPipelineStack;
beforeEach(() => {
  app = new cdk.App();
  stack = new MyPipeline.MyPipelineStack(app, 'MyTestStack');
});

test('pipeline has three stages', () => {
  expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
      "Stages": [
        {
          "Name": "Source"
        },
        {
          "Name": "Build"
        },
        {
          "Name": "UpdatePipeline"
        }
      ]
  });

});

test('the source github', () => {
  
  expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
    "Name": "MyAppPipeline",
    "Stages": [
      {
        "Name": "Source",
        "Actions": [
          {
            "ActionTypeId": {
              "Category": "Source",
              "Owner": "ThirdParty",
              "Provider": "GitHub",
            },
          }
        ]
      }
    ]
  })
});








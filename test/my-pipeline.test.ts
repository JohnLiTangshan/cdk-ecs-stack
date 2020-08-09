import { expect, haveResourceLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as MyPipeline from '../lib/my-pipeline-stack';
import { DefaultStackSynthesizer } from '@aws-cdk/core';


const props = {
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': 'true'
  }
};
test('pipeline has four stages', () => {
  // GIVEN
  const app = new cdk.App(props);
  const stack = new MyPipeline.MyPipelineStack(app, 'MyTestStack', {
    env: {
      account: '121',
      region: 'test'
    }
  });
  // THEN
  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source'
        },
        {
          'Name': 'Build'
        },
        {
          'Name': 'UpdatePipeline'
        },
        {
          'Name': 'DemoApplicationStage'
        }
      ]
  }));

});

test('the source github', () => {
  // GIVEN
  const app = new cdk.App(props);
  const stack = new MyPipeline.MyPipelineStack(app, 'MyTestStack', {
    env: {
      account: '121',
      region: 'test'
    }
  });
  // THEN
  expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
    'Name': 'MyAppPipeline',
    'Stages': [
      {
        'Name': 'Source',
        'Actions': [
          {
            'ActionTypeId': {
              'Category': 'Source',
              'Owner': 'ThirdParty',
              'Provider': 'GitHub',
            },
          }
        ]
      }
    ]
  }));
});








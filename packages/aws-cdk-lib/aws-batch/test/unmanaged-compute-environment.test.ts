import { capitalizePropertyNames } from './utils';
import { Match, Template } from '../../assertions';
import { Role, ServicePrincipal } from '../../aws-iam';
import { Stack, Validations } from '../../core';
import type { CfnComputeEnvironmentProps } from '../lib/';
import { ContainerInsights, UnmanagedComputeEnvironment } from '../lib/';

const defaultExpectedProps: CfnComputeEnvironmentProps = {
  type: 'unmanaged',
  computeEnvironmentName: undefined,
  computeResources: undefined,
  eksConfiguration: undefined,
  replaceComputeEnvironment: undefined,
  serviceRole: {
    'Fn::GetAtt': ['MyCEBatchServiceRole4FDA2CB6', 'Arn'],
  } as any,
  state: 'ENABLED',
  tags: undefined,
  unmanagedvCpus: undefined,
  updatePolicy: undefined,
};

let stack = new Stack();
const pascalCaseExpectedProps = capitalizePropertyNames(stack, defaultExpectedProps);

test('default props', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
  });
});

test('respects enabled: false', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    enabled: false,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    State: 'DISABLED',
  });
});

test('respects name', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    computeEnvironmentName: 'magic',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    ComputeEnvironmentName: 'magic',
  });
});

test('respects serviceRole', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    serviceRole: new Role(stack, 'myMagicRole', {
      assumedBy: new ServicePrincipal('batch.amazonaws.com'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    ServiceRole: {
      'Fn::GetAtt': ['myMagicRole2BBD827A', 'Arn'],
    },
  });
});

test('respects unmanagedvCpus', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', {
    unmanagedvCpus: 256,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    ...pascalCaseExpectedProps,
    UnmanagedvCpus: 256,
  });
});

test('does not set EcsSettings by default', () => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    EcsSettings: Match.absent(),
  });
});

test.each([
  [ContainerInsights.ENABLED, 'ENABLED'],
  [ContainerInsights.ENHANCED, 'ENHANCED'],
  [ContainerInsights.DISABLED, 'DISABLED'],
])('renders containerInsights %p as EcsSettings.ContainerInsights %s', (containerInsights, expected) => {
  // GIVEN
  stack = new Stack();

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', { containerInsights });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    EcsSettings: { ContainerInsights: expected },
  });
});

test('renders a custom containerInsights value from ContainerInsights.of()', () => {
  // GIVEN
  stack = new Stack();
  Validations.of(stack).acknowledge({
    id: 'CloudFormation-Validate::W3030',
    reason: 'value not yet in the CloudFormation spec',
  });

  // WHEN
  new UnmanagedComputeEnvironment(stack, 'MyCE', { containerInsights: ContainerInsights.of('SOME_NEW_MODE') });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::ComputeEnvironment', {
    EcsSettings: { ContainerInsights: 'SOME_NEW_MODE' },
  });
});

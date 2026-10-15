import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ContainerInsights, FargateComputeEnvironment, ManagedEc2EcsComputeEnvironment, UnmanagedComputeEnvironment } from 'aws-cdk-lib/aws-batch';

const app = new App();
const stack = new Stack(app, 'batch-container-insights-stack');
const vpc = new ec2.Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

new FargateComputeEnvironment(stack, 'FargateEnhanced', {
  vpc,
  maxvCpus: 16,
  containerInsights: ContainerInsights.ENHANCED,
});

new ManagedEc2EcsComputeEnvironment(stack, 'Ec2EcsEnabled', {
  vpc,
  maxvCpus: 16,
  containerInsights: ContainerInsights.ENABLED,
});

new UnmanagedComputeEnvironment(stack, 'UnmanagedDisabled', {
  containerInsights: ContainerInsights.DISABLED,
});

new integ.IntegTest(app, 'BatchContainerInsightsTest', {
  testCases: [stack],
});

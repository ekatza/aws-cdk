import type { IConstruct } from 'constructs';
import { CfnPropsMixin } from '../../../core/lib/helpers-internal';
import { CfnComputeEnvironment } from '../batch.generated';
import type { ContainerInsights } from '../compute-environment-base';

/**
 * Applies `containerInsights` to the CfnComputeEnvironment under `scope`, if set.
 */
export function applyContainerInsights(scope: IConstruct, containerInsights?: ContainerInsights): void {
  if (containerInsights === undefined) {
    return;
  }
  scope.with(new CfnPropsMixin(CfnComputeEnvironment, {
    ecsSettings: { containerInsights: containerInsights.value },
  }));
}

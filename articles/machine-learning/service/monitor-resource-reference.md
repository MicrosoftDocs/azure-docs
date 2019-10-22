# <!-- Service --> monitoring data reference
See [Monitoring <!-- Service -->](monitor-service.md) for details on collecting and analyzing monitoring data for <!-- Service -->.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->

## Activity log

The following table lists the operations related to Azure Azure Machine Learning that may be create in the Activity log.

| Operation | Description |
|:---|:---|
| | |
| | |

<!-- Fill in the table with the operations that can be created in the Activity log for the service. Create a separate section for each table. -->

## Resource logs

The following table lists the properties for Azure Azure Machine Learning resource logs when they're collected in Azure Monitor Logs or Azure Storage.

### AmlComputeJobEvents table

| Property | Description |
|:--- |:---|
| TimeGenerated | |
| OperationName | |
| Category | |
| ProvisioningState | |
| ClusterName | |
| ClusterType | |
| CreatedBy | |
| CoreCount | |
| VmSize | |
| VmPriority | |
| ScalingType | |
| InitialNodeCount | |
| MinimumNodeCount | |
| MaximumNodeCount | |
| NodeDeallocationOption | |
| Publisher | |
| Offer | |
| Sku | |
| Version | |
| SubnetId | |
| AllocationState | |
| CurrentNodeCount | |
| TargetNodeCount | |
| EventType | |
| NodeIdleTimeSecondsBeforeScaleDown | |
| PreemptedNodeCount | |
| IsResizeGrow | |
| VmFamilyName | |
| LeavingNodeCount | |
| UnusableNodeCount | |
| IdleNodeCount | |
| RunningNodeCount | |
| PreparingNodeCount | |
| QuotaAllocated | |
| QuotaUtilized | |
| AllocationStateTransitionTime | |
| ClusterErrorCodes | |
| CreationApiVersion | |
| InternalOperationName | |

### AmlComputeNodeEvents table

| Property | Description |
|:--- |:--- |
| TimeGenerated | |
| OperationName | |
| Category | |
| ProvisioningState | |
| ClusterName | |
| ClusterType | |
| CreatedBy | |
| CoreCount | |
| VmSize | |
| VmPriority | |
| ScalingType | |
| InitialNodeCount | |
| MinimumNodeCount | |
| MaximumNodeCount | |
| NodeDeallocationOption | |
| Publisher | |
| Offer | |
| Sku | |
| Version | |
| SubnetId | |
| AllocationState | |
| CurrentNodeCount | |
| TargetNodeCount | |
| EventType | |
| NodeIdleTimeSecondsBeforeScaleDown | |
| PreemptedNodeCount | |
| IsResizeGrow | |
| VmFamilyName | |
| LeavingNodeCount | |
| UnusableNodeCount | |
| IdleNodeCount | |
| RunningNodeCount | |
| PreparingNodeCount | |
| QuotaAllocated | |
| QuotaUtilized | |
| AllocationStateTransitionTime | |
| ClusterErrorCodes | |
| CreationApiVersion | |
| InternalOperationName | |

### AmlComputeJobEvents table

| Property | Description |
|:--- |:---|
| TimeGenerated | |
| OperationName | |
| Category | |
| ProvisioningState | |
| ClusterName | |
| ClusterType | |
| CreatedBy | |
| CoreCount | |
| VmSize | |
| VmPriority | |
| ScalingType | |
| InitialNodeCount | |
| MinimumNodeCount | |
| MaximumNodeCount | |
| NodeDeallocationOption | |
| Publisher | |
| Offer | |
| Sku | |
| Version | |
| SubnetId | |
| AllocationState | |
| CurrentNodeCount | |
| TargetNodeCount | |
| EventType | |
| NodeIdleTimeSecondsBeforeScaleDown | |
| PreemptedNodeCount | |
| IsResizeGrow | |
| VmFamilyName | |
| LeavingNodeCount | |
| UnusableNodeCount | |
| IdleNodeCount | |
| RunningNodeCount | |
| PreparingNodeCount | |
| QuotaAllocated | |
| QuotaUtilized | |
| AllocationStateTransitionTime | |
| ClusterErrorCodes | |
| CreationApiVersion | |
| InternalOperationName | |

### Metrics

The following tables list the platform metrics collected for Azure Machine Learning All metrics are stored in the namespace **Azure Machine Learning Service Workspace**.

**Model**

| Model | Unit | Description |
| ----- | ----- | ----- |
| Model deploy failed | Count | The number of model deployments that failed. |
| Model deploy started | Count | The number of model deployments started. |
| Model deploy succeeded | Count | The number of model deployments that succeeded. |
| Model register failed | Count | The number of model registrations that failed. |
| Model register succeeded | Count | The number of model registrations that succeeded. |

**Quota**

Quota information is for Azure Machine Learning compute only.

| Metric | Unit | Description |
| ----- | ----- | ----- |
| Active cores | Count | The number of active compute cores. |
| Active nodes | Count | The number of active nodes. |
| Idle cores | Count | The number of idle compute cores. |
| Idle nodes | Count | The number of idle compute nodes. |
| Leaving cores | Count | The number of leaving cores. |
| Leaving nodes | Count | The number of leaving nodes. |
| Preempted cores | Count | The number of preempted cores. |
| Preempted nodes | Count | The number of preempted nodes. |
| Quota utilization percentage | Percent | The percentage of quota used. |
| Total cores | Count | The total cores. |
| Total nodes | Count | The total nodes. |
| Unusable cores | Count | The number of unusable cores. |
| Unusable nodes | Count | The number of unusable nodes. |

The following are dimensions that can be used to filter quota metrics:

| Dimension | Description |
| ---- | ---- |
| Cluster Name | The name of the Azure Machine Learning compute instance. |
| Vm Family Name | The name of the VM family used by the cluster. This dimension is only available with the __Quota utilization percentage__ metric. |
| Vm Priority | |

**Run**

Information on training runs.

| Metric | Unit | Description |
| ----- | ----- | ----- |
| Completed runs | Count | The number of completed runs. |
| Failed runs | Count | The number of failed runs. |
| Started runs | Count | The number of started runs. |

The following are dimensions that can be used to filter run metrics:

| Dimension | Description |
| ---- | ---- |
| Region | The Azure region the run occurred in. |
| ResourceId | |
| Scenario | |
| ComputeType | The compute type that the run used. |
| PipelineStepType | The type of [PipelineStep](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinestep?view=azure-ml-py) used in the run. |
| PublishedPipelineId | The ID of the published pipeline used in the run. |
| RunType | |

## See Also

- See [Monitoring Azure Azure Machine Learning](monitor-azure-machine-learning.md) for a description of monitoring Azure Azure Machine Learning.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resource) for details on monitoring Azure resources.

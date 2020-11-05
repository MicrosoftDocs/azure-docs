---
title: Monitor Azure Machine Learning data reference | Microsoft Docs
description: Important reference material needed when you monitor Azure Machine Learning. Learn about the data and resources collected for Azure Machine Learning, and available in Azure Monitor. Azure Monitor collects and surfaces data about your Azure Machine Learning workspace, and allows you to view metrics, set alerts, and analyze logged data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 10/02/2020
---

# Monitoring Azure machine learning data reference

Learn about the data and resources collected by Azure Monitor from your Azure Machine Learning workspace. See [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md) for details on collecting and analyzing monitoring data.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Machine Learning. The resource provider for these metrics is [Microsoft.MachineLearningServices/workspaces](../azure-monitor/platform/metrics-supported.md#microsoftmachinelearningservicesworkspaces).

**Model**

| Metric | Unit | Description |
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

**Resource**

| Metric | Unit | Description |
| ----- | ----- | ----- |
| CpuUtilization | Percent | How much percent of CPU was utilized for a given node during a run/job. This metric is published only when a job is running on a node. One job may use one or more nodes. This metric is published per node. |
| GpuUtilization | Percent | How much percentage of GPU was utilized for a given node during a run/job. One node can have one or more GPUs. This metric is published per GPU per node. |

**Run**

Information on training runs.

| Metric | Unit | Description |
| ----- | ----- | ----- |
| Completed runs | Count | The number of completed runs. |
| Failed runs | Count | The number of failed runs. |
| Started runs | Count | The number of started runs. |

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/platform/data-platform-metrics.md#multi-dimensional-metrics).

Azure Machine Learning has the following dimensions associated with its metrics.

| Dimension | Description |
| ---- | ---- |
| Cluster Name | The name of the compute instance. Available for all quota metrics. |
| Vm Family Name | The name of the VM family used by the cluster. Available for quota utilization percentage. |
| Vm Priority | The priority of the VM. Available for quota utilization percentage.
| CreatedTime | Only available for CpuUtilization and GpuUtilization. |
| DeviceId | ID of the device (GPU). Only available for GpuUtilization. |
| NodeId | ID of the node created where job is running. Only available for CpuUtilization and GpuUtilization. |
| RunId | ID of the run/job. Only available for CpuUtilization and GpuUtilization. |
| ComputeType | The compute type that the run used. Only available for Completed runs, Failed runs, and Started runs. |
| PipelineStepType | The type of [PipelineStep](/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinestep?preserve-view=true&view=azure-ml-py) used in the run. Only available for Completed runs, Failed runs, and Started runs. |
| PublishedPipelineId | The ID of the published pipeline used in the run. Only available for Completed runs, Failed runs, and Started runs. |
| RunType | The type of run. Only available for Completed runs, Failed runs, and Started runs. |

The valid values for the RunType dimension are:

| Value | Description |
| ----- | ----- |
| Experiment | Non-pipeline runs. |
| PipelineRun | A pipeline run, which is the parent of a StepRun. |
| StepRun | A run for a pipeline step. |
| ReusedStepRun | A run for a pipeline step that reuses a previous run. |

## Activity log

The following table lists the operations related to Azure Machine Learning that may be created in the Activity log.

| Operation | Description |
|:---|:---|
| Creates or updates a Machine Learning workspace | A workspace was created or updated |
| CheckComputeNameAvailability | Check if a compute name is already in use |
| Creates or updates the compute resources | A compute resource was created or updated |
| Deletes the compute resources | A compute resource was deleted |
| List secrets | On operation listed secrets for a Machine Learning workspace |

## Resource logs

This section lists the types of resource logs you can collect for Azure Machine Learning workspace.

Resource Provider and Type: [Microsoft.MachineLearningServices/workspace](../azure-monitor/platform/resource-logs-categories.md#microsoftmachinelearningservicesworkspaces).

| Category | Display Name |
| ----- | ----- |
| AmlComputeClusterEvent | AmlComputeClusterEvent |
| AmlComputeClusterNodeEvent | AmlComputeClusterNodeEvent |
| AmlComputeCpuGpuUtilization | AmlComputeCpuGpuUtilization |
| AmlComputeJobEvent | AmlComputeJobEvent |
| AmlRunStatusChangedEvent | AmlRunStatusChangedEvent |

## Schemas

The following schemas are in use by Azure Machine Learning

### AmlComputeJobEvents table

| Property | Description |
|:--- |:---|
| TimeGenerated | Time when the log entry was generated |
| OperationName | Name of the operation associated with the log event |
| Category | Name of the log event, AmlComputeClusterNodeEvent |
| JobId | ID of the Job submitted |
| ExperimentId | ID of the Experiment |
| ExperimentName | Name of the Experiment |
| CustomerSubscriptionId | SubscriptionId where Experiment and Job as submitted |
| WorkspaceName | Name of the machine learning workspace |
| ClusterName | Name of the Cluster |
| ProvisioningState | State of the Job submission |
| ResourceGroupName | Name of the resource group |
| JobName | Name of the Job |
| ClusterId | ID of the cluster |
| EventType | Type of the Job event. For example, JobSubmitted, JobRunning, JobFailed, JobSucceeded. |
| ExecutionState | State of the job (the Run). For example, Queued, Running, Succeeded, Failed |
| ErrorDetails | Details of job error |
| CreationApiVersion | Api version used to create the job |
| ClusterResourceGroupName | Resource group name of the cluster |
| TFWorkerCount | Count of TF workers |
| TFParameterServerCount | Count of TF parameter server |
| ToolType | Type of tool used |
| RunInContainer | Flag describing if job should be run inside a container |
| JobErrorMessage | detailed message of Job error |
| NodeId | ID of the node created where job is running |

### AmlComputeClusterEvents table

| Property | Description |
|:--- |:--- |
| TimeGenerated | Time when the log entry was generated |
| OperationName | Name of the operation associated with the log event |
| Category | Name of the log event, AmlComputeClusterNodeEvent |
| ProvisioningState | Provisioning state of the cluster |
| ClusterName | Name of the cluster |
| ClusterType | Type of the cluster |
| CreatedBy | User who created the cluster |
| CoreCount | Count of the cores in the cluster |
| VmSize | Vm size of the cluster |
| VmPriority | Priority of the nodes created inside a cluster Dedicated/LowPriority |
| ScalingType | Type of cluster scaling manual/auto |
| InitialNodeCount | Initial node count of the cluster |
| MinimumNodeCount | Minimum node count of the cluster |
| MaximumNodeCount | Maximum node count of the cluster |
| NodeDeallocationOption | How the node should be deallocated |
| Publisher | Publisher of the cluster type |
| Offer | Offer with which the cluster is created |
| Sku | Sku of the Node/VM created inside cluster |
| Version | Version of the image used while Node/VM is created |
| SubnetId | SubnetId of the cluster |
| AllocationState | Cluster allocation state |
| CurrentNodeCount | Current node count of the cluster |
| TargetNodeCount | Target node count of the cluster while scaling up/down |
| EventType | Type of event during cluster creation. |
| NodeIdleTimeSecondsBeforeScaleDown | Idle time in seconds before cluster is scaled down |
| PreemptedNodeCount | Preempted node count of the cluster |
| IsResizeGrow | Flag indicating that cluster is scaling up |
| VmFamilyName | Name of the VM family of the nodes that can be created inside cluster |
| LeavingNodeCount | Leaving node count of the cluster |
| UnusableNodeCount | Unusable node count of the cluster |
| IdleNodeCount | Idle node count of the cluster |
| RunningNodeCount | Running node count of the cluster |
| PreparingNodeCount | Preparing node count of the cluster |
| QuotaAllocated | Allocated quota to the cluster |
| QuotaUtilized | Utilized quota of the cluster |
| AllocationStateTransitionTime | Transition time from one state to another |
| ClusterErrorCodes | Error code received during cluster creation or scaling |
| CreationApiVersion | Api version used while creating the cluster |

### AmlComputeClusterNodeEvents table

| Property | Description |
|:--- |:--- |
| TimeGenerated | Time when the log entry was generated |
| OperationName | Name of the operation associated with the log event |
| Category | Name of the log event, AmlComputeClusterNodeEvent |
| ClusterName | Name of the cluster |
| NodeId | ID of the cluster node created |
| VmSize | Vm size of the node |
| VmFamilyName | Vm family to which the node belongs |
| VmPriority | Priority of the node created Dedicated/LowPriority |
| Publisher | Publisher of the vm image. For example, microsoft-dsvm |
| Offer | Offer associated with the VM creation |
| Sku | Sku of the Node/VM created |
| Version | Version of the image used while Node/VM is created |
| ClusterCreationTime | Time when cluster was created |
| ResizeStartTime | Time when cluster scale up/down started |
| ResizeEndTime | Time when cluster scale up/down ended |
| NodeAllocationTime | Time when Node was allocated |
| NodeBootTime | Time when Node was booted up |
| StartTaskStartTime | Time when task was assigned to a node and started |
| StartTaskEndTime | Time when task assigned to a node ended |
| TotalE2ETimeInSeconds | Total time node was active |


## See also

- See [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md) for a description of monitoring Azure Machine Learning.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/insights/monitor-azure-resource.md) for details on monitoring Azure resources.
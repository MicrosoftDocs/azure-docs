---
title: Monitoring data reference | Microsoft Docs
titleSuffix: Azure Machine Learning
description: Learn about the data and resources collected for Azure Machine Learning, and available in Azure Monitor. Azure Monitor collects and surfaces data about your Azure Machine Learning workspace, and allows you to view metrics, set alerts, and analyze logged data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 11/06/2019
---

# Azure machine learning monitoring data reference

Learn about the data and resources collected by Azure Monitor from your Azure Machine Learning workspace. See [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md) for details on collecting and analyzing monitoring data.

## Resource logs

The following table lists the properties for Azure Machine Learning resource logs when they're collected in Azure Monitor Logs or Azure Storage.

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
| EventType | Type of the Job event, e.g., JobSubmitted, JobRunning, JobFailed, JobSucceeded, etc. |
| ExecutionState | State of the job (the Run), e.g., Queued, Running, Succeeded, Failed |
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
| Publisher | Publisher of the vm image, e.g., microsoft-dsvm |
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

### Metrics

The following tables list the platform metrics collected for Azure Machine Learning All metrics are stored in the namespace **Azure Machine Learning Workspace**.

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

The following are dimensions that can be used to filter quota metrics:

| Dimension | Metric(s) available with | Description |
| ---- | ---- | ---- |
| Cluster Name | All quota metrics | The name of the compute instance. |
| Vm Family Name | Quota utilization percentage | The name of the VM family used by the cluster. |
| Vm Priority | Quota utilization percentage | The priority of the VM.

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
| ComputeType | The compute type that the run used. |
| PipelineStepType | The type of [PipelineStep](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinestep?view=azure-ml-py) used in the run. |
| PublishedPipelineId | The ID of the published pipeline used in the run. |
| RunType | The type of run. |

The valid values for the RunType dimension are:

| Value | Description |
| ----- | ----- |
| Experiment | Non-pipeline runs. |
| PipelineRun | A pipeline run, which is the parent of a StepRun. |
| StepRun | A run for a pipeline step. |
| ReusedStepRun | A run for a pipeline step that reuses a previous run. |

## See Also

- See [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md) for a description of monitoring Azure Machine Learning.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resource) for details on monitoring Azure resources.

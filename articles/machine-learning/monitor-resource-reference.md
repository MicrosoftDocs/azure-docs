---
title: Monitor Azure Machine Learning data reference | Microsoft Docs
description: Reference documentation for monitoring Azure Machine Learning. Learn about the data & resources collected and available in Azure Monitor. 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: reference
ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.custom: subject-monitoring engagement-fy23
ms.date: 09/12/2023
---

# Monitoring Azure Machine Learning data reference

Learn about the data and resources collected by Azure Monitor from your Azure Machine Learning workspace. See [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md) for details on collecting and analyzing monitoring data.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Machine Learning. The resource provider for these metrics is [Microsoft.MachineLearningServices/workspaces](../azure-monitor/essentials/metrics-supported.md#microsoftmachinelearningservicesworkspaces).

**Model**

| Metric | Unit | Description |
|--|--|--|
| Model Register Succeeded | Count | Number of model registrations that succeeded in this workspace |
| Model Register Failed | Count | Number of model registrations that failed in this workspace |
| Model Deploy Started | Count | Number of model deployments started in this workspace |
| Model Deploy Succeeded | Count | Number of model deployments that succeeded in this workspace |
| Model Deploy Failed | Count | Number of model deployments that failed in this workspace |

**Quota**

Quota information is for Azure Machine Learning compute only.

| Metric | Unit | Description |
|--|--|--|
| Total Nodes | Count | Number of total nodes. This total includes some of Active Nodes, Idle Nodes, Unusable Nodes, Preempted Nodes, Leaving Nodes |
| Active Nodes | Count | Number of Active nodes. The nodes that are actively running a job. |
| Idle Nodes | Count | Number of idle nodes. Idle nodes are the nodes that are not running any jobs but can accept new job if available. |
| Unusable Nodes | Count | Number of unusable nodes. Unusable nodes are not functional due to some unresolvable issue. Azure will recycle these nodes. |
| Preempted Nodes | Count | Number of preempted nodes. These nodes are the low-priority nodes that are taken away from the available node pool. |
| Leaving Nodes | Count | Number of leaving nodes. Leaving nodes are the nodes that just finished processing a job and will go to Idle state. |
| Total Cores | Count | Number of total cores |
| Active Cores | Count | Number of active cores |
| Idle Cores | Count | Number of idle cores |
| Unusable Cores | Count | Number of unusable cores |
| Preempted Cores | Count | Number of preempted cores |
| Leaving Cores | Count | Number of leaving cores |
| Quota Utilization Percentage | Count | Percent of quota utilized |

**Resource**

| Metric| Unit | Description |
|--|--|--|
| CpuUtilization | Count | Percentage of utilization on a CPU node. Utilization is reported at one-minute intervals. |
| CpuUtilizationPercentage | Count | Utilization percentage of a CPU node. Utilization is aggregated in one minute intervals. |
| CpuUtilizationMillicores | Count | Utilization of a CPU node in millicores. Utilization is aggregated in one minute intervals. |
| CpuCapacityMillicores | Count | Maximum capacity of a CPU node in millicores. Capacity is aggregated in one minute intervals. |
| CpuMemoryCapacityMegabytes | Count | Maximum memory utilization of a CPU node in megabytes. Utilization is aggregated in one minute intervals. |
| CpuMemoryUtilizationMegabytes | Count | Memory utilization of a CPU node in megabytes. Utilization is aggregated in one minute intervals. |
| CpuMemoryUtilizationPercentage | Count | Memory utilization percentage of a CPU node. Utilization is aggregated in one minute intervals. |
| GpuUtilization | Count | Percentage of utilization on a GPU node. Utilization is reported at one-minute intervals. |
| GpuUtilizationPercentage | Count | Utilization percentage of a GPU device. Utilization is aggregated in one minute intervals. |
| GpuUtilizationMilliGPUs | Count | Utilization of a GPU device in milli-GPUs. Utilization is aggregated in one minute intervals. |
| GpuCapacityMilliGPUs | Count | Maximum capacity of a GPU device in milli-GPUs. Capacity is aggregated in one minute intervals. |
| GpuMemoryCapacityMegabytes | Count | Maximum memory capacity of a GPU device in megabytes. Capacity aggregated in at one minute intervals. |
| GpuMemoryUtilization | Count | Percentage of memory utilization on a GPU node. Utilization is reported at one-minute intervals. |
| GpuMemoryUtilizationMegabytes | Count | Memory utilization of a GPU device in megabytes. Utilization aggregated in at one minute intervals.
| GpuMemoryUtilizationPercentage | Count | Memory utilization percentage of a GPU device. Utilization aggregated in at one minute intervals.
| GpuEnergyJoules | Count | Interval energy in Joules on a GPU node. Energy is reported at one-minute intervals. |
| DiskAvailMegabytes | Count | Available disk space in megabytes. Metrics are aggregated in one minute intervals. |
| DiskReadMegabytes | Count | Data read from disk in megabytes. Metrics are aggregated in one minute intervals. |
| DiskUsedMegabytes | Count | Used disk space in megabytes. Metrics are aggregated in one minute intervals. |
| DiskWriteMegabytes | Count | Data written into disk in megabytes. Metrics are aggregated in one minute intervals. |
| IBReceiveMegabytes | Count | Network data received over InfiniBand in megabytes. Metrics are aggregated in one minute intervals. |
| IBTransmitMegabytes | Count | Network data sent over InfiniBand in megabytes. Metrics are aggregated in one minute intervals. |
| NetworkInputMegabytes | Count | Network data received in megabytes. Metrics are aggregated in one minute intervals. |
| NetworkOutputMegabytes | Count | Network data sent in megabytes. Metrics are aggregated in one minute intervals. |



**Run**

Information on training runs for the workspace.

| Metric | Unit | Description |
|--|--|--|
| Cancelled Runs | Count | Number of runs canceled for this workspace. Count is updated when a run is successfully canceled. |
| Cancel Requested Runs | Count | Number of runs where cancel was requested for this workspace. Count is updated when cancellation request has been received for a run. |
| Completed Runs | Count | Number of runs completed successfully for this workspace. Count is updated when a run has completed and output has been collected. |
| Failed Runs | Count | Number of runs failed for this workspace. Count is updated when a run fails. |
| Finalizing Runs | Count | Number of runs entered finalizing state for this workspace. Count is updated when a run has completed but output collection still in progress. | 
| Not Responding Runs | Count | Number of runs not responding for this workspace. Count is updated when a run enters Not Responding state. |
| Not Started Runs | Count | Number of runs in Not Started state for this workspace. Count is updated when a request is received to create a run but run information has not yet been populated. |
| Preparing Runs | Count | Number of runs that are preparing for this workspace. Count is updated when a run enters Preparing state while the run environment is being prepared. |
| Provisioning Runs | Count | Number of runs that are provisioning for this workspace. Count is updated when a run is waiting on compute target creation or provisioning. |
| Queued Runs | Count | Number of runs that are queued for this workspace. Count is updated when a run is queued in compute target. Can occur when waiting for required compute nodes to be ready. |
| Started Runs | Count | Number of runs running for this workspace. Count is updated when run starts running on required resources. |
| Starting Runs | Count | Number of runs started for this workspace. Count is updated after request to create run and run info, such as the Run ID, has been populated |
| Errors | Count | Number of run errors in this workspace. Count is updated whenever run encounters an error. |
| Warnings | Count | Number of run warnings in this workspace. Count is updated whenever a run encounters a warning. |

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure Machine Learning has the following dimensions associated with its metrics.

| Dimension | Description |
| ---- | ---- |
| Cluster Name | The name of the compute cluster resource. Available for all quota metrics. |
| Vm Family Name | The name of the VM family used by the cluster. Available for quota utilization percentage. |
| Vm Priority | The priority of the VM. Available for quota utilization percentage.
| CreatedTime | Only available for CpuUtilization and GpuUtilization. |
| DeviceId | ID of the device (GPU). Only available for GpuUtilization. |
| NodeId | ID of the node created where job is running. Only available for CpuUtilization and GpuUtilization. |
| RunId | ID of the run/job. Only available for CpuUtilization and GpuUtilization. |
| ComputeType | The compute type that the run used. Only available for Completed runs, Failed runs, and Started runs. |
| PipelineStepType | The type of [PipelineStep](/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinestep) used in the run. Only available for Completed runs, Failed runs, and Started runs. |
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

Resource Provider and Type: [Microsoft.MachineLearningServices/workspace](../azure-monitor/essentials/resource-logs-categories.md#microsoftmachinelearningservicesworkspaces).

| Category | Display Name |
| ----- | ----- |
| AmlComputeClusterEvent | AmlComputeClusterEvent |
| AmlComputeClusterNodeEvent (deprecated) | AmlComputeClusterNodeEvent |
| AmlComputeCpuGpuUtilization | AmlComputeCpuGpuUtilization |
| AmlComputeJobEvent | AmlComputeJobEvent |
| AmlRunStatusChangedEvent | AmlRunStatusChangedEvent |
| ModelsChangeEvent | ModelsChangeEvent |
| ModelsReadEvent | ModelsReadEvent |
| ModelsActionEvent | ModelsActionEvent |
| DeploymentReadEvent | DeploymentReadEvent |
| DeploymentEventACI | DeploymentEventACI |
| DeploymentEventAKS | DeploymentEventAKS |
| InferencingOperationAKS | InferencingOperationAKS |
| InferencingOperationACI | InferencingOperationACI |
| EnvironmentChangeEvent | EnvironmentChangeEvent |
| EnvironmentReadEvent | EnvironmentReadEvent |
| DataLabelChangeEvent | DataLabelChangeEvent |
| DataLabelReadEvent | DataLabelReadEvent |
| ComputeInstanceEvent | ComputeInstanceEvent |
| DataStoreChangeEvent | DataStoreChangeEvent |
| DataStoreReadEvent | DataStoreReadEvent |
| DataSetChangeEvent | DataSetChangeEvent |
| DataSetReadEvent | DataSetReadEvent |
| PipelineChangeEvent | PipelineChangeEvent |
| PipelineReadEvent | PipelineReadEvent |
| RunEvent | RunEvent |
| RunReadEvent | RunReadEvent |


## Schemas

The following schemas are in use by Azure Machine Learning

### AmlComputeJobEvent table

| Property | Description |
|:--- |:---|
| TimeGenerated | Time when the log entry was generated |
| OperationName | Name of the operation associated with the log event |
| Category | Name of the log event |
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

### AmlComputeClusterEvent table

| Property | Description |
|:--- |:--- |
| TimeGenerated | Time when the log entry was generated |
| OperationName | Name of the operation associated with the log event |
| Category | Name of the log event |
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

### AmlComputeClusterNodeEvent table

| Property | Description |
|:--- |:--- |
| TimeGenerated | Time when the log entry was generated |
| OperationName | Name of the operation associated with the log event |
| Category | Name of the log event |
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

> [!NOTE]
> Effective February 2022, the AmlComputeClusterNodeEvent table will be deprecated. We recommend that you instead use the AmlComputeClusterEvent table.

### AmlComputeInstanceEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlComputeInstanceEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| CorrelationId | A GUID used to group together a set of related events, when applicable. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlComputeInstanceName | "The name of the compute instance associated with the log entry. |

### AmlDataLabelEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlDataLabelEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| CorrelationId | A GUID used to group together a set of related events, when applicable. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlProjectId | The unique identifier of the Azure Machine Learning project. |
| AmlProjectName | The name of the Azure Machine Learning project. |
| AmlLabelNames | The label class names which are created for the project. |
| AmlDataStoreName | The name of the data store where the project's data is stored. |

### AmlDataSetEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlDataSetEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| AmlWorkspaceId | A GUID and unique ID of the Azure Machine Learning workspace. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlDatasetId | The ID of the Azure Machine Learning Data Set. |
| AmlDatasetName | The name of the Azure Machine Learning Data Set. |

### AmlDataStoreEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlDataStoreEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| AmlWorkspaceId | A GUID and unique ID of the Azure Machine Learning workspace. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlDatastoreName | The name of the Azure Machine Learning Data Store. |

### AmlDeploymentEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlDeploymentEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlServiceName | The name of the Azure Machine Learning Service. |

### AmlInferencingEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlInferencingEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlServiceName | The name of the Azure Machine Learning Service. |

### AmlModelsEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlModelsEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| ResultSignature | The HTTP status code of the event. Typical values include 200, 201, 202 etc. |
| AmlModelName | The name of the Azure Machine Learning Model. |

### AmlPipelineEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlPipelineEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| AmlWorkspaceId | A GUID and unique ID of the Azure Machine Learning workspace. |
| AmlWorkspaceId | The name of the Azure Machine Learning workspace. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlModuleId | A GUID and unique ID of the module.|
| AmlModelName | The name of the Azure Machine Learning Model. |
| AmlPipelineId | The ID of the Azure Machine Learning pipeline. |
| AmlParentPipelineId | The ID of the parent Azure Machine Learning pipeline (in the case of cloning). |
| AmlPipelineDraftId | The ID of the Azure Machine Learning pipeline draft. |
| AmlPipelineDraftName | The name of the Azure Machine Learning pipeline draft. |
| AmlPipelineEndpointId | The ID of the Azure Machine Learning pipeline endpoint. |
| AmlPipelineEndpointName | The name of the Azure Machine Learning pipeline endpoint. |


### AmlRunEvent table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlRunEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| ResultType | The status of the event. Typical values include Started, In Progress, Succeeded, Failed, Active, and Resolved. |
| OperationName | The name of the operation associated with the log entry |
| AmlWorkspaceId | A GUID and unique ID of the Azure Machine Learning workspace. |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| RunId | The unique ID of the run. |

### AmlEnvironmentEvent  table

| Property | Description |
|:--- |:--- |
| Type | Name of the log event, AmlEnvironmentEvent |
| TimeGenerated | Time (UTC) when the log entry was generated |
| Level | The severity level of the event. Must be one of Informational, Warning, Error, or Critical. |
| OperationName | The name of the operation associated with the log entry |
| Identity | The identity of the user or application that performed the operation. |
| AadTenantId | The Microsoft Entra tenant ID the operation was submitted for. |
| AmlEnvironmentName | The name of the Azure Machine Learning environment configuration. |
| AmlEnvironmentVersion | The name of the Azure Machine Learning environment configuration version. |

### AMLOnlineEndpointTrafficLog table (preview)

[!INCLUDE [endpoint-monitor-traffic-reference](includes/endpoint-monitor-traffic-reference.md)]

For more information on this log, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

### AMLOnlineEndpointConsoleLog

[!INCLUDE [endpoint-monitor-console-reference](includes/endpoint-monitor-console-reference.md)]

For more information on this log, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

### AMLOnlineEndpointEventLog (preview)

[!INCLUDE [endpoint-monitor-event-reference](includes/endpoint-monitor-event-reference.md)]

For more information on this log, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).
## See also

- See [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md) for a description of monitoring Azure Machine Learning.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

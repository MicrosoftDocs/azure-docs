---
title: Azure Machine Learning monitoring data reference
description: This article contains important reference material you need when you monitor Azure Machine Learning.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
ms.author: aashishb
author: aashishb
ms.service: machine-learning
ms.subservice: mlops
---

# Azure Machine Learning monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Machine Learning](monitor-azure-machine-learning.md) for details on the data you can collect for Azure Machine Learning and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]
The resource provider for these metrics is Microsoft.MachineLearningServices/workspaces.

The metrics categories are **Model**, **Quota**, **Resource**, **Run**, and **Traffic**. **Quota** information is for Machine Learning compute only. **Run** provides information on training runs for the workspace.

### Supported metrics for Microsoft.MachineLearningServices/workspaces
The following table lists the metrics available for the Microsoft.MachineLearningServices/workspaces resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.MachineLearningServices/workspaces](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-machinelearningservices-workspaces-metrics-include.md)]

### Supported metrics for Microsoft.MachineLearningServices/workspaces/onlineEndpoints
The following table lists the metrics available for the Microsoft.MachineLearningServices/workspaces/onlineEndpoints resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.MachineLearningServices/workspaces/onlineEndpoints](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-machinelearningservices-workspaces-onlineendpoints-metrics-include.md)]

### Supported metrics for Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments
The following table lists the metrics available for the Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-machinelearningservices-workspaces-onlineendpoints-deployments-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]
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

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.MachineLearningServices/registries
[!INCLUDE [Microsoft.MachineLearningServices/registries](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-machinelearningservices-registries-logs-include.md)]

### Supported resource logs for Microsoft.MachineLearningServices/workspaces
[!INCLUDE [Microsoft.MachineLearningServices/workspaces](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-machinelearningservices-workspaces-logs-include.md)]

### Supported resource logs for Microsoft.MachineLearningServices/workspaces/onlineEndpoints
[!INCLUDE [Microsoft.MachineLearningServices/workspaces/onlineEndpoints](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-machinelearningservices-workspaces-onlineendpoints-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
### Machine Learning
Microsoft.MachineLearningServices/workspaces
- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AMLOnlineEndpointConsoleLog](/azure/azure-monitor/reference/tables/AMLOnlineEndpointConsoleLog#columns)
- [AMLOnlineEndpointTrafficLog](/azure/azure-monitor/reference/tables/AMLOnlineEndpointTrafficLog#columns)
- [AMLOnlineEndpointEventLog](/azure/azure-monitor/reference/tables/AMLOnlineEndpointEventLog#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AMLComputeClusterEvent](/azure/azure-monitor/reference/tables/AMLComputeClusterEvent#columns)
- [AMLComputeClusterNodeEvent](/azure/azure-monitor/reference/tables/AMLComputeClusterNodeEvent#columns)
- [AMLComputeJobEvent](/azure/azure-monitor/reference/tables/AMLComputeJobEvent#columns)
- [AMLRunStatusChangedEvent](/azure/azure-monitor/reference/tables/AMLRunStatusChangedEvent#columns)
- [AMLComputeCpuGpuUtilization](/azure/azure-monitor/reference/tables/AMLComputeCpuGpuUtilization#columns)
- [AMLComputeInstanceEvent](/azure/azure-monitor/reference/tables/AMLComputeInstanceEvent#columns)
- [AMLDataLabelEvent](/azure/azure-monitor/reference/tables/AMLDataLabelEvent#columns)
- [AMLDataSetEvent](/azure/azure-monitor/reference/tables/AMLDataSetEvent#columns)
- [AMLDataStoreEvent](/azure/azure-monitor/reference/tables/AMLDataStoreEvent#columns)
- [AMLDeploymentEvent](/azure/azure-monitor/reference/tables/AMLDeploymentEvent#columns)
- [AMLEnvironmentEvent](/azure/azure-monitor/reference/tables/AMLEnvironmentEvent#columns)
- [AMLInferencingEvent](/azure/azure-monitor/reference/tables/AMLInferencingEvent#columns)
- [AMLModelsEvent](/azure/azure-monitor/reference/tables/AMLModelsEvent#columns)
- [AMLPipelineEvent](/azure/azure-monitor/reference/tables/AMLPipelineEvent#columns)
- [AMLRunEvent](/azure/azure-monitor/reference/tables/AMLRunEvent#columns)

Microsoft.MachineLearningServices/registries
- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AmlRegistryReadEventsLog](/azure/azure-monitor/reference/tables/AmlRegistryReadEventsLog#columns)
- [AmlRegistryWriteEventsLog](/azure/azure-monitor/reference/tables/AmlRegistryWriteEventsLog#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

The following table lists some operations related to Machine Learning that may be created in the activity log. For a complete listing of Microsoft.MachineLearningServices operations, see [Microsoft.MachineLearningServices resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices).

| Operation | Description |
|:---|:---|
| Creates or updates a Machine Learning workspace | A workspace was created or updated |
| CheckComputeNameAvailability | Check if a compute name is already in use |
| Creates or updates the compute resources | A compute resource was created or updated |
| Deletes the compute resources | A compute resource was deleted |
| List secrets | On operation listed secrets for a Machine Learning workspace |

## Log schemas

Azure Machine Learning uses the following schemas.

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

<!-- removing as deprecated
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
-->
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

## Related content

- See [Monitor Machine Learning](monitor-azure-machine-learning.md) for a description of monitoring Machine Learning.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

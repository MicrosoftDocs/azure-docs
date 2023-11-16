---
title: Monitor AKS data reference
description: Important reference material needed when you monitor AKS 
ms.custom: subject-monitoring, ignite-2022
ms.date: 08/01/2023
ms.topic: conceptual
---

# Monitor AKS data reference

See [Monitoring AKS](monitor-aks.md) for details on collecting and analyzing monitoring data for AKS.

## Metrics

The following table lists the platform metrics collected for AKS.  Follow each link for a detailed list of the metrics for each particular type.

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Managed clusters | [Microsoft.ContainerService/managedClusters](../azure-monitor/essentials/metrics-supported.md#microsoftcontainerservicemanagedclusters)
| Connected clusters | [microsoft.kubernetes/connectedClusters](../azure-monitor/essentials/metrics-supported.md)
| Virtual machines| [Microsoft.Compute/virtualMachines](../azure-monitor/essentials/metrics-supported.md#microsoftcomputevirtualmachines) |
| Virtual machine scale sets | [Microsoft.Compute/virtualMachineScaleSets](../azure-monitor/essentials/metrics-supported.md#microsoftcomputevirtualmachinescalesets)|
| Virtual machine scale sets virtual machines | [Microsoft.Compute/virtualMachineScaleSets/virtualMachines](../azure-monitor/essentials/metrics-supported.md#microsoftcomputevirtualmachinescalesetsvirtualmachines)|

For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

In addition to the above platform metrics, Azure Monitor Container insights collects [these custom metrics](../azure-monitor/containers/container-insights-custom-metrics.md) for nodes, pods, containers, and persistent volumes.

## Metric dimensions

The following table lists [dimensions](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics) for AKS metrics. 

<!-- listed here /azure/azure-monitor/essentials/metrics-supported#microsoftcontainerservicemanagedclusters-->

| Dimension Name | Description |
| ------------------- | ----------------- |
| requestKind | Used by metrics such as *Inflight Requests* to split by type of request. |
| condition | Used by metrics such as *Statuses for various node conditions*, *Number of pods in Ready state* to split by condition type. |
| status | Used by metrics such as *Statuses for various node conditions* to split by status of the condition. |
| status2 | Used by metrics such as *Statuses for various node conditions* to split by status of the condition.  |
| node | Used by metrics such as *CPU Usage Millicores* to split by the name of the node. |
| phase | Used by metrics such as *Number of pods by phase* to split by the phase of the pod. |
| namespace | Used by metrics such as *Number of pods by phase* to split by the namespace of the pod. |
| pod | Used by metrics such as *Number of pods by phase* to split by the name of the pod. |
| nodepool | Used by metrics such as *Disk Used Bytes* to split by the name of the nodepool. |
| device | Used by metrics such as *Disk Used Bytes* to split by the name of the device. |

## Resource logs

AKS implements control plane logs for the cluster as [resource logs in Azure Monitor.](../azure-monitor/essentials/resource-logs.md). See [Resource logs](monitor-aks.md#resource-logs) for details on creating a diagnostic setting to collect these logs and [Sample queries](monitor-aks-reference.md#resource-logs) for query examples.

The following table lists the resource log categories you can collect for AKS. It also includes the table the logs for each category are sent to when you send the logs to a Log Analytics workspace using [resource-specific mode](../azure-monitor/essentials/resource-logs.md#resource-specific). In [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode), all logs are written to the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table.


| Category | Description | Table<br>(resource-specific mode) |
|:---|:---|:---|
| kube-apiserver          | Logs from the API server. | AKSControlPlane |
| kube-audit              | Audit log data for every audit event including get, list, create, update, delete, patch, and post. | AKSAudit |
| kube-audit-admin        | Subset of the kube-audit log category. Significantly reduces the number of logs by excluding the get and list audit events from the log. | AKSAuditAdmin |
| kube-controller-manager | Gain deeper visibility of issues that may arise between Kubernetes and the Azure control plane. A typical example is the AKS cluster having a lack of permissions to interact with Azure. | AKSControlPlane |
| kube-scheduler          | Logs from the scheduler. | AKSControlPlane |
| cluster-autoscaler       | Understand why the AKS cluster is scaling up or down, which may not be expected. This information is also useful to correlate time intervals where something interesting may have happened in the cluster. | AKSControlPlane |
| cloud-controller-manager | Logs from the cloud-node-manager component of the Kubernetes cloud controller manager.| AKSControlPlane |
| guard                   | Managed Microsoft Entra ID and Azure RBAC audits. For managed Microsoft Entra ID, this includes token in and user info out. For Azure RBAC, this includes access reviews in and out. | AKSControlPlane |
| csi-azuredisk-controller | Logs from the Azure Disk CSI storage driver. | AKSControlPlane |
| csi-azurefile-controller | Logs from the Azure Files CSI storage driver. | AKSControlPlane |
| csi-snapshot-controller | Logs from the Azure CSI driver snapshot controller. | AKSControlPlane |
| AllMetrics              | Includes all platform metrics. Sends these values to Log Analytics workspace where it can be evaluated with other data using log queries. | AzureMetrics |

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md). 

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs tables relevant to AKS and available for query by Log Analytics.

|Resource Type | Notes |
|-------|-----|
| [Kubernetes services](/azure/azure-monitor/reference/tables/tables-resourcetype#kubernetes-services) | Follow this link for a list of all tables used by AKS and a description of their structure. |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

## Activity log

The following table lists a few example operations related to AKS that may be created in the [Activity log](../azure-monitor/essentials/activity-log.md). Use the Activity log to track information such as when a cluster is created or had its configuration change. You can view this information [in the portal](../azure-monitor/essentials/activity-log.md#view-the-activity-log) or by using [other methods](../azure-monitor/essentials/activity-log.md#other-methods-to-retrieve-activity-log-events). You can also use it to create an [Activity log alert]() to be proactively notified when an event occurs.

| Operation | Description |
|:---|:---|
| Microsoft.ContainerService/managedClusters/write | Create or update managed cluster |
| Microsoft.ContainerService/managedClusters/delete | Delete Managed Cluster |
| Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action | List clusterMonitoringUser credential |
| Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List clusterAdmin credential |
| Microsoft.ContainerService/managedClusters/agentpools/write | Create or Update Agent Pool |

For a complete list of possible log entries, see [Microsoft.ContainerService Resource Provider options](../role-based-access-control/resource-provider-operations.md#microsoftcontainerservice).

For more information on the schema of Activity Log entries, see [Activity  Log schema](../azure-monitor/essentials/activity-log-schema.md). 

## See also

- See [Monitoring Azure AKS](monitor-aks.md) for a description of monitoring Azure AKS.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.

---
title: Monitoring AKS data reference
description: Important reference material needed when you monitor AKS 
ms.service: container-service
ms.custom: subject-monitoring
ms.date: 07/07/2021
ms.topic: reference
---

# Monitoring AKS data reference

See [Monitoring AKS](monitor-aks.md) for details on collecting and analyzing monitoring data for AKS.

## Metrics

The following table lists the platform metrics collected for AKS.  Follow each link for a detail list of the metrics for each particular type.

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Managed Clusters | [Microsoft.ContainerService/managedClusters](/azure/azure-monitor/essentials/metrics-supported#microsoftcontainerservicemanagedclusters)
| Connected Clusters | [microsoft.kubernetes/connectedClusters](/azure/azure-monitor/essentials/metrics-supported#microsoftkubernetesconnectedclusters)
| Virtual Machines| [Microsoft.Compute/virtualMachines](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual Machine ScaleSets | [Microsoft.Compute/virtualMachineScaleSets](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachinescalesets)|
| Virtual Machine ScaleSets Virtual Machines | [Microsoft.Compute/virtualMachineScaleSets/virtualMachines](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachinescalesetsvirtualmachines)|

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

The following tables lists [dimensions](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics) for AKS metrics. 

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

The following table lists the resource log categories you can collect for AKS. These are the logs for AKS control plane components. See [Configure monitoring](monitor-aks.md#configure-monitoring) for information on creating a diagnostic setting to collect these logs. See [How to query logs from Container insights](../azure-monitor/containers/container-insights-log-query.md#resource-logs) for query examples.

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema). 

| Category                | Description |
|:---|:---|
| cluster-autoscale       | Understand why the AKS cluster is scaling up or down, which may not be expected. This information is also useful to correlate time intervals where something interesting may have happened in the cluster. |
| guard                   | Managed Azure Active Directory and Azure RBAC audits. For managed Azure AD, this includes token in and user info out. For Azure RBAC, this includes access reviews in and out. |
| kube-apiserver          | Logs from the API server. |
| kube-audit              | Audit log data for every audit event including get, list, create, update, delete, patch, and post. |
| kube-audit-admin        | Subset of the kube-audit log category. Significanly reduces the number of logs by excluding the get and list audit events from the log. |
| kube-controller-manager | Gain deeper visibility of issues that may arise between Kubernetes and the Azure control plane. A typical example is the AKS cluster having a lack of permissions to interact with Azure. |
| kube-scheduler          | Logs from the scheduler. |
| AllMetrics              | Includes all platform metrics. Sends these values to Log Analytics workspace where it can be evaluated with other data using log queries.

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs tables relevant to AKS and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) | Resource logs. Diagnostic settings that sends to Log Analytics workspace is required.  |
| [ContainerImageInventory](/azure/azure-monitor/reference/tables/containerimageinventory) | Inventory of container images and their attributes that were discovered by the agent. |
| [ContainerInventory](/azure/azure-monitor/reference/tables/containerinventory) |Inventory of containers and their attributes that are monitored by the agent. |
| [ContainerLog](/azure/azure-monitor/reference/tables/containerlog) | Log lines collected from stdout and stderr streams for containers. |
| [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2) | Kubernetes Container logs in V2 schema. This is the successor for ContainerLog with a friendlier schema, specifically for kubernetes orchestrated containers in pods. |
| [ContainerNodeInventory](/azure/azure-monitor/reference/tables/containernodeinventory) | Container host and node information. |
| [ContainerServiceLog](/azure/azure-monitor/reference/tables/containerservicelog) | |
| [KubeEvents](/azure/azure-monitor/reference/tables/kubeevents) | Kubernetes events. |
| [KubeHealth](/azure/azure-monitor/reference/tables/kubehealth) | Health states from various health monitors for kubernetes clusters and components. |
| [KubeMonAgentEvents](/azure/azure-monitor/reference/tables/kubemonagentevents) | Events from the Kubernetes cluster monitoring agent. |
| [KubeNodeInventory](/azure/azure-monitor/reference/tables/kubenodeinventory) | Kubernetes cluster's node information. |
| [KubePodInventory](/azure/azure-monitor/reference/tables/kubepodinventory) | Kubernetes cluster's pod and container information. |
| [KubePVInventory](/azure/azure-monitor/reference/tables/kubepvinventory) | Kubernetes persistent volumes and their properties. |
| [KubeServices](/azure/azure-monitor/reference/tables/kubeservices) | Kubernetes services information. |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).


## Activity log

The following table lists a few example operations related to AKS that may be created in the Activity log.

| Operation | Description |
|:---|:---|
| Microsoft.ContainerService/managedClusters/write | Create or Update Managed Cluster |
| Microsoft.ContainerService/managedClusters/delete | Delete Managed Cluster |
| Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action | List clusterMonitoringUser credential |
| Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List clusterAdmin credential |
| Microsoft.ContainerService/managedClusters/agentpools/write | Create or Update Agent Pool |

For a complete list of possible log entires, see [Microsoft.ContainerService Resource Provider options](/azure/role-based-access-control/resource-provider-operations#microsoftcontainerservice).

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## See Also

- See [Monitoring Azure AKS](monitor-aks.md) for a description of monitoring Azure AKS.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.
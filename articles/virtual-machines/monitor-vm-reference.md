---
title: Monitoring Azure virtual machines data reference
description: Important reference material needed when you monitor Azure virtual machines 
ms.service: container-service
ms.custom: subject-monitoring
ms.date: 06/21/2021
ms.topic: reference
---

# Monitoring Azure virtual machines data reference

See [Monitoring Azure virtual machines](monitor-vm.md) for details on collecting and analyzing monitoring data for virtual machines.

## Metrics

This section lists all the automatically collected platform metrics collected for AKS.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Machines| [Microsoft.Compute/virtualMachines](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual Machine ScaleSets | [Microsoft.Compute/virtualMachineScaleSets](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachinescalesets)|
| Virtual Machine ScaleSets Virtual Machines | [Microsoft.Compute/virtualMachineScaleSets/virtualMachines](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachinescalesetsvirtualmachines)|

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

<!-- listed here /azure/azure-monitor/essentials/metrics-supported#microsoftcontainerservicemanagedclusters-->

AKS has the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| LUN | Logical Unit Number |
| VMName | Used by metrics such as *Statuses for various node conditions*, *Number of pods in Ready state* to split by condition type. |
| status | Used by metrics such as *Statuses for various node conditions* to split by status of the condition. |
| status2 | Used by metrics such as *Statuses for various node conditions* to split by status of the condition.  |
| node | Used by metrics such as *CPU Usage Millicores* to split by the name of the node. |
| phase | Used by metrics such as *Number of pods by phase* to split by the phase of the pod. |
| namespace | Used by metrics such as *Number of pods by phase* to split by the namespace of the pod. |
| pod | Used by metrics such as *Number of pods by phase* to split by the name of the pod. |
| nodepool | Used by metrics such as *Disk Used Bytes* to split by the name of the nodepool. |
| device | Used by metrics such as *Disk Used Bytes* to split by the name of the device. |

## Resource logs

This section lists the types of resource logs you can collect for AKS.

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

This section lists all the resource log category types collected for AKS.  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Managed Clusters | [Microsoft.ContainerService/managedClusters](/azure/azure-monitor/essentials/resource-logs-categories#microsoftcontainerservicemanagedclusters) |

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs tables relevant to virtual machines and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| [Virtual machines](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machines) | |
| [Virtual machine scale sets](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

### Diagnostics tables

AKS uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.



## Activity log

The following table lists a few example operations related to virtual machines that may be created in the Activity log.

| Operation | Description |
|:---|:---|
| Microsoft.ContainerService/managedClusters/write | Create or Update Managed Cluster |
| Microsoft.ContainerService/managedClusters/delete | Delete Managed Cluster |
| Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action | List clusterMonitoringUser credential |
| Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List clusterAdmin credential |
| Microsoft.ContainerService/managedClusters/agentpools/write | Create or Update Agent Pool |

For a complete list of possible log entires, see [Microsoft.ContainerService Resource Provider options](/azure/role-based-access-control/resource-provider-operations#microsoftcontainerservice).

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by AKS

resource log schemas

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

- See [Monitoring Azure AKS](../aks/monitor-aks.md) for a description of monitoring Azure AKS.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.
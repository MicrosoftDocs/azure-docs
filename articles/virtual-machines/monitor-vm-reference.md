---
title: 'Reference: Monitoring Azure virtual machine data'
description: This article covers important reference material for monitoring Azure virtual machines.
ms.service: virtual-machines
ms.custom: subject-monitoring
ms.date: 11/17/2021
ms.topic: reference
---

# Reference: Monitoring Azure virtual machine data

For more information about collecting and analyzing monitoring data for Azure virtual machines (VMs), see [Monitoring Azure virtual machines](monitor-vm.md).

## Metrics

This section lists the platform metrics that are collected for Azure virtual machines and virtual machine scale sets.  

| Metric type | Resource provider / type namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual machines | [Microsoft.Compute/virtualMachines](../azure-monitor/essentials/metrics-supported.md#microsoftcomputevirtualmachines) |
| Virtual machine scale sets | [Microsoft.Compute/virtualMachineScaleSets](../azure-monitor/essentials/metrics-supported.md#microsoftcomputevirtualmachinescalesets)|
| Virtual machine scale sets and virtual machines | [Microsoft.Compute/virtualMachineScaleSets/virtualMachines](../azure-monitor/essentials/metrics-supported.md#microsoftcomputevirtualmachinescalesetsvirtualmachines)|
| | |

For more information, see a list of [platform metrics that are supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric dimensions

For more information about metric dimensions, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure virtual machines and virtual machine scale sets have the following dimensions that are associated with their metrics.

| Dimension name | Description |
| ------------------- | ----------------- |
| LUN | Logical unit number |
| VMName | Used with virtual machine scale sets |
| | |

## Azure Monitor Logs tables

This section refers to all the Azure Monitor Logs tables that are relevant to virtual machines and virtual machine scale sets and available for query by Log Analytics. 

|Resource type | Notes |
|-------|-----|
| [Virtual machines](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machines) | |
| [Virtual machine scale sets](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | |
| | |

For reference documentation about Azure Monitor Logs and Log Analytics tables, see the [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

## Activity log

The following table lists a few example operations that relate to creating virtual machines in the activity log. For a complete list of possible log entries, see [Microsoft.Compute Resource Provider options](../role-based-access-control/resource-provider-operations.md#compute).

| Operation | Description |
|:---|:---|
| Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
| Microsoft.Compute/virtualMachines/restart/action | Deletes a managed cluster |
| Microsoft.Compute/virtualMachines/write | Creates a new virtual machine or updates an existing one |
| Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
| Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
| Microsoft.Compute/virtualMachineScaleSets/write | Starts the instances of the virtual machine scale set |
| | |

For more information about the schema of activity log entries, see [Activity log schema](../azure-monitor/essentials/activity-log-schema.md). 


## See also

For a description of monitoring Azure virtual machines, see [Monitoring Azure virtual machines](../virtual-machines/monitor-vm.md).
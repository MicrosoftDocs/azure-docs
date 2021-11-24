---
title: Monitoring Azure Virtual Machines data reference
description: Important reference material needed when you monitor Azure virtual machines.
ms.service: virtual-machines
ms.custom: subject-monitoring
ms.date: 11/17/2021
ms.topic: reference
---

# Monitoring Azure Virtual Machines data reference

See [Monitoring Azure Virtual Machines](monitor-vm.md) for details on collecting and analyzing monitoring data for virtual machines.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Virtual Machines and virtual machine scale sets.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual machine | [Microsoft.Compute/virtualMachines](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual machine scale set | [Microsoft.Compute/virtualMachineScaleSets](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachinescalesets)|
| Virtual machine scale set virtual machines | [Microsoft.Compute/virtualMachineScaleSets/virtualMachines](/azure/azure-monitor/essentials/metrics-supported#microsoftcomputevirtualmachinescalesetsvirtualmachines)|

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).


Azure Virtual Machines and virtual machine scale sets have the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| LUN | Logical Unit Number |
| VMName | Used with virtual machine scale sets. |

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs tables relevant to virtual machines and virtual machine scale sets and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| [Virtual machines](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machines) | |
| [Virtual machine scale sets](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

## Activity log

The following table lists a few example operations related to virtual machines that may be created in the Activity log. For a complete list of possible log entires, see [Microsoft.Compute Resource Provider options](/azure/role-based-access-control/resource-provider-operations#compute).

| Operation | Description |
|:---|:---|
| Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
| Microsoft.Compute/virtualMachines/restart/action | Delete Managed Cluster |
| Microsoft.Compute/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
| Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
| Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
| Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
| Microsoft.Compute/virtualMachines/restart/action | Delete Managed Cluster |
| Microsoft.Compute/virtualMachineScaleSets/write | Starts the instances of the Virtual Machine Scale Set |
| Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
| Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 


## See also

- See [Monitoring Azure Virtual Machines](../virtual-machines/monitor-vm.md) for a description of monitoring Azure virtual machines.

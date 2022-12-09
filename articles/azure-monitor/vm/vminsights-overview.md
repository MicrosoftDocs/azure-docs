---
title: What is VM insights?
description: Overview of VM insights, which monitors the health and performance of Azure VMs and automatically discovers and maps application components and their dependencies. 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2022
---

# Overview of VM insights

VM insights monitors the performance and health of your virtual machines and virtual machine scale sets. It monitors their running processes and dependencies on other resources. VM insights can help deliver predictable performance and availability of vital applications by identifying performance bottlenecks and network issues. It can also help you understand whether an issue is related to other dependencies.

> [!NOTE]
> VM insights now supports [Azure Monitor agent](../agents/azure-monitor-agent-overview.md). For more information, see [Enable VM insights overview](vminsights-enable-overview.md#agents).

VM insights supports Windows and Linux operating systems on:

- Azure virtual machines.
- Azure virtual machine scale sets.
- Hybrid virtual machines connected with Azure Arc.
- On-premises virtual machines.
- Virtual machines hosted in another cloud environment.

VM insights stores its data in Azure Monitor Logs, which allows it to deliver powerful aggregation and filtering and to analyze data trends over time. You can view this data in a single VM from the virtual machine directly. Or, you can use Azure Monitor to deliver an aggregated view of multiple VMs.

![Screenshot that shows the VM insights perspective in the Azure portal.](media/vminsights-overview/vminsights-azmon-directvm.png)

## Pricing

There's no direct cost for VM insights, but you're charged for its activity in the Log Analytics workspace. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), VM insights is billed for:

- Data ingested from agents and stored in the workspace.
- Health state data collected from guest health (preview).
- Alert rules based on log and health data.
- Notifications sent from alert rules.

The log size varies by the string lengths of performance counters. It can increase with the number of logical disks and network adapters allocated to the VM. If you're already using Service Map, the only change you'll see is the extra performance data that's sent to the Azure Monitor `InsightsMetrics` data type.​

## Access VM insights

Access VM insights for all your virtual machines and virtual machine scale sets by selecting **Virtual Machines** from the **Monitor** menu in the Azure portal. To access VM insights for a single virtual machine or virtual machine scale set, select **Insights** from the machine's menu in the Azure portal.

## Configure VM insights

To configure VM insights, follow the steps in each link for detailed guidance:

- [Create a Log Analytics workspace](./vminsights-configure-workspace.md#create-log-analytics-workspace).
- [Add the VMInsights solution to a workspace](./vminsights-configure-workspace.md#add-vminsights-solution-to-workspace) (Log Analytics agent only).
- [Install agents on the virtual machine and virtual machine scale set to be monitored](./vminsights-enable-overview.md).

> [!NOTE]
> VM insights doesn't support sending data to more than one Log Analytics workspace (multi-homing).

## Next steps

See [Deploy VM insights](./vminsights-enable-overview.md) for requirements and methods to enable monitoring for your virtual machines.

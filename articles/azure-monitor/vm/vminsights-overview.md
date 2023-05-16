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

## Who should use VM insights?
VM insights is not required for monitoring your virtual machines in Azure Monitor. You can use other methods to [deploy the Azure Monitor agent](../agents/azure-monitor-agent-manage.md) to your virtual machines, and [create data collection rules](../agents/data-collection-rule-azure-monitor-agent.md) to collect the same performance counters. Even if you use VM insights, you need to create additional data collection rules to collect events from your VMs and to alert on events or performance data.

VM insights provides the following value:

| Feature | Alternative |
|:---|:---|
| List of all your VMs and their monitoring status. Deploy agents for unmonitored machines with a single click. | Use the [AMA Migration Helper](../agents/azure-monitor-agent-migration-tools.md) to view agent installation status and use any of the available methods to [install the Azure Monitor agent](../agents/azure-monitor-agent-manage.md). |
| Automatically created data collection rules with predefined set of performance counters. | Use the Azure portal to [create data collection rules](../agents/data-collection-rule-azure-monitor-agent.md) to collect performance counters. |
| Predefined workbooks that allow you to view trending of collected performance data. | Use [metrics explorer]() to analyze client performance counters or [create your own workbooks](). |
| Collect data to support the [map feature](vminsights-maps.md) that graphically illustrates processes running on your VMs and dependencies between them. | Disable collection of processes and dependencies to lower your data ingestion cost. |


## Pricing

There's no direct cost for VM insights, but you're charged for its activity in the Log Analytics workspace. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), VM insights is billed for:

- Data ingested from agents and stored in the workspace.
- Health state data collected from guest health (preview).
- Alert rules based on log and health data.
- Notifications sent from alert rules.

The log size varies by the string lengths of performance counters. It can increase with the number of logical disks and network adapters allocated to the VM. If you're already using Service Map, the only change you'll see is the extra performance data that's sent to the Azure Monitor `InsightsMetrics` data type.​

## Access VM insights

Access VM insights for all your virtual machines and virtual machine scale sets by selecting **Virtual Machines** from the **Monitor** menu in the Azure portal. To access VM insights for a single virtual machine or virtual machine scale set, select **Insights** from the machine's menu in the Azure portal.

## Limitations

- VM insights doesn't support sending data to multiple Log Analytics workspaces (multi-homing).

## Next steps

- [Enable and configure VM insights](./vminsights-enable-overview.md).
- [Migrate machines with VM insights from Log Analytics agent to Azure Monitor Agent](../vm/vminsights-enable-overview.md#migrate-from-log-analytics-agent-to-azure-monitor-agent).

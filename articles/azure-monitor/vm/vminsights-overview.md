---
title: What is VM insights?
description: Overview of VM insights, which monitors the health and performance of Azure VMs and automatically discovers and maps application components and their dependencies. 
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023
---

# Overview of VM insights

VM insights provides a quick and easy method for getting started monitoring the client workloads on your virtual machines and virtual machine scale sets. It displays an inventory of your existing VMs and provides a guided experience to enable base monitoring for them. It also monitors the performance and health of your virtual machines and virtual machine scale sets by collecting data on their running processes and dependencies on other resources. 

VM insights supports Windows and Linux operating systems on:

- Azure virtual machines.
- Azure virtual machine scale sets.
- Hybrid virtual machines connected with Azure Arc.
- On-premises virtual machines.
- Virtual machines hosted in another cloud environment.

VM insights provides a set of predefined workbooks that allow you to view trending of [collected performance data](vminsights-log-query.md#performance-records) over time. You can view this data in a single VM from the virtual machine directly, or you can use Azure Monitor to deliver an aggregated view of multiple VMs.

:::image type="content" source="media/vminsights-overview/vminsights-azmon-directvm.png" lightbox="media/vminsights-overview/vminsights-azmon-directvm.png" alt-text="Screenshot that shows the VM insights perspective in the Azure portal.":::


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

- VM insights collects a predefined set of metrics from the VM client and doesn't collect any event data. You can use the Azure portal to [create data collection rules](../agents/data-collection-rule-azure-monitor-agent.md) to collect events and additional performance counters using the same Azure Monitor agent used by VM insights.
- VM insights doesn't support sending data to multiple Log Analytics workspaces (multi-homing).

## Next steps

- [Enable and configure VM insights](./vminsights-enable-overview.md).
- [Migrate machines with VM insights from Log Analytics agent to Azure Monitor Agent](../vm/vminsights-enable-overview.md#migrate-from-log-analytics-agent-to-azure-monitor-agent).


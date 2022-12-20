---
title: Monitor virtual machines with Azure Monitor
description: Learn how to use Azure Monitor to monitor the health and performance of virtual machines and their workloads.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor

This scenario describes how to use Azure Monitor to monitor the health and performance of virtual machines and their workloads. It includes collection of telemetry critical for monitoring and analysis and visualization of collected data to identify trends. It also shows you how to configure alerting to be proactively notified of critical issues.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your enterprise Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).

This article introduces the scenario and provides general concepts for monitoring virtual machines in Azure Monitor. If you want to jump right into a specific area, see one of the other articles that are part of this scenario described in the following table.

| Article | Description |
|:---|:---|
| [Enable monitoring](monitor-virtual-machine-configure.md) | Configure Azure Monitor to collect data from your virtual machines, including options for deploying the Azure Monitor agent. |
| [Analyze](monitor-virtual-machine-analyze.md) | Analyze monitoring data collected by Azure Monitor from virtual machines and their guest operating systems and applications to identify trends and critical information. |
| [Alerts](monitor-virtual-machine-alerts.md) | Create alerts to proactively identify critical issues in your monitoring data. |
| [Monitor security](monitor-virtual-machine-security.md) | Discover Azure services for monitoring security of virtual machines. |
| [Monitor workloads](monitor-virtual-machine-workloads.md) | Monitor applications and other workloads running on your virtual machines. |


## Types of machines

This scenario includes monitoring of the following types of machines using Azure Monitor. Many of the processes described here are the same regardless of the type of machine. Considerations for different types of machines are clearly identified where appropriate. The types of machines include:

- Azure virtual machines.
- Azure virtual machine scale sets.
- Hybrid machines, which are virtual machines running in other clouds, with a managed service provider, or on-premises. They also include physical machines running on-premises.

## Layers of monitoring

There are fundamentally four layers to a virtual machine that require monitoring. Each layer has a distinct set of telemetry and monitoring requirements. 

:::image type="content" source="media/monitor-virtual-machines/monitoring-layers.png" alt-text="Diagram that shows monitoring layers." lightbox="media/monitor-virtual-machines/monitoring-layers.png":::

| Layer | Description |
|:---|:---|
| Virtual machine host | The host virtual machine in Azure. Azure Monitor has no access to the host in other clouds but must rely on information collected from the guest operating system. The host can be useful for tracking activity such as configuration changes, and basic alerting such as processor utilization and whether the machine is running. |
| Guest operating system | The operating system running on the virtual machine, which is some version of either Windows or Linux. A significant amount of monitoring data is available from the guest operating system, such as performance data and events. You must install Azure Monitor agent to retrieve this telemetry. |
| Workloads | Workloads running in the guest operating system that support your business applications. These will typically generate performance data and events similar to the operating system that you can retrieve. You must install Azure Monitor agent to retrieve this telemetry. |
| Application | The business application that depends on your virtual machines. This will typically be monitored by APplication insights. |

## Azure Monitor agent
Any monitoring tool like Azure Monitor, requires an agent installed on a machine to collect data from its guest operating system. Azure Monitor uses the [Azure Monitor agent](../agents/agents-overview.md), which supports virtual machines in Azure, other cloud environments, and on-premises. The Azure Monitor agent replaces legacy agents that are still available but should only be used if you require particular functionality not yet available with Azure Monitor agent. Most users will be able to use Azure Monitor without the legacy agents.

The legacy agents include the following:

- [Log Analytics agent](../agents/log-analytics-agent.md): Supports virtual machines in Azure, other cloud environments, and on-premises. Sends data to Azure Monitor Logs. This agent is the same agent used for System Center Operations Manager.
- [Azure Diagnostic extension](../agents/diagnostics-extension-overview.md): Supports Azure Monitor virtual machines only. Sends data to Azure Monitor Metrics, Azure Event Hubs, and Azure Storage.

See [Supported services and features](../agents/agents-overview.md#supported-services-and-features) for the current features supported by Azure Monitor agent. See [Migrate to Azure Monitor Agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md) for details on migrating to the Azure Monitor agent if you already have the Log Analytics agent deployed.

## Data collection rules
[Data collection rules (DCR)](../essentials/data-collection-rule-overview.md) define the data collection process in Azure Monitor. DCRs are stored in your Azure subscription and specify what data should be collected, how to transform that data, and where to send it. 

For virtual machines, DCRs will define the events and performance counters to collect and specify the Log Analytics workspaces that data should be sent to. The DCR can also apply transformations to the data including filtering out unwanted records and adding calculated properties. A single machine can be associated with multiple DCRs, and a single DCR can be associated with multiple machines. DCRs are delivered to any machines they're associated with where they're processed by the Azure Monitor agent.

You should implement a strategy for configuring your DCRs so that they're manageable as your monitoring environment grows in complexity. See [Best practices for data collection rule creation and management in Azure Monitor](data-collection-rule-vm-strategy.md) for guidance on different strategies.

 
## VM insights
[VM insights](../vm/vminsights-overview.md) is a feature in Azure Monitor that allows you to quickly get started monitoring your virtual machines. It provides the following features:

- Simplified onboarding of the Azure Monitor agent to enable monitoring of a virtual machine guest operating system and workloads.
- Preconfigured data collection rule that collects the most common set of performance counters for Windows and Linux.
- Predefined trending performance charts and workbooks that you can use to analyze core performance metrics from the virtual machine's guest operating system.
- Optional collection of details for each virtual machine, the processes running on it, and dependencies with other services.
- Optional dependency map that displays interconnected components with other machines and external sources.

Whether or not you choose to use the performance or map views in VM insights, it's valuable in providing base level performance monitoring and an interface to manage your monitored and unmonitored machines. VM insights also includes a simplified interface for [managing Azure Policy definitions](vminsights-enable-policy.md) to automatically install the agent and enable monitoring on new machines.

By default, VM insights will not enable collection of processes and dependencies to save data ingestion costs. This data is required for the map feature and will also deploy the dependency agent to the machine. [Enable this collection](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent) if you want to use this feature.

## System Center Operations Manager (SCOM)
You may currently use System Center Operations Manager (SCOM) to monitor your virtual machines and their workloads and are starting to consider which monitoring you can move to Azure Monitor. As described in [Azure Monitor for existing Operations Manager customer](../azure-monitor-operations-manager.md), you may continue using SCOM for some period of time until you know longer require the extensive monitoring that SCOM provides.

Use the information in this content to assess the capabilities of Azure Monitor to monitor your virtual machine and determine those machines and workloads that you can migrate from SCOM.


## Next steps

[Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)

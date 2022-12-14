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

This set of articles describes how to use Azure Monitor to monitor the health and performance of virtual machines and their workloads. It includes collection of telemetry critical for monitoring and analysis and visualization of collected data to identify trends. It also shows you how to configure alerting to be proactively notified of critical issues.

> [!NOTE]
> This content describes how to implement complete monitoring of your enterprise Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).

This article introduces the content and provides general concepts for monitoring virtual machines in Azure Monitor. If you want to jump right into a specific area, see one of the other articles that are part of this scenario described in the following table.

| Article | Description |
|:---|:---|
| [Enable monitoring](monitor-virtual-machine-configure.md) | Configure Azure Monitor to collect data from your virtual machines, including options for deploying the Azure Monitor agent. |
| [Analyze](monitor-virtual-machine-analyze.md) | Analyze monitoring data collected by Azure Monitor from virtual machines and their guest operating systems and applications to identify trends and critical information. |
| [Alerts](monitor-virtual-machine-alerts.md) | Create alerts to proactively identify critical issues in your monitoring data. |
| [Monitor security](monitor-virtual-machine-security.md) | Discover Azure services for monitoring security of virtual machines. |
| [Monitor workloads](monitor-virtual-machine-workloads.md) | Monitor applications and other workloads running on your virtual machines. |


## Types of machines

This guidance includes monitoring of the following types of machines using Azure Monitor. Many of the processes described here are the same regardless of the type of machine. Considerations for different types of machines are clearly identified where appropriate. The types of machines include:

- Azure virtual machines.
- Azure virtual machine scale sets.
- Hybrid machines, which are virtual machines running in other clouds, with a managed service provider, or on-premises. They also include physical machines running on-premises.

## Layers of monitoring

There are fundamentally four layers to a virtual machine that require monitoring. Each layer has a distinct set of telemetry and monitoring requirements. 

:::image type="content" source="media/monitor-virtual-machines/monitoring-layers.png" alt-text="Diagram that shows monitoring layers." lightbox="media/monitor-virtual-machines/monitoring-layers.png":::

| Layer | Description |
|:---|:---|
| Virtual machine host | The host virtual machine in Azure. Azure Monitor has no access to the host in other clouds but must rely on information collected from the guest operating system. The host can be useful for tracking activity such as configuration changes, and basic alerting such as processor utilization and whether the machine is running. |
| Guest operating system | The operating system running on the virtual machine, which is some version of either Windows or Linux. A significant amount of monitoring data is available from the guest operating system, such as performance data and events. |
| Workloads | Workloads running in the guest operating system that support your business applications. |
| Application | The business application that depends on your virtual machines. |

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
[VM insights](../vm/vminsights-overview.md) is a feature in Azure Monitor that allows you to quickly get started monitoring your virtual machines. It provides the following advantages:

- Simplified onboarding of the Azure Monitor agent to enable monitoring of a virtual machine guest operating system and workloads.
- Predefined trending performance charts and workbooks that you can use to analyze core performance metrics from the virtual machine's guest operating system.
- Dependency map that displays processes running on each virtual machine and the interconnected components with other machines and external sources.

You may or may not choose to use VM insights to support enterprise-wide monitoring of your virtual machines. Even if you enable it, you'll still need create additional DCRs to collect events and send performance data to Azure Monitor Metrics. You'll also need to configure alert rules since VM insights doesn't provide any alerting.

While VM insights makes it easy to deploy the Azure Monitor agent, you may use Azure Policy instead to have the agent automatically deployed to any new machines. Aside from agent management, your decision will primarily depend on whether you use the performance charts and Map feature of VM insights. If you don't, then you can reduce your monitoring costs by not not enabling VM insights and collecting this additional

The performance charts in VM insights depend on the VM insights DCR that sends client performance data to a Log Analytics workspace. This allows you to use use KQL queries to analyze the data, which is what the performance charts are based on. You may choose to send thr performance data to Azure Metrics either instead of or in addition to the workspace. This saves you the cost of sending data to the workspace and allows you to use metrics explorer and metric alerts with the data.

## SCOM Managed Instance
If you currently use [System Center Operations Manager](/system-center/scom) and are starting your transition into the cloud, then you 


## Next steps

[Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)

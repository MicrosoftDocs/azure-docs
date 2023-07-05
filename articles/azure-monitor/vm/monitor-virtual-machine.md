---
title: Monitor virtual machines with Azure Monitor
description: Learn how to use Azure Monitor to monitor the health and performance of virtual machines and their workloads.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/05/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor

This guide describes how to use Azure Monitor to monitor the health and performance of virtual machines and their workloads. It includes collection of telemetry critical for monitoring and analysis and visualization of collected data to identify trends. It also shows you how to configure alerting to be proactively notified of critical issues.

> [!NOTE]
> This guide describes how to implement complete monitoring of your enterprise Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md).

## Types of machines

This guide includes monitoring of the following types of machines using Azure Monitor. Many of the processes described here are the same regardless of the type of machine. Considerations for different types of machines are clearly identified where appropriate. The types of machines include:

- Azure virtual machines.
- Azure Virtual Machine Scale Sets.
- Hybrid machines, which are virtual machines running in other clouds, with a managed service provider, or on-premises. They also include physical machines running on-premises.

## Layers of monitoring

There are fundamentally four layers to a virtual machine that require monitoring. Each layer has a distinct set of telemetry and monitoring requirements. 

:::image type="content" source="media/monitor-virtual-machines/monitoring-layers.png" alt-text="Diagram that shows monitoring layers." lightbox="media/monitor-virtual-machines/monitoring-layers.png":::

| Layer | Description |
|:---|:---|
| Virtual machine host | The host virtual machine in Azure. Azure Monitor has no access to the host in other clouds but must rely on information collected from the guest operating system. The host can be useful for tracking activity such as configuration changes, and basic alerting such as processor utilization and whether the machine is running. |
| Guest operating system | The operating system running on the virtual machine, which is some version of either Windows or Linux. A significant amount of monitoring data is available from the guest operating system, such as performance data and events. You must install Azure Monitor agent to retrieve this telemetry. |
| Workloads | Workloads running in the guest operating system that support your business applications. These will typically generate performance data and events similar to the operating system that you can retrieve. You must install Azure Monitor agent to retrieve this telemetry. |
| Application | The business application that depends on your virtual machines. This will typically be monitored by Application insights. |

## Configuration steps
The following table lists the different steps for configuration of VM monitoring. Each one links to an article with the detailed description of that configuration step.

| Step | Description |
|:---|:---|
| [Deploy Azure Monitor agent](monitor-virtual-machine-agent.md) | Deploy the Azure Monitor agent to your Azure and hybrid virtual machines to collect data from the guest operating system and workloads. |
| [Configure data collection](monitor-virtual-machine-data-collection.md)) | Create data collection rules to instruct the Azure Monitor agent to collect telemetry from the guest operating system. |
| [Analyze collect data](monitor-virtual-machine-analyze.md) | Analyze monitoring data collected by Azure Monitor from virtual machines and their guest operating systems and applications to identify trends and critical information. |
| [Create alert rules](monitor-virtual-machine-alerts.md) | Create alerts to proactively identify critical issues in your monitoring data. |
| [Migrate management pack logic](monitor-virtual-machine-management-packs.md) | General guidance for translation the logic from your System Center Operations Manager management packs to Azure Monitor. |

 
## VM insights
[VM insights](../vm/vminsights-overview.md) is a feature in Azure Monitor that allows you to quickly get started monitoring your virtual machines. While it's not required to take advantage of most Azure Monitor features for monitoring your VMs, it provides the following value:

- Simplified onboarding of the Azure Monitor agent to enable monitoring of a virtual machine guest operating system and workloads.
- Preconfigured data collection rule that collects the most common set of performance counters for Windows and Linux.
- Predefined trending performance charts and workbooks that you can use to analyze core performance metrics from the virtual machine's guest operating system.
- Optional collection of details for each virtual machine, the processes running on it, and dependencies with other services.
- Optional dependency map that displays interconnected components with other machines and external sources.

The articles in this guide provide guidance on configuring VM insights and using the data it collects with other Azure Monitor features. They also identify alternatives if you choose not to use VM insights.


## Security monitoring
Azure Monitor focuses on operational data, while security monitoring in Azure is performed by other services such as [Microsoft Defender for Cloud](../../defender-for-cloud/index.yml) and [Microsoft Sentinel](../../sentinel/index.yml). Configuration of these services is not included in this guide.

> [!IMPORTANT]
> The security services have their own cost independent of Azure Monitor. Before you configure these services, refer to their pricing information to determine your appropriate investment in their usage.

The following table lists the integration points for Azure Monitor with the security services. All the services use the same Azure Monitor agent, which reduces complexity because there are no other components being deployed to your virtual machines. Defender for Cloud and Microsoft Sentinel store their data in a Log Analytics workspace so that you can use log queries to correlate data collected by the different services. Or you can create a custom workbook that combines security data and availability and performance data in a single view.

See [Design a Log Analytics workspace architecture](../logs/workspace-design.md) for guidance on the most effective workspace design for your requirements taking into account all your services that use them.

| Integration point       | Azure Monitor | Microsoft<br>Defender for Cloud | Microsoft<br>Sentinel | Microsoft<br>Defender for Endpoint |
|:---|:---:|:---:|:---:|:---:|
| Collects security events     | X<sup>1</sup> | X | X | X |
| Stores data in Log Analytics workspace | X | X | X |   | 
| Uses Azure Monitor agent     | X | X | X | X | 

<sup>1</sup> Azure Monitor agent can collect security events but will send them to the [Event table](/azure/azure-monitor/reference/tables/event) with other events. Microsoft Sentinel provides additional features to collect and analyze these events.

> [!IMPORTANT]
> Azure Monitor agent is in preview for some service features. See [Supported services and features](../agents/agents-overview.md#supported-services-and-features) for current details.


## Next steps

[Deploy the Azure Monitor agent to your virtual machines](monitor-virtual-machine-agent.md)
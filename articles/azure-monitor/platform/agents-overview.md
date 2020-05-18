---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring virtual machines hosted in Azure or hybrid environment.
services: azure-monitor

ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/14/2020
---

# Overview of Azure Monitor agents

Virtual machines and other compute resources require an agent to collect monitoring data to measure the performance and availability of their guest operating system and workloads. This article describes the agents used by Azure Monitor and helps you determine which you need to meet the requirements for your particular environment.

> [!NOTE]
> Azure Monitor currently has multiple agents because of recent consolidation of Azure Monitor and Log Analytics. While there may be overlap in their features, each has unique capabilities. Depending on your requirements, you may need one or more of the agents on your virtual machines. 

You may have a specific set of requirements that can't be completely met with a single agent for a particular virtual machine. For example, you may want to use metric alerts which requires Azure diagnostics extension but also want to leverage the functionality of Azure Monitor for VMs which requires the Log Analytics agent and the Dependency agent. In cases such as this, you can use multiple agents, and this is a common scenario for customers who require functionality from each.

## Summary of agents

The following tables provide a quick comparison of the Azure Monitor agents for Windows and Linux. Further detail on each is provided in the section below. 

### Windows agents

| | Diagnostics<br>extension (WAD) | Log Analytics<br>agent | Dependency<br>agent |
|:---|:---|:---|:---|
| Environments supported | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises | 
| Agent requirements  | None | None | Requires Log Analytics agent |
| Data collected | Event Logs<br>ETW events<br>Performance<br>File based logs<br>IIS logs<br>.NET app logs<br>Crash dumps<br>Agent diagnostics logs | Event Logs<br>Performance<IIS logs><br>File based logs<br>Insights and solutions<br>Other services | Process details and dependencies<br>Network connection metrics |
| Data sent to | Azure Storage<br>Azure Monitor Metrics<br>Event Hub | Azure Monitor Logs | Azure Monitor Logs |


### Linux agents

| | Diagnostics<br>extension (LAD) | Telegraf<br>agent | Log Analytics<br>agent | Dependency<br>agent |
|:---|:---|:---|:---|:---|
| Environments supported | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises |
| Agent requirements  | None | None | None | Requires Log Analytics agent |
| Data collected | Syslog<br>Performance | Performance | Syslog<br>Performance| Process details and dependencies<br>Network connection metrics |
| Data sent to | Azure Storage<br>Event Hub | Azure Monitor Metrics | Azure Monitor Logs | Azure Monitor Logs |

## Log Analytics agent

The [Log Analytics agent](log-analytics-agent.md) collects monitoring data from the guest operating system and workloads of virtual machines in Azure, other cloud providers, and on-premises. It collects data into a Log Analytics workspace. The Log Analytics agent is the same agent used by System Center Operations Manager, and you can multihome agent computers to communicate with your management group and Azure Monitor simultaneously. This agent is also required by certain insights and solutions in Azure Monitor.


> [!NOTE]
> The Log Analytics agent for Windows is often referred to as Microsoft Monitoring Agent (MMA). The Log Analytics agent for Linux is often referred to as OMS agent.



Use the Log Analytics agent if you need to:

* Collect logs and performance data from virtual or physical machines outside of Azure. 
* Send data to a Log Analytics workspace to take advantage of features supported by [Azure Monitor Logs](data-platform-logs.md#what-can-you-do-with-azure-monitor-logs) such as [log queries](../log-query/log-query-overview.md).
* Use [Azure Monitor for VMs](../insights/vminsights-overview.md) which allows you to monitor your virtual machines at scale and monitors their processes and dependencies on other resources and external processes..  
* Manage the security of your virtual machines using [Azure Security Center](../../security-center/security-center-intro.md)  or [Azure Sentinel](../../sentinel/overview.md).
* Use [Azure Automation Update management](../../automation/automation-update-management.md), [Azure Automation State Configuration](../../automation/automation-dsc-overview.md), or [Azure Automation Change Tracking and Inventory](../../automation/change-tracking.md) to deliver comprehensive management of your Azure VMs
* Use different [solutions](../monitor-reference.md#insights-and-core-solutions) to monitor a particular service or application.

Limitations of the Log Analytics agent include:

- Cannot send data to Azure Monitor Metrics, Azure Storage, or Azure Event Hubs.

## Azure diagnostics extension

The [Azure Diagnostics extension](diagnostics-extension-overview.md) collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources. It primarily collects data into Azure Storage but also allows you to define data sinks to also send data to other destinations such as Azure Monitor Metrics and Azure Event Hubs.

Use Azure diagnostic extension if you need to:

- Send data to Azure Storage for archiving or to analyze it with tools such as [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).
- Send data to [Azure Monitor Metrics](data-platform-metrics.md) to analyze it with [metrics explorer](metrics-getting-started.md) and to take advantage of features such as near real-time [metric alerts](../../azure-monitor/platform/alerts-metric-overview.md) and [autoscale](autoscale-overview.md) (Windows only).
- Send data to third-party tools using [Azure Event Hubs](diagnostics-extension-stream-event-hubs.md).
- Collect [Boot Diagnostics](../../virtual-machines/troubleshooting/boot-diagnostics.md) to investigate VM boot issues.

Limitations of Azure diagnostics extension include:

- Can only be used with Azure resources.
- Limited ability to send data to Azure Monitor Logs.

## Telegraf agent

The [InfluxData Telegraf agent](collect-custom-metrics-linux-telegraf.md) is used to collect performance data from Linux computers to Azure Monitor Metrics.

Use Telegraf agent if you need to:

* Send data to [Azure Monitor Metrics](data-platform-metrics.md) to analyze it with [metrics explorer](metrics-getting-started.md) and to take advantage of features such as near real-time [metric alerts](../../azure-monitor/platform/alerts-metric-overview.md) and [autoscale](autoscale-overview.md) (Linux only). 



## Dependency agent

The Dependency agent collects discovered data about processes running on the virtual machine and external process dependencies. 

Use the Dependency agent if you need to:

* Use the Map feature [Azure Monitor for VMs](../insights/vminsights-overview.md) or the [Service Map](../insights/service-map.md) solution.

Consider the following when using the Dependency agent:

- The Dependency agent requires the Log Analytics agent to be installed on the same virtual machine.
- On Linux VMs, the Log Analytics agent must be installed before the Azure Diagnostic Extension.

## Extensions compared to agents

The Log Analytics extension for [Windows](../../virtual-machines/extensions/oms-windows.md) and [Linux](../../virtual-machines/extensions/oms-linux.md) install the Log Analytics agent on Azure virtual machines. The Azure Monitor Dependency extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) and [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) install the Dependency agent on Azure virtual machines. These are the same agents described above but allow you to manage them through [virtual machine extensions](../../virtual-machines/extensions/overview.md). You should use extensions to install and manage the agents whenever possible.


## Next steps

Get more details on each of the agents at the following:

- [Overview of the Log Analytics agent](log-analytics-agent.md)
- [Azure Diagnostics extension overview](diagnostics-extension-overview.md)
- [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](collect-custom-metrics-linux-telegraf.md)

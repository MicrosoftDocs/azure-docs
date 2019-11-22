---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring virtual machines hosted in Azure or hybrid environment.
services: azure-monitor
ms.service: azure-monitor
ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/15/2019
---


# Overview of the Azure Monitor agents 
Compute resources such as virtual machines generate data to monitor their performance and availability just like [other cloud resources](../insights/monitor-azure-resource.md). Compute resources though also have a guest operating system and workloads that need to be monitored. Collecting this monitoring data from inside the resource requires an agent. This article describes the agents used by Azure Monitor and helps you determine which you need to meet the requirements for your particular environment.

## Summary of agents

> [!NOTE]
> Azure Monitor currently has multiple agents because of recent consolidation of Azure Monitor and Log Analytics. Both agents share some capabilities while other features are unique to a particular agent. Depending on your requirements, you may need one of the agents or both. 

Azure Monitor has three agents that each provide specific functionality. Depending on your requirements, you may install a single agent or multiple on your virtual machines and other compute resources.

* [Azure Diagnostics extension](#azure-diagnostic-extension)
* [Log Analytics agent](#log-analytics-agent)
* [Dependency agent](#dependency-agent)

The following table provides a quick comparison of the different agents. See the rest of this article for details on each.

| | Azure Diagnostic Extension | Log Analytics agent | Dependency agent |
|:---|:---|:---|:---|
| Environments supported | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises |
| Operating systems | Windows<br>Linux | Windows<br>Linux | Windows<br>Linux
| Agent dependencies  | None | None | Requires Log Analytics agent |
| Data collected | Event Logs<br>ETW events<br>Syslog<br>Performance<br>IIS logs<br>.NET app tracing output logs<br>Crash dumps | Event Logs<br>Syslog<br>Performance<br>IIS logs<br>Custom logs<br>Data from solutions | Process details and dependencies<br>Network connection metrics |
| Data sent to | Azure Storage<br>Azure Monitor Metrics<br>Event Hub | Azure Monitor Logs | Azure Monitor Logs |



## Azure Diagnostic extension
The [Azure Diagnostics extension](../../azure-monitor/platform/diagnostics-extension-overview.md) collects monitoring data from the guest operating system and workloads of Azure compute resources. It primarily collects data into Azure Storage. You can configure Azure Monitor to copy the data from storage to a Log Analytics workspace. You can also collect guest performance data into Azure Monitor Metrics.

Azure Diagnostic Extension is often referred to as the Windows Azure Diagnostic (WAD) or Linux Azure Diagnostic (LAD) extension.


### Scenarios supported

Scenarios supported by the Azure Diagnostics extension include the following:

* Collect logs and performance data from Azure compute resources.
* Archive logs and performance data from the guest operating system to Azure storage.
* View monitoring data in storage using a tool such as [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).
* Collect performance data in a metrics database to take advantage of features supported by [Azure Monitor Metrics](data-platform-metrics.md) such as near real-time [metric alerts](../../azure-monitor/platform/alerts-metric-overview.md) and [autoscale](autoscale-overview.md). 
* Collect monitoring data from [storage to a Log Analytics workspace](azure-storage-iis-table.md) to take advantage of features supported by [Azure Monitor Logs](data-platform-logs.md#what-can-you-do-with-azure-monitor-logs) such as [log queries](../log-query/log-query-overview.md).
* Send monitoring data to third-party tools using [Azure Event Hubs](diagnostics-extension-stream-event-hubs.md).
* Investigate VM boot issues with [Boot Diagnostics](../../virtual-machines/troubleshooting/boot-diagnostics.md).
* Copy data from applications running in your VM [to Application Insights](diagnostics-extension-to-application-insights.md) to integrate with other application monitoring.

## Log Analytics agent
The [Log Analytics agent](log-analytics-agent.md) collects monitoring data from the guest operating system and workloads of virtual machines in Azure, other cloud providers, and on-premises. It collects data into a Log Analytics workspace.

The Log Analytics agent is the same agent used by System Center Operations Manager, and you multihome agent computers to communicate with your management group and Azure Monitor simultaneously. This agent is also required by certain solutions in Azure Monitor.

The Log Analytics agent for Windows is often referred to as Microsoft Management Agent (MMA). The Log Analytics agent for Linux is often referred to as OMS agent.


### Scenarios supported

Scenarios supported by the Log Analytics agent include the following:

* Collect logs and performance data from virtual machines in Azure, other cloud providers, and on-premises. 
* Collect monitoring data to a Log Analytics workspace to take advantage of features supported by [Azure Monitor Logs](data-platform-logs.md#what-can-you-do-with-azure-monitor-logs) such as [log queries](../log-query/log-query-overview.md).
* Use Azure Monitor monitoring solutions such as [Azure Monitor for VMs](../insights/vminsights-overview.md), [Azure Monitor for containers](../insights/container-insights-overview.md), etc.  
* Manage the security of your virtual machines using  [Azure Sentinel](../../sentinel/overview.md) which requires the Log Analytics agent.
* Manage the security of your virtual machines using  [Azure Security Center](../../security-center/security-center-intro.md) which requires the Log Analytics agent.
* Use features of [Azure Automation](../../automation/automation-intro.md) to deliver comprehensive management of your Azure VMs through their lifecycle.  Examples of these features that require the Log Analytics agent include:
  * [Azure Automation Update management](../../automation/automation-update-management.md) of operating system updates.
  * [Azure Automation State Configuration](../../automation/automation-dsc-overview.md) to maintain consistent configuration state.
  * Track configuration changes with [Azure Automation Change Tracking and Inventory](../../automation/change-tracking.md).

## Dependency agent
The Dependency agent collects discovered data about processes running on the virtual machine and external process dependencies. This agent is required for [Service Map](../insights/service-map.md) and the Map feature [Azure Monitor for VMs](../insights/vminsights-overview.md). The Dependency agent requires the Log Analytics agent and writes data to a Log Analytics workspace in Azure Monitor.


## Using multiple agents
You may have specific requirements to use either the Azure Diagnostic Extension or Log Analytics agent for a particular virtual machine. For example, you may want to use metric alerts which requires Azure Diagnostic Extension. But you may also want to use the Map feature of Azure Monitor for VMs which requires the Dependency agent and the Log Analytics agent. In this case, you can use multiple agents, and this is a common scenario for customers who require functionality from each.

### Considerations

- The Dependency agent requires the Log Analytics agent to be installed on the same virtual machine.
- On Linux VMs, the Log Analytics agent must be installed before the Azure Diagnostic Extension.


## Next steps

- See [Overview of the Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md) to review requirements and supported methods to deploy the agent to machines hosted in Azure, in your datacenter, or other cloud environment.


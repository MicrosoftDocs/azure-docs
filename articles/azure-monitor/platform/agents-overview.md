---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring virtual machines hosted in Azure or hybrid environment.
services: azure-monitor
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: magoedte
---

# Overview of the Azure Monitor agents 
Compute resources such as virtual machines generate data to monitor their performance and availability just like other cloud resources. Compute resources though also have a guest operating system running workloads that need to be monitored. Collecting this monitoring data from inside the resource requires an agent. This article describes the agents used by Azure Monitor and helps you determine which you need to meet the requirements for your particular environment.

## Summary of agents

> [!NOTE]
> Azure Monitor currently has multiple agents is because of recent consolidation of services. Each agent has unique capabilities so you may use one or multiple depending on your requirements. We are working to simplify the configuration required to provide all monitoring capabilities.

Azure Monitor has three agents that each provide specific functionality. Depending on your requirements, you may install a single agent or multiple on your virtual machines and other compute resources.

* [Azure Diagnostics extension](az#are-diagnostic-extension)
* [Log Analytics agent](#log-analytics-agent)
* [Dependency agent](#dependency-agent)

The following table provides a quick comparison of the different agents. See the rest of this article for details on each.

| | Azure Diagnostic Extension | Log Analytics agent | Dependency agent |
|:---|:---|:---|:---|
| Environments supported | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises |
| Operating Systems | Windows<br>Linux | Windows<br>Linux | Windows<br>Linux
| Agent dependencies  | None | None | Requires Log Analytics agent |
| Data collected | Event Logs<br>ETW events<br>Syslog<br>Performance<br>IIS logs<br>.NET app tracing output logs<br>Crash dumps | Event Logs<br>Syslog<br>Performance<br>IIS logs<br>Custom logs | Process details and dependencies |
| Data stored in | Azure Monitor Logs | Azure Monitor Metrics<br>Azure Storage | Azure Monitor Logs |




## Azure Diagnostic extension
The [Azure Diagnostics extension](../../azure-monitor/platform/diagnostics-extension-overview.md) is often referred to as the Windows Azure Diagnostic (WAD) or Linux Azure Diagnostic (LAD) extension. This agent is available for Azure compute resources such as virtual machines and collects guest monitoring data into Azure Storage and Azure Monitor Metrics.

 Once in storage, you choose to view with one of several available tools, such as [Server Explorer in Visual Studio](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage) and [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).

You can choose to collect:

* A predefined set of operating system performance counters and event logs, or you can specify which to collect. 
* All requests and/or failed requests to an IIS web server
* .NET app tracing output logs
* Event tracing for Windows (ETW) events 
* Collect log events from syslog  
* Crash dumps 

The Azure Diagnostics agent should be used when you want to:

* Archive logs and metrics to Azure storage
* Integrate monitoring data with third-party tools. These tools use a variety of methods including querying the storage account, forwarded to [Event Hubs](../../event-hubs/event-hubs-about.md), or querying with the [Azure Monitoring REST API](../../azure-monitor/platform/rest-api-walkthrough.md)
* Upload data to Azure Monitor to create metric charts in the Azure portal or create near real-time [metric alerts](../../azure-monitor/platform/alerts-metric-overview.md). 
* Autoscale virtual machine scale sets and Classic Cloud Services based on guest OS metrics.
* Investigate VM boot issues with [Boot Diagnostics](../../virtual-machines/troubleshooting/boot-diagnostics.md).
* Understand how your applications are performing and proactively identifies issues affecting them with [Application Insights](../../azure-monitor/overview.md).
* Configure Azure Monitor to import metrics and log data collected from Cloud Services, classic VMs, and Service Fabric nodes stored in an Azure storage account.

## Log Analytics agent
For advanced monitoring where you need to do more than collect metrics and a subset of logs, the Log Analytics agent for Windows (also referred to as the Microsoft Monitoring Agent (MMA)) and Linux is required. The Log Analytics agent was developed for comprehensive management across on-premises physical and virtual machines, computers monitored by System Center Operations Manager, and VMs in hosted in other clouds. The Windows and Linux agents connect to a Log Analytics workspace in Azure Monitor to collect both monitoring solution-based data as well as custom data sources that you configure.

The Log Analytics agent should be used when you want to:

* Collect data from a variety of sources both within Azure, other cloud providers, and on-premises resources. 
* Use one of the Azure Monitor monitoring solutions such as [Azure Monitor for VMs](../insights/vminsights-overview.md), [Azure Monitor for containers](../insights/container-insights-overview.md), etc.  
* Use one of the other Azure management services such as [Azure Security Center](../../security-center/security-center-intro.md), [Azure Automation](../../automation/automation-intro.md), etc.

Previously, several Azure services were bundled as the *Operations Management Suite*, and as a result the Log Analytics agent is shared across services including Azure Security Center and Azure Automation.  This includes the full set of features they offer, delivering comprehensive management of your Azure VMs through their lifecycle.  Some examples of this are:

* [Azure Automation Update management](../../automation/automation-update-management.md) of operating system updates.
* [Azure Automation Desired State Configuration](../../automation/automation-dsc-overview.md) to maintain consistent configuration state.
* Track configuration changes with [Azure Automation Change Tracking and Inventory](../../automation/change-tracking.md).
* Azure services such as [Application Insights](https://docs.microsoft.com/azure/application-insights/) and [Azure Security Center](https://docs.microsoft.com/azure/security-center/), which natively store their data directly in Log Analytics.  

## Dependency agent
The Dependency agent was developed as part of the Service Map solution, which was not originally developed by Microsoft. [Service Map](../insights/service-map.md) and [Azure Monitor for VMs](../insights/vminsights-overview.md) requires a Dependency Agent on Windows and Linux virtual machines and it integrates with the Log Analytics agent to collect discovered data about processes running on the virtual machine and external process dependencies. It stores this data in a Log Analytics workspace and visualizes the discovered interconnected components.

You may need some combination of these agents to monitor your VM. The agents can be installed side by side as Azure extensions, however on Linux, the Log Analytics agent *must* be installed first or else installation will fail. 

## Next steps

- See [Overview of the Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md) to review requirements and supported methods to deploy the agent to machines hosted in Azure, in your datacenter, or other cloud environment.


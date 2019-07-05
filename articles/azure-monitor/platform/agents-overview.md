---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring virtual machines hosted in Azure or hybrid environment.
services: azure-monitor
documentationcenter: azure-monitor
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

# Overview of the Azure monitoring agents 
Microsoft Azure provides multiple ways to collect different types of data from virtual machines running Microsoft Windows and Linux hosted in Azure, your datacenter, or other cloud providers. The three types of agents available to monitor a VM are:

* Azure Diagnostics extensions
* Log Analytics Agent for Linux and Windows
* Dependency agent

This article describes the differences between them and their capabilities in order for you to determine which one will support your IT service management or general monitoring requirements.  

## Azure Diagnostic extension
The [Azure Diagnostics extension](../../azure-monitor/platform/diagnostics-extension-overview.md) (commonly referred to as the Windows Azure Diagnostic (WAD) or Linux Azure Diagnostic (LAD) extension), which has been provided for Azure Cloud Services since it became generally available in 2010, is an agent that delivers simple collection of diagnostic data from an Azure compute resource like a VM, and persist it to Azure storage. Once in storage, you choose to view with one of several available tools, such as [Server Explorer in Visual Studio](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage) and [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).

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

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]

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


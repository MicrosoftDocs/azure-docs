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
ms.devlang: na
ms.topic: conceptual
ms.date: 11/12/2018
ms.author: magoedte
---

# Overview of the Azure monitoring agents 
Microsoft Azure provides multiple ways to collect different types of data from Virtual Machines hosted in Azure or other cloud providers running Microsoft Windows and Linux. This article will help describe the differences and capabilities available with each agent in order for you to determine which one will support your service management or general monitoring requirements.  

## Comparing Azure Diagnostic, Log Analytics, and Dependency agent
Today in Azure, there are three types of agents available to monitor an Azure VM - the Azure Diagnostics extension, the Dependency agent, and Log Analytics Agent for Linux and Windows.  Fundamentally, the Azure Dependency extension and Log Analytics agents are designed to collect metrics and logs, and forward to a repository. However, that's where their similarities end.  

The [Azure Diagnostics extension](../monitoring-and-diagnostics/azure-diagnostics.md) (commonly referred to as the Windows Azure Diagnostic (WAD) or Linux Azure Diagnostic (LAD extension), which has been provided for Azure Cloud Services since it became generally available in 2010, is an agent that delivers simple collection of diagnostic data from an Azure compute resource like a VM, and persist it to Azure storage. Once in storage, you chose to view with one of several available tools, such as [Server Explorer in Visual Studio](/visualstudio/azure/vs-azure-tools-storage-resources-server-explorer-browse-manage) and [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

You can choose to collect:

* A predefined set of operating system performance counters and event logs, or you can specify which to collect. 
* All requests and/or failed requests to an IIS web server
* .NET app tracing output logs
* Event tracing for Windows (ETW) events 
* Collect log events from syslog  
* Crash dumps 

The Azure Diagnostics agent should be used when:

* You want to archive logs and metrics to Azure storage
* Integrate monitoring data with third-party tools. These tools use a variety of methods including querying the storgae account, forwarded to [Event Hub](../event-hubs/event-hubs-about.md), or querying with the [Azure Monitoring REST API](../monitoring-and-diagnostics/monitoring-rest-api-walkthrough.md)
* Upload data to Azure Monitor to create metric charts in the Azure portal or create near real-time [metric alerts](..monitoring-and-diagnostics/alert-metric-overview.md). 
* Autoscale virtual machine scale sets and Classic Cloud Services based on guest OS metrics.
* Investigate VM boot issues with [Boot Diagnostics](../virtual-machines/troubleshooting/boot-diagnostics.md).
* Understand how your applications are performing and proactively identifies issues affecting them with [Application Insights](../azure-monitor/overview.md).
* Configure Log Analytics to import metrics and log data collected from Cloud Services, classic VMs, and Service Fabric nodes stored in an Azure storage account.

For advanced monitoring where you need more than collecting metrics and a subset of logs, the Log Analytics agent for Windows and Linux is required. The Log Analytics agent was developed for comprehensive management across on-premises physical and virtual machines, computers monitored by System Center Operations Manager, and VMs in hosted in other clouds. The Windows and Linux agents connect to a Log Analytics workspace to collect both monitoring solution-based data as well as custom data sources that you configure.

[!INCLUDE [log-analytics-agent-note](../../includes/log-analytics-agent-note.md)]

The Log Analytics agent should be used when:

* You have machines running on-premises or other cloud environment
* Using one of the Azure Monitor monitoring solutions such as [Azure Monitor for VMs](../monitoring/monitoring-vminsights-overview.md?toc=%2fazure%2fmonitoring%2ftoc.json), [Azure Monitor for containers](../monitoring/monitoring-container-insights-overview.md?toc=%2fazure%2fmonitoring%2ftoc.json), etc.  
* Using one of the other Azure management services such as [Azure Security Center](../security-center/security-center-intro.md), [Azure Automation](../automation/automation-intro.md), etc.
* Uploading log and/or metric data to Azure Monitor.

Previously, several Azure services were bundled as the *Operations Management Suite*, and as a result the Log Analytics agent is shared across services including Azure Security Center and Azure Automation.  This includes the full set of features they offer, delivering comprehensive management of your Azure VMs through their lifecycle. This includes:

* [Azure Automation Update management](../automation/automation-update-management.md) of operating system updates.
* [Azure Automation Desired State Configuration](../automation/automation-dsc-overview.md) to maintain consistent configuration state.
* Track configuration changes with [Azure Automation Change Tracking and Inventory](../automation/automation-change-tracking.md).
* Collection of custom logs from OS and hosted applications such as [FluentD](../log-analytics/log-analytics-data-sources-json.md), [custom logs](../log-analytics/log-analytics-data-sources-custom-logs.md), [MySQL and Apache](../log-analytics/log-analytics-data-sources-linux-applications.md) with Log Analytics.
* Azure services such as [Application Insights](https://docs.microsoft.com/azure/application-insights/) and [Azure Security Center](https://docs.microsoft.com/azure/security-center/) natively store their data directly in Log Analytics.  

## Dependency agent
The Dependency agent was developed as part of the Service Map solution, which was originally developed externally from Microsoft. [Service Map](../monitoring/monitoring-service-map.md) and [Azure Monitor for VMs](monitoring-vminsights-overview.md) requires a Dependency Agent on Windows and Linux virtual machines and it integrates with the Log Analytics agent to collects discovered data about processes running on the virtual machine and external process dependencies. It stores this data in Log Analytics and visualizes the discovered interconnected components.

You may need some combination of these agents to monitor your VM. The agents can be installed side-by-side as Azure extensions, however on Linux, the Log Analytics agent *must* be installed first or else installation will fail. 

## Next steps

See [Overview of the Log Analytics agent](../log-analytics/log-analytics-agent-overview.md) to review requirements and supported methods to deploy the agent to machines hosted in Auzre, in your datacenter, or other cloud environment.


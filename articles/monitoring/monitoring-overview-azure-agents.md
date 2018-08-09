---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring Azure VMs.   
services: log-analytics
documentationcenter: log-analytics
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2018
ms.author: magoedte
---

# Overview of the Azure agents to monitor Azure Virtual Machines
Microsoft Azure provides multiple ways to collect different types of data from Virtual Machines hosted in Azure or other cloud providers running Microsoft Windows and Linux.  This article will help describe the differences and capabilities available with each agent in order for you to determine which one will support your service management or general monitoring requirements.  

## Comparing Azure Diagnostic and Log Analytics agent
Today in Azure, there are two types of agents available to monitor an Azure VM - the Azure Diagnostics extension and Log Analytics Agent for Linux and Windows.  Fundamentally, these agents are designed to collect metrics and logs, and forward to a repository. However, that's where their similarities end.  

The [Azure Diagnostics extension](../monitoring-and-diagnostics/azure-diagnostics.md), which has been provided for Azure Cloud Services since it became generally available in 2010, is an agent that delivers simple collection of diagnostic data from an Azure IaaS resource like a VM, and persist it to Azure storage.  Once in storage, you chose to view with one of several available tools, such as [Server Explorer in Visual Studio](../vs-azure-tools-storage-resources-server-explorer-browse-manage.md) and [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

You can choose to collect:

* A predefined set of operating system performance counters and event logs, or you can specify which to collect. 
* All requests and/or failed requests to an IIS web server
* .NET app tracing output logs
* Event tracing for Windows (ETW) events 
* Collect log events from syslog  
* Crash dumps 

Data can be alternatively forwarded to [Application Insights](../application-insights/app-insights-cloudservices.md), [Log Analytics](../log-analytics/log-analytics-overview.md), or to non-Azure services using [Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md). 

For advanced monitoring where you need more than collecting metrics and a subset of logs, the Log Analytics agent for Windows and Linux is required.  With this agent, you are able to utilize Azure services such as Automation and Log Analytics, including the full set of features they offer, to deliver comprehensive management of your Azure VMs through their lifecycle. This includes:

* [Azure Automation Update management](../automation/automation-update-management.md) of operating system updates
* [Azure Automation Desired State Configuration](../automation/automation-dsc-overview.md) to maintain consistent configuration state
* Track configuration changes with [Azure Automation Change Tracking and Inventory](../automation/automation-change-tracking.md)
* Collection of custom logs from OS and hosted applications such as [FluentD](../log-analytics/log-analytics-data-sources-json.md), [custom logs](../log-analytics/log-analytics-data-sources-custom-logs.md), [MySQL and Apache](../log-analytics/log-analytics-data-sources-linux-applications.md) with Log Analytics
* Azure services such as [Application Insights](https://docs.microsoft.com/azure/application-insights/) and [Azure Security Center](https://docs.microsoft.com/azure/security-center/) natively store their data directly in Log Analytics.  

## Next steps

- See [Collect data from computers in your environment with Log Analytics](../log-analytics/log-analytics-concept-hybrid.md) to review requirements and available methods to deploy the agent to computers in your datacenter or other cloud environment.
- See [Collect data about Azure Virtual Machines](../log-analytics/log-analytics-quick-collect-azurevm.md) to configure data collection from Azure VMs. 
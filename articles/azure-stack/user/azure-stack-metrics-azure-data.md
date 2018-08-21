---
title: Azure monitor on Azure Stack | Microsoft Docs
description: Learn about Azure monitor on Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/28/2018
ms.author: mabrigg

---

# Azure monitor on Azure Stack

Applies to: Azure Stack integrated systems and Azure Stack Development Kit.

This article provides an overview of the Azure Monitor service in Azure Stack. It discusses what Azure Monitor does and provides pointers to additional information on how to use Azure Monitor on Azure Stack. 

> [!Note]  
Metrics and Diagnostic logs are not available for development kit

## Prerequisite

You should register **Microsoft.insights** providers on your subscription's offer resource providers settings. `Is there any existing guides on how Azure user should perform this kind of the ops?`

## Overview

Just like what Azure Monitor does on Azure, Azure Monitor on Azure Stack also provides base-level infrastructure metrics and logs for most services in Microsoft Azure. Azure services that do not yet put their data into Azure Monitor will put it there in the future.

## Azure monitor sources: compute subset

[Image1]

The Compute services here in Azure Stack include:
 - Virtual Machines 
 - Virtual Machines scale sets  `we don't have metrics for VMSS yet.`

### Application - Diagnostics logs, Application logs, and Metrics

Applications can run on top of the Guest OS in the compute model. They emit their own set of logs and metrics. Azure Monitor relies on the Azure diagnostics extension (Windows or Linux) to collect most application level metrics and logs. The types include:
 - Performance counters
 - Application Logs
 - Windows Event Logs
 - .NET Event Source
 - IIS Logs
 - Manifest based ETW
 - Crash Dumps
 - Customer Error Logs

> [!Note]  
> Linux Diagnostics extension on Azure Stack is not yet supported (TBD)

### Host and Guest VM metrics

The previously listed compute resources have a dedicated host VM and guest OS they interact with. The host VM and guest OS are the equivalent of root VM and guest VM in the Hyper-V hypervisor model. You can collect metrics on both. You can also collect diagnostics logs on the guest OS. (Vita: although we can have guest Agent to collect metrics/logs, Azure will do differently, they will VM guest metrics into MDM and OBO) A list of collectable metrics for Host and Guest VM metrics on Azure Stack are available at supported metrics(TBA: [Supported metrics with Azure Monitor on Azure Stack](azure-stack-metrics-supported.md)). 

### Activity log

You can search the activity logs for information about your compute resources as seen by the Azure Stack infrastructure. The log contains information such as times when resources are created or destroyed. The Activity logs on Azure Stack is consistent with Azure.  For more information, see the description of [Activity log overview on Azure](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs). 


## Azure monitor sources: everything else

[Image 2]

### Resources - Metrics and Diagnostics logs

Collectable metrics and diagnostics logs vary based on the resource type. A list of collectable metrics for each resource on Azure Stack is available at supported metrics(TBA: Supported metrics with Azure Monitor on Azure Stack). (Vita: this should be another link for logs when we have any)

### Activity log
The activity log is the same as for compute resources. 

### Uses for monitoring data
Store and Archive 
Some monitoring data is already stored and available in Azure Monitor for a set amount of time. 
 - Metrics are stored for 90 days. 
 - Activity log entries are stored for 90 days. 
 - Diagnostics logs are not stored at all. (Vita: this is confused, should be store upon resource diagnostic setting, and we don't have any resource supports this yet)
Archive the data to storage account longer (Vita: shorter is not supported neither) than the time period listed above is not support yet on Azure Stack. 

**Query**
You can use the Azure Monitor REST API, cross platform Command-Line Interface (CLI) commands, PowerShell cmdlets, or the .NET SDK to access the data in the system or Azure storage. 

**Virtualize**

Visualizing your monitoring data in graphics and charts helps you find trends quicker than looking through the data itself. 

A few visualization methods include:
 - Use the Azure Stack user's and admin portal
 - Route data to Microsoft Power BI - TBD
 - Route the data to a third-party visualization tool using either live streaming or by having the tool read from an archive in Azure storage - TBD

## Methods of accessing Azure monitor on Azure Stack

In general, you can manipulate data tracking, routing, and retrieval using one of the following methods. Not all methods are available for all actions or data types.
 - [Azure Stack Portal](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-use-portal)
 - [PowerShell](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-powershell-samples)
 - [Cross-platform Command Line Interface(CLI)](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-cli-samples)
 - [REST API](https://docs.microsoft.com/rest/api/monitor)
 - [.NET SDK](http://www.nuget.org/packages/Microsoft.Azure.Management.Monitor)

## Next steps

Learn more about 
 - Options of the monitoring data consumption on Azure Stack
 - [Consume monitoring data from Azure Stack](azure-stack-metrics-monitor.md)

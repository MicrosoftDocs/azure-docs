# Retirement of classic deployment model APIs for metrics and autoscale

Azure Monitor currently offers the capability to create and manage autoscale settings and consume metrics from classic VMs and classic Cloud Services using a set of classic deployment model (ASM) based APIs. These APIs will be **retired after June 30, 2019** in the Azure public cloud and all sovereign clouds (government and China) for all regions.  Azure Monitor was formerly named *Azure Insights* when these APIs were introduced.

The same operations have been supported through a set of Azure Resource Manager based APIs for over a year. The Azure portal uses the new REST APIs for both autoscale and metrics. A new SDK, PowerShell, and CLI based on these Resource Manager APIs are also available. Our partner services for monitoring also consume the new ARM based REST APIs in Azure Monitor.  

## Who is affected 

### Managing Autoscale
If you are directly calling the classic autoscale settings APIs from your custom-built tools or through the legacy Azure Insights .NET SDK, please migrate to use the new Resource Manager Azure Monitor REST API for managing autoscale settings. 

## Older Azure Insights SDK
If you are using our classic Azure Insights SDK, please plan to switch over to using the new Azure Monitor SDK (.NET & Java). 

### Consuming Metrics
If you are using the classic Azure Insights SDK or ASM/classic REST APIs directly from custom-built tools to consume metrics, you should switch to using the new ARM Azure Monitor REST API for consuming metrics.  
 

## Who is not affected 

If you are managing autoscale via the Azure portal, the new Azure Monitor SDK, PowerShell, CLI or Resource Manager templates, no action is necessary.  

If you are consuming metrics via the Azure portal or via various partner services, no action is necessary. We will also work with remaining monitoring partners to complete their migration to the new APIs. 


## Why should you make the switch 

All the existing capabilities for Autoscale and metrics will continue to work via the new APIs.  

Migrating over to new APIs come with Resource Manager based capabilities such as support for consistent Role Based Access Control (RBAC) across all your monitoring services. You will also gain additional functionaly for metrics including support for dimensions, consistent 1-minute metric granularities across all services, better querying capabilities and higher data retention (3 months of metrics vs. initial 30 days). Overall, like all other services in Azure, the Resource Manager based Azure Monitor APIs come with better performance, scalability and reliability. 

 
## What happens if you do not migrate 

### Before retirement 
There will not be any direct impact to your Azure services or their workloads, though you will have access to the added functionality describes previously. 

### After retirement 
If your custom-built tool tries to use the classic API to manage autoscale or query metrics after the retirement date, the operation will fail returning an error message such as the following: 

For autoscale:
*This API has been deprecated. Please use the Azure portal, Azure Monitor SDK, PowerShell, CLI or ARM templates to manage Autoscale Settings*.  

For metrics: 
*This API has been deprecated. Please use the Azure portal, Azure Monitor SDK, PowerShell, CLI to query for metrics*. 

 
## Specific APIs are being retired   

The list of classic APIs beING deprecated are documented here: 
- [Autoscaling](https://msdn.microsoft.com/en-us/library/azure/mt348562.aspx) 
- [Metrics](https://msdn.microsoft.com/en-us/library/azure/dn510374.aspx)   

  
## Am I using retired APIs? 

If you are unsure whether your code or custom tools are calling the classic APIs to be retired, review URI referenced in your code or tool.

**Being retired**
Classic APIs use the URI https://management.core.windows.net. 

**Newest**
The URI for the Resource Manager based APIs begins with https://management.azure.com/. 


## Email Notificatons
This notification was sent to email addresses for the following account roles: 
- account and service administrators 
- co-administrators.  
 

## References 

- REST APIs for Azure Monitor:  https://docs.microsoft.com/en-us/rest/api/monitor/  
- New SDK for Azure Monitor: [.NET](https://github.com/azure/azure-libraries-for-net) & Java 

If you have any questions, please contact us at MonitorClassicAPIhelp@microsoft.com.  


 

Azure Monitor Team 

 ---
title: "Get started with roles, permissions, and security with Azure Monitor"
description: Learn how to use Azure Monitor's built-in roles and permissions to restrict access to monitoring resources.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 10/27/2017
ms.author: johnkem
ms.component: ""
---
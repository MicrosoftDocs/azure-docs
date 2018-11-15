# Retirement of classic deployment model APIs for metrics and autoscale

Azure Monitor (formerly Azure Insights when first released) currently offers the capability to create and manage autoscale settings for and consume metrics from classic VMs and classic Cloud Services. The original set of classic deployment model-based APIs will be **retired after June 30, 2019** in all Azure public and private clouds in all regions.   

The same operations have been supported through a set of Azure Resource Manager based APIs for over a year. The Azure portal uses the new REST APIs for both autoscale and metrics. A new SDK, PowerShell, and CLI based on these Resource Manager APIs are also available. Our partner services for monitoring consume the new Resource Manager based REST APIs in Azure Monitor.  

## Who is affected 

This article applies to you in the following cases:

- **Older Azure Insights SDK** - If you're using our classic Azure Insights SDK, move to use the new Azure Monitor SDK for .NET or Java located [TODO LINK HERE](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor). 
- **Classic Azure Insights .NET SDK** - If you're directly managing autoscale settings or consuming metrics using this SDK, you should switch to use the newer [Resource Manager Azure Monitor REST API](https://docs.microsoft.com/en-us/rest/api/monitor/). 
- **Azure classic deployment model APIs** - If you're directly managing autoscale settings or consuming metrics using these APIs, you should switch to use the newer Resource Manager [Azure Monitor REST API](https://docs.microsoft.com/en-us/rest/api/monitor/).  

    The classic APIs being deprecated are documented here: 
    - [Autoscaling](https://msdn.microsoft.com/en-us/library/azure/mt348562.aspx) 
    - [Metrics](https://msdn.microsoft.com/en-us/library/azure/dn510374.aspx)     
- **Code or custom tools using retired APIs** - If you are unsure whether your code or custom tools are calling the classic APIs, review URI referenced in your code or tool. The classic APIs use the URI https://management.core.windows.net. You should change to use the URI for the Resource Manager based APIs, which will always begin with https://management.azure.com/.  

 

## Who is not affected 

If you are managing autoscale via the Azure portal, the new Azure Monitor SDK, PowerShell, CLI, or Resource Manager templates, no action is necessary.  

If you are consuming metrics via the Azure portal or via various partner services, no action is necessary. We will also work with remaining monitoring partners to complete their migration to the new APIs. 


## Why should you make the switch 

All the existing capabilities for autoscale and metrics will continue to work via the new APIs.  

Migrating over to newer APIs come with Resource Manager based capabilities, such as support for consistent Role-Based Access Control (RBAC) across all your monitoring services. You also gain additional functionality for metrics: 
- support for dimensions
- consistent 1-minute metric granularities across all services 
- better querying capabilities
- higher data retention (93 days of metrics vs. 30 days) 

Overall, like all other services in Azure, the Resource Manager based Azure Monitor APIs come with better performance, scalability, and reliability. 

 
## What happens if you do not migrate 

### Before retirement 
There will not be any direct impact to your Azure services or their workloads.  

### After retirement 
Any calls to the classic APIs listed previously will fail and return error messages similar to the following ones:   

For autoscale:
*This API has been deprecated. Use the Azure portal, Azure Monitor SDK, PowerShell, CLI, or Resource Manager templates to manage Autoscale Settings*.  

For metrics: 
*This API has been deprecated. Use the Azure portal, Azure Monitor SDK, PowerShell, CLI to query for metrics*. 

 

## Email Notifications
This notification was sent to email addresses for the following account roles: 
- account and service administrators 
- coadministrators.  
 

## References 

- REST APIs for Azure Monitor:  https://docs.microsoft.com/en-us/rest/api/monitor/  
- New SDK for Azure Monitor: [.NET](https://github.com/azure/azure-libraries-for-net) & Java 

If you have any questions, contact us at MonitorClassicAPIhelp@microsoft.com.  


 

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
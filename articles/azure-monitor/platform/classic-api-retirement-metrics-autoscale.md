---
title: Retire deployment APIs for Azure Monitor metrics and autoscale
description: Metrics and autoscale classic APIs, also called Azure Service Management (ASM) or RDFE deployment model being retired
ms.subservice: 
ms.topic: conceptual
ms.date: 11/19/2018

---

# Azure Monitor retirement of classic deployment model APIs for metrics and autoscale

Azure Monitor (formerly Azure Insights when first released) currently offers the capability to create and manage autoscale settings for and consume metrics from classic VMs and classic Cloud Services. The original set of classic deployment model-based APIs will be **retired after June 30, 2019** in all Azure public and private clouds in all regions.   

The same operations have been supported through a set of Azure Resource Manager based APIs for over a year. The Azure portal uses the new REST APIs for both autoscale and metrics. A new SDK, PowerShell, and CLI based on these Resource Manager APIs are also available. Our partner services for monitoring consume the new Resource Manager based REST APIs in Azure Monitor.  

## Who is not affected

If you are managing autoscale via the Azure portal, the [new Azure Monitor SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/), PowerShell, CLI, or Resource Manager templates, no action is necessary.  

If you are consuming metrics via the Azure portal or via various [monitoring partner services](../../azure-monitor/platform/partners.md), no action is necessary. Microsoft is working with monitoring partners to migrate to the new APIs.

## Who is affected

This article applies to you if you are using the following components:

- **Classic Azure Insights SDK** - If you're using the [classic Azure Insights SDK](https://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Monitoring/),  switch to using the new Azure Monitor SDK for [.NET](https://github.com/azure/azure-libraries-for-net#download) or [Java](https://github.com/azure/azure-libraries-for-java#download). Download the [Azure Monitor SDK NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/).

- **Classic Autoscale** - If you're calling the [classic autoscale settings APIs](https://msdn.microsoft.com/library/azure/mt348562.aspx) from your custom-built tools or using the [classic Azure Insights SDK](https://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Monitoring/), you should switch to using the [Resource Manager Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/autoscalesettings).

- **Classic Metrics** - If you're consuming metrics using the [classic REST APIs](https://msdn.microsoft.com/library/azure/dn510374.aspx) or  [classic Azure Insights SDK](https://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Monitoring/) from custom-built tools, you should switch to using the [Resource Manager Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/autoscalesettings). 

If you're unsure whether your code or custom tools are calling the classic APIs, look at the following:

- Review the URI referenced in your code or tool. The classic APIs use the URI https://management.core.windows.net. You should be using the newer URI for the Resource Manager based APIs begins with `https://management.azure.com/`.

- Compare the assembly name on your machine. The older classic assembly is  at  https://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Monitoring/.

- If you're using certificate authentication to access metrics or autoscale APIs, you are using a classic endpoint and library. The newer Resource Manager APIs require Azure Active Directory authentication via a service principal or user principal.

- If you're using calls referenced in the documentation at any of the following links, you are using the older classic APIs.

  - [Windows.Azure.Management.Monitoring Class Library](https://docs.microsoft.com/previous-versions/azure/dn510414(v=azure.100))

  - [Monitoring (classic) .NET](https://docs.microsoft.com/previous-versions/azure/reference/mt348562(v%3dazure.100))

  - [IMetricOperations Interface](https://docs.microsoft.com/previous-versions/azure/reference/dn802395(v%3dazure.100))

## Why you should switch

All the existing capabilities for autoscale and metrics will continue to work via the new APIs.  

Migrating over to newer APIs come with Resource Manager based capabilities, such as support for consistent Role-Based Access Control (RBAC) across all your monitoring services. You also gain additional functionality for metrics: 

- support for dimensions
- consistent 1-minute metric granularity across all services 
- better querying
- higher data retention (93 days of metrics vs. 30 days) 

Overall, like all other services in Azure, the Resource Manager based Azure Monitor APIs come with better performance, scalability, and reliability. 

## What happens if you do not migrate

### Before retirement

There will not be any direct impact to your Azure services or their workloads.  

### After retirement

Any calls to the classic APIs listed previously will fail and return error messages similar the following ones:

For autoscale:
*This API has been deprecated. Use the Azure portal, Azure Monitor SDK, PowerShell, CLI, or Resource Manager templates to manage Autoscale Settings*.  

For metrics: 
*This API has been deprecated. Use the Azure portal, Azure Monitor SDK, PowerShell, CLI to query for metrics*.

## Email notifications

A retirement notification was sent to email addresses for the following account roles: 

- Account and service administrators
- Coadministrators  

If you have any questions, contact us at MonitorClassicAPIhelp@microsoft.com.  

## References

- [Newer REST APIs for Azure Monitor](https://docs.microsoft.com/rest/api/monitor/) 
- [Newer Azure Monitor SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Monitor/)

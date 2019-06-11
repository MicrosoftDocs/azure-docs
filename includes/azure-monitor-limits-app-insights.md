---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.topic: "include"
ms.date: 02/07/2019
ms.author: robb
ms.custom: "include file"
---

#### Autoscale

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Autoscale settings |100 per region per subscription. | Same as default. |

#### Alerts

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Metric alerts (classic) |100 active alert rules per subscription. | Call support. |
| Metric alerts |1000 active alert rules per subscription (in public clouds) and 100 active alert rules per subscription in Azure China and Azure Government. | Call support. |
| Activity log alerts | 100 active alert rules per subscription. | Same as default. |
| Log alerts | 512 | Call support. |
| Action groups |2,000 action groups per subscription. | Call support. |

#### Action groups

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Azure app push | 10 Azure app actions per action group. | Call support. |
| Email | 1,000 email actions in an action group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | Call support. |
| ITSM | 10 ITSM actions in an action group. | Call support. | 
| Logic app | 10 logic app actions in an action group. | Call support. |
| Runbook | 10 runbook actions in an action group. | Call support. |
| SMS | 10 SMS actions in an action group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | Call support. |
| Voice | 10 voice actions in an action group. Also see the [rate limiting information](../articles/azure-monitor/platform/alerts-rate-limiting.md). | Call support. |
| Webhook | 10 webhook actions in an action group.  Maximum number of webhook calls is 1500 per minute per subscription. Other limits are available at [action-specific information](../articles/azure-monitor/platform/action-groups.md#action-specific-information).  | Call support. |


#### Log Analytics workspaces
The following limits apply to each Log Analytics workspace in the current consumption-based pricing tier introduced in April 2018:

|     | Per GB 2018 |
| --- | --- | 
| Data volume collected per day | No limit |
| Data retention period | 30 to 730 days<sup>1</sup> |

The following limits apply to each Log Analytics workspace with the most recent legacy pricing tiers:

|  | Free | Standalone (Per GB) | Per Node (OMS) |
| --- | --- | --- | --- | --- | --- |--- |
| Data volume collected per day |500 MB<sup>2</sup> |No limit |No limit |
| Data retention period |7 days | 30 to 730 days<sup>1</sup> | 30 to 730 days<sup>1</sup> |

The following limits apply to each Log Analytics workspace with the oldest legacy pricing tiers:

|  | Standard | Premium | 
| --- | --- | --- | --- | --- | --- |--- |
| Data volume collected per day | No limit | No limit | 
| Data retention period |30 days | 365 days |

<sup>1</sup>Data retention beyond 31 days is available for additional charges. Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

<sup>2</sup>When your workspace reaches the 500-MB daily data transfer limit, data analysis stops and resumes at the start of the next day. A day is based on UTC.

>[!NOTE]
>Depending on how long you've been using Log Analytics, you might have access to legacy pricing tiers. Learn more about [Log Analytics legacy pricing tiers](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#legacy-pricing-tiers). 
>

The following limits apply to Log Analytics workspaces per subscription.

| Pricing tier    | Number of workspaces per subscription | Comments
| --- | --- | --- |
| Free tier  | 10 | This limit can't be increased. |
| All tiers other than Free | N/A | You're limited by the number of resources within a resource group and the number of resource groups per subscription. | 

You cannot create new Log Analytics workspaces in the following regions:

| Region | Explanation |
|:---|:---|
| 

The following limits apply to Log Analytics in the Azure portal:
| Category | Limits | Comments
| --- | --- | --- |
| Maximum records returned by a log query | 10,000 | Reduce results using query scope, time range, and filters in the query. |

The following limits apply to the Log Analytics APIs:

| Category | Limits | Comments
| --- | --- | --- |
| Data Collector API | Maximum size for a single post is 30 MB.<br>Maximum size for field values is 32 KB. | Split larger volumes into multiple posts.<br>Fields longer than 32 KB are truncated. |
| Search API | 5,000 records returned for non-aggregated data.<br>500,000 records for aggregated data.<br>64,000,000 bytes (~61 MiB)<br>Query cannot run longer than 10 minutes. | Aggregated data is a search that includes the `summarize` command.<br>See [Timeouts](https://dev.loganalytics.io/documentation/Using-the-API/Timeouts) for details on query timeouts.  |


#### Application Insights
There are some limits on the number of metrics and events per application, that is, per instrumentation key. Limits depend on the [pricing plan](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

| Resource | Default limit | Note
| --- | --- | --- |
| Total data per day | 100 GB | You can reduce data by setting a cap. If you need more data, you can increase the limit in the portal, up to 1,000 GB. For capacities greater than 1,000 GB, send email to AIDataCap@microsoft.com.
| Throttling | 32,000 events/second | The limit is measured over a minute.
| Data retention | 90 days | This resource is for [Search](../articles/azure-monitor/app/diagnostic-search.md), [Analytics](../articles/azure-monitor/app/analytics.md), and [Metrics Explorer](../articles/azure-monitor/app/metrics-explorer.md).
| [Availability multi-step test](../articles/azure-monitor/app/monitor-web-app-availability.md#multi-step-web-tests) detailed results retention | 90 days | This resource provides detailed results of each step.
| Maximum event size | 64,000 |
| Property and metric name length | 150 | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| Property value string length | 8,192 | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| Trace and exception message length | 32,768  | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| [Availability tests](../articles/azure-monitor/app/monitor-web-app-availability.md) count per app | 100 |
| [Profiler](../articles/azure-monitor/app/profiler.md) data retention | 5 days |
| [Profiler](../articles/azure-monitor/app/profiler.md) data sent per day | 10 GB |

For more information, see [About pricing and quotas in Application Insights](../articles/azure-monitor/app/pricing.md).
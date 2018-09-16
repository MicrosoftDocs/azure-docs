---
title: include file
description: include file
services: application-insights
author: mrbullwinkle
ms.service: application-insights
ms.topic: include
ms.date: 06/21/2018
ms.author: mbullwin
ms.custom: include file
---

There are some limits on the number of metrics and events per application (that is, per instrumentation key). Limits depend on the [pricing plan](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

| Resource | Default limit | Note
| --- | --- | --- |
| Total data per day | 100 GB | You can reduce data by setting a cap. If you need more data, you can increase the limit in the portal, up to 1,000 GB. For capacities greater than 1,000 GB, send mail to AIDataCap@microsoft.com.
| Throttling | 32 K events/second | The limit is measured over a minute.
| Data retention | 90 days | This resource is for [Search](../articles/application-insights/app-insights-diagnostic-search.md), [Analytics](../articles/application-insights/app-insights-analytics.md), and [Metrics Explorer](../articles/application-insights/app-insights-metrics-explorer.md).
| [Availability multi-step test](../articles/application-insights/app-insights-monitor-web-app-availability.md#multi-step-web-tests) detailed results retention | 90 days | This resource provides detailed results of each step.
| Maximum event size | 64 K | 
| Property and metric name length | 150 | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| Property value string length | 8,192 | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| Trace and exception message length | 10 K | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| [Availability tests](../articles/application-insights/app-insights-monitor-web-app-availability.md) count per app | 100 |
| [Profiler](../articles/application-insights/app-insights-profiler.md) data retention | 5 days |
| [Profiler](../articles/application-insights/app-insights-profiler.md) data sent per day | 10 GB |

For more information, see [About pricing and quotas in Application Insights](../articles/application-insights/app-insights-pricing.md).
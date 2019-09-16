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

There are some limits on the number of metrics and events per application, that is, per instrumentation key. Limits depend on the [pricing plan](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

| Resource | Default limit | Note
| --- | --- | --- |
| Total data per day | 100 GB | You can reduce data by setting a cap. If you need more data, you can increase the limit in the portal, up to 1,000 GB. For capacities greater than 1,000 GB, send email to AIDataCap@microsoft.com.
| Throttling | 32,000 events/second | The limit is measured over a minute.
| Data retention | 90 days | This resource is for [Search](../articles/azure-monitor/app/diagnostic-search.md), [Analytics](../articles/azure-monitor/app/analytics.md), and [Metrics Explorer](../articles/azure-monitor/app/metrics-explorer.md).
| [Availability multi-step test](../articles/azure-monitor/app/availability-multistep.md) detailed results retention | 90 days | This resource provides detailed results of each step.
| Maximum event size | 64,000 |
| Property and metric name length | 150 | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| Property value string length | 8,192 | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| Trace and exception message length | 32,768  | See [type schemas](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/Schemas/Docs/).
| [Availability tests](../articles/azure-monitor/app/monitor-web-app-availability.md) count per app | 100 |
| [Profiler](../articles/azure-monitor/app/profiler.md) data retention | 5 days |
| [Profiler](../articles/azure-monitor/app/profiler.md) data sent per day | 10 GB |

For more information, see [About pricing and quotas in Application Insights](../articles/azure-monitor/app/pricing.md).
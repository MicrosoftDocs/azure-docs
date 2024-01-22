---
title: include file
description: include file
services: application-insights
author: lgayhardt
ms.service: application-insights
ms.topic: include
ms.date: 08/06/2019
ms.author: lagayhar
ms.custom: include file
---

There are some limits on the number of metrics and events per application, that is, per instrumentation key. Limits depend on the [pricing plan](https://azure.microsoft.com/pricing/details/application-insights/) that you choose.

| Resource | Default limit| Maximum limit | Notes |
|---|---|---|---|
| Total data per day | 100 GB | [Contact support.](https://azure.microsoft.com/support/options/) | You can set a cap to reduce data. If you need more data, you can increase the limit in the portal, up to 1,000 GB. For capacities greater than 1,000 GB, send email to AIDataCap@microsoft.com.
| Throttling | 32,000 events/second | [Contact support.](https://azure.microsoft.com/support/options/) | The limit is measured over a minute.
| Data retention logs | [30 to 730 days](../articles/azure-monitor/logs/data-retention-archive.md) | 730 days | This resource is for [Logs](../articles/azure-monitor/logs/log-query-overview.md).
| Data retention metrics | 90 days | 90 days | This resource is for [Metrics Explorer](../articles/azure-monitor/essentials/metrics-charts.md).
| [Availability multistep test](/previous-versions/azure/azure-monitor/app/availability-multistep) detailed results retention | 90 days | 90 days | This resource provides detailed results of each step.
| Maximum telemetry item size | 64 KB | 64 KB | |
| Maximum telemetry items per batch | 64,000 | 64,000 | |
| Property and metric name length | 150 | 150 | See [type schemas](../articles/azure-monitor/app/data-model.md).
| Property value string length | 8,192 | 8,192 | See [type schemas](../articles/azure-monitor/app/data-model.md).
| Trace and exception message length | 32,768 | 32,768 | See [type schemas](../articles/azure-monitor/app/data-model.md).
| [Availability tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) count per app | 100 | 100 | |
| [Profiler](../articles/azure-monitor/app/profiler.md) and [Snapshot](../articles/azure-monitor/app/snapshot-debugger.md) data retention | Two weeks | [Contact support.](https://azure.microsoft.com/support/options/) Maximum retention limit is six months. | |
| [Profiler](../articles/azure-monitor/app/profiler.md) data sent per day | No limit | No limit. | |
| [Snapshot](../articles/azure-monitor/app/snapshot-debugger.md) data sent per day | 30 snapshots per day per monitored app | No limit. | The number of snapshots collected per application can be modified through [configuration](../articles/azure-monitor/app/snapshot-debugger-vm.md). |

For more information about pricing and quotas, see [Application Insights billing](../articles/azure-monitor/logs/cost-logs.md#application-insights-billing).

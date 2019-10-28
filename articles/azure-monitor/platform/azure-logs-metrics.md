---
title: Logs and metrics in Azure | Microsoft Docs
description: Overview of diagnostic logs in Azure which provide rich, frequent data about the operation of an Azure resource.
author: bwren
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/29/2019
ms.author: bwren
ms.subservice: logs
---
# Logs and metrics in Azure
There are different [logs](data-platform-logs.md) and [metrics](data-platform-metrics.md)

Monitoring applications and services in Azure can be separated into  that are stored in the [Azure data platform](data-platform.md). 

Logs and metrics can be separated into two categories

- Platform - Logs and metrics that are automatically generated without any configuration required other than simply 



| Layer | Platform Logs | Platform Metrics | Custom Logs | Custom Metrics |
|:---|:---|:---|:---|:---|
| Application  | | | | |
| Guest OS     | Heartbeat |  | Diagnostics Extension<br>Log Analytics Agent | Diagnostics Extension |
| Resource     | [Resource logs](resource-logs-overview.md)<br>(specific to each service) | [Resource metrics](metrics-supported.md)<br>(specific to each service) | | [Custom metrics](metrics-custom-overview.md) |
| Subscription | [Activity log](activity-logs-overview.md) | | | |
| Tenant       | 

## Next steps

* [Stream resource diagnostic logs to **Event Hubs**](resource-logs-stream-event-hubs.md)
* [Change resource diagnostic settings using the Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/)
* [Analyze logs from Azure storage with Azure Monitor](collect-azure-metrics-logs.md)

---
title: Observability in Azure API Management | Microsoft Docs
description: Overview of all observability options in Azure API Management.
services: api-management
documentationcenter: ''
author: begim
manager: alberts
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 06/01/2020
ms.author: apimpm

---

# Observability in Azure API Management

Observability is the ability to understand the internal state of a system from the data it produces and the ability to explore that data to answer questions about what happened and why. 

Azure API Management helps organizations centralize the management of all APIs. Since it serves as a single point of entry of all API traffic, it is an ideal place to observe the APIs. 

## Observability Tools

The table below summarizes all the tools supported by API Management to observe APIs, each is useful for one or more scenarios:

| Tool        | Useful for    | Data lag | Retention | Sampling | Data kind | Enabled|
|:------------- |:-------------|:---- |:----|:---- |:--- |:---- 
| **[API Inspector](api-management-howto-api-inspector.md)** | Testing and debugging | Instant | Last 100 traces | Turned on per request | Request traces | Always
| **Built-in Analytics** | Reporting and monitoring | Minutes | Lifetime | 100% | Reports and logs | Always |
| **[Azure Monitor Metrics](api-management-howto-use-azure-monitor.md)** | Reporting and monitoring | Minutes | 93 days (upgrade to extend) | 100% | Metrics | Always |
| **[Azure Monitor Logs](api-management-howto-use-azure-monitor.md)** | Reporting, monitoring, and debugging | Minutes | 31 days/5GB (upgrade to extend) | 100% (adjustable) | Logs | Optional |
| **[Azure Application Insights](api-management-howto-app-insights.md)** | Reporting, monitoring, and debugging | Seconds | 90 days/5GB (upgrade to extend) | Custom | Logs, metrics | Optional |
| **[Logging through Azure Event Hub](api-management-howto-log-event-hubs.md)** | Custom scenarios | Seconds | User managed | Custom | Custom | Optional |

### Self-hosted gateway

All the tools mentioned above are supported by the managed gateway in the cloud. The [self-hosted gateway](self-hosted-gateway-overview.md) currently does not send diagnostic logs to Azure Monitor. However, it is possible to configure and persist logs locally where the self-hosted gateway is deployed. For more information, please see [configuring cloud metrics and logs for self-hosted gateway](how-to-configure-cloud-metrics-logs.md) and [configuring local metrics and logs for self-hosted gateway](how-to-configure-local-metrics-logs.md).

## Next Steps

* [Follow the tutorials to learn more about API Management](import-and-publish.md)

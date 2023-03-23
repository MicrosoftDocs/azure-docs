---
title: Observability in Azure API Management | Microsoft Docs
description: Overview of all API observability and monitoring options in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 06/01/2020
ms.author: danlep

---

# Observability in Azure API Management

Observability is the ability to understand the internal state of a system from the data it produces and the ability to explore that data to answer questions about what happened and why. 

Azure API Management helps organizations centralize the management of all APIs. Since it serves as a single point of entry of all API traffic, it is an ideal place to observe the APIs.

## Overview

Azure API Management allows you to choose to use the managed gateway or [self-hosted gateway](self-hosted-gateway-overview.md), either self-deployed or by using an [Azure Arc extension](how-to-deploy-self-hosted-gateway-azure-arc.md).

The table below summarizes all the observability capabilities supported by API Management to operate APIs and what deployment models they support. These capabilities can be used by API publishers and others who have permissions to operate or manage the API Management instance. 

> [!NOTE]
> For API consumers who use the developer portal, a built-in API report is available. It only provides information about their individual API usage during the preceding 90 days.
>  
| Tool        | Useful for    | Data lag | Retention | Sampling | Data kind | Supported Deployment Model(s) |
|:------------- |:-------------|:---- |:----|:---- |:--- |:---- |
| **[API Inspector](api-management-howto-api-inspector.md)** | Testing and debugging | Instant | Last 100 traces | Turned on per request | Request traces | Managed, Self-hosted, Azure Arc |
| **[Built-in Analytics](howto-use-analytics.md)** | Reporting and monitoring | Minutes | Lifetime | 100% | Reports and logs | Managed |
| **[Azure Monitor Metrics](api-management-howto-use-azure-monitor.md)** | Reporting and monitoring | Minutes | 90 days (upgrade to extend) | 100% | Metrics | Managed, Self-hosted<sup>2</sup>, Azure Arc |
| **[Azure Monitor Logs](api-management-howto-use-azure-monitor.md)** | Reporting, monitoring, and debugging | Minutes | 31 days/5GB (upgrade to extend) | 100% (adjustable) | Logs | Managed<sup>1</sup>, Self-hosted<sup>3</sup>, Azure Arc<sup>3</sup> |
| **[Azure Application Insights](api-management-howto-app-insights.md)** | Reporting, monitoring, and debugging | Seconds | 90 days/5GB (upgrade to extend) | Custom | Logs, metrics | Managed<sup>1</sup>, Self-hosted<sup>1</sup>, Azure Arc<sup>1</sup> |
| **[Logging through Azure Event Hubs](api-management-howto-log-event-hubs.md)** | Custom scenarios | Seconds | User managed | Custom | Custom | Managed<sup>1</sup>, Self-hosted<sup>1</sup>, Azure Arc<sup>1</sup> |
| **[OpenTelemetry](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md#introduction-to-opentelemetry)** | Monitoring | Minutes | User managed | 100% | Metrics | Self-hosted<sup>2</sup> |

*1. Optional, depending on the configuration of feature in Azure API Management*

*2. Optional, depending on the configuration of the gateway*

*3. The [self-hosted gateway](self-hosted-gateway-overview.md) currently does not send diagnostic logs to Azure Monitor. However, it is possible to configure and persist logs locally where the self-hosted gateway is deployed. For more information, please see [configuring local metrics and logs for self-hosted gateway](how-to-configure-local-metrics-logs.md)*

## Next Steps

- Get started with [Azure Monitor metrics and logs](api-management-howto-use-azure-monitor.md)
- Learn how to log requests with [Application Insights](api-management-howto-app-insights.md)
- Learn how to log events through [Event Hubs](api-management-howto-log-event-hubs.md) 
- Learn about visualizing Azure Monitor data using [Azure Managed Grafana](visualize-using-managed-grafana-dashboard.md)

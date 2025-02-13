---
title: Observability in Azure API Management | Microsoft Docs
description: Overview of all API observability and monitoring options in Azure API Management.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: conceptual
ms.date: 02/10/2025
ms.author: danlep
---

# Observability in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Observability is the ability to understand the internal state of a system from the data it produces and the ability to explore that data to answer questions about what happened and why. 

Azure API Management helps organizations centralize the management of all APIs. Since it serves as a single point of entry of all API traffic, it's an ideal place to observe the APIs.

## Overview

Azure API Management allows you to choose to use the managed gateway or [self-hosted gateway](self-hosted-gateway-overview.md), either self-deployed or by using an [Azure Arc extension](how-to-deploy-self-hosted-gateway-azure-arc.md).

The following table summarizes all the observability capabilities supported by API Management to operate APIs and what deployment models they support. API publishers and others with permissions to operate or manage the API Management instance can use these capabilities. 

> [!NOTE]
> For API consumers who use the developer portal, a built-in API report is available. It only provides information about their individual API usage during the preceding 90 days. Currently, the built-in API report isn't available in the developer portal for the v2 service tiers.
>  
| Tool        | Useful for    | Data lag | Retention | Sampling | Data kind | Supported Deployment Model(s) |
|:------------- |:-------------|:---- |:----|:---- |:--- |:---- |
| **[API Inspector](api-management-howto-api-inspector.md)** | Testing and debugging | Instant | Last 100 traces | Turned on per request | Request traces | Managed, Self-hosted, Azure Arc, Workspace |
| **[Built-in Analytics](monitor-api-management.md#get-api-analytics-in-azure-api-management)** | Reporting and monitoring | Minutes | Lifetime | 100% | Reports and logs | Managed |
| **[Azure Monitor Metrics](monitor-api-management-reference.md#metrics)** | Reporting and monitoring | Minutes | 90 days (upgrade to extend) | 100% | Metrics | Managed, Self-hosted<sup>2</sup>, Azure Arc |
| **[Azure Monitor Logs](monitor-api-management-reference.md#resource-logs)** | Reporting, monitoring, and debugging | Minutes | 31 days/5GB (upgrade to extend) | 100% (adjustable) | Logs | Managed<sup>1</sup>, Self-hosted<sup>3</sup>, Azure Arc<sup>3</sup> |
| **[Azure Application Insights](api-management-howto-app-insights.md)** | Reporting, monitoring, and debugging | Seconds | 90 days/5GB (upgrade to extend) | Custom | Logs, metrics | Managed<sup>1</sup>, Self-hosted<sup>1</sup>, Azure Arc<sup>1</sup>, Workspace<sup>1</sup> |
| **[Logging through Azure Event Hubs](api-management-howto-log-event-hubs.md)** | Custom scenarios | Seconds | User managed | Custom | Custom | Managed<sup>1</sup>, Self-hosted<sup>1</sup>, Azure Arc<sup>1</sup> |
| **[OpenTelemetry](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md#introduction-to-opentelemetry)** | Monitoring | Minutes | User managed | 100% | Metrics | Self-hosted<sup>2</sup> |

*1. Optional, depending on the configuration of feature in Azure API Management*

*2. Optional, depending on the configuration of the gateway*

*3. The [self-hosted gateway](self-hosted-gateway-overview.md) currently doesn't send diagnostic logs to Azure Monitor. However, it's possible to configure and persist logs locally where the self-hosted gateway is deployed. For more information, please see [configuring local metrics and logs for self-hosted gateway](how-to-configure-local-metrics-logs.md)*

## Next Steps

- Get started with [Azure Monitor for API Management](monitor-api-management.md)
- Learn how to log requests with [Application Insights](api-management-howto-app-insights.md)
- Learn how to log events through [Event Hubs](api-management-howto-log-event-hubs.md) 
- Learn about visualizing Azure Monitor data using [Azure Managed Grafana](monitor-api-management.md#visualize-api-management-monitoring-data-using-a-managed-grafana-dashboard)

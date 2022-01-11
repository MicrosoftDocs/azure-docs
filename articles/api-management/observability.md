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
ms.author: danlep

---

# Observability in Azure API Management

Observability is the ability to understand the internal state of a system from the data it produces and the ability to explore that data to answer questions about what happened and why. 

Azure API Management helps organizations centralize the management of all APIs. Since it serves as a single point of entry of all API traffic, it is an ideal place to observe the APIs.

## Overview

The table below summarizes all the observability capabilities supported by API Management to operate APIs, each is useful for one or more scenarios:

| Tool        | Useful for    | Data lag | Retention | Sampling | Data kind | Managed Gateway Support | Self-hosted Gateway Support |
|:------------- |:-------------|:---- |:----|:---- |:--- |:---- |:---- 
| **[API Inspector](api-management-howto-api-inspector.md)** | Testing and debugging | Instant | Last 100 traces | Turned on per request | Request traces | ✔️, always enabled | ❌ |
| **Built-in Analytics** | Reporting and monitoring | Minutes | Lifetime | 100% | Reports and logs | ✔️, always enabled | ❌ |
| **[Azure Monitor Metrics](api-management-howto-use-azure-monitor.md)** | Reporting and monitoring | Minutes | 90 days (upgrade to extend) | 100% | Metrics | ✔️, always enabled | ✔️, optional |
| **[Azure Monitor Logs](api-management-howto-use-azure-monitor.md)** | Reporting, monitoring, and debugging | Minutes | 31 days/5GB (upgrade to extend) | 100% (adjustable) | Logs | ✔️, optional | ❌ <sup>1</sup> |
| **[Azure Application Insights](api-management-howto-app-insights.md)** | Reporting, monitoring, and debugging | Seconds | 90 days/5GB (upgrade to extend) | Custom | Logs, metrics | ✔️, optional | ✔️, optional |
| **[Logging through Azure Event Hub](api-management-howto-log-event-hubs.md)** | Custom scenarios | Seconds | User managed | Custom | Custom | ✔️, optional | ✔️, optional |
| **[OpenTelemetry](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md#Introduction-to-OpenTelemetry)** | Monitoring | 1 minute | User managed | 100% | Metrics | ❌ | ✔️, optional |

*1. The [self-hosted gateway](self-hosted-gateway-overview.md) currently does not send diagnostic logs to Azure Monitor. However, it is possible to configure and persist logs locally where the self-hosted gateway is deployed. For more information, please see [configuring local metrics and logs for self-hosted gateway](how-to-configure-local-metrics-logs.md)*

## Next Steps

* [Follow the tutorials to learn more about API Management](import-and-publish.md)

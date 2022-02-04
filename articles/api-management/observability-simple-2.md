---
title: Observability in Azure API Management (Simple 2) | Microsoft Docs
description: Overview of all observability options in Azure API Management. (Simple 2)
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

# Observability in Azure API Management (Simple 2)

Observability is the ability to understand the internal state of a system from the data it produces and the ability to explore that data to answer questions about what happened and why. 

Azure API Management helps organizations centralize the management of all APIs. Since it serves as a single point of entry of all API traffic, it is an ideal place to observe the APIs.

## Overview

The table below summarizes all the observability capabilities supported by API Management to operate APIs, each is useful for one or more scenarios:

| Tool        | Useful for    | Data lag | Retention | Sampling | Data kind | Supported Deployment Model(s) |
|:------------- |:-------------|:---- |:----|:---- |:--- |:---- |
| **[API Inspector](api-management-howto-api-inspector.md)** | Testing and debugging | Instant | Last 100 traces | Turned on per request | Request traces | <ul><li>Managed</li><li>Self-hosted</li><li>Azure Arc</li></ul> |
| **Built-in Analytics** | Reporting and monitoring | Minutes | Lifetime | 100% | Reports and logs | <ul><li>Managed</li></ul> |
| **[Azure Monitor Metrics](api-management-howto-use-azure-monitor.md)** | Reporting and monitoring | Minutes | 90 days (upgrade to extend) | 100% | Metrics | <ul><li>Managed</li><li>Self-hosted<sup>2</sup></li><li>Azure Arc</li></ul> |
| **[Azure Monitor Logs](api-management-howto-use-azure-monitor.md)** | Reporting, monitoring, and debugging | Minutes | 31 days/5GB (upgrade to extend) | 100% (adjustable) | Logs |<ul><li>Managed<sup>1</sup></li><li>Self-hosted<sup>3</sup></li><li>Azure Arc<sup>3</sup></li></ul> |
| **[Azure Application Insights](api-management-howto-app-insights.md)** | Reporting, monitoring, and debugging | Seconds | 90 days/5GB (upgrade to extend) | Custom | Logs, metrics | <ul><li>Managed<sup>1</sup></li><li>Self-hosted<sup>1</sup></li><li>Azure Arc<sup>1</sup></li></ul> |
| **[Logging through Azure Event Hub](api-management-howto-log-event-hubs.md)** | Custom scenarios | Seconds | User managed | Custom | Custom | <ul><li>Managed<sup>1</sup></li><li>Self-hosted<sup>1</sup></li><li>Azure Arc<sup>1</sup></li></ul> |
| **[OpenTelemetry](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md#introduction-to-opentelemetry)** | Monitoring | 1 minute | User managed | 100% | Metrics | <ul><li>Self-hosted<sup>2</sup></li></ul> |

*1. Optional, depending on the configuration of feature in Azure API Management*

*2. Optional, depending on the configuration of the gateway*

*3. The [Self-hosted](self-hosted-gateway-overview.md) currently does not send diagnostic logs to Azure Monitor. However, it is possible to configure and persist logs locally where the Self-hosted is deployed. For more information, please see [configuring local metrics and logs for Self-hosted](how-to-configure-local-metrics-logs.md)*

## Next Steps

* [Follow the tutorials to learn more about API Management](import-and-publish.md)

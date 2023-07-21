---
title: Azure Monitor metrics for Application Gateway for Containers
description: Learn how to use metrics to monitor performance of Application Gateway for Containers
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: article
ms.date: 07/20/2023
ms.author: greglin

---
# Metrics for Application Gateway for Containers

Application Gateway for Containers publishes data points to [Azure Monitor](../../azure-monitor/overview.md) for the performance of your Application Gateway for Containers and backend instances. These data points are called metrics, and are numerical values in an ordered set of time-series data. Metrics describe some aspect of your application gateway at a particular time. If there are requests flowing through the Application Gateway, it measures and sends its metrics in 60-second intervals. If there are no requests flowing through the Application Gateway or no data for a metric, the metric isn't reported. For more information, see [Azure Monitor metrics](../../azure-monitor/essentials/data-platform-metrics.md).

## Metrics supported by Application Gateway for Containers

| Metric Name | Description | Aggregation Type | Dimensions |
| ----------- | ----------- | ---------------- | ---------- |
| Backend Connection Timeouts | Count of requests that timed out waiting for a response from the backend target (includes all retry requests initiated from Application Gateway for Containers to the backend target) | Total | Backend Service |
| Backend Healthy Targets | Count of healthy backend targets | Avg | Backend Service |
| Backend HTTP Response Status | HTTP response status returned by the backend target to Application Gateway for Containers | Total | Backend Service, HTTP Response Code |
| Connection Timeouts | Count of connections closed due to timeout between clients and Application Gateway for Containers | Total | Frontend |
| HTTP Response Status | HTTP response status returned by Application Gateway for Containers | Total | Frontend, HTTP Response Code |
| Total Connection Idle Timeouts | Count of connections closed, between client and Application Gateway for Containers frontend, due to exceeding idle timeout | Total | Frontend |
| Total Requests | Count of requests Application Gateway for Containers has served | Total | Frontend |

## Next steps

* [Using Azure Log Analytics in Power BI](/power-bi/transform-model/log-analytics/desktop-log-analytics-overview)
* [Configure Azure Log Analytics for Power BI](/power-bi/transform-model/log-analytics/desktop-log-analytics-configure)
* [Visualize Azure Cognitive Search Logs and Metrics with Power BI](/azure/search/search-monitor-logs-powerbi)
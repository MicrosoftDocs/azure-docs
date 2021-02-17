---
title: Monitoring metrics for Azure Front Door Standard/Premium
description: This article describes the Azure Front Door Standard/Premium monitoring metrics.
services: frontdoor
author: duau
manager: KumudD
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: yuajia
---

# Real-time Monitoring in Azure Front Door Standard/Premium

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

Azure Front Door Standard/Premium is integrated with Azure Monitor and has 11 metrics to help monitor Azure Front Door Standard/Premium in real-time to track, troubleshoot, and debug issues.  

Azure Front Door Standard/Premium measures and sends its metrics in 60-second intervals. The metrics can take up to 3 mins to appear in the portal. Metrics can be displayed in charts or grid of your choice and are accessible via portal, PowerShell, CLI, and API. For more information, see [Azure Monitor metrics](../../azure-monitor/platform/data-platform-metrics.md).  

The default metrics are free of charge. You can enable additional metrics for an extra cost. 

You can configure alerts for each metric such as a threshold for 4XXErrorRate or 5XXErrorRate. When the error rate exceeds the threshold, it will trigger an alert as configured. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md). 

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Metrics supported in Azure Front Door Standard/Premium

| Metrics  | Description | Dimensions |
| ------------- | ------------- | ------------- |
| Bytes Hit ratio | The percentage of egress from AFD cache, computed against the total egress. </br> **Byte Hit Ratio** = (egress from edge - egress from origin)/egress from edge. </br> **Scenarios excluded in bytes hit ratio calculation**:</br> 1. You explicitly configure no cache either through Rules Engine or Query String caching behavior. </br> 2. You explicitly configure cache-control directive with no-store or private cache. </br>3. Byte hit ratio can be low if most of the traffic is forwarded to origin rather than served from caching based on your configurations or scenarios. | Endpoint |
| RequestCount | The number of client requests served by CDN. | Endpoint, client country, client region, HTTP status, HTTP status group |
| ResponseSize | The number of client requests served by AFD. |Endpoint, client country, client region, HTTP status, HTTP status group |
| TotalLatency | The total time from the client request received by CDN **until the last response byte send from CDN to client**. |Endpoint, client country, client region, HTTP status, HTTP status group |
| RequestSize | The number of bytes sent as requests from clients to AFD. | Endpoint, client country, client region, HTTP status, HTTP status group |
| 4XX % ErrorRate | The percentage of all the client requests for which the response status code is 4XX. | Endpoint, Client Country, Client Region |
| 5XX % ErrorRate | The percentage of all the client requests for which the response status code is 5XX. | Endpoint, Client Country, Client Region |
| OriginRequestCount  | The number of requests sent from AFD to origin | Endpoint, Origin, HTTP status, HTTP status group |
| OriginLatency | The time calculated from when the request was sent by AFD edge to the backend until AFD received the last response byte from the backend. | Endpoint, Origin |
| OriginHealth% | The percentage of successful health probes from AFD to origin.| Origin, Origin Group |
| WAF request count | Matched WAF request. | Action, rule name, Policy Name |

## Access Metrics in Azure portal

1. From the Azure portal menu, select **All Resources** >> **\<your-AFD Standard/Premium (Preview) -profile>**.

2. Under **Monitoring**, select **Metrics**:

3. In **Metrics**, select the metric to add:

   :::image type="content" source="../media/how-to-monitoring-metrics/front-door-metrics-1.png" alt-text="Screenshot of metrics page." lightbox="../media/how-to-monitoring-metrics/front-door-metrics-1-expanded.png":::

4. Select **Add filter** to add a filter:

    :::image type="content" source="../media/how-to-monitoring-metrics/front-door-metrics-2.png" alt-text="Screenshot of adding filters to metrics." lightbox="../media/how-to-monitoring-metrics/front-door-metrics-2-expanded.png":::
    
5. Select **Apply splitting** to split data by different dimensions:

   :::image type="content" source="../media/how-to-monitoring-metrics/front-door-metrics-4.png" alt-text="Screenshot of adding dimensions to metrics." lightbox="../media/how-to-monitoring-metrics/front-door-metrics-4-expanded.png":::

6. Select **New chart** to add a new chart:

## Configure Alerts in Azure portal

1. Set up alerts on Azure Front Door Standard/Premium (Preview) by selecting **Monitoring** >> **Alerts**.

1. Select **New alert rule** for metrics listed in Metrics section.

Alert will be charged based on Azure Monitor. For more information about alerts, see [Azure Monitor alerts](../../azure-monitor/platform/alerts-overview.md).

## Next steps

- Learn about [Azure Front Door Standard/Premium Reports](how-to-reports.md).
- Learn about [Azure Front Door Standard/Premium Logs](how-to-logs.md).

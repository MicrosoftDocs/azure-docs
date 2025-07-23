---
title: Azure Monitor metrics for Application Gateway
description: Monitor Application Gateway performance with Azure Monitor metrics including backend connect time, response latency, and WAF data. Configure alerts and visualize metric trends.
#customer intent: As a cloud administrator, I want to understand Application Gateway timing metrics so that I can diagnose performance issues between my application gateway and backend servers.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 06/11/2025
ms.author: mbender
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:06/11/2025
# Customer intent: "As a network administrator, I want to monitor the performance metrics of the Application Gateway, so that I can identify latency issues and optimize the response times for better service delivery."
---

# Metrics for Application Gateway

Azure Application Gateway provides comprehensive monitoring capabilities through [Azure Monitor](/azure/azure-monitor/overview) metrics. These metrics help you track the performance and health of your application gateway instance, including request latency, backend connectivity, and throughput measurements.

This article describes the metrics available for Application Gateway, how to access and visualize them, and how to configure alerts based on metric thresholds. You learn about timing metrics that help diagnose performance bottlenecks, backend health indicators, and Web Application Firewall (WAF) metrics for security monitoring. For more information, see [Azure Monitor metrics](/azure/azure-monitor/essentials/data-platform-metrics).


## Metrics overview

Application Gateway metrics are numerical values collected at regular intervals that describe the performance characteristics of your gateway at specific points in time. These metrics are automatically published to Azure Monitor when requests flow through your Application Gateway, with data points captured every 60 seconds.

## Metrics supported by Application Gateway V2 SKU

> [!NOTE]
> For TLS/TCP proxy related information, visit [data reference](monitor-application-gateway-reference.md#tlstcp-proxy-metrics).

### Timing metrics

Application Gateway provides several built‑in timing metrics related to the request and response, which are all measured in milliseconds.

:::image type="content" source="./media/application-gateway-metrics/application-gateway-metrics.png" alt-text="Screenshot of diagram showing timing metrics for the Application Gateway.":::

> [!NOTE]
> If there's more than one listener in the Application Gateway, then always filter by *Listener* dimension while comparing different latency metrics in order to get meaningful inference.

> [!NOTE]
> Latency might be observed in the metric data, as all metrics are aggregated at one-minute intervals. This latency can vary for different application gateway instances based on the metric start time.

You can use timing metrics to determine whether the observed slowdown is due to the client network, Application Gateway performance, the backend network, and backend server TCP stack saturation, backend application performance, or large file size. For more information, see [Timing metrics](monitor-application-gateway-reference.md#timing-metrics-for-application-gateway-v2-sku).

For example, if there's a spike in *Backend first byte response time* trend but the *Backend connect time* trend is stable, you can infer that the application gateway to backend latency and the time taken to establish the connection is stable. The spike is caused due to an increase in the response time of backend application. On the other hand, if the spike in *Backend first byte response time* is associated with a corresponding spike in *Backend connect time*, you can deduce that either the network between Application Gateway and backend server or the backend server TCP stack has saturated.

If you notice a spike in *Backend last byte response time* but the *Backend first byte response time* is stable, you can deduce that the spike is because of a larger file being requested.

Similarly, if the *Application gateway total time* has a spike but the *Backend last byte response time* is stable, then it can either be a sign of performance bottleneck at the Application Gateway or a bottleneck in the network between client and Application Gateway. Additionally, if the *client RTT* also has a corresponding spike, then it indicates that the degradation is because of the network between client and Application Gateway.

### Application Gateway metrics

For Application Gateway, there are several metrics available. For a list, see [Application Gateway metrics](monitor-application-gateway-reference.md#metrics-for-application-gateway-v2-sku).

### Backend metrics

For Application Gateway, There are several backend metrics available. For a list, see [Backend metrics](monitor-application-gateway-reference.md#backend-metrics-for-application-gateway-v2-sku).

### Web Application Firewall (WAF) metrics

For information on WAF Monitoring, see [WAF v2 Metrics](../../articles/web-application-firewall/ag/application-gateway-waf-metrics.md#application-gateway-waf-v2-metrics) and [WAF v1 Metrics](../../articles/web-application-firewall/ag/application-gateway-waf-metrics.md#application-gateway-waf-v1-metrics).

## Metrics visualization

Browse to an application gateway, under **Monitoring** select **Metrics**. To view the available values, select the **METRIC** drop-down list.

In the following image, you see an example with three metrics displayed for the last 30 minutes:

:::image type="content" source="media/application-gateway-metrics/view-application-gateway-metrics.png" alt-text="Screenshot of the Metric view displaying three metrics." lightbox="media/application-gateway-metrics/view-application-gateway-metrics-lb.png":::

To see a current list of metrics, see [Supported metrics with Azure Monitor](/azure/azure-monitor/essentials/metrics-supported).

### Alert rules on metrics

You can start alert rules based on metrics for a resource. For example, an alert can call a webhook or email an administrator if the throughput of the application gateway is above, below, or at a threshold for a specified period.

The following example walks you through creating an alert rule that sends an email to an administrator after throughput breaches a threshold:

1. select **Add metric alert** to open the **Add rule** page. You can also reach this page from the metrics page.

   :::image type="content" source="./media/application-gateway-metrics/add-metrics-alert.png" alt-text="Screenshot of the Add metric alert button.":::

1. On the **Add rule** page, fill out the name, condition, and notify sections, and select **OK**.

   - In the **Condition** selector, select one of the four values: **Greater than**, **Greater than or equal**, **Less than**, or **Less than or equal to**.

   - In the **Period** selector, select a period from five minutes to six hours.

   - If you select **Email owners, contributors, and readers**, the email can be dynamic, based on the users who have access to that resource. Otherwise, you can provide a comma-separated list of users in the **Additional administrator email(s)** box.

   :::image type="content" source="./media/application-gateway-metrics/add-rule.png" alt-text="Screenshot of the Add rule page.":::

If the threshold is breached, an email that's similar to the one in the following image arrives:

:::image type="content" source="./media/application-gateway-metrics/example-email-notification.png" alt-text="Screenshot of email notification for breached threshold.":::

A list of alerts appears after you create a metric alert. It provides an overview of all the alert rules.

:::image type="content" source="./media/application-gateway-metrics/overview-alerts-rules.png" alt-text="Screenshot showing list of alerts and rules.":::

To learn more about alert notifications, see [Receive alert notifications](/azure/azure-monitor/alerts/alerts-overview).

To understand more about webhooks and how you can use them with alerts, visit [Configure a webhook on an Azure metric alert](/azure/azure-monitor/alerts/alerts-webhooks).

## Next steps

- Visualize counter and event logs by using [Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics).
- [Visualize your Azure activity log with Power BI](https://powerbi.microsoft.com/blog/monitor-azure-audit-logs-with-power-bi/) blog post.
- [View and analyze Azure activity logs in Power BI and more](https://azure.microsoft.com/blog/analyze-azure-audit-logs-in-powerbi-more/) blog post.

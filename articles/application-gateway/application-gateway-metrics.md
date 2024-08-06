---
title: Azure Monitor metrics for Application Gateway
description: Learn how to use metrics to monitor performance of application gateway
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: article
ms.date: 06/17/2024
ms.author: greglin

---
# Metrics for Application Gateway

Application Gateway publishes data points to [Azure Monitor](../azure-monitor/overview.md) for the performance of your Application Gateway and backend instances. These data points are called metrics, and are numerical values in an ordered set of time-series data. Metrics describe some aspect of your application gateway at a particular time. If there are requests flowing through the Application Gateway, it measures and sends its metrics in 60-second intervals. If there are no requests flowing through the Application Gateway or no data for a metric, the metric isn't reported. For more information, see [Azure Monitor metrics](../azure-monitor/essentials/data-platform-metrics.md).

<a name="metrics-supported-by-application-gateway-v1-sku"></a>

## Metrics supported by Application Gateway V2 SKU

> [!NOTE]
> For TLS/TCP proxy related information, visit [data reference](monitor-application-gateway-reference.md#tlstcp-proxy-metrics).

### Timing metrics

Application Gateway provides several built‑in timing metrics related to the request and response, which are all measured in milliseconds.

:::image type="content" source="./media/application-gateway-metrics/application-gateway-metrics.png" alt-text="[Diagram of timing metrics for the Application Gateway" border="false":::

> [!NOTE]
>
> If there is more than one listener in the Application Gateway, then always filter by *Listener* dimension while comparing different latency metrics in order to get meaningful inference.

You can use timing metrics to determine whether the observed slowdown is due to the client network, Application Gateway performance, the backend network and backend server TCP stack saturation, backend application performance, or large file size. For more information, see [Timing metrics](monitor-application-gateway-reference.md#timing-metrics-for-application-gateway-v2-sku).

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

:::image type="content" source="media/application-gateway-diagnostics/figure5.png" alt-text="Screenshot shows the Metric view of three metrics." lightbox="media/application-gateway-diagnostics/figure5-lb.png":::

To see a current list of metrics, see [Supported metrics with Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

### Alert rules on metrics

You can start alert rules based on metrics for a resource. For example, an alert can call a webhook or email an administrator if the throughput of the application gateway is above, below, or at a threshold for a specified period.

The following example walks you through creating an alert rule that sends an email to an administrator after throughput breaches a threshold:

1. select **Add metric alert** to open the **Add rule** page. You can also reach this page from the metrics page.

   !["Add metric alert" button][6]

2. On the **Add rule** page, fill out the name, condition, and notify sections, and select **OK**.

   * In the **Condition** selector, select one of the four values: **Greater than**, **Greater than or equal**, **Less than**, or **Less than or equal to**.

   * In the **Period** selector, select a period from five minutes to six hours.

   * If you select **Email owners, contributors, and readers**, the email can be dynamic, based on the users who have access to that resource. Otherwise, you can provide a comma-separated list of users in the **Additional administrator email(s)** box.

   ![Add rule page][7]

If the threshold is breached, an email that's similar to the one in the following image arrives:

![Email for breached threshold][8]

A list of alerts appears after you create a metric alert. It provides an overview of all the alert rules.

![List of alerts and rules][9]

To learn more about alert notifications, see [Receive alert notifications](../azure-monitor/alerts/alerts-overview.md).

To understand more about webhooks and how you can use them with alerts, visit [Configure a webhook on an Azure metric alert](../azure-monitor/alerts/alerts-webhooks.md).

## Next steps

* Visualize counter and event logs by using [Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics).
* [Visualize your Azure activity log with Power BI](https://powerbi.microsoft.com/blog/monitor-azure-audit-logs-with-power-bi/) blog post.
* [View and analyze Azure activity logs in Power BI and more](https://azure.microsoft.com/blog/analyze-azure-audit-logs-in-powerbi-more/) blog post.

[1]: ./media/application-gateway-diagnostics/figure1.png
[2]: ./media/application-gateway-diagnostics/figure2.png
[3]: ./media/application-gateway-diagnostics/figure3.png
[4]: ./media/application-gateway-diagnostics/figure4.png
[5]: ./media/application-gateway-diagnostics/figure5.png
[6]: ./media/application-gateway-diagnostics/figure6.png
[7]: ./media/application-gateway-diagnostics/figure7.png
[8]: ./media/application-gateway-diagnostics/figure8.png
[9]: ./media/application-gateway-diagnostics/figure9.png
[10]: ./media/application-gateway-diagnostics/figure10.png

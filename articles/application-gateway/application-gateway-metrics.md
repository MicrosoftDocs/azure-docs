---
title: Azure Monitor metrics for Application Gateway
description: Learn how to use metrics to monitor performance of application gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: article
ms.date: 05/17/2023
ms.author: greglin

---
# Metrics for Application Gateway

Application Gateway publishes data points to [Azure Monitor](../azure-monitor/overview.md) for the performance of your Application Gateway and backend instances. These data points are called metrics, and are numerical values in an ordered set of time-series data. Metrics describe some aspect of your application gateway at a particular time. If there are requests flowing through the Application Gateway, it measures and sends its metrics in 60-second intervals. If there are no requests flowing through the Application Gateway or no data for a metric, the metric isn't reported. For more information, see [Azure Monitor metrics](../azure-monitor/essentials/data-platform-metrics.md).

## Metrics supported by Application Gateway V2 SKU

> [!NOTE]
> For TLS/TCP proxy related information, visit [data reference](monitor-application-gateway-reference.md#tlstcp-proxy-metrics).

### Timing metrics

Application Gateway provides several built‑in timing metrics related to the request and response, which are all measured in milliseconds.

:::image type="content" source="./media/application-gateway-metrics/application-gateway-metrics.png" alt-text="[Diagram of timing metrics for the Application Gateway" border="false":::

> [!NOTE]
>
> If there are more than one listener in the Application Gateway, then always filter by *Listener* dimension while comparing different latency metrics in order to get meaningful inference.

You can use timing metrics to determine whether the observed slowdown is due to the client network, Application Gateway performance, the backend network and backend server TCP stack saturation, backend application performance, or large file size. For more information, see [Timing metrics](monitor-application-gateway-reference.md#timing-metrics).

For example, if there's a spike in *Backend first byte response time* trend but the *Backend connect time* trend is stable, you can infer that the application gateway to backend latency and the time taken to establish the connection is stable. The spike is caused due to an increase in the response time of backend application. On the other hand, if the spike in *Backend first byte response time* is associated with a corresponding spike in *Backend connect time*, you can deduce that either the network between Application Gateway and backend server or the backend server TCP stack has saturated.

If you notice a spike in *Backend last byte response time* but the *Backend first byte response time* is stable, you can deduce that the spike is because of a larger file being requested.

Similarly, if the *Application gateway total time* has a spike but the *Backend last byte response time* is stable, then it can either be a sign of performance bottleneck at the Application Gateway or a bottleneck in the network between client and Application Gateway. Additionally, if the *client RTT* also has a corresponding spike, then it indicates that the degradation is because of the network between client and Application Gateway.

### Application Gateway metrics

For Application Gateway, there are several metrics available. For a list, see [Application Gateway metrics](monitor-application-gateway-reference.md#application-gateway-metrics).

### Backend metrics

For Application Gateway, There are several backend metrics available. For a list, see [Backend metrics](monitor-application-gateway-reference.md#backend-metrics).

### Web Application Firewall (WAF) metrics

For information on WAF Monitoring, see [WAF v2 Metrics](../../articles/web-application-firewall/ag/application-gateway-waf-metrics.md#application-gateway-waf-v2-metrics).

## Metrics supported by Application Gateway V1 SKU

The Application Gateway V1 SKU supports the following metrics.

### Application Gateway metrics for Application Gateway V1 SKU

For Application Gateway, the following metrics are available:

- **CPU Utilization**

  Displays the utilization of the CPUs allocated to the Application Gateway.  Under normal conditions, CPU usage should not regularly exceed 90%, as this may cause latency in the websites hosted behind the Application Gateway and disrupt the client experience. You can indirectly control or improve CPU utilization by modifying the configuration of the Application Gateway by increasing the instance count or by moving to a larger SKU size, or doing both.

- **Current connections**

  Count of current connections established with Application Gateway

- **Failed Requests**

  Number of requests that failed due to connection issues. This count includes requests that failed due to exceeding the "Request time-out" HTTP setting and requests that failed due to connection issues between Application gateway and backend. This count doesn't include failures due to no healthy backend being available. 4xx and 5xx responses from the backend are also not considered as part of this metric.

- **Response Status**

  HTTP response status returned by Application Gateway. The response status code distribution can be further categorized to show responses in 2xx, 3xx, 4xx, and 5xx categories.

- **Throughput**

  Number of bytes per second the Application Gateway has served

- **Total Requests**

  Count of successful requests that Application Gateway has served. The request count can be further filtered to show count per each/specific backend pool-http setting combination.

### Backend metrics for Application Gateway V1 SKU

For Application Gateway, the following metrics are available:

- **Healthy host count**

  The number of backends that are determined healthy by the health probe. You can filter on a per backend pool basis to show the number of healthy hosts in a specific backend pool.

- **Unhealthy host count**

  The number of backends that are determined unhealthy by the health probe. You can filter on a per backend pool basis to show the number of unhealthy hosts in a specific backend pool.

### Web Application Firewall (WAF) metrics

For information on WAF Monitoring, see [WAF v1 Metrics](../../articles/web-application-firewall/ag/application-gateway-waf-metrics.md#application-gateway-waf-v1-metrics).

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

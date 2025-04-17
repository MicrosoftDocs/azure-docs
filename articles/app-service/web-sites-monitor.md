---
title: Azure App Service Quotas and Metrics
description: Learn how to monitor apps in Azure App Service by using the Azure portal. Understand the quotas and metrics that are reported.
ms.assetid: d273da4e-07de-48e0-b99d-4020d84a425e
ms.topic: article
ms.date: 03/31/2025
ms.author: msangapu
author: msangapu-msft
#customer intent: As a app developer, I need to use quotas and metrics to support my team's web apps in Azure App Service.
---
# Azure App Service quotas and metrics

[Azure App Service](./overview.md) provides built-in monitoring functionality for web, mobile, and API apps in the [Azure portal](https://portal.azure.com).

In the portal, you can review *quotas* and *metrics* for an app and App Service plan. You can set up *alerts* and *autoscaling* rules based on metrics.

## <a name = "understand-quotas"></a> Quotas

Apps that are hosted in App Service are subject to certain limits on the resources that they can use. The App Service plan for the app defines the limits.

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

If the app is hosted in a Free or Shared plan, quotas define the limits on the resources that the app can use. Quotas for apps in a Free or Shared plan are:

| Quota | Description |
| --- | --- |
| **CPU (Short)** | The amount of CPU allowed for this app in a five-minute interval. This quota resets every five minutes. |
| **CPU (Day)** | The total amount of CPU allowed for this app in a day. This quota resets every 24 hours at midnight UTC. |
| **Memory** | The total amount of memory allowed for this app. |
| **Bandwidth** | The total amount of outgoing bandwidth allowed for this app in a day. This quota resets every 24 hours at midnight UTC. |
| **Filesystem** | The total amount of storage allowed. |

If the app is hosted in a Basic, Standard, or Premium plan, then the *size* and the *instance count* set the limits on the resources that the app can use. Size is small, medium, or large. Instance count is the number of instances. The only quota applicable to apps that are hosted in a Basic, Standard, or Premium plan is **Filesystem**.

For more information about the specific quotas, limits, and features available to the App Service tiers, see [Azure App Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits).

### Quota enforcement

If an app exceeds the **CPU (Short)**, **CPU (Day)**, or **Bandwidth** quota, the app is stopped until the quota resets. During this time, all incoming requests result in an HTTP 403 error.

:::image type="content" source="./media/web-sites-monitor/http403.png" alt-text="Screenshot that shows a 403 error message.":::

If the app exceeds its **Memory** quota, it stops temporarily.

If app exceeds the **Filesystem** quota, any write operation fails. Write operation failures include any writes to logs.

You can increase or remove quotas from your app by upgrading your App Service plan.

## <a name = "understand-metrics"></a> Metrics

Metrics provide information about the app's or the App Service plan's behavior. App Service plan metrics are available only for plans in Basic, Standard, Premium, and Isolated tiers.

For a list of available metrics for apps or for App Service plans, see [Supported metrics for Microsoft.Web](monitor-app-service-reference.md#supported-metrics-for-microsoftweb).

> [!NOTE]
> Metrics for an app include the requests to the app's Source Control Manager (SCM) site, also known as Kudu. The requests include requests to view the site's log stream by using Kudu. Log-stream requests might span several minutes. This fact affects the **Request Time** metrics. Be aware of this relationship when you're using these metrics with autoscale logic.
>
> **HTTP Server Errors** records only requests that reach the back-end service (the workers that host the app). If the requests are failing at the front end, they're not recorded as HTTP server errors. You can use the [health check feature](./monitor-instances-health-check.md) and Application Insights availability tests for outside-in monitoring.

### CPU time vs. CPU percentage

Two metrics reflect CPU usage:

- **CPU Time**: Useful for apps hosted in Free or Shared plans, because one of their quotas is defined in CPU minutes that the app uses.

- **CPU Percentage**: Useful for apps hosted in Basic, Standard, and Premium plans, because they can be scaled out. CPU percentage is a good indication of the overall usage across instances.

### <a name = "metrics-granularity-and-retention-policy"></a> Retention policy

The service logs and aggregates metrics for an app and for an App Service plan. The metrics are retained according to [these rules](/azure/azure-monitor/essentials/data-platform-metrics#retention-of-metrics).

## Monitoring quotas and metrics in the Azure portal

To review the status of the quotas and metrics that affect an app, go to the [Azure portal](https://portal.azure.com).

To find quotas, go to your app. In the left menu, select **App Service Plan** > **Quotas**. On each chart, you can review this information about the quota:

- Name
- Reset interval
- Current limit
- Current value

:::image type="content" source="./media/web-sites-monitor/quotas.png" alt-text="Screenshot that shows quota charts in the Azure portal." lightbox="./media/web-sites-monitor/quotas.png":::

You can access metrics directly from the resource **Overview** page. Select the **Monitoring** tab, which shows charts that represent some of the app metrics. Selecting any of those charts takes you to the **Metrics** view, where you can create custom charts, query various metrics, and much more.

:::image type="content" source="./media/web-sites-monitor/metrics.png" alt-text="Screenshot that shows a metric chart in the Azure portal." lightbox="./media/web-sites-monitor/metrics.png":::

To learn more about metrics, see [Azure Monitor data platform](/azure/azure-monitor/data-platform).

## Alerts and autoscale

Metrics for an app or an App Service plan can be connected to alerts. For more information, see [Alerts](monitor-app-service.md#alerts).

Apps hosted in Basic or higher App Service plans support autoscale. With autoscale, you can configure rules that monitor the App Service plan metrics. Rules can increase or decrease the instance count, which can provide more resources as needed. Rules can also help you save money when the app is overprovisioned.

For more information about autoscale, see [Get started with autoscale in Azure](/azure/azure-monitor/autoscale/autoscale-get-started) and [Best practices for autoscale](/azure/azure-monitor/autoscale/autoscale-best-practices).

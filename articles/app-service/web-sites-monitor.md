---
title: Monitor apps - Azure App Service | Microsoft Docs
description: Learn how to monitor apps in Azure App Service by using the Azure portal.
services: app-service
documentationcenter: ''
author: btardif
manager: erikre
editor: ''

ms.assetid: d273da4e-07de-48e0-b99d-4020d84a425e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/11/2019
ms.author: byvinyal
ms.custom: seodec18

---
# Monitor apps in Azure App Service
[Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714) provides
built-in monitoring functionality for web apps, mobile back ends, and API apps in the [Azure portal](https://portal.azure.com).

In the Azure portal, you can review *quotas* and *metrics* for an app, review the App Service plan, and automatically set up *alerts* and *scaling* that are based on the metrics.

## Understand quotas

Apps that are hosted in App Service are subject to certain limits on the resources they can use. The limits are defined by the App Service plan that's associated with the app.

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

If the app is hosted in a *Free* or *Shared* plan, the limits
on the resources that the app can use are defined by quotas.

If the app is hosted in a *Basic*, *Standard*, or *Premium* plan, the limits on the resources that they can use are set by the *size* (Small, Medium, Large) and *instance count* (1, 2, 3, and so on) of the App Service plan.

Quotas for Free or Shared apps are:

| Quota | Description |
| --- | --- |
| **CPU (Short)** | The amount of CPU allowed for this app in a 5-minute interval. This quota resets every five minutes. |
| **CPU (Day)** | The total amount of CPU allowed for this app in a day. This quota resets every 24 hours at midnight UTC. |
| **Memory** | The total amount of memory allowed for this app. |
| **Bandwidth** | The total amount of outgoing bandwidth allowed for this app in a day. This quota resets every 24 hours at midnight UTC. |
| **Filesystem** | The total amount of storage allowed. |

The only quota applicable to apps that are hosted in *Basic*, *Standard*, and
*Premium* plans is Filesystem.

For more information about the specific quotas, limits, and features available to the various App Service SKUs, see [Azure Subscription service limits](../azure-subscription-service-limits.md#app-service-limits).

### Quota enforcement

If an app exceeds the *CPU (short)*, *CPU (Day)*, or *bandwidth* quota, the app is stopped until the quota resets. During this time, all incoming requests result in an HTTP 403 error.

![403 error message][http403]

If the app Memory quota is exceeded, the app is restarted.

If the Filesystem quota is exceeded, any write operation fails. Write operation failures include any writes to logs.

You can increase or remove quotas from your app by upgrading your App Service plan.

## Understand metrics

Metrics provide information about the app or the App Service plan's behavior.

For an app, the available metrics are:

| Metric | Description |
| --- | --- |
| **Average Response Time** | The average time taken for the app to serve requests, in milliseconds. |
| **Average memory working set** | The average amount of memory used by the app, in megabytes (MiB). |
| **CPU Time** | The amount of CPU consumed by the app, in seconds. For more information about this metric, see [CPU time vs CPU percentage](#cpu-time-vs-cpu-percentage). |
| **Data In** | The amount of incoming bandwidth consumed by the app, in MiB. |
| **Data Out** | The amount of outgoing bandwidth consumed by the app, in MiB. |
| **Http 2xx** | The count of requests resulting in an HTTP status code ≥ 200 but < 300. |
| **Http 3xx** | The count of requests resulting in an HTTP status code ≥ 300 but < 400. |
| **Http 401** | The count of requests resulting in HTTP 401 status code. |
| **Http 403** | The count of requests resulting in HTTP 403 status code. |
| **Http 404** | The count of requests resulting in HTTP 404 status code. |
| **Http 406** | The count of requests resulting in HTTP 406 status code. |
| **Http 4xx** | The count of requests resulting in an HTTP status code ≥ 400 but < 500. |
| **Http Server Errors** | The count of requests resulting in an HTTP status code ≥ 500 but < 600. |
| **Memory working set** | The current amount of memory used by the app, in MiB. |
| **Requests** | The total number of requests regardless of their resulting HTTP status code. |

For an App Service plan, the available metrics are:

> [!NOTE]
> App Service plan metrics are available only for plans in *Basic*, *Standard*, and *Premium* tiers.
> 

| Metric | Description |
| --- | --- |
| **CPU Percentage** | The average CPU used across all instances of the plan. |
| **Memory Percentage** | The average memory used across all instances of the plan. |
| **Data In** | The average incoming bandwidth used across all instances of the plan. |
| **Data Out** | The average outgoing bandwidth used across all instances of the plan. |
| **Disk Queue Length** | The average number of both read and write requests that were queued on storage. A high disk queue length is an indication of an app that might be slowing down due to excessive disk I/O. |
| **Http Queue Length** | The average number of HTTP requests that had to sit on the queue before being fulfilled. A high or increasing HTTP Queue length is a symptom of a plan under heavy load. |

### CPU time vs CPU percentage
<!-- To do: Fix Anchor (#CPU-time-vs.-CPU-percentage) -->

There are two metrics that reflect CPU usage:

**CPU Time**: Useful for apps hosted in Free or Shared plans, because one of their quotas is defined in CPU minutes used by the app.

**CPU percentage**: Useful for apps hosted in Basic, Standard, and Premium plans, because they can be scaled out. CPU percentage is a good indication of the overall usage across all instances.

## Metrics granularity and retention policy
Metrics for an app and app service plan are logged and aggregated by the service, with the following granularities and retention policies:

* **Minute** granularity metrics are retained for 30 hours.
* **Hour** granularity metrics are retained for 30 days.
* **Day** granularity metrics are retained for 30 days.

## Monitoring quotas and metrics in the Azure portal
To review the status of the various quotas and metrics that affect an app, go to the [Azure portal](https://portal.azure.com).

![Quotas chart in the Azure portal][quotas]

To find quotas, select **Settings** > **Quotas**. On the chart, you can review: 
1. The quota name.
1. Its reset interval.
1. Its current limit.
1. Its current value.

![Metric chart in the Azure portal][metrics]
You can access metrics directly from the **Resource** page. To customize the chart: 
1. Select the chart.
1. Select **Edit chart**.
1. Edit the **Time Range**.
1. Edit the **Chart type**.
1. Edit the metrics you want to display.  

To learn more about metrics, see [Monitor service metrics](../monitoring-and-diagnostics/insights-how-to-customize-monitoring.md).

## Alerts and autoscale
Metrics for an app or an App Service plan can be hooked up to alerts. For more information, see [Receive alert notifications](../monitoring-and-diagnostics/insights-alerts-portal.md).

App Service apps hosted in Basic, Standard, or Premium App Service plans support autoscale. With autoscale, you can configure rules that monitor the App Service plan metrics. Rules can increase or decrease the instance count, which can provide additional resources as needed. Rules can also help you save money when the app is over-provisioned.

For more information about autoscale, see [How to scale](../monitoring-and-diagnostics/insights-how-to-scale.md) and [Best practices for Azure Monitor autoscaling](../azure-monitor/platform/autoscale-best-practices.md).

[fzilla]:https://go.microsoft.com/fwlink/?LinkId=247914
[vmsizes]:https://go.microsoft.com/fwlink/?LinkID=309169

<!-- Images. -->
[http403]: ./media/web-sites-monitor/http403.png
[quotas]: ./media/web-sites-monitor/quotas.png
[metrics]: ./media/web-sites-monitor/metrics.png
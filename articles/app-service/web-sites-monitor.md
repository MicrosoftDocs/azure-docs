---
title: Monitor apps
description: Learn how to monitor apps in Azure App Service by using the Azure portal. Understand the quotas and metrics that are reported.

ms.assetid: d273da4e-07de-48e0-b99d-4020d84a425e
ms.topic: article
ms.date: 06/29/2023
ms.author: msangapu
author: msangapu-msft
ms.custom: seodec18

---
# Monitor apps in Azure App Service
[Azure App Service](./overview.md) provides
built-in monitoring functionality for web apps, mobile, and API apps in the [Azure portal](https://portal.azure.com).

In the Azure portal, you can review *quotas* and *metrics* for an app and App Service plan, and set up *alerts* and *autoscaling* rules based metrics.

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
*Premium* is Filesystem.

For more information about the specific quotas, limits, and features available to the various App Service SKUs, see [Azure Subscription service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits).

### Quota enforcement

If an app exceeds the *CPU (short)*, *CPU (Day)*, or *bandwidth* quota, the app is stopped until the quota resets. During this time, all incoming requests result in an HTTP 403 error.

![403 error message][http403]

If the app Memory quota is exceeded, the app is stopped temporarily.

If the Filesystem quota is exceeded, any write operation fails. Write operation failures include any writes to logs.

You can increase or remove quotas from your app by upgrading your App Service plan.

## Understand metrics

> [!IMPORTANT]
> **Average Response Time** will be deprecated to avoid confusion with metric aggregations. Use **Response Time** as a replacement.

> [!NOTE]
> Metrics for an app include the requests to the app's SCM site(Kudu).  This includes requests to view the site's logstream using Kudu.  Logstream requests may span several minutes, which will affect the Request Time metrics.  Users should be aware of this relationship when using these metrics with autoscale logic.
> 
> **Http Server Errors** only records requests that reach the backend service (the worker(s) hosting the app). If the requests are failing at the FrontEnd, they are not recorded as Http Server Errors. The [Health Check feature](./monitor-instances-health-check.md) / Application Insights availability tests can be used for outside in monitoring.

Metrics provide information about the app or the App Service plan's behavior.

For an app, the available metrics are:

| Metric | Description |
| --- | --- |
| **Response Time** | The time taken for the app to serve requests, in seconds. |
| **Average Response Time (deprecated)** | The average time taken for the app to serve requests, in seconds. |
| **Average memory working set** | The average amount of memory used by the app, in megabytes (MiB). |
| **Connections** | The number of bound sockets existing in the sandbox (w3wp.exe and its child processes).  A bound socket is created by calling bind()/connect() APIs and remains until said socket is closed with CloseHandle()/closesocket(). |
| **CPU Time** | The amount of CPU consumed by the app, in seconds. For more information about this metric, see [CPU time vs CPU percentage](#cpu-time-vs-cpu-percentage). |
| **Current Assemblies** | The current number of Assemblies loaded across all AppDomains in this application. |
| **Data In** | The amount of incoming bandwidth consumed by the app, in MiB. |
| **Data Out** | The amount of outgoing bandwidth consumed by the app, in MiB. |
| **File System Usage** | The amount of usage in bytes by storage share. |
| **Gen 0 Garbage Collections** | The number of times the generation 0 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs.|
| **Gen 1 Garbage Collections** | The number of times the generation 1 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs.|
| **Gen 2 Garbage Collections** | The number of times the generation 2 objects are garbage collected since the start of the app process.|
| **Handle Count** | The total number of handles currently open by the app process.|
| **Health Check Status** | The average health status across the application's instances in the App Service Plan.|
| **Http 2xx** | The count of requests resulting in an HTTP status code ≥ 200 but < 300. |
| **Http 3xx** | The count of requests resulting in an HTTP status code ≥ 300 but < 400. |
| **Http 401** | The count of requests resulting in HTTP 401 status code. |
| **Http 403** | The count of requests resulting in HTTP 403 status code. |
| **Http 404** | The count of requests resulting in HTTP 404 status code. |
| **Http 406** | The count of requests resulting in HTTP 406 status code. |
| **Http 4xx** | The count of requests resulting in an HTTP status code ≥ 400 but < 500. |
| **Http Server Errors** | The count of requests resulting in an HTTP status code ≥ 500 but < 600. |
| **IO Other Bytes Per Second** | The rate at which the app process is issuing bytes to I/O operations that don't involve data, such as control operations.|
| **IO Other Operations Per Second** | The rate at which the app process is issuing I/O operations that aren't read or write operations.|
| **IO Read Bytes Per Second** | The rate at which the app process is reading bytes from I/O operations.|
| **IO Read Operations Per Second** | The rate at which the app process is issuing read I/O operations.|
| **IO Write Bytes Per Second** | The rate at which the app process is writing bytes to I/O operations.|
| **IO Write Operations Per Second** | The rate at which the app process is issuing write I/O operations.|
| **Memory working set** | The current amount of memory used by the app, in MiB. |
| **Private Bytes** | Private Bytes is the current size, in bytes, of memory that the app process has allocated that can't be shared with other processes.|
| **Requests** | The total number of requests regardless of their resulting HTTP status code. |
| **Requests In Application Queue** | The number of requests in the application request queue.|
| **Thread Count** | The number of threads currently active in the app process.|
| **Total App Domains** | The current number of AppDomains loaded in this application.|
| **Total App Domains Unloaded** | The total number of AppDomains unloaded since the start of the application.|


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
| **Disk Queue Length** | The average number of both read and write requests that were queued on storage. A high disk queue length is an indication of an app that might be slowing down because of excessive disk I/O. |
| **Http Queue Length** | The average number of HTTP requests that had to sit on the queue before being fulfilled. A high or increasing HTTP Queue length is a symptom of a plan under heavy load. |

### CPU time vs CPU percentage
<!-- To do: Fix Anchor (#CPU-time-vs.-CPU-percentage) -->

There are two metrics that reflect CPU usage:

**CPU Time**: Useful for apps hosted in Free or Shared plans, because one of their quotas is defined in CPU minutes used by the app.

**CPU percentage**: Useful for apps hosted in Basic, Standard, and Premium plans, because they can be scaled out. CPU percentage is a good indication of the overall usage across all instances.

## Metrics granularity and retention policy
Metrics for an app and app service plan are logged and aggregated by the service and [retained according to these rules](../azure-monitor/essentials/data-platform-metrics.md#retention-of-metrics).

## Monitoring quotas and metrics in the Azure portal
To review the status of the various quotas and metrics that affect an app, go to the [Azure portal](https://portal.azure.com).

![Quotas chart in the Azure portal][quotas]

To find quotas, select **Settings** > **Quotas**. On the chart, you can review: 
1. The quota name.
1. Its reset interval.
1. Its current limit.
1. Its current value.

![Metric chart in the Azure portal][metrics]
You can access metrics directly from the resource **Overview** page. Here you'll see charts representing some of the apps metrics.

Clicking on any of those charts will take you to the metrics view where you can create custom charts, query different metrics and much more. 

To learn more about metrics, see [Monitor service metrics](../azure-monitor/data-platform.md).

## Alerts and autoscale
Metrics for an app or an App Service plan can be hooked up to alerts. For more information, see [Receive alert notifications](../azure-monitor/alerts/alerts-classic-portal.md).

App Service apps hosted in Basic or higher App Service plans support autoscale. With autoscale, you can configure rules that monitor the App Service plan metrics. Rules can increase or decrease the instance count, which can provide additional resources as needed. Rules can also help you save money when the app is over-provisioned.

For more information about autoscale, see [How to scale](../azure-monitor/autoscale/autoscale-get-started.md) and [Best practices for Azure Monitor autoscaling](../azure-monitor/autoscale/autoscale-best-practices.md).

[fzilla]:https://go.microsoft.com/fwlink/?LinkId=247914
[vmsizes]:https://go.microsoft.com/fwlink/?LinkID=309169

<!-- Images. -->
[http403]: ./media/web-sites-monitor/http403.png
[quotas]: ./media/web-sites-monitor/quotas.png
[metrics]: ./media/web-sites-monitor/metrics.png

---
title: Fix HTTP 502 and HTTP 503 Errors
description: Troubleshoot 502 Bad Gateway and 503 Service Unavailable errors in your app hosted in Azure App Service.
tags: top-support-issue
keywords: 502 bad gateway, 503 service unavailable, error 503, error 502

ms.assetid: 51cd331a-a3fa-438f-90ef-385e755e50d5
ms.topic: troubleshooting-general
ms.date: 07/06/2016
ms.author: msangapu
author: msangapu-msft
---

# Troubleshoot HTTP 502 and 503 errors in Azure App Service

HTTP "502 Bad Gateway" and "503 Service Unavailable" are common errors that you can get when you try to open your app that's hosted in [Azure App Service](./overview.md). This article helps you troubleshoot these errors.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident on the [Azure Support site](https://azure.microsoft.com/support/options/) by selecting **Get Support**.

The cause of these errors is often an application-level problem, such as:

* Requests are taking a long time.
* The app is using high memory or CPU.
* An exception is preventing the app from responding.

Troubleshooting consists of three tasks, in sequential order:

1. Observe and monitor application behavior.
2. Collect data.
3. Mitigate the problem.

App Service gives you options for each task.

<a name="observe"></a>

## Observe and monitor application behavior

### Track service health

Azure publicizes service interruptions and performance degradations in App Service. You can track the health of the service in the [Azure portal](https://portal.azure.com/). For more information, see [View service health notifications by using the Azure portal](/azure/service-health/service-notifications).

### Monitor your app

You can monitor your app to find out if it's having any problems. On the Azure portal page for your app, select the **Requests and errors** tile. The **Metric** box shows you all the metrics that you can add.

Some of the metrics that you might want to monitor for your app are:

* Average memory working set
* Average response time
* CPU time
* Memory working set
* Requests

:::image type="content" source="./media/app-service-web-troubleshoot-HTTP-502-503/1-monitor-metrics.png" alt-text="Screenshot that shows metric options for an app in the portal.":::

For more information, see:

* [Azure App Service quotas and metrics](web-sites-monitor.md)
* [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)

<a name="collect"></a>

## Collect data

### Use the diagnostics feature

App Service provides an intelligent and interactive experience to help you troubleshoot your app, with no configuration required. The diagnostics feature can discover a problem and guide you to the right information for troubleshooting and resolution.

To access App Service diagnostics, go to your App Service app or App Service Environment in the [Azure portal](https://portal.azure.com). On the left menu, select **Diagnose and solve problems**.

### Use the Kudu debug console

App Service comes with a console that you can use for debugging, exploring, and uploading files. It also provides JSON endpoints that you can use to get information about your environment. This console is part of the Kudu dashboard for your app.

You can access the dashboard by going to the link `https://<Your app name>.scm.azurewebsites.net/`.

Kudu provides:

* Environment settings for your application.
* A log stream.
* A diagnostic dump.
* The debug console, in which you can run PowerShell cmdlets and basic DOS commands.

If your application is throwing first-chance exceptions, you can use Kudu and the Sysinternals tool ProcDump to create memory dumps. These memory dumps are snapshots of the process and can often help you troubleshoot more complicated problems with your app.

For more information on features available in Kudu, see the blog post
[Kudu Dashboard explained - WordPress on App Service](https://techcommunity.microsoft.com/blog/appsonazureblog/kudu-dashboard-explained---wordpress-on-app-service/4030035).

<a name="mitigate"></a>

## Mitigate the problem

### Scale the app

In Azure App Service, for increased performance and throughput, you can adjust the scale at which you run your application. Scaling up an app involves two related actions:

* Changing your App Service plan to a higher pricing tier
* Configuring certain settings after you switch to a higher pricing tier

For more information on scaling, see [Scale an app in Azure App Service](manage-scale-up.md).

Additionally, you can choose to run your application on more than one instance. This choice not only provides you with more processing capability but also gives you some amount of fault tolerance. If the process goes down on one instance, the other instance continues to serve requests.

You can set the scaling to be manual or automatic.

### Use auto-healing

Auto-healing recycles the worker process for your app based on settings that you choose. The settings include configuration changes, requests, memory-based limits, or the time needed to execute a request.

Most of the time, recycling the process is the fastest way to recover from a problem. Though you can always restart the app directly in the Azure portal, auto-healing can do it automatically for you. All you need to do is add some triggers in the root `Web.config` file for your app. These settings work in the same way even if your application is not a .NET one.

For more information, see [Azure App Service diagnostics overview](overview-diagnostics.md#auto-healing).

### Restart the app

Restarting your app is often the simplest way to recover from one-time problems. On the [Azure portal](https://portal.azure.com/) page for your app, you have the option to stop or restart your app.

:::image type="content" source="./media/app-service-web-troubleshoot-HTTP-502-503/2-restart.png" alt-text="Screenshot that shows options for stopping and restarting an app in the portal.":::

You can also manage your app by using Azure PowerShell. For more information, see
[Manage Azure resources by using Azure PowerShell](../azure-resource-manager/management/manage-resources-powershell.md).

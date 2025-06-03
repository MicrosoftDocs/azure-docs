---
title: Troubleshoot Performance Degradation
description: Learn how to troubleshoot slow app performance issues in Azure App Service. Monitor app behavior, collect data, and mitigate the issue.
tags: top-support-issue
keywords: web app performance, slow app, app slow

ms.assetid: b8783c10-3a4a-4dd6-af8c-856baafbdde5
ms.topic: article
ms.date: 04/30/2025
ms.author: msangapu
author: msangapu-msft
ms.custom:
  - build-2025
---
# Troubleshoot slow app performance issues in Azure App Service

This article helps you troubleshoot slow app performance issues in [Azure App Service](./overview.md).

If you require more help at any point in this article, contact the Azure experts at [Azure Community Support](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select **Submit a support ticket**.

## Symptom

When you browse the app, the pages load slowly and sometimes time out.

## Cause

This problem is often caused by application level issues, such as:

* Network requests taking a long time
* Application code or database queries being inefficient
* Application using high memory/CPU
* Application crashing due to an exception

## Troubleshooting steps

Troubleshooting can be divided into three distinct tasks, in sequential order:

1. [Observe and monitor application behavior](#observe)
1. [Collect data](#collect)
1. [Mitigate the issue](#mitigate)

[App Service](overview.md) gives you various options at each step.

<a name="observe"></a>

## Observe and monitor application behavior

### Track service health

Azure publicizes each service interruption or performance degradation. You can track the health of the service in the [Azure portal](https://portal.azure.com/). For more information, see [View service health notifications by using the Azure portal](/azure/service-health/service-notifications).

### Monitor your app

You can use monitoring tools in the Azure portal to find out if your application is having any issues. Under **Monitoring** in the sidebar menu, select **Metrics**. The **Metric** dropdown menu shows you all the metrics you can add.

Some of the metrics that you might want to monitor for your app include:

* Average memory working set
* CPU time
* Memory working set
* Requests
* Response time

:::image type="content" source="media/app-service-web-troubleshoot-performance-degradation/1-monitor-metrics.png" alt-text="Screenshot of the metrics section under Monitoring.":::

For more information, see:

* [Azure App Service quotas and metrics](web-sites-monitor.md)
* [Receive alert notifications](/azure/azure-monitor/alerts/alerts-overview)

### Monitor web endpoint status

If your app in running in the **Standard** pricing tier, App Service lets you monitor two endpoints from three geographic locations.

Endpoint monitoring configures web tests from geo-distributed locations that test response time and uptime of web URLs. The test performs an `HTTP GET` operation on the web URL to determine the response time and uptime from each location. Each configured location runs a test every five minutes.

Uptime is monitored using HTTP response codes, and response time is measured in milliseconds. A monitoring test fails if the HTTP response code is greater than or equal to 400 or if the response takes more than 30 seconds. An endpoint is considered available if its monitoring tests succeed from all the specified locations.

To set it up, see [Azure App Service quotas and metrics](web-sites-monitor.md).

### Application performance monitoring using extensions

You can also monitor your application performance by using a *site extension*.

Each App Service app provides an extensible management endpoint that allows you to use a powerful set of tools deployed as site extensions. Extensions include: 

- Source code editors like [GitHub Codespaces](https://github.com/features/codespaces/).
- Management tools for connected resources such as a MySQL database connected to an app.

[Azure Application Insights](https://azure.microsoft.com/services/application-insights/) is a performance monitoring site extension that's also available. To use Application Insights, you rebuild your code with an SDK. You can also install an extension that provides access to additional data. The SDK lets you write code to monitor the usage and performance of your app in more detail. For more information, see [Introduction to Application Insights - OpenTelemetry observability](/azure/azure-monitor/app/app-insights-overview).

<a name="collect"></a>

## Collect data

App Service provides diagnostic functionality for logging information from both the web server and the web application. The information is separated into web server diagnostics and application diagnostics.

### Enable web server diagnostics

You can enable or disable the following kinds of logs:

* **Detailed Error Logging**: Detailed error information for HTTP status codes that indicate a failure (status code 400 or greater). This might contain information that can help determine why the server returned the error code.
* **Failed Request Tracing**: Detailed information on failed requests, including a trace of the IIS components used to process the request and the time taken in each component. This can be useful if you're attempting to improve app performance or isolate what is causing a specific HTTP error.
* **Web Server Logging**: Information about HTTP transactions using the W3C extended log file format. This is useful when determining overall app metrics, such as the number of requests handled or how many requests are from a specific IP address.

### Enable application diagnostics

There are several options to collect application performance data from App Service, profile your application live from Visual Studio, or modify your application code to log more information and traces. You can choose the options based on how much access you have to the application and what you observed from the monitoring tools.

#### Use Application Insights Profiler

You can enable the Application Insights Profiler to start capturing detailed performance traces. You can access traces captured up to five days in the past when you need to investigate problems. You can choose this option as long as you have access to the app's Application Insights resource on Azure portal.

Application Insights Profiler provides statistics on response time for each web call and traces that indicate which line of code caused the slow responses. Sometimes the App Service app is slow because certain code isn't written in a performant way. Examples include sequential code that can be run in parallel and undesired database lock contentions. Removing these bottlenecks in the code increases the app's performance, but they're hard to detect without setting up elaborate traces and logs. The traces collected by Application Insights Profiler helps identifying the lines of code that slows down the application and overcome this challenge for App Service apps.

For more information, see [Enable the .NET Profiler for Azure App Service apps in Windows](/azure/azure-monitor/profiler/profiler).

#### Set up diagnostic traces manually

If you have access to the web application source code, application diagnostics allows you to capture information produced by a web application. ASP.NET applications can use the `System.Diagnostics.Trace` class to log information to the application diagnostics log. However, you need to change the code and redeploy your application. This method is recommended if your app is running on a testing environment.

For detailed instructions on how to configure your application for logging, see [Enable diagnostic logging for apps in Azure App Service](troubleshoot-diagnostic-logs.md).

### Use the diagnostics tool

App Service provides an intelligent and interactive experience to help you troubleshoot your app with no configuration required. When you do run into issues with your app, the diagnostics tool points out what’s wrong to guide you to the right information to more easily and quickly troubleshoot and resolve the issue.

To access App Service diagnostics, navigate to your App Service app or App Service Environment in the [Azure portal](https://portal.azure.com). In the sidebar menu, select **Diagnose and solve problems**.

### Use the Kudu Debug Console

App Service comes with a debug console that you can use for debugging, exploring, uploading files, as well as JSON endpoints for getting information about your environment. This console is called the *Kudu Console* or the *SCM Dashboard* for your app.

You can access this dashboard by going to your Kudu site.

Some of the things that Kudu provides are:

* Environment settings for your application
* Log stream
* Diagnostic dump
* Debug console in which you can run PowerShell cmdlets and basic DOS commands

Another useful feature of Kudu is that, in case your application is throwing first-chance exceptions, you can use Kudu and the SysInternals tool Procdump to create memory dumps. These memory dumps are snapshots of the process and can often help you troubleshoot more complicated issues with your app.

For more information on features available in Kudu, see [Windows Azure Websites online tools you should know about](https://azure.microsoft.com/blog/windows-azure-websites-online-tools-you-should-know-about/).

<a name="mitigate"></a>

## Mitigate the issue

### Scale the app

In App Service, for increased performance and throughput, you can adjust the scale at which you're running your application. Scaling up an app involves two related actions: changing your App Service plan to a higher pricing tier, and configuring certain settings after you switch to the higher pricing tier.

For more information on scaling, see [Scale an app in Azure App Service](manage-scale-up.md).

Additionally, you can choose to run your application on more than one instance. Scaling out not only provides you with more processing capability, but also gives you some amount of fault tolerance. If the process goes down on one instance, the other instances continue to serve requests.

You can set the scaling to be manual or automatic.

### Use auto-heal

Auto-heal recycles the worker process for your app based on settings you choose, like configuration changes, requests, memory-based limits, or the time needed to execute a request. Most of the time, recycling the process is the fastest way to recover from a problem. Though you can always restart the app from directly within the Azure portal, auto-heal does it automatically for you. All you need to do is add some triggers in the root web.config for your app. These settings would work in the same way even if your application isn't a .NET app.

For more information, see [Auto-Healing Azure Web Sites](https://azure.microsoft.com/blog/auto-healing-windows-azure-web-sites/).

### Restart the app

Restarting is often the simplest way to recover from one-time issues. In the [Azure portal](https://portal.azure.com/), you have the options to stop or restart your app.

:::image type="content" source="media/app-service-web-troubleshoot-performance-degradation/2-restart.png" alt-text="Screenshot of the app menu bar with stop and restart buttons.":::

You can also manage your app using Azure PowerShell. For more information, see [Manage Azure resources by using Azure PowerShell](../azure-resource-manager/management/manage-resources-powershell.md).

## Related content

- [Troubleshooting intermittent outbound connection errors in Azure App Service](troubleshoot-intermittent-outbound-connection-errors.md)
- [Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)

---
title: Troubleshoot performance degradation
description: Find out how to troubleshoot slow app performance issues in Azure App Service, including monitoring app behavior, collecting data, and mitigating the issue.
tags: top-support-issue
keywords: web app performance, slow app, app slow

ms.assetid: b8783c10-3a4a-4dd6-af8c-856baafbdde5
ms.topic: article
ms.date: 08/03/2016
ms.custom: seodec18
ms.author: msangapu
author: msangapu-msft

---
# Troubleshoot slow app performance issues in Azure App Service
This article helps you troubleshoot slow app performance issues in [Azure App Service](./overview.md).

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click on **Get Support**.

## Symptom
When you browse the app, the pages load slowly and sometimes timeout.

## Cause
This problem is often caused by application level issues, such as:

* network requests taking a long time
* application code or database queries being inefficient
* application using high memory/CPU
* application crashing due to an exception

## Troubleshooting steps
Troubleshooting can be divided into three distinct tasks, in sequential order:

1. [Observe and monitor application behavior](#observe)
2. [Collect data](#collect)
3. [Mitigate the issue](#mitigate)

[App Service](overview.md) gives you various options at each step.

<a name="observe"></a>

### 1. Observe and monitor application behavior
#### Track Service health
Microsoft Azure publicizes each time there is a service interruption or performance degradation. You can track the health of the service on the [Azure portal](https://portal.azure.com/). For more information, see [Track service health](../service-health/service-notifications.md).

#### Monitor your app
This option enables you to find out if your application is having any issues. In your app’s blade, click the **Requests and errors** tile. The **Metric** blade shows you all the metrics you can add.

Some of the metrics that you might want to monitor for your app are

* Average memory working set
* Response time
* CPU time
* Memory working set
* Requests

![monitor app performance](./media/app-service-web-troubleshoot-performance-degradation/1-monitor-metrics.png)

For more information, see:

* [Monitor apps in Azure App Service](web-sites-monitor.md)
* [Receive alert notifications](../azure-monitor/alerts/alerts-overview.md)

#### Monitor web endpoint status
If you are running your app in the **Standard** pricing tier, App Service lets you monitor two endpoints from three geographic locations.

Endpoint monitoring configures web tests from geo-distributed locations that test response time and uptime of web URLs. The test performs an HTTP GET operation on the web URL to determine the response time and uptime from each location. Each configured location runs a test every five minutes.

Uptime is monitored using HTTP response codes, and response time is measured in milliseconds. A monitoring test fails if the HTTP response code is greater than or equal to 400 or if the response takes more than 30 seconds. An endpoint is considered available if its monitoring tests succeed from all the specified locations.

To set it up, see [Monitor apps in Azure App Service](web-sites-monitor.md).

Also, see Keeping Azure Web Sites up plus Endpoint Monitoring - with Stefan Schackow for a video on endpoint monitoring.

#### Application performance monitoring using Extensions
You can also monitor your application performance by using a *site extension*.

Each App Service app provides an extensible management end point that allows you to use a powerful set of tools deployed as site extensions. Extensions include: 

- Source code editors like [Azure DevOps](https://www.visualstudio.com/products/what-is-visual-studio-online-vs.aspx). 
- Management tools for connected resources such as a MySQL database connected to an app.

[Azure Application Insights](https://azure.microsoft.com/services/application-insights/) is a performance monitoring site extension that's also available. To use Application Insights, you rebuild your code with an SDK. You can also install an extension that provides access to additional data. The SDK lets you write code to monitor the usage and performance of your app in more detail. For more information, see [Monitor performance in web applications](../azure-monitor/app/app-insights-overview.md).

<a name="collect"></a>

### 2. Collect data
App Service provides diagnostic functionality for logging information from both the web server and the web application. The information is separated into web server diagnostics and application diagnostics.

#### Enable web server diagnostics
You can enable or disable the following kinds of logs:

* **Detailed Error Logging** - Detailed error information for HTTP status codes that indicate a failure (status code 400 or greater). This may contain information that can help determine why the server returned the error code.
* **Failed Request Tracing** - Detailed information on failed requests, including a trace of the IIS components used to process the request and the time taken in each component. This can be useful if you are attempting to improve app performance or isolate what is causing a specific HTTP error.
* **Web Server Logging** - Information about HTTP transactions using the W3C extended log file format. This is useful when determining overall app metrics, such as the number of requests handled or how many requests are from a specific IP address.

#### Enable application diagnostics
There are several options to collect application performance data from App Service, profile your application live from Visual Studio, or modify your application code to log more information and traces. You can choose the options based on how much access you have to the application and what you observed from the monitoring tools.

##### Use Application Insights Profiler
You can enable the Application Insights Profiler to start capturing detailed performance traces. You can access traces captured up to five days ago when you need to investigate problems happened in the past. You can choose this option as long as you have access to the app's Application Insights resource on Azure portal.

Application Insights Profiler provides statistics on response time for each web call and traces that indicates which line of code caused the slow responses. Sometimes the App Service app is slow because certain code is not written in a performant way. Examples include sequential code that can be run in parallel and undesired database lock contentions. Removing these bottlenecks in the code increases the app's performance, but they are hard to detect without setting up elaborate traces and logs. The traces collected by Application Insights Profiler helps identifying the lines of code that slows down the application and overcome this challenge for App Service apps.

 For more information, see [Profiling live apps in Azure App Service with Application Insights](../azure-monitor/app/profiler.md).

##### Use Remote Profiling
In Azure App Service, web apps, API apps, mobile back ends, and WebJobs can be remotely profiled. Choose this option if you have access to the app resource and you know how to reproduce the issue, or if you know the exact time interval the performance issue happens.

Remote Profiling is useful if the CPU usage of the process is high and your process is running slower than expected, or the latency of HTTP requests are higher than normal, you can remotely profile your process and get the CPU sampling call stacks to analyze the process activity and code hot paths.

For more information, see [Remote Profiling support in Azure App Service](https://azure.microsoft.com/blog/remote-profiling-support-in-azure-app-service).

##### Set up diagnostic traces manually
If you have access to the web application source code, Application diagnostics enables you to capture information produced by a web application. ASP.NET applications can use the `System.Diagnostics.Trace` class to log information to the application diagnostics log. However, you need to change the code and redeploy your application. This method is recommended if your app is running on a testing environment.

For detailed instructions on how to configure your application for logging, see [Enable diagnostics logging for apps in Azure App Service](troubleshoot-diagnostic-logs.md).

#### Use the diagnostics tool
App Service provides an intelligent and interactive experience to help you troubleshoot your app with no configuration required. When you do run into issues with your app, the diagnostics tool will point out what’s wrong to guide you to the right information to more easily and quickly troubleshoot and resolve the issue.

To access App Service diagnostics, navigate to your App Service app or App Service Environment in the [Azure portal](https://portal.azure.com). In the left navigation, click on **Diagnose and solve problems**.

#### Use the Kudu Debug Console
App Service comes with a debug console that you can use for debugging, exploring, uploading files, as well as JSON endpoints for getting information about your environment. This console is called the *Kudu Console* or the *SCM Dashboard* for your app.

You can access this dashboard by going to the link **https://&lt;Your app name>.scm.azurewebsites.net/**.

Some of the things that Kudu provides are:

* environment settings for your application
* log stream
* diagnostic dump
* debug console in which you can run PowerShell cmdlets and basic DOS commands.

Another useful feature of Kudu is that, in case your application is throwing first-chance exceptions, you can use Kudu and the SysInternals tool Procdump to create memory dumps. These memory dumps are snapshots of the process and can often help you troubleshoot more complicated issues with your app.

For more information on features available in Kudu, see
[Azure DevOps tools you should know about](https://azure.microsoft.com/blog/windows-azure-websites-online-tools-you-should-know-about/).

<a name="mitigate"></a>

### 3. Mitigate the issue
#### Scale the app
In Azure App Service, for increased performance and throughput,  you can adjust the scale at which you are running your application. Scaling up an app involves two related actions: changing your App Service plan to a higher pricing tier, and configuring certain settings after you have switched to the higher pricing tier.

For more information on scaling, see [Scale an app in Azure App Service](manage-scale-up.md).

Additionally, you can choose to run your application on more than one instance. Scaling out not only provides you with more processing capability, but also gives you some amount of fault tolerance. If the process goes down on one instance, the other instances continue to serve requests.

You can set the scaling to be Manual or Automatic.

#### Use AutoHeal
AutoHeal recycles the worker process for your app based on settings you choose (like configuration changes, requests, memory-based limits, or the time needed to execute a request). Most of the time, recycle the process is the fastest way to recover from a problem. Though you can always restart the app from directly within the Azure portal, AutoHeal does it automatically for you. All you need to do is add some triggers in the root web.config for your app. These settings would work in the same way even if your application is not a .NET app.

For more information, see [Auto-Healing Azure Web Sites](https://azure.microsoft.com/blog/auto-healing-windows-azure-web-sites/).

#### Restart the app
Restarting is often the simplest way to recover from one-time issues. On the [Azure portal](https://portal.azure.com/), on your app’s blade, you have the options to stop or restart your app.

 ![restart app to solve performance issues](./media/app-service-web-troubleshoot-performance-degradation/2-restart.png)

You can also manage your app using Azure PowerShell. For more information, see
[Using Azure PowerShell with Azure Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md).

## More resources

[Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)

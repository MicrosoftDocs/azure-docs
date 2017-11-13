---
title: Profile live web apps on Azure with Application Insights Profiler | Microsoft Docs
description: Identify the hot path in your web server code with a low-footprint profiler.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: mbullwin

---
# Profile live Azure web apps with Application Insights

*This feature of Application Insights is generally available for Azure App Service and is in preview for Azure compute resources.*

Find out how much time is spent in each method in your live web application by using [Application Insights Profiler](app-insights-overview.md). The Application Insights profiling tool shows detailed profiles of live requests that were served by your app, and highlights the *hot path* that uses the most time. The profiler automatically selects examples that have different response times, and then uses various techniques to minimize overhead.

The profiler currently works for ASP.NET web apps running on Azure App Service, in at least the Basic service tier.

## <a id="installation"></a> Enable the profiler

[Install Application Insights](app-insights-asp-net.md) in your code. If it's already installed, make sure you have the latest version. To check for the latest version, in Solution Explorer, right-click your project, and then select **Manage NuGet packages** > **Updates** > **Update all packages**. Then, redeploy your app.

*Using ASP.NET Core? Get [more information](#aspnetcore).*

In [the Azure portal](https://portal.azure.com), open the Application Insights resource for your web app. Select **Performance** > **Enable Application Insights Profiler**.

![Select the Enable profiler banner][enable-profiler-banner]

Alternatively, you can select **Configure** to view status and enable or disable the profiler.

![Under Performance, select Configure][performance-blade]

Web apps that are configured with Application Insights are listed under **Configure**. Follow instructions to install the profiler agent, if needed. If no web apps have been configured with Application Insights, select **Add Linked Apps**.

To control the profiler on all your linked web apps, in the **Configure** pane, select **Enable Profiler** or **Disable Profiler**.

![Configure pane options][linked app services]

Unlike web apps that are hosted through App Service plans, applications that are hosted in Azure compute resources (for example, Azure Virtual Machines, virtual machine scale sets, Azure Service Fabric, or Azure Cloud Services) are not directly managed by Azure. In this case, there's no web app to link to. Instead of linking to an app, select the **Enable Profiler** button.

## Disable the profiler
To stop or restart the profiler for an individual App Service instance, under **Web Jobs**, go to the App Service resource. To delete the profiler, go to **Extensions**.

![Disable profiler for a web jobs][disable-profiler-webjob]

We recommend that you have the profiler enabled on all your web apps to discover any performance issues as early as possible.

If you use WebDeploy to deploy changes to your web application, ensure that you exclude the App_Data folder from being deleted during deployment. Otherwise, the profiler extension's files are deleted the next time you deploy the web application to Azure.

### Using profiler with Azure VMs and Azure compute resources (preview)

When you [enable Application Insights for Azure App Service at runtime](app-insights-azure-web-apps.md#run-time-instrumentation-with-application-insights), Application Insights Profiler is automatically available. If you have already enabled Application Insights for the resource, you might need to update to the latest version by using the Configure wizard.

Get information about a [preview version of the profiler for Azure compute resources](https://go.microsoft.com/fwlink/?linkid=848155).


## Limitations

The default data retention is five days. The maximum data ingested per day is 10 GB.

There are no charges for using the profiler service. To use the profiler service, your web app must be hosted in at least the Basic tier of App Service.

## Overhead and sampling algorithm

The profiler randomly runs two minutes every hour on each virtual machine that hosts the application that has profiler enabled for capturing traces. When the profiler is running, it adds between 5% and 15% CPU overhead to the server.
The more servers that are available for hosting the application, the less impact the profiler has on the overall application performance. This is because the sampling algorithm results in the profiler running on only 5% of servers at any time. More servers are available to serve web requests to offset the server overhead caused by running the profiler.


## View profiler data

Go to the **Performance** pane, and then scroll down to the list of operations.

![Application Insights Performance pane examples column][performance-blade-examples]

The operations table has these columns:

* **COUNT**: The number of these requests in the time range of the **COUNT** pane.
* **MEDIAN**: The typical time your app takes to respond to a request. Half of all responses were faster than this value.
* **95TH PERCENTILE**:  95% of responses were faster than this value. If this value is substantially different from the median, there might be an intermittent problem with your app. (Or, it might be explained by a design feature, like caching.)
* **PROFILER TRACES**: An icon indicates that the profiler has captured stack traces for this operation.

Select **View** to open the trace explorer. The explorer shows several samples that the profiler has captured, classified by response time.

If you are using the **Preview Performance** pane, go to the **Take Actions** section of the page to view profiler traces. Select the **Profiler Traces** button.

![Application Insights Performance pane preview profiler traces][performance-blade-v2-examples]

Select a sample to show a code-level breakdown of time spent executing the request.

![Application Insights trace explorer][trace-explorer]

The trace explorer shows the following information:

* **Show Hot Path**: Opens the biggest leaf node, or at least something close. In most cases, this node
is adjacent to a performance bottleneck.
* **Label**: The name of the function or event. The tree shows a mix of code and events that occurred (like SQL and HTTP events). The top event represents the overall request duration.
* **Elapsed**: The time interval between the start of the operation and the end of the operation.
* **When**: When the function or event was running in relation to other functions.

## How to read performance data

The Microsoft service profiler uses a combination of sampling methods and instrumentation to analyze the performance of your application. When detailed collection is in progress, the service profiler samples the instruction pointer of each of the machine's CPU in every millisecond. Each sample captures the complete call stack of the thread that currently is executing. It gives detailed and useful information about what that thread was doing, both at a high level and at a low level of abstraction. The service profiler also collects other events to track activity correlation and causality, including context switching events, Task Parallel Library (TPL) events, and thread pool events.

The call stack that's shown in the timeline view is the result of the sampling and instrumentation. Because each sample captures the complete call stack of the thread, it includes code from the Microsoft .NET Framework, and from other frameworks that you reference.

### <a id="jitnewobj"></a>Object allocation (clr!JIT\_New or clr!JIT\_Newarr1)
**clr!JIT\_New** and **clr!JIT\_Newarr1** are helper functions in the .NET Framework that allocate memory from a managed heap. **clr!JIT\_New** is invoked when an object is allocated. **clr!JIT\_Newarr1** is invoked when an object array is allocated. These two functions typically are very fast, and take relatively small amounts of time. If you see **clr!JIT\_New** or **clr!JIT\_Newarr1** take a substantial amount of time in your timeline, it's an indication that the code might be allocating many objects and consuming significant amounts of memory.

### <a id="theprestub"></a>Loading code (clr!ThePreStub)
**clr!ThePreStub** is a helper function in the .NET Framework that prepares the code to execute for the first time. This typically includes, but is not limited to, just-in-time (JIT) compilation. For each C# method, **clr!ThePreStub** should be invoked at most once during the lifetime of a process.

If **clr!ThePreStub** takes a substantial amount of time for a request, this indicates that the request is the first one that executes that method. The time for the .NET Framework runtime to load that method is significant. You might consider using a warmup process that executes that portion of the code before your users access it, or consider running Native Image Generator (ngen.exe) on your assemblies.

### <a id="lockcontention"></a>Lock contention (clr!JITutil\_MonContention or clr!JITutil\_MonEnterWorker)
**clr!JITutil\_MonContention** or **clr!JITutil\_MonEnterWorker** indicates that the current thread is waiting for a lock to be released. This typically shows up when executing a C# **LOCK** statement, when invoking the **Monitor.Enter** method, or when invoking a method with the **MethodImplOptions.Synchronized** attribute. Lock contention typically occurs when thread A acquires a lock, and thread B tries to acquire the same lock before thread A releases it.

### <a id="ngencold"></a>Loading code ([COLD])
If the method name contains **[COLD]**, such as **mscorlib.ni![COLD]System.Reflection.CustomAttribute.IsDefined**, the .NET Framework runtime is executing code for the first time that is not optimized by <a href="https://msdn.microsoft.com/library/e7k32f4k.aspx">profile-guided optimization</a>. For each method, it should show up at most once during the lifetime of the process.

If loading code takes a substantial amount of time for a request, this indicates that the request is the first one to execute the unoptimized portion of the method. Consider using a warmup process that executes that portion of the code before your users access it.

### <a id="httpclientsend"></a>Send HTTP request
Methods like **HttpClient.Send** indicate that the code is waiting for an HTTP request to be completed.

### <a id="sqlcommand"></a>Database operation
Methods like **SqlCommand.Execute** indicate that the code is waiting for a database operation to finish.

### <a id="await"></a>Waiting (AWAIT\_TIME)
**AWAIT\_TIME** indicates that the code is waiting for another task to finish. This typically happens with the C# **AWAIT** statement. When the code does a C# **AWAIT**, the thread unwinds and returns control to the thread pool, and there is no thread that is blocked waiting for the **AWAIT** to finish. However, logically, the thread that did the **AWAIT** is "blocked," and is waiting for the operation to finish. The **AWAIT\_TIME** statement indicates the blocked time waiting for the task to finish.

### <a id="block"></a>Blocked time
**BLOCKED_TIME** indicates that the code is waiting for another resource to be available. For example, it might be waiting for a synchronization object, for a thread to be available, or for a request to finish.

### <a id="cpu"></a>CPU time
The CPU is busy executing the instructions.

### <a id="disk"></a>Disk time
The application is performing disk operations.

### <a id="network"></a>Network time
The application is performing network operations.

### <a id="when"></a>When column
The **When** column is a visualization of how the INCLUSIVE samples collected for a node vary over time. The total range of the request is divided into 32 time buckets. The inclusive samples for that node are accumulated in those 32 buckets. Each bucket is represented as a bar. The height of the bar represents a scaled value. For nodes marked **CPU_TIME** or **BLOCKED_TIME**, or where there is an obvious relationship of consuming a resource (CPU, disk, thread), the bar represents consuming one of those resources for the period of time of that bucket. For these metrics, it's possible to get a value of greater than 100% by consuming multiple resources. For example, if on average you use two CPUs during an interval, you get 200%.


## <a id="troubleshooting"></a>Troubleshooting

### Too many active profiling sessions

Currently, you can enable profiler on a maximum of four Azure web apps and deployment slots that are running in the same service plan. If the profiler web job is reporting too many active profiling sessions, move some web apps to a different service plan.

### How do I determine whether Application Insights Profiler is running?

The profiler runs as a continuous web job in the web app. You can open the web app resource in [the Azure portal](https://portal.azure.com). In the **WebJobs** pane, check the status of **ApplicationInsightsProfiler**. If it isn't running, open **Logs** to get more information.

### Why can't I find any stack examples, even though the profiler is running?

Here are a few things that you can check:

* Make sure that your web app service plan is Basic tier or above.
* Make sure that your web app has Application Insights SDK 2.2 Beta or later enabled.
* Make sure that your web app has the **APPINSIGHTS_INSTRUMENTATIONKEY** setting configured with the same instrumentation key that's used by the Application Insights SDK.
* Make sure that your web app is running on .NET Framework 4.6.
* If your web app is an ASP.NET Core application, check [the required dependencies](#aspnetcore).

After the profiler is started, there is a short warmup period during which the profiler actively collects several performance traces. After that, the profiler collects performance traces for two minutes in every hour.  

### I was using Azure Service Profiler. What happened to it?  

When you enable Application Insights Profiler, the Azure Service Profiler agent is disabled.

### <a id="double-counting"></a>Double counting in parallel threads

In some cases, the total time metric in the stack viewer is more than the duration of the request.

This might occur when there are two or more threads associated with a request, and they are operating in parallel. In that case, the total thread time is more than the elapsed time. One thread might be waiting on the other to be completed. The viewer tries to detect this and omits the uninteresting wait, but it errs on the side of showing too much rather than omitting what might be critical information.  

When you see parallel threads in your traces, determine which threads are waiting so you can determine the critical path for the request. In most cases, the thread that quickly goes into a wait state is simply waiting on the other threads. Concentrate on the other threads and ignore the time in the waiting threads.

### <a id="issue-loading-trace-in-viewer"></a>No profiling data

Here are a few things that you can check:

* If the data you are trying to view is older than a couple of weeks, try limiting your time filter and try again.
* Check that proxies or a firewall have not blocked access to https://gateway.azureserviceprofiler.net.
* Check that the Application Insights instrumentation key you are using in your app is the same as the Application Insights resource that you used to enabled profiling. The key usually is in ApplicationInsights.config, but also might be located in the web.config or app.config files.

### Error report in the profiling viewer

Submit a support ticket in the portal. Be sure to include the correlation ID from the error message.

### Deployment error: Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'

If you are redeploying your web app to an App Service resource with the profiler enabled, you might see a message that looks like the following:

Directory Not Empty 'D:\\home\\site\\wwwroot\\App_Data\\jobs'

This error occurs if you run Web Deploy from scripts or from Visual Studio Team Services Deployment Pipeline. The solution is to add the following additional deployment parameters to the Web Deploy task:

```
-skip:Directory='.*\\App_Data\\jobs\\continuous\\ApplicationInsightsProfiler.*' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs\\continuous$' -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data\\jobs$'  -skip:skipAction=Delete,objectname='dirPath',absolutepath='.*\\App_Data$'
```

These parameters delete the folder that's used by Application Insights Profiler and unblock the redeploy process. They don't affect the profiler instance that's currently running.


## Manual installation

When you configure the profiler, updates are made to the web app's settings. You can apply the updates manually if your environment requires it. For example, if your application runs in App Service Environment for PowerApps.

1. In the web app control pane, open **Settings**.
2. Set **.Net Framework version** to **v4.6**.
3. Set **Always On** to **On**.
4. Add the __APPINSIGHTS_INSTRUMENTATIONKEY__ app setting and set the value to the same instrumentation key that's used by the SDK.
5. Open **Advanced Tools**.
6. Select **Go** to open the Kudu website.
7. On the Kudu website, select **Site extensions**.
8. Install __Application Insights__ from the Azure Web Apps Gallery.
9. Restart the web app.

## <a id="aspnetcore"></a>ASP.NET Core support

An ASP.NET Core application needs to install the Microsoft.ApplicationInsights.AspNetCore NuGet package 2.1.0-beta6 or later to work with the profiler. As of June 27, 2017, we don't support earlier versions.

## Next steps

* [Working with Application Insights in Visual Studio](https://docs.microsoft.com/azure/application-insights/app-insights-visual-studio)

[performance-blade]: ./media/app-insights-profiler/performance-blade.png
[performance-blade-examples]: ./media/app-insights-profiler/performance-blade-examples.png
[performance-blade-v2-examples]:./media/app-insights-profiler/performance-blade-v2-examples.png
[trace-explorer]: ./media/app-insights-profiler/trace-explorer.png
[trace-explorer-toolbar]: ./media/app-insights-profiler/trace-explorer-toolbar.png
[trace-explorer-hint-tip]: ./media/app-insights-profiler/trace-explorer-hint-tip.png
[trace-explorer-hot-path]: ./media/app-insights-profiler/trace-explorer-hot-path.png
[enable-profiler-banner]: ./media/app-insights-profiler/enable-profiler-banner.png
[disable-profiler-webjob]: ./media/app-insights-profiler/disable-profiler-webjob.png
[linked app services]: ./media/app-insights-profiler/linked-app-services.png

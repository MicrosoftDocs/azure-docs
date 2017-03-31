---
title: Profiling live web apps on Azure with Application Insights | Microsoft Docs
description: Identify the hot path in your web server code with a low-footprint profiler.
services: application-insights
documentationcenter: ''
author: alancameronwills
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 03/31/2017
ms.author: awills

---
# Profiling live Azure web apps with Application Insights (preview)

*This feature of Application Insights is in preview.*

Find out how much time is spent in each method in your live web application by using the profiling tool of [Azure Application Insights](app-insights-overview.md). It automatically highlights the 'hot path' that is using the most time. The profiler uses a variety of techniques to minimize overhead.

<a id="installation"></a>
## Prerequisites

- Your app is an ASP.NET web application hosted in Azure App Services. 
    * If it's an ASP.NET Core application, the target framework must be .NetCoreApp.
- The version of the Application Insights NuGet package you have installed in your web app is:
    * Microsoft.ApplicationInsights.Web v2.2.0-beta2 or later; or
    * Microsoft.ApplicationInsights.AspNetCore v2.0.0 or later.
- The Azure Web App Service Plan that is hosting your app must be Basic tier or above.

App types that are **not yet** supported in this preview:

* Azure WebJobs.
* ASP.NET Core apps targeted on .NET Framework. See [ASP.NET Core Support](#aspnetcore) for more information.

## Start the profiler

1.In [https://portal.azure.com](https://portal.azure.com), open the Application Insights resource for your web app. (Either open it directly, or, from the web app blade, open Application Insights, then **View more detail**.)
2. Open Investigate/**Performance**.
3. Click **Configure** on the toolbar.
4. Select the app from the Web App list.
5. Click **Start** to set up the profiler. 
5. After the enabling completes, the profiler agent will run as a continuous web job (ApplicationInsightsProfiler) in the Web App.

### What does starting the profiler do?

Whe you click Start, these updates are made to the Web App's Application Settings. If you prefer it, you could do them yourself manually:

* In Application Settings:
 * Set ".Net Framework version" to v4.6.
 * Set "Always On" to On.
 * Add app setting "__APPINSIGHTS_INSTRUMENTATIONKEY__" and set the value to the same instrumentation key used by the SDK.
* In Extensions:
 * Add "Application Insights Profiler".


## Stop the profiler

1. Open the Web App resource in [https://portal.azure.com](https://portal.azure.com)
2. Select "SETTINGS -> WebJobs" to open WebJobs blade.
3. Select "ApplicationInsightsProfiler" and click "Stop" button.
4. Later on, you can click "Start" button to re-enable the profiler.

## Delete the profiler

1. Open the Web App resource in [https://portal.azure.com](https://portal.azure.com)
2. Select "DEVELOPMENT TOOLS -> Extensions" to open Extensions blade.
3. Select "Application Insights Profiler" and click "Delete" button. After deletion, the profiler agent will also be removed.

## Viewing profiler data

To view data click on the performance tab in the overview blade or the first chart in the overview timeline.

![How to open the Performance blade](./media/app-insights-profiler/performance-blade.png)

When a row has an icon in the last column this means there are traces 
available for that operation name. Clicking on this icon will bring you to our trace explorer where you can view several different samples 
that we have captures. 

![Application Insights Performance blade Examples Column][performance-blade-examples]

In the explorer there are a few things that are available to you. On the left we give you a percentile breakdown with samples in the categories.
This gives you quick access to profile data in performance bucket. If you need more data or can't find what you need, click 'Show all' at the top, to reveal more data. 


![Application Insights Trace Explorer][trace-explorer]

In the toolbar we have some meta information with a precise timestamp you can use for tracing purposes. For more advanced investigations, you can download the .etl file and view it in a tool such as PerfView.

![Toolbar][trace-explorer-toolbar]

If our analysis is able to provide a performance tip we will show a notification at the top of the trace with what type of issue you might have. The common
case is "waiting" or "awaiting" where most of the time there is a network or I/O operation the framework was waiting for.

![Hint][trace-explorer-hint-tip]

**Show hot path** opens the biggest leaf node, or at least something close. In most cases this node
will be adjacent to where your performance bottleneck is.

![Hot path][trace-explorer-hot-path]


## How to read performance data

Microsoft service profiler uses a combination of sampling method and instrumentation to analyze the performance of your application. 
When detailed collection is in progress, service profiler samples the instruction pointer of each of the machine's CPUs every millisecond. 
Each sample captures the complete call stack of the thread currently executing, giving detailed and useful information about what that 
thread was doing at both high and low levels of abstraction. Service profiler also collects other events such as context switching events,
TPL events and threadpool events to track activity correlation and causality. 

The call stack shown in the timeline view is the result of the above sampling and instrumentation. Because each sample captures the complete
call stack of the thread, it will include code from .net framework as well as other frameworks you reference.

### <a id="jitnewobj"></a>Object Allocation (clr!JIT\_New or clr!JIT\_Newarr1)
clr!JIT\_New and clr!JIT\_Newarr1 are helper functions inside .net framework that allocates memory from managed heap. clr!JIT\_New is invoked
when an object is allocated. clr!JIT\_Newarr1 is invoked when an object array is allocated. These two functions are typically 
very fast and should take relatively small amount of time. If you see clr!JIT\_New or clr!JIT\_Newarr1 take a substantial amount of 
time in your timeline, it's an indication that the code may be allocating many objects and consuming significant amount of memory. 

### <a id="theprestub"></a>Loading Code (clr!ThePreStub)
clr!ThePreStub is a helper function inside .net framework that prepares the code to execute for the first time. This typically includes, 
but not limited to, JIT (Just In Time) compilation. For each C# method, clr!ThePreStub should be invoked at most once during the lifetime
of a process.

If you see clr!ThePreStub takes significant amount of time for a request, it indicates that request is the first one that executes 
that method, and the time for .net framework runtime to load that method is significant. You can consider a warm up process that executes
that portion of the code before your users access it, or consider NGen your assemblies. 

### <a id="lockcontention"></a>Lock Contention (clr!JITutil\_MonContention or clr!JITutil\_MonEnterWorker)
clr!JITutil\_MonContention or clr!JITutil\_MonEnterWorker indicate the current thread is waiting for a lock to be released. This typically
shows up when executing a c# lock statement, invoking Monitor.Enter method, or invoking a method with MethodImplOptions.Synchronized 
attribute. Lock contention typically happens when thread A acquires a lock, and thread B tries to acquire the same lock before thread 
A releases it. 

### <a id="ngencold"></a>Loading code ([COLD])
If the method name has the word "[COLD]" in it, such as mscorlib.ni![COLD]System.Reflection.CustomAttribute.IsDefined, it means the .net
framework runtime is executing code that is not optimized by <a href="https://msdn.microsoft.com/en-us/library/e7k32f4k.aspx">
profile-guided optimization</a> for the first time. For each method, it should show up at most once during the lifetime of the process. 

If loading code takes significant amount of time for a request, it indicates that request is the first one to execute the unoptimized 
portion of the method. You can consider a warm up process that executes that portion of the code before your users access it. 

### <a id="httpclientsend"></a>Send HTTP Request
Methods such as HttpClient.Send indicates the code is waiting for a HTTP request to complete.

### <a id="sqlcommand"></a>Database Operation
Method such as SqlCommand.Execute indicates the code is waiting for a database operation to complete.

### <a id="await"></a>Waiting (AWAIT\_TIME)
AWAIT\_TIME indicates the code is waiting for another task to complete. This typically happens with C# 'await' statement. When the code
does a C# 'await', the thread unwinds and returns control to the threadpool, and there is no thread that is blocked waiting for 
the 'await' to finish. However, logically the thread that did the await is 'blocked' waiting for the operation to complete. The
AWAIT\_TIME indicates the blocked time waiting for the task to complete.

### <a id="block"></a>Blocked Time
BLOCKED\_TIME indicates the code is waiting for another resource to be available, such as waiting for a synchronization object,
waiting for a thread to be available, or waiting for a request to finish. 

### <a id="cpu"></a>CPU Time
The CPU is busy executing the instructions.

### <a id="disk"></a>Disk Time
The application is performing disk operations.

### <a id="network"></a>Network Time
The application is performing network operations.

### <a id="when"></a>When column
This is a visualization of how the INCLUSIVE samples collected for a node vary over time. The total range of the request
is divided into 32 time buckets and the inclusive samples for that node are accumulated into those 32 buckets. Each bucket is then represented as 
a bar whose height represents a scaled value. For nodes marked CPU_TIME or BLOCKED_TIME, or where there is an obvious relationship of consuming a resource (cpu, disk, thread),
the bar represents consuming 1 of those resources for the period of time of that bucket. For these metrics you can get greater than 100% by consuming multiple 
resources (e.g. if on average you consume 2 CPUs over an interval than you will get 200%, which we currently do not visualize).

## <a id="aspnetcore"></a>ASP.NET Core Support

ASP.NET Core application is currently supported on .NET Core runtime but NOT supported in full .NET Framework runtime.

The application also needs to include the following components to enable profiling.

1. [Application Insights for ASP.NET Core 2.0](https://github.com/Microsoft/ApplicationInsights-aspnetcore/releases/tag/v2.0.0)
    * [Getting started](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Getting-Started)
2. [System.Diagnostics.DiagnosticSource 4.4.0-beta-25022-02](https://dotnet.myget.org/feed/dotnet-core/package/nuget/System.Diagnostics.DiagnosticSource/4.4.0-beta-25022-02)
    * In Visual Studio, select menu "Tools -> NuGet Package Manager -> Package Manager Settings".
    * In Options dialog, select "NuGet Package Manager -> Package Sources".
    * Click "+" button to add a new package source with Name "DotNet-Core-MyGet" and Value "https://dotnet.myget.org/F/dotnet-core/api/v3/index.json".
    * Click "Update" button and close Options dialog.
    * Open Solution Explorer, right-click the ASP.NET Core project and select "Manage NuGet Packages...".
    * Click "Browse" tab, select "Package source: DotNet-Core-MyGet" and check "Include prerelease".
    * Search "System.Diagnostics.DiagnosticSource" and choose "__4.4.0-beta-25022-02__" to install.

## <a id="troubleshooting"></a>Troubleshooting

### How can I know if Application Insights profiler is running after installation?

The profiler run as a continuous web job in Web App. You can open the Web App resource in https://portal.azure.com and check "ApplicationInsightsProfiler" status in WebJobs blade. If it's not running, you can click "Logs" button to find out more information. 

### Why can't I find any stack examples even the profiler is running?

Here are a few things you can check.

1. Make sure your Web App Service Plan is Basic tier and above.
2. Make sure your Web App has Application Insights SDK 2.2 Beta and above enabled.
3. Make sure your Web App has the APPINSIGHTS_INSTRUMENTATIONKEY setting with the same instrumentation key used by AI SDK.
4. Make sure your Web App is running on .Net Framework 4.6.
5. If it's an ASP.NET Core application, please also check [the required dependencies](#aspnetcore).

After the profiler is started, there is a short warm-up period when the profiler actively collects several performance traces. After that, the profiler will collect 2-minutes performance trace once an hour. If you keep sending the traffic to the Web App, you will eventually get the stack examples. We plan to provide the configuration option in future release.

### If I'm currently using Azure Service Profiler for my Web App, should I switch to Application Insights Profiler?  

If it is ASP.NET application, we strongly recommend you to switch to Application Insights Profiler which not only provides the same performance insight as Azure Service Profiler but also correlates with other Application Insights data. In fact, after you enable Application Insights Profiler on your Web App, the existing Azure Service Profiler agent will be disabled.

### <a id="double-counting"></a>Double counting of nodes

In some cases the total metric in the stack viewer is more than the wall clock time for the request. This is not necessarily a bug.  
This can happen any time two are more threads associated with a request are operating in parallel. In such cases each thread 
contributes thread time and it can add up to more than the total wall clock time. In many cases one thread may be simply 
waiting on the other to complete. The viewer tries to detect this and omit the uninteresting wait, but it can’t do a 
perfect job and errs on the side of showing too much rather than omitting what may be critical information.  

When you see this in your traces, you technically need to understand which threads are waiting on what so you can determine the ‘critical path’ for the request. 
However a much simpler heuristic almost always works. Simply look at all paths. Typically one or more will quickly wait and are uninteresting. 
Since it is likely that these are simply waiting on the other threads, concentrate on the rest and ignore the time in the uninteresting threads.   
This simple, ‘obvious’ technique, almost always works.   

### <a id="issue-loading-trace-in-viewer"></a>Issue loading data in viewer

There are 3 reasons we know of that could impact your ability to view your data.

1. Our data retention policy has removed your trace. If the data you are trying to view is older than a couple of weeks, try limiting your time filter and try again.

2. Network connectivity issues have impacted our ability process requests. Check to see if there are any azure outages that could impact our services, and wait for issues to be resolved before trying again. Also, check that proxies or a firewall has not blocked access to https://gateway.azureserviceprofiler.net. 

3. There was a configuration issue when deploying the profiler. Confirm that the Application Insights instrumentation key you are using in your app (usually this is specified in the ApplicationInsights.config but can also be found in your web.config, app.config, etc.) is the same as the Application Insights resource you've enabled profiling with.

If the problem persists file a support ticket from the portal, or feel free to send an email to our help alias, [serviceprofilerhelp@microsoft.com](mailto:serviceprofilerhelp@microsoft.com). If you received this error in the viewer there should have been a correlation id used with your error. Please include this in communicating with us so that we can help troubleshoot your problem.


If you have any further questions, please send mail to [serviceprofilerhelp@microsoft.com](mailto:serviceprofilerhelp@microsoft.com).

## Next steps

* [Working with Application Insights in Visual Studio](https://docs.microsoft.com/azure/application-insights/app-insights-visual-studio)

[performance-blade]: ./media/app-insights-profiler/performance-blade.png
[performance-blade-examples]: ./media/app-insights-profiler/performance-blade-examples.png
[trace-explorer]: ./media/app-insights-profiler/trace-explorer.png
[trace-explorer-toolbar]: ./media/app-insights-profiler/trace-explorer-toolbar.png
[trace-explorer-hint-tip]: ./media/app-insights-profiler/trace-explorer-hint-tip.png
[trace-explorer-hot-path]: ./media/app-insights-profiler/trace-explorer-hot-path.png
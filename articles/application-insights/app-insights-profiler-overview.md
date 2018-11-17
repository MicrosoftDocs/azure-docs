---
title: Profile production applications in Azure with Application Insights Profiler | Microsoft Docs
description: Identify the hot path in your web server code with a low-footprint profiler.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.reviewer: cawa
ms.date: 08/06/2018
ms.author: mbullwin

---
# Profile production applications in Azure with Application Insights
## Enable Profiler for your application

Application Insights Profiler provides performance traces for applications running in production in Azure. It captures the data automatically at scale without negatively affecting your end users. Profiler will help you identify the “hot” code path that takes the longest time when handling a particular web request. 

The profiler works with .Net applications deployed on the following Azure services. Specific instructions for enabling the profiler for each service type are in the links below.

* [App Services](app-insights-profiler.md?toc=/azure/azure-monitor/toc.json)
* [Cloud Services](app-insights-profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Service Fabric Applications](app-insights-profiler-servicefabric.md?toc=/azure/azure-monitor/toc.json)
* [Virtual Machines and VM Scalesets](app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)

If you have enabled Profiler, but aren't seeing traces, check our [Troubleshooting Guide.](app-insights-profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json)

Running Profiler on premises isn't officially supported, but we do have some [instructions you can try.](https://docs.microsoft.com/azure/application-insights/enable-profiler-compute#enable-profiler-on-on-premises-servers)

## View profiler data

In order for the profiler to upload traces, your application actively handling requests. If you're doing an experiment, you can generate requests to your web app using [Application Insights Performance Testing](https://docs.microsoft.com/vsts/load-test/app-service-web-app-performance-test). If you've newly enabled Profiler, you can run a short load test. While the load test is running, press the **Profile Now** button in the [**Profiler Settings page**](app-insights-profiler-settings.md#profiler-settings-page). Once profiler is running, it will profile randomly about once every hour and for a duration of two minutes. If your application is handling a steady stream of requests, Profiler will upload traces every hour.

After your application receives some traffic and the profiler has had time to upload the trances, you should have traces to view. This process can take 5 to 10 minutes. To view traces, go to the **Performance** pane, select **Take Actions** to view profiler traces, and then select the **Profiler Traces** button.

![Application Insights Performance pane preview Profiler traces][performance-blade]

Select a sample to display a code-level breakdown of time spent executing the request.

![Application Insights trace explorer][trace-explorer]

The trace explorer displays the following information:

* **Show Hot Path**: Opens the biggest leaf node, or at least something close. In most cases, this node is near a performance bottleneck.
* **Label**: The name of the function or event. The tree displays a mix of code and events that occurred (like SQL and HTTP events). The top event represents the overall request duration.
* **Elapsed**: The time interval between the start of the operation and the end of the operation.
* **When**: The time when the function or event was running in relation to other functions.

## How to read performance data

The Microsoft service profiler uses a combination of sampling methods and instrumentation to analyze the performance of your application. When detailed collection is in progress, the service profiler samples the instruction pointer of each machine CPU every millisecond. Each sample captures the complete call stack of the thread that is currently executing. It gives detailed information about what that thread was doing, both at a high level and at a low level of abstraction. The service profiler also collects other events to track activity correlation and causality, including context switching events, Task Parallel Library (TPL) events, and thread pool events.

The call stack that's displayed in the timeline view is the result of the sampling and instrumentation. Because each sample captures the complete call stack of the thread, it includes code from Microsoft .NET Framework, and from other frameworks that you reference.

### <a id="jitnewobj"></a>Object allocation (clr!JIT\_New or clr!JIT\_Newarr1)

**clr!JIT\_New** and **clr!JIT\_Newarr1** are helper functions in the .NET Framework that allocate memory from a managed heap. **clr!JIT\_New** is invoked when an object is allocated. **clr!JIT\_Newarr1** is invoked when an object array is allocated. These two functions are usually fast and take relatively small amounts of time. If you see **clr!JIT\_New** or **clr!JIT\_Newarr1** take a substantial amount of time in your timeline, it indicates that the code might be allocating many objects and consuming significant amounts of memory.

### <a id="theprestub"></a>Loading code (clr!ThePreStub)

**clr!ThePreStub** is a helper function in the .NET Framework that prepares the code to execute for the first time. This usually includes, but isn't limited to, just-in-time (JIT) compilation. For each C# method, **clr!ThePreStub** should be invoked at most once during the lifetime of a process.

If **clr!ThePreStub** takes a large amount of time for a request, this indicates the request is the first one that executes that method. The time for the .NET Framework runtime to load the first method is significant. You might consider using a warmup process that executes that portion of the code before your users access it, or consider running Native Image Generator (ngen.exe) on your assemblies.

### <a id="lockcontention"></a>Lock contention (clr!JITutil\_MonContention or clr!JITutil\_MonEnterWorker)

**clr!JITutil\_MonContention** or **clr!JITutil\_MonEnterWorker** indicates that the current thread is waiting for a lock to be released. This text is often displayed when you execute a C# **LOCK** statement, when invoking the **Monitor.Enter** method, or when invoking a method with the **MethodImplOptions.Synchronized** attribute. Lock contention usually occurs when thread _A_ acquires a lock, and thread _B_ tries to acquire the same lock before thread _A_ releases it.

### <a id="ngencold"></a>Loading code ([COLD])

If the method name contains **[COLD]**, such as **mscorlib.ni![COLD]System.Reflection.CustomAttribute.IsDefined**, the .NET Framework runtime is executing code for the first time that is not optimized by <a href="https://msdn.microsoft.com/library/e7k32f4k.aspx">profile-guided optimization</a>. For each method, it should be displayed at most once during the lifetime of the process.

If loading code takes a substantial amount of time for a request, this indicates that the request is the first one to execute the unoptimized portion of the method. Consider using a warmup process that executes that portion of the code before your users access it.

### <a id="httpclientsend"></a>Send HTTP request

Methods like **HttpClient.Send** indicate that the code is waiting for an HTTP request to be completed.

### <a id="sqlcommand"></a>Database operation

Methods like **SqlCommand.Execute** indicate that the code is waiting for a database operation to finish.

### <a id="await"></a>Waiting (AWAIT\_TIME)

**AWAIT\_TIME** indicates that the code is waiting for another task to finish. This usually happens with the C# **AWAIT** statement. When the code does a C# **AWAIT**, the thread unwinds and returns control to the thread pool, and there's no thread that is blocked waiting for the **AWAIT** to finish. However, logically, the thread that did the **AWAIT** is "blocked," and is waiting for the operation to finish. The **AWAIT\_TIME** statement indicates the blocked time waiting for the task to finish.

### <a id="block"></a>Blocked time

**BLOCKED_TIME** indicates that the code is waiting for another resource to be available. For example, it might be waiting for a synchronization object, for a thread to be available, or for a request to finish.

### <a id="cpu"></a>CPU time

The CPU is busy executing the instructions.

### <a id="disk"></a>Disk time

The application is performing disk operations.

### <a id="network"></a>Network time

The application is performing network operations.

### <a id="when"></a>When column

The **When** column is a visualization of how the INCLUSIVE samples collected for a node vary over time. The total range of the request is divided into 32 time buckets. The inclusive samples for that node are accumulated in those 32 buckets. Each bucket is represented as a bar. The height of the bar represents a scaled value. For nodes that are marked **CPU_TIME** or **BLOCKED_TIME**, or where there is an obvious relationship to consuming a resource (for example, a CPU, disk, or thread), the bar represents the consumption of one of the resources during the period of that bucket. For these metrics, it's possible to get a value of greater than 100 percent by consuming multiple resources. For example, if you use, on average, two CPUs during an interval, you get 200 percent.

## Limitations

The default data retention period is five days. The maximum data that's ingested per day is 10 GB.

There are no charges for using the Profiler service. For you to use the Profiler service, your web app must be hosted in at least the Basic tier of Web Apps.

## Overhead and sampling algorithm

Profiler randomly runs two minutes every hour on each virtual machine that hosts the application that has Profiler enabled for capturing traces. When Profiler is running, it adds from 5 percent to 15 percent CPU overhead to the server.

## Next Steps
Enable Application Insights Profiler for your Azure application
* [App Services](app-insights-profiler.md?toc=/azure/azure-monitor/toc.json)
* [Cloud Services](app-insights-profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Service Fabric Applications](app-insights-profiler-servicefabric.md?toc=/azure/azure-monitor/toc.json)
* [Virtual Machines and VM Scalesets](app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)


[performance-blade]: ./media/app-insights-profiler/performance-blade-v2-examples.png
[trace-explorer]: ./media/app-insights-profiler/trace-explorer.png

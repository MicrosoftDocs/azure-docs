---
title: Generate load and view Application Insights Profiler data
description: Generate load to your Azure service to view the Profiler data
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 09/22/2023
ms.reviewer: charles.weininger
---

# View Application Insights Profiler data

Let's say you're running a web performance test. You'll need traces to understand how your web app is running under load. In this article, you'll:

> [!div class="checklist"]
> - Generate traffic to your web app by starting a web performance test or starting a Profiler on-demand session.
> - View the Profiler traces after your load test or Profiler session.
> - Learn how to read the Profiler performance data and call stack.

## Generate traffic to your Azure service

For Profiler to upload traces, your service must be actively handling requests. 

If you've newly enabled Profiler, run a short [load test](/vsts/load-test/app-service-web-app-performance-test). 

If your Azure service already has incoming traffic or if you just want to manually generate traffic, skip the load test and start a **Profiler on-demand session**:

1. From the Application Insights overview page for your Azure service, select **Performance** from the left menu. 
1. On the **Performance** pane, select **Profiler** from the top menu for Profiler settings.

   :::image type="content" source="./media/profiler-overview/profiler-button-inline.png" alt-text="Screenshot of the Profiler button from the Performance pane." lightbox="media/profiler-settings/profiler-button.png":::

1. Once the Profiler settings page loads, select **Profile Now**. 

   :::image type="content" source="./media/profiler-settings/configure-blade-inline.png" alt-text="Screenshot of Profiler page features and settings." lightbox="media/profiler-settings/configure-blade.png":::

## View traces

1. After the Profiler sessions finish running, return to the **Performance** pane. 
1. Under **Drill into...**, select **Profiler traces** to view the traces.

   :::image type="content" source="./media/profiler-overview/trace-explorer-inline.png" alt-text="Screenshot of trace explorer page." lightbox="media/profiler-overview/trace-explorer.png":::

The trace explorer displays the following information:

| Filter | Description |
| ------ | ----------- |
| Profile tree v. Flame graph | View the traces as either a tree or in graph form. |
| Hot path | Select to open the biggest leaf node. In most cases, this node is near a performance bottleneck. |
| Framework dependencies | Select to view each of the traced framework dependencies associated with the traces. |
| Hide events | Type in strings to hide from the trace view. Select *Suggested events* for suggestions. |
| Event | Event or function name. The tree displays a mix of code and events that occurred, such as SQL and HTTP events. The top event represents the overall request duration. |
| Module | The module where the traced event or function occurred. |
| Thread time | The time interval between the start of the operation and the end of the operation. |
| Timeline | The time when the function or event was running in relation to other functions. |

## How to read performance data

Profiler uses a combination of sampling methods and instrumentation to analyze your application's performance. While performing detailed collection, the Profiler:

- Samples the instruction pointer of each machine CPU every millisecond. 
  - Each sample captures the complete call stack of the thread, giving detailed information at both high and low levels of abstraction. 
- Collects events to track activity correlation and causality, including:
  - Context switching events
  - Task Parallel Library (TPL) events
  - Thread pool events

The call stack displayed in the timeline view is the result of the sampling and instrumentation. Because each sample captures the complete call stack of the thread, it includes code from Microsoft .NET Framework, and any other frameworks that you reference.

### Object allocation (clr!JIT\_New or clr!JIT\_Newarr1)

**clr!JIT\_New** and **clr!JIT\_Newarr1** are helper functions in .NET Framework that allocate memory from a managed heap. 
- **clr!JIT\_New** is invoked when an object is allocated. 
- **clr!JIT\_Newarr1** is invoked when an object array is allocated. 

These two functions usually work quickly. If **clr!JIT\_New** or **clr!JIT\_Newarr1** take up time in your timeline, the code might be allocating many objects and consuming significant amounts of memory.

### Loading code (clr!ThePreStub)

**clr!ThePreStub** is a helper function in .NET Framework that prepares the code for initial execution, which usually includes just-in-time (JIT) compilation. For each C# method, **clr!ThePreStub** should be invoked, at most, once during a process.

If **clr!ThePreStub** takes extra time for a request, it's the first request to execute that method. The .NET Framework runtime takes a significant amount of time to load the first method. Consider:
- Using a warmup process that executes that portion of the code before your users access it.
- Running Native Image Generator (ngen.exe) on your assemblies.

### Lock contention (clr!JITutil\_MonContention or clr!JITutil\_MonEnterWorker)

**clr!JITutil\_MonContention** or **clr!JITutil\_MonEnterWorker** indicate that the current thread is waiting for a lock to be released. This text is often displayed when you:
- Execute a C# **LOCK** statement,
- Invoke the **Monitor.Enter** method, or
- Invoke a method with the **MethodImplOptions.Synchronized** attribute. 

Lock contention usually occurs when thread _A_ acquires a lock and thread _B_ tries to acquire the same lock before thread _A_ releases it.

### Loading code ([COLD])

If the .NET Framework runtime is executing [unoptimized code](/cpp/build/profile-guided-optimizations) for the first time, the method name will contain **[COLD]**:

`mscorlib.ni![COLD]System.Reflection.CustomAttribute.IsDefined`

For each method, it should be displayed once during the process, at most.

If loading code takes a substantial amount of time for a request, it's the request's initiate execute of the unoptimized portion of the method. Consider using a warmup process that executes that portion of the code before your users access it.

### Send HTTP request

Methods such as **HttpClient.Send** indicate that the code is waiting for an HTTP request to be completed.

### Database operation

Methods such as **SqlCommand.Execute** indicate that the code is waiting for a database operation to finish.

### Waiting (AWAIT\_TIME)

**AWAIT\_TIME** indicates that the code is waiting for another task to finish. This delay occurs with the C# **AWAIT** statement. When the code does a C# **AWAIT**:
- The thread unwinds and returns control to the thread pool.
- There's no blocked thread waiting for the **AWAIT** to finish. 

However, logically, the thread that did the **AWAIT** is "blocked", waiting for the operation to finish. The **AWAIT\_TIME** statement indicates the blocked time, waiting for the task to finish.

If the **AWAIT_TIME** appears to be in framework code instead of your code, the Profiler could be showing:
- The framework code used to execute the **AWAIT** 
- Code used for recording telemetry about the **AWAIT** 

You can uncheck the **Framework dependencies** checkbox at the top of the page to show only your code and make it easier to see where the **AWAIT** originates.  

### Blocked time

**BLOCKED_TIME** indicates that the code is waiting for another resource to be available. For example, it might be waiting for:
- A synchronization object
- A thread to be available
- A request to finish

### Unmanaged Async

In order for async calls to be tracked across threads, .NET Framework emits ETW events and passes activity IDs between threads. Since unmanaged (native) code and some older styles of asynchronous code lack these events and activity IDs, the Profiler can't track the thread and functions running on the thread. This item is labeled **Unmanaged Async** in the call stack. Download the ETW file to use [PerfView](https://github.com/Microsoft/perfview/blob/master/documentation/Downloading.md) for more insight.

### CPU time

The CPU is busy executing the instructions.

### Disk time

The application is performing disk operations.

### Network time

The application is performing network operations.

### When column

The **When** column is a visualization of the variety of _inclusive_ samples collected for a node over time. The total range of the request is divided into 32 time buckets, where the node's inclusive samples accumulate. Each bucket is represented as a bar. The height of the bar represents a scaled value. For the following nodes, the bar represents the consumption of one of the resources during the bucket:
- Nodes marked **CPU_TIME** or **BLOCKED_TIME**.
- Nodes with an obvious relationship to consuming a resource (for example, a CPU, disk, or thread). 

For these metrics, you can get a value of greater than 100% by consuming multiple resources. For example, if you use two CPUs during an interval on average, you get 200%.

## Next steps
Learn how to...
> [!div class="nextstepaction"]
> [Configure Profiler settings](./profiler-settings.md)


[performance-blade]: ./media/profiler-overview/performance-blade-v2-examples.png
[trace-explorer]: ./media/profiler-overview/trace-explorer.png

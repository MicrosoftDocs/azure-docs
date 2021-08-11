---
title: Metrics for Azure Spring Cloud
description: Learn how to review metrics in Azure Spring Cloud
author: karlerickson
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 09/08/2020
ms.author: karler
ms.custom: devx-track-java
---

# Metrics for Azure Spring Cloud

Azure Metrics explorer is a component of the Microsoft Azure portal that allows plotting charts, visually correlating trends, and investigating spikes and dips in metrics. Use the metrics explorer to investigate the health and utilization of your resources. 

In Azure Spring Cloud, there are two viewpoints for metrics.
* Charts in each application overview page
* Common metrics page

 ![Metrics Charts](media/metrics/metrics-1.png)

Charts in the application **Overview** provide quick status checks for each application. The common **Metrics** page contains all metrics available for reference. You can build your own charts in the common metrics page and pin them in Dashboard.

## Application overview page
Select an app in **Apps** to find charts in the overview page.  

 ![Application Metrics Management](media/metrics/metrics-2.png)

Each application's **Application Overview** page presents a metrics chart that allows you to perform a quick status check of your application.  

 ![Application Metrics Overview](media/metrics/metrics-3.png)

Azure Spring Cloud provides these five charts with metrics that are updated every minute:

* **Http Server Errors**: Error count for HTTP requests to your app
* **Data In**: Bytes received by your app
* **Data Out**: Bytes sent by your app
* **Requests**: Requests received by your app
* **Average Response Time**: Average response time from your app

For the chart, you can select a time range from one hour to seven days.

## Common metrics page

The **Metrics** in the left navigation pane links to the common metrics page.

First, select metrics to view:

![Select Metric View](media/metrics/metrics-4.png)

Details of all metrics options can be found in the [section](#user-metrics-options) below.

Next, select aggregation type for each metric:

![Metric Aggregation](media/metrics/metrics-5.png)

The aggregation type indicates how to aggregate metric points in the chart by time. There is one raw metric point every minute, and the pre-aggregation type within a minute is pre-defined by metrics type.
* Sum: Sum all values as target output.
* Average: Use the Average value in the period as target output.
* Max/Min: Use the Max/Min value in the period as target output.

The time range can also be adjusted from last 30 minutes to last 30 days or a custom time range.

![Metric Modification](media/metrics/metrics-6.png)

The default view includes all of an Azure Spring Cloud service's application's metrics together. Metrics of one app or instance can be filtered in the display.  Click **Add filter**, set the property to **App**, and select the target application you want to monitor in the **Values** text box. 

You can use two kinds of filters (properties):
* App: filter by app name
* Instance: filter by app instance

![Metric Filters](media/metrics/metrics-7.png)

You can also use the **Apply splitting** option, which will draw multiple lines for one app:

![Metric Splitting](media/metrics/metrics-8.png)

>[!TIP]
> You can build your own charts on the metrics page and pin them to your **Dashboard**. Start by naming your chart.  Next, select **Pin to dashboard in the top right corner**. You can now check on your application at your Portal **Dashboard**.

## User metrics options

The following tables show the available metrics and details.

### Error
>[!div class="mx-tdCol2BreakAll"]
>| Name | Spring Actuator Metric Name | Unit | Details |
>|----|----|----|------------|
>| tomcat.global.error | tomcat.global.error | Count | Number of errors that occurred in processed requests |

### Performance
>[!div class="mx-tdCol2BreakAll"]
>| Name | Spring Actuator Metric Name | Unit | Details |
>|----|----|----|------------|
>| system.cpu.usage | system.cpu.usage | Percent | Recent CPU usage for the whole system (Obsolete and don't suggest using it). This value is a double in the [0.0,1.0] interval. A value of 0.0 means that all CPUs were idle during the recent period of time observed, while a value of 1.0 means that all CPUs were actively running 100% of the time during the recent period being observed.|
>| process.cpu.usage | App CPU Usage Percentage | Percent | Recent CPU usage for the Java Virtual Machine process (Obsolete and don't suggest using it). This value is a double in the [0.0,1.0] interval. A value of 0.0 means that none of the CPUs were running threads from the JVM process during the recent period of time observed, while a value of 1.0 means that all CPUs were actively running threads from the JVM 100% of the time during the recent period being observed. Threads from the JVM include the application threads as well as the JVM internal threads.|
>| PodCpuUsage | App CPU Usage | Percent | Recent CPU usage of the JVM process against the CPU allocated to this app, double type value between [0.0,1.0]. A value of 0.0 means that none of the CPUs were running threads from the JVM process during the recent period of time observed, while a value of 1.0 means that all CPUs were actively running threads from the JVM 100% of the time during the recent period being observed. Threads from the JVM include the application threads as well as the JVM internal threads.|
>| AppCpuUsage | App CPU Usage (Deprecated) | Percent | Deprecated metric of App CPU Usage. Please use new App CPU Usage instead|
>| PodMemoryUsage | App Memory Usage | Percent | Recent memory usage of the JVM process against the memory allocated to this app, double type value between [0.0,1.0]. A value of 0.0 means that none of the memory was allocated by threads from the JVM process during the recent period of time observed, while a value of 1.0 means that all memory was allocated by threads from the JVM 100% of the time during the recent period being observed. Threads from the JVM include the application threads as well as the JVM internal threads.|
>| jvm.memory.committed | jvm.memory.committed | Bytes | Represents the amount of memory that is guaranteed to be available for use by the JVM. The JVM may release memory to the system and committed could be less than init. committed will always be greater than or equal to used. |
>| jvm.memory.used | jvm.memory.used | Bytes | Represents the amount of memory currently used in bytes. |
>| jvm.memory.max | jvm.memory.max | Bytes | Represents the maximum amount of memory that can be used for memory management. The amount of used and committed memory will always be less than or equal to max if max is defined. A memory allocation may fail if it attempts to increase the used memory such that used > committed even if used <= max would still be true (for example, when the system is low on virtual memory). |
>| jvm.gc.max.data.size | jvm.gc.max.data.size | Bytes | The peak memory usage of the old generation memory pool since the Java virtual machine was started. |
>| jvm.gc.live.data.size | jvm.gc.live.data.size | Bytes | Size of old generation memory pool after a full GC. |
>| jvm.gc.memory.promoted | jvm.gc.memory.promoted | Bytes | Count of positive increases in the size of the old generation memory pool before GC to after GC. |
>| jvm.gc.memory.allocated | jvm.gc.memory.allocated | Bytes | Incremented for an increase in the size of the young generation memory pool after one GC to before the next. |
>| jvm.gc.pause.total.count | jvm.gc.pause (total-count) | Count | Total GC count after this JMV started, including Young and Old GC. |
>| jvm.gc.pause.total.time | jvm.gc.pause (total-time) | Milliseconds | Total GC time consumed after this JMV started, including Young and Old GC. |

### Performance (.NET)

>[!div class="mx-tdCol2BreakAll"]
>| Name | Spring Actuator Metric Name | Unit | Details |
>|------|-----------------------------|------|---------|
>| CPU usage       | cpu-usage      | Percent      | The percent of the process's CPU usage relative to all of the system CPU resources [0-100]. |
>| Working set     | working-set    | Megabytes    | Amount of working set used by the process. |
>| GC heap size    | gc-heap-size   | Megabytes    | Total heap size reported by the garbage collector. |
>| Gen 0 GC count  | gen-0-gc-count | Count        | Number of Generation 0 garbage collections per second. |
>| Gen 1 GC count  | gen-1-gc-count | Count        | Number of Generation 1 garbage collections per second. |
>| Gen 2 GC count  | gen-2-gc-count | Count        | Number of Generation 2 garbage collections per second. |
>| Time in GC      | timein-gc      | Percent      | The percent of time in garbage collection since the last garbage collection. |
>| Gen 0 heap size | gen-0-size     | Bytes        | Generation 0 heap size. |
>| Gen 1 heap size | gen-1-size     | Bytes        | Generation 1 heap size. |
>| Gen 2 heap size | gen-2-size     | Bytes        | Generation 2 heap size. |
>| LOH heap size   | loh-size       | Bytes        | Large Object Heap heap size. |
>| Allocation rate | alloc-rate     | Bytes        | Number of bytes allocated per second. |
>| Assembly count  | assembly-count | Count        | Number of assemblies loaded. |
>| Exception count | exception-count | Count       | Number of exceptions per second. |
>| Thread pool thread count      | threadpool-thread-count              | Count | Number of thread pool threads. |
>| Monitor lock contention count | monitor-lock-contention-count        | Count | The number of times per second there was contention when trying to take a monitor's lock. |
>| Thread pool queue length      | threadpool-queue-length              | Count | Thread pool work items queue length. |
>| Thread pool completed items count | threadpool-completed-items-count | Count | Thread pool completed work items count. |
>| Active timers count               | active-timer-count               | Count | The number of timers that are currently active. An active timer is one that is registered to tick at some point in the future, and has not yet been canceled. |

For more information, see [dotnet counters](/dotnet/core/diagnostics/dotnet-counters).

### Request
>[!div class="mx-tdCol2BreakAll"]
>| Name | Spring Actuator Metric Name | Unit | Details |
>|----|----|----|------------|
>| tomcat.global.sent | tomcat.global.sent | Bytes | Amount of data Tomcat web server sent |
>| tomcat.global.received | tomcat.global.received | Bytes | Amount of data Tomcat web server received |
>| tomcat.global.request.total.count | tomcat.global.request (total-count) | Count | Total count of Tomcat web server processed requests |
>| tomcat.global.request.max | tomcat.global.request.max | Milliseconds | Maximum time of Tomcat web server to process a request |

### Request (.NET)

>[!div class="mx-tdCol2BreakAll"]
>| Name | Spring Actuator Metric Name | Unit | Details |
>|------|-----------------------------|------|---------|
>| Requests per second | requests-per-second | Count | Request rate. |
>| Total requests | total-requests | Count | Total number of requests. |
>| Current requests | current-requests | Count | Number of current requests. |
>| Failed requests | failed-requests | Count | Number of failed requests. |

For more information, see [dotnet counters](/dotnet/core/diagnostics/dotnet-counters).

### Session
>[!div class="mx-tdCol2BreakAll"]
>| Name | Spring Actuator Metric Name | Unit | Details |
>|----|----|----|------------|
>| tomcat.sessions.active.max | tomcat.sessions.active.max | Count | Maximum number of sessions that have been active at the same time |
>| tomcat.sessions.alive.max | tomcat.sessions.alive.max | Milliseconds | Longest time (in seconds) that an expired session was alive |
>| tomcat.sessions.created | tomcat.sessions.created | Count | Number of sessions that have been created |
>| tomcat.sessions.expired | tomcat.sessions.expired | Count | Number of sessions that have expired |
>| tomcat.sessions.rejected | tomcat.sessions.rejected | Count | Number of sessions that were not created because the maximum number of active sessions reached. |
>| tomcat.sessions.active.current | tomcat.sessions.active.current | Count | Tomcat Session Active Count |

## See also

* [Quickstart: Monitoring Azure Spring Cloud apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md)

* [Getting started with Azure Metrics Explorer](../azure-monitor/essentials/metrics-getting-started.md)

* [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md)

## Next steps

* [Tutorial: Monitor Spring Cloud resources using alerts and action groups](./tutorial-alerts-action-groups.md)

* [Quotas and Service Plans for Azure Spring Cloud](./quotas.md)

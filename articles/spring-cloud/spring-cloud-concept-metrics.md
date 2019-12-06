---
title: Understanding metrics for Azure Spring Cloud
description: Learn how to review metrics in the Azure Spring Cloud
author: jpconnock
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 12/06/2019
ms.author: jeconnoc

---

# Metrics for Azure Spring Cloud

Azure Metrics explorer is a component of the Microsoft Azure portal that allows plotting charts, visually correlating trends, and investigating spikes and dips in metrics. Use the metrics explorer to investigate the health and utilization of your resources. 

In Azure Spring Cloud, there are two view point for metrics.
* Charts in each application overview page
* Common metrics page

 ![Metrics views](media/metrics/metrics-1.png)

Charts in the application **Overview** provides quick status check for each application. The common **Metrics** page contains all metrics available for reference. You can build your own charts in the common metrics page and pin them in Dashboard.

## Application overview page
Select an app in **App Management** to find charts in the overview page.  

 ![App Management](media/metrics/metrics-2.png)

Each application's **Application Overview** page presents a metrics chart that allows you to perform a quick status check of your application.  

 ![App Management](media/metrics/metrics-3.png)

We provide 5 charts with metrics updated every minute for the following:

* **Http Server Errors**: Error count for HTTP requests to your app.
* **Data In**: Bytes received by your app.
* **Data Out**: Bytes sent to your app.
* **Requests**: Requests received by your app.
* **Average Response Time**: Average response time from your app.

You can select a time range for the chart between 1 hour up to 7 Days.

## Common metrics page

The **Metrics** in the left navigation pane links to the common metrics page.

First, select metrics to view:

![App Management](media/metrics/metrics-4.png)

## Service-level metric queries

Azure Spring Cloud allows you to monitor a variety of application metrics. 

To review metric data, you will select your metric, your **Aggregation**, and your time range.  These concepts are explained below.

### Aggregation 

Azure polls and updates metrics every minute. Azure provides three ways to aggregate data for a chosen time period:

* **Total**: Sum all metrics as target output.
* **Average**: Use the Average value in the period as target output.
* **Max/Min**: Use the Max/Min value in the period as target output.

### Time range

Select a default time range or define your own.

### Modifying the granularity of your metric query

By default, Azure aggregates metrics for all of an Azure Spring Cloud service's applications. To review metrics at the application or instance level, use the filter function.  
Select **Add filter**, set the property to **App** and select the target application you want to monitor. Optionally, use the **Apply splitting** option to draw separate lines for each app in the chart.

>[!TIP]
> You can build your own charts in metrics page and pin them to your **Dashboard**. Start by naming your chart.  Next, select **Pin to dashboard in the top right corner**. You can now check on your application at your Portal **Dashboard**.

## User portal metrics options

All User Metrics provide 3 aggregation types:
* Average
* Max
* Min

You can use 2 kinds of filters (properties):
* App: filter by app name
* Instance: filter by app instance

The following table shows the available metrics and details.

<table>
   <tr>
    <th>Name</th>
    <th>Display Name</th> 
    <th>Spring Actuator Metric Name</th>
    <th>Unit</th>
    <th>Details</th>
  </tr>
  <tr>
    <td>SystemCpuUsagePercentage</td>
    <td>System CPU Usage Percentage</td>
    <td>system.cpu.usage</td>
    <td>Percent</td>
    <td>Recent CPU usage for the whole system. This value is a double in the [0.0,1.0] interval. A value of 0.0 means that all CPUs were idle during the recent period of time observed, while a value of 1.0 means that all CPUs were actively running 100% of the time during the recent period being observed. All values betweens 0.0 and 1.0 are possible depending of the activities going on in the system. If the system recent cpu usage is not available, the method returns a negative value.</td>
   </tr>
  <tr>
    <td>AppCpuUsagePercentage</td>
    <td>App CPU Usage Percentage</td>
    <td>process.cpu.usage</td>
    <td>Percent</td>
    <td>Recent CPU usage for the Java Virtual Machine process. This value is a double in the [0.0,1.0] interval. A value of 0.0 means that none of the CPUs were running threads from the JVM process during the recent period of time observed, while a value of 1.0 means that all CPUs were actively running threads from the JVM 100% of the time during the recent period being observed. Threads from the JVM include the application threads as well as the JVM internal threads. All values betweens 0.0 and 1.0 are possible depending of the activities going on in the JVM process and the whole system. If the Java Virtual Machine recent CPU usage is not available, the method returns a negative value.</td>
   </tr>
  <tr>
    <td>AppMemoryCommitted</td>
    <td>App Memory Assigned</td>
    <td>jvm.memory.committed</td>
    <td>Bytes</td>
    <td>Represents the amount of memory (in bytes) that is guaranteed to be available for use by the Java virtual machine. The amount of committed memory may change over time (increase or decrease). The Java virtual machine may release memory to the system and committed could be less than init. committed will always be greater than or equal to used.</td>
   </tr>
  <tr>
    <td>AppMemoryUsed</td>
    <td>App Memory Used</td>
    <td>jvm.memory.used</td>
    <td>Bytes</td>
    <td>Represents the amount of memory currently used in bytes.</td>
   </tr>
  <tr>
    <td>AppMemoryMax</td>
    <td>App Memory Max</td>
    <td>jvm.memory.max</td>
    <td>Bytes</td>
    <td>Represents the maximum amount of memory (in bytes) that can be used for memory management. Its value may be undefined. The maximum amount of memory may change over time if defined. The amount of used and committed memory will always be less than or equal to max if max is defined. A memory allocation may fail if it attempts to increase the used memory such that used > committed even if used <= max would still be true (for example, when the system is low on virtual memory).</td>
   </tr>
  <tr>
    <td>MaxOldGenMemoryPoolBytes</td>
    <td>Max Available Old Generation Data Size</td>
    <td>jvm.gc.max.data.size</td>
    <td>Bytes</td>
    <td>The peak memory usage of the old generation memory pool since the Java virtual machine was started.</td>
   </tr>
  <tr>
    <td>OldGenMemoryPoolBytes</td>
    <td>Old Generation Data Size</td>
    <td>jvm.gc.live.data.size</td>
    <td>Bytes</td>
    <td>Size of old generation memory pool after a full GC.</td>
   </tr>
  <tr>
    <td>OldGenPromotedBytes</td>
    <td>Promote to Old Generation Data Size</td>
    <td>jvm.gc.memory.promotede</td>
    <td>Bytes</td>
    <td>Count of positive increases in the size of the old generation memory pool before GC to after GC.</td>
   </tr>
  <tr>
    <td>YoungGenPromotedBytes</td>
    <td>Promote to Young Generation Data Size</td>
    <td>jvm.gc.memory.allocated</td>
    <td>Bytes</td>
    <td>Incremented for an increase in the size of the young generation memory pool after one GC to before the next.</td>
   </tr>
  <tr>
    <td>GCPauseTotalCount</td>
    <td>GC Pause Count</td>
    <td>jvm.gc.pause (total-count)</td>
    <td>Count</td>
    <td>Total GC count after this JMV started, including Young and Old GC.</td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
</table>

## See also
[Azure Monitor Metrics](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-getting-started)
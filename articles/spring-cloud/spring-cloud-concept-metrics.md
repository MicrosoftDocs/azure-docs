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
    <td></td>
    <td>Percent</td>
    <td>Recent CPU usage for the Java Virtual Machine process. This value is a double in the [0.0,1.0] interval. A value of 0.0 means that none of the CPUs were running threads from the JVM process during the recent period of time observed, while a value of 1.0 means that all CPUs were actively running threads from the JVM 100% of the time during the recent period being observed. Threads from the JVM include the application threads as well as the JVM internal threads. All values betweens 0.0 and 1.0 are possible depending of the activities going on in the JVM process and the whole system. If the Java Virtual Machine recent CPU usage is not available, the method returns a negative value.</td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
   </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
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
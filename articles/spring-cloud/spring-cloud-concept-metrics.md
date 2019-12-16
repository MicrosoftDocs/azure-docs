---
title: Understanding metrics for Azure Spring Cloud
description: Learn how to review metrics in Azure Spring Cloud
author: jpconnock
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/06/2019
ms.author: jeconnoc

---

# Understand metrics for Azure Spring Cloud

Azure Monitor metrics explorer is a component of the Azure portal. It features chart plots, visually correlated trends, and investigation of spikes and dips in metrics. Use the metrics explorer to investigate the health and utilization of your resources. Azure Spring Cloud offers two options for viewing metrics: charts on the **Application Overview** page and the service-level **Metrics** page.

## Application Overview page

Each application's **Application Overview** page presents a metrics chart. With that chart, you can quickly check an application's status.  To see the metrics chart, go to your Azure Spring Cloud service page, select **Application Dashboard**, then select an application from the list.  

Azure Spring Cloud provides these five charts with metrics that are updated every minute:

* **Http Server Errors**: Error count for HTTP requests to your app
* **Data In**: Bytes received by your app
* **Data Out**: Bytes sent by your app
* **Requests**: Requests received by your app
* **Average Response Time**: Average response time from your app

For the chart, you can select a time range from one hour to seven days.

## Service-level metric queries

With Azure Spring Cloud, you can monitor different kinds of application metrics. Review the [guide to getting started](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-getting-started) with Azure Monitor metrics to learn more about this service.

To review metric data, select your metric, your **Aggregation** value, and your time range. These concepts are explained in the following sections.

### Aggregation

Azure polls and updates metrics every minute. Azure provides three ways to aggregate data for a chosen time period:

* **Total**: Sum all metrics as target output.
* **Average**: Use the average value of the period as target output.
* **Max/Min**: Use the maximum and minimum values of the period as target output.

### Time range

Either select a default time range or define your own.

### Modifying the granularity of your metric query

By default, Azure aggregates metrics for all applications of an Azure Spring Cloud service. To review metrics at the application or instance level, use the filter function.

To use this function, select **Add filter**, set the property to **App**, and select the target application you want to monitor. Optionally, use the **Apply splitting** option to draw separate lines in the chart for each app.

>[!TIP]
> You can build your own charts on the metrics page and pin them to your dashboard. Start by naming your chart. Next, select **Pin to dashboard** in the upper-right corner. You can now check your application on your dashboard.

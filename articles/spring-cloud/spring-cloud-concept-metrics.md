---
title: Conceptual article for metrics in Azure Spring Cloud | Microsoft Docs
description: Conceptual article for metrics in Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---

# Metrics for Azure Spring Cloud

Azure Monitor Metrics explorer is a component of the Microsoft Azure portal that allows plotting charts, visually correlating trends, and investigating spikes and dips in metrics' values. Use the metrics explorer to investigate the health and utilization of your resources. In Azure Spring Cloud, we offer two options for viewing metrics: charts in the **Application Overview** page and the service level Metrics page.

## App Overview Page

The metrics in each application's **Application Overview** page are charts that provide a quick status check.

Currently, we provide 5 charts with metrics taken every minute for the following:

- **Http Server Errors**: Error count for http requests to your app
- **Data In**: Received bytes to your app
- **Data Out**: Sent bytes from your app
- **Requests**: Requests received to your app
- **Average Response Time**: Average response time from your app

You may also choose the time range from 1 hour up to 7 Days.

To find this page, go to your Azure Spring Cloud service page and click **Application Dashboard**. Then select an application from the list, and you will see multiple charts in the app's **Overview** page.



## Service-level metric queries

We provide many metrics to monitor your Azure Spring Cloud service. This metrics page contains all of them. If you have never used Azure Monitor in any capacity, you can view the [getting started guide](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-getting-started).

To get metric data, you need to choose your metric, your **Aggregation**, and your time range.

### Aggregation 

Each metric is measured every minute. The Aggregation type indicates how to aggregate those data for the chosen time period. The three options are:

- **Total**: Sum all metrics as target output
- **Average**: Use the Average value in the period as target output
- **Max/Min**: Use the Max/Min value in the period as target output

### Time range

We provide some default options for time range, or you can create a custom range.

screenshot???

### Modifying the granularity of your metric query

By default we provide the metrics for all an Azure Spring Cloud service's applications combined. If you need metrics at a per application or per instance granularity, use the filter function:

Click **Add filter**, set the property to **App** and select the target application you want to monitor. You can also use the **Apply splitting** option, which draws separate lines for each app in the chart.

>[!TIP]
> You can build your own charts in metrics page and pin them to your **Dashboard**. First give your chart a name. Then, click **Pin to dashboard in the top right corner**. Now you can check on your application at your Portal **Dashboard** like the below screenshot.
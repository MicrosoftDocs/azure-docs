---
title: Manage pricing and data volume for Application Insights | Microsoft Docs
description: Manage telemetry volumes and monitor costs in Application Insights.
services: application-insights
documentationcenter: ''
author: alancameronwills
manager: douge

ms.assetid: ebd0d843-4780-4ff3-bc68-932aa44185f6
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 11/15/2016
ms.author: awills

---
# Manage data volume in Application Insights


Pricing for [Azure Application Insights][start] is based on data volume per application. Low usage during development or for a small app is likely to be free, because there's a free daily allowance of telemetry data.

Each Application Insights resource is charged as a separate service, and contributes to the bill for your subscription to Azure.

Your choice of pricing scheme affects:

* The set of features that is available.
* The way in which your monthly bill is calculated.

The Basic scheme provides a free service for low usage, but without certain features.

[See the pricing scheme][pricing].

## Review pricing scheme for your Application Insights resource
Open the Pricing blade in the Application Insights resource for your application.

![Choose pricing.](./media/app-insights-pricing/01-pricing.png)

Here you can select the pricing scheme for this resource, review the costs during the month, and, if necessary, restrict data volume.

Application Insights charges are added to your Azure bill. You can see details of your Azure bill on the Billing section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions). 

![On the side menu, choose Billing.](./media/app-insights-pricing/02-billing.png)

## Data rate
In addition to the monthly quota, there are throttling limits on the data rate. For the Basic pricing scheme, the limit is 200 data points/second averaged over 5 minutes and for Enterprise it is 500/s averaged over 1 minute. 

There are three buckets which are counted separately:

* [TrackTrace calls](app-insights-api-custom-events-metrics.md#track-trace) and [captured logs](app-insights-asp-net-trace-logs.md)
* [Exceptions](app-insights-api-custom-events-metrics.md#track-exception), limited to 50 points/s.
* All other telemetry (page views, sessions, requests, dependencies, metrics, custom events, web test results).

*What happens if my app exceeds the per-second rate?*

* The volume of data that your app sends is assessed every minute. If it exceeds the per-second rate averaged over the minute, the server refuses some requests. The SDK buffers the data and then tries to resend, spreading a surge out over several minutes. If your app consistently sends data at above the throttling rate, some data will be dropped. (The ASP.NET, Java, and JavaScript SDKs try to resend in this way; other SDKs might simply drop throttled data.)

If throttling occurs, you'll see a notification warning that this has happened.

*How do I know how many data points my app is sending?*

* Open the Pricing blade to see the Data Volume chart.
* Or in Metrics Explorer, add a new chart and select **Data point volume** as its metric. Switch on Grouping, and group by **Data type**.

## To reduce your data rate
If you encounter the throttling limits, here are some things you can do:

* Use [Sampling](app-insights-sampling.md). This technology reduces data rate without skewing your metrics, and without disrupting the ability to navigate between related items in Search.
* [Limit the number of Ajax calls that can be reported](app-insights-javascript.md#detailed-configuration) in every page view, or switch off Ajax reporting.
* Switch off collection modules you don't need by [editing ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). For example, you might decide that performance counters or dependency data are inessential.
* Pre-aggregate metrics. If you have put calls to TrackMetric in your app, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Or you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). 

## Sampling
[Sampling](app-insights-sampling.md) is a method of reducing the rate at which telemetry is sent to your app, while still retaining the ability to find related events during diagnostic searches, and still retaining correct event counts. 

Sampling is an effective way to reduce charges and stay within your monthly quota. The sampling algorithm retains related items of telemetry, so that, for example, when you use Search, you can find the request related to a particular exception. The algorithm also retains correct counts, so that you see the correct values in Metric Explorer for request rates, exception rates, and other counts.

There are several forms of sampling.

* [Adaptive sampling](app-insights-sampling.md) is the default for the ASP.NET SDK, which automatically adjusts to the volume of telemetry that your app sends. It operates automatically in the SDK in your web app, so that the telemetry traffic on the network is reduced. 
* *Ingestion sampling* is an alternative that operates at the point where telemetry from your app enters the Application Insights service. It doesn't affect the volume of telemetry sent from your app, but it reduces the volume retained by the service. You can use it to reduce the quota used up by telemetry from browsers and other SDKs.

To set ingestion sampling, set the control in the Pricing blade:

![From the Quota and pricing blade, click the Samples tile and select a sampling fraction.](./media/app-insights-pricing/04.png)

> [!WARNING]
> The value shown on the Samples Retained tile indicates only the value you have set for ingestion sampling. It doesn't show the sampling rate that is operating at the SDK in your app. 
> 
> If the incoming telemetry has already been sampled at the SDK, ingestion sampling is not applied.
> 
> 

To discover the actual sampling rate no matter where it has been applied, use an [Analytics query](app-insights-analytics.md) such as this:

    requests | where timestamp > ago(1d)
    | summarize 100/avg(itemCount) by bin(timestamp, 1h) 
    | render areachart 

In each retained record, `itemCount` indicates the number of original records that it represents, equal to 1 + the number of  previous discarded records. 


## Name limits
1. Maximum of 200 unique metric names and 200 unique property names for your application. Metrics include data sent via TrackMetric as well as measurements on other  data types such as Events.  [Metrics and property names][api] are global per instrumentation key.
2. [Properties][apiproperties] can be used for filtering and group-by only while they have less than 100 unique values for each property. After the number of unique values exceeds 100, you can still search the property, but no longer use it for filters or group-by.
3. Standard properties such as Request Name and Page URL are limited to 1000 unique values per week. After 1000 unique values, additional values are marked as "Other values." The original values can still be used for full text search and filtering.

If you find your application is exceeding these limits, consider splitting your data between different instrumentation keys - that is, [create new Application Insights resources](app-insights-create-new-resource.md) and send some of the data to the new instrumentation keys. You might find that the result is better structured. You can use [dashboards](app-insights-dashboards.md#dashboards) to bring the different metrics onto the same screen, so this approach doesn't restrict your ability to compare different metrics. 

## Limits summary
[!INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]

<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[start]: app-insights-overview.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/


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
ms.date: 11/16/2016
ms.author: awills

---
# Manage data volume in Application Insights


Pricing for [Azure Application Insights][start] is based on data volume per application. Low usage during development or for a small app is likely to be free, because there's a free monthly allowance of telemetry data.

Each Application Insights resource is charged as a separate service, and contributes to the bill for your subscription to Azure.

There are two pricing schemes. The default scheme is called Basic. You can opt for the Enterprise scheme, which has a daily charge, but enables certain additional features such as [continuous export](app-insights-export-telemetry.md).

[See the pricing scheme][pricing].

## Review pricing scheme for your Application Insights resource
Open the Features + Pricing blade in the Application Insights resource for your application.

![Choose Pricing.](./media/app-insights-pricing/01-pricing.png)

1. Review your data volume for the month. This includes all the data received and retained (after any [sampling](app-insights-sampling.md) from your server and client apps, and from availability tests.
2. A separate charge is made for [multi-step web tests](app-insights-monitor-web-app-availability.md#multi-step-web-tests). (This doesn't include simple availability tests, which are included in the data volume charge.)
3. Enable the additional features provided by the Enterprise scheme. In this scheme there is no free data allowance.
4. Click through to data management options to set a daily cap or set ingestion sampling.

Application Insights charges are added to your Azure bill. You can see details of your Azure bill on the Billing section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions). 

![On the side menu, choose Billing.](./media/app-insights-pricing/02-billing.png)

## Data rate
There are three ways in which the volume you send data is limited:

* Daily cap. By default this is set at 100GB/day. When your app hits the cap, we send an email and discard data until the end of the day. Change it through the Data Volume Management blade.
* [Sampling](app-insights-sampling.md). This mechanism can reduce the amount of telemetry sent from your server and client apps, with minimal distortion of metrics.
* Throttling limits the data rate per minute. For the Basic pricing scheme, the limit is 200 data points/second averaged over 5 minutes and for Enterprise it is 500/s averaged over 1 minute. 

For throttling, three buckets are counted separately:

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
Here are some things you can do to reduce your data volume:

* Reduce the daily volume cap. The default is 100GB/day.
* Use [Sampling](app-insights-sampling.md). This technology reduces data rate without skewing your metrics, and without disrupting the ability to navigate between related items in Search. In server apps, it operates automatically.
* [Limit the number of Ajax calls that can be reported](app-insights-javascript.md#detailed-configuration) in every page view, or switch off Ajax reporting.
* Switch off collection modules you don't need by [editing ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). For example, you might decide that performance counters or dependency data are inessential.
* Split your telemetry to separate instrumentation keys. 
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
There are some limits on metric and dimension manes.

1. Maximum of 200 unique metric names and 200 unique property names for your application. Metrics include data sent via TrackMetric as well as measurements on other  data types such as Events.  [Metrics and property names][api] are global per instrumentation key.
2. [Properties][apiproperties] can be used for filtering and group-by only while they have less than 100 unique values for each property. After the number of unique values exceeds 100, you can still search the property, but no longer use it for filters or group-by.
3. Standard properties such as Request Name and Page URL are limited to 1000 unique values per week. After 1000 unique values, additional values are marked as "Other values." The original values can still be used for full text search and filtering.



## Limits summary
[!INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]

<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[start]: app-insights-overview.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/


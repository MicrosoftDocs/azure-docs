---
title: Manage features and data volume for Application Insights | Microsoft Docs
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
# Manage features and data volume in Application Insights


Pricing for [Azure Application Insights][start] is based on data volume per application. Low usage during development or for a small app is likely to be free, because there's a free monthly allowance of telemetry data.

Each Application Insights resource is charged as a separate service, and contributes to the bill for your subscription to Azure.

There are two pricing plans. The default plan is called Basic. You can opt for the Enterprise plan, which has a daily charge, but enables certain additional features such as [continuous export](app-insights-export-telemetry.md).

[See the pricing plan][pricing].

## Review pricing plan for your Application Insights resource
Open the Features + Pricing blade in the Application Insights resource for your application.

![Choose Pricing.](./media/app-insights-pricing/01-pricing.png)

1. Review your data volume for the month. This includes all the data received and retained (after any [sampling](app-insights-sampling.md) from your server and client apps, and from availability tests.
2. A separate charge is made for [multi-step web tests](app-insights-monitor-web-app-availability.md#multi-step-web-tests). (This doesn't include simple availability tests, which are included in the data volume charge.)
3. Enable the additional features provided by the Enterprise plan. In this plan there is no free data allowance.
4. Click through to data management options to set a daily cap or set ingestion sampling.

Application Insights charges are added to your Azure bill. You can see details of your Azure bill on the Billing section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions). 

![On the side menu, choose Billing.](./media/app-insights-pricing/02-billing.png)

## Data rate
There are three ways in which the volume you send data is limited:

* Daily cap. By default this is set at 100GB/day. When your app hits the cap, we send an email and discard data until the end of the day. Change it through the Data Volume Management blade.
* [Sampling](app-insights-sampling.md). This mechanism can reduce the amount of telemetry sent from your server and client apps, with minimal distortion of metrics.
* Throttling limits the data rate per minute. For the Basic pricing plan, the limit is 200 data points/second averaged over 5 minutes and for Enterprise it is 500/s averaged over 1 minute. 

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

## Which pricing plan should I choose?

Unless you need the advanced features offered by the Enterprise plan, the Basic plan is simpler and slightly more cost-effective. You get a free data allowance per app per month, and then a charge per additional GB of telemetry sent by your app. 

## Nodes in the Enterprise plan

If you choose the Enterprise price plan, part of your bill is calculated from the number of nodes that are sending data to Application Insights.

A node is a server that hosts your application. It can be a virtual machine, or a Platform-as-a-Service instance, or a physical machine. 

Developer workstations that run your application during debugging are not included in the node count. Client apps that run in browsers or mobile devices are not included.

Nodes are counted in every hour. Although node prices are quoted per month, prices are actually charged per hour, so that you will be charged less for a node that sends telemetry for only some hours of the month.

If your application scales with varying load to use more or less server instances, then the Application Insights Enterprise plan charges will scale up and down as well.

Nodes may be shared between apps. For example, if you have three applications running on two VMs, and the Application Insights resources for these applications are in the same subscription and in the Enterprise plan, then the number of nodes found in this subscription is two.

The data allowance of 200MB per node per day is pooled between nodes in the same subscription. If you have two nodes that host apps in the Enterprise plan, that send data for 16 hours and 20 hours in a day, then the data allowance for that day is ((16+20)/24)*200MB = 300MB. If, at the end of that day, your apps in the Enterprise plan have sent more than 300MB, then you will be charged at the per-GB rate for the excess.

The Enterprise plan's allowance is not shared with applications for which you have chosen the Basic plan.

## Transition from the old pricing tiers

Existing applications can continue to use the old pricing tiers until February 2017. A that time, most applications will be automatically moved to the Basic plan. Those that are using continuous export or the connector for OMS Log Analytics will be moved to the Enterprise plan.


## Limits summary
[!INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]

## Next steps

* [Sampling](app-insights-sampling.md)

<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[start]: app-insights-overview.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/


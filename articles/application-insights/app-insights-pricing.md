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
ms.date: 12/14/2016
ms.author: awills

---
# Manage pricing and data volume in Application Insights


Pricing for [Azure Application Insights][start] is based on data volume per application. Low usage during development or for a small app is likely to be free, because there's a free monthly allowance of telemetry data.

Each Application Insights resource is charged as a separate service, and contributes to the bill for your subscription to Azure.

There are two pricing plans. The default plan is called Basic. You can opt for the Enterprise plan, which has a daily charge, but enables certain additional features such as [continuous export](app-insights-export-telemetry.md).


## The pricing plans


[See the pricing plan][pricing] for current charges.

### Basic plan

**Basic** is the default plan. 

* Use this plan unless you want features such as [Continuous Export](app-insights-export-telemetry.md) or [Log Analytics connector](https://go.microsoft.com/fwlink/?LinkId=833039&clcid=0x409). These aren't available in the Basic plan.
* In the Basic plan, you are charged per GB of telemetry received at the Application Insights portal.
* Your first 1 GB for each app is free, so if you're just experimenting or developing, you're unlikely to have to pay.

### Enterprise plan

* In the Enterprise plan, your app can use all the features of Application Insights. 
* You pay per node that is sending telemetry for any apps in the Enterprise plan. 
 * A *node* is a physical or virtual server machine, or a Platform-as-a-Service role instance, that hosts your app.
 * Development machines and client browsers and devices are not included in this count. 
 * If your app has several components that send telemetry, such as a web service and a back-end worker, they will be counted separately.
* Across a subscription, your charges are per node, not per app. If you have five nodes sending telemetry for 12 apps, then the charge is for five nodes.
* Although charges are quoted per month, you're charged only for any hour in which a node sends telemetry from an app. The hourly charge is the quoted monthly charge / 744. If your app scales to use more servers at a 
* For each node that sends telemetry (from one or more Enterprise apps) in any hour, you get a quota of telemetry. This is accumulated over the day and across all Enterprise apps in your Azure subscription. At the end of each day (midnight UTC), a charge is made for any telemetry that your Enterprise apps have sent beyond the accumulated quota. 
* Quota is not carried over from one day to the next.


### Multi-step web tests

There's an additional charge for [**Multi-step web tests**](app-insights-monitor-web-app-availability.md#multi-step-web-tests). This refers to web tests that perform a sequence of actions. 

There is no separate charge for 'ping tests' of a single page. Telemetry from both ping tests and multi-step tests is charged along with other telemetry from your app.

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


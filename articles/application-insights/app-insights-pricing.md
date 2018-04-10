---
title: Manage pricing and data volume for Azure Application Insights | Microsoft Docs
description: Manage telemetry volumes and monitor costs in Application Insights.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: ebd0d843-4780-4ff3-bc68-932aa44185f6
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: mbullwin

---
# Manage pricing and data volume in Application Insights

Pricing for [Azure Application Insights][start] is based on data volume per application. Each Application Insights resource is charged as a separate service, and contributes to the bill for your subscription to Azure.

There are two pricing plans. The default plan is called Basic which includes all of the same features as the Enterprise plan at no addition cost and bills primarily on the volume of data ingested. If you are using the Operations Management Suite, you should opt for the Enterprise plan, which has a per-node charge along with daily data allowances, and then will charge for data ingested above the included allowance.

If you have questions about how pricing works for Application Insights, feel free to post a question in our [forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=ApplicationInsights).

## The price plans

See the [Application Insights pricing page][pricing] for current prices in your currency and region.

### Basic plan

The Basic plan is the default when a new Application Insights resource is created, and is optimal for all customers except those with an Operations Management Suite subscription.

* In the Basic plan, you are charged by data volume: number of bytes of telemetry received by Application Insights. 
Data volume is measured as the size of the uncompressed JSON data package received by Application Insights from your application.
For [tabular data imported into Analytics](https://docs.microsoft.com/azure/application-insights/app-insights-analytics-import), the data volume is measured as the uncompressed size of files sent to Application Insights.
* [Live Metrics Stream](app-insights-live-stream.md) data isn't counted for pricing purposes.
* [Continuous Export](app-insights-export-telemetry.md) and the [Log Analytics connector](https://go.microsoft.com/fwlink/?LinkId=833039&amp;clcid=0x409) are available without any extra charge in the Basic plan as of April 2018.

### Enterprise plan and Operations Management Suite subscription entitlements

Customers who purchase Microsoft Operations Management Suite E1 and E2 are able to get Application Insights Enterprise as an additional component at no additional cost as [previously announced](https://blogs.technet.microsoft.com/msoms/2017/05/19/azure-application-insights-enterprise-as-part-of-operations-management-suite-subscription/). Specifically, each unit of Operations Management Suite E1 and E2 includes an entitlement to 1 node of the Enterprise plan of Application Insights. As described below in more detail each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no additional cost. Since this is only applicable to customers with an Operations Management Suite subscription, customers without a subscription will not see an option to select this plan.

> [!NOTE]
> To ensure that you get this entitlement, you must have your Application Insights resources in the Enterprise pricing plan. This entitlement applies only as nodes, so Application Insights resources in the Basic plan will not realize any benefit. Note that this entitlement will not be visible on the estimated costs shown on the *Usage and estimated cost* page. Also, if you move a subscription to the new Azure monitoring pricing model of April 2018, the Basic plan will be the only plan available so it is not advised if you have an Operations Management Suite subscription.

For more details on the Enterprise plan visit the [Enterprise pricing details page.](app-insights-pricing-enterprise-details.md)

### Multi-step web tests

There's an additional charge for [multi-step web tests](app-insights-monitor-web-app-availability.md#multi-step-web-tests). This refers to web tests that perform a sequence of actions.

There is no separate charge for 'ping tests' of a single page. Telemetry from both ping tests and multi-step tests is charged along with other telemetry from your app.

## Review pricing plans and estimate costs

Application Insights makes it easy to understand the pricing plans available and what the costs are likely be based on recent usage patterns. Start by opening the **Usage and estimated costs** page in the Application Insights resource in the Azure portal:

![Choose Pricing.](./media/app-insights-pricing/pricing-001.png)

**a.** Review your data volume for the month. This includes all the data received and retained (after any [sampling](app-insights-sampling.md) from your server and client apps, and from availability tests.

**b.** A separate charge is made for [multi-step web tests](app-insights-monitor-web-app-availability.md#multi-step-web-tests). (This doesn't include simple availability tests, which are included in the data volume charge.)

**c.** View data volume trends for the last month.

**d.** Enable data ingestion [sampling.](app-insights-sampling.md) 

**e.** Configure the daily data volume cap.

Application Insights charges are added to your Azure bill. You can see details of your Azure bill on the Billing section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions). 

![On the side menu, choose Billing.](./media/app-insights-pricing/02-billing.png)

## Data rate
There are three ways in which the volume you send data is limited:

* **Sampling:** This mechanism can be used reduce the amount of telemetry sent from your server and client apps, with minimal distortion of metrics. This is the primary tool you have to tune the amount of data. Learn more about [sampling features](app-insights-sampling.md). 
* **Daily cap:** When creating an Application Insights resource from the Azure portal this is set to 100 GB/day. The default when creating an Application Insights resource from Visual Studio, is small (only 32.3 MB/day) which is intended only to facilitate testing. In this case it is intended that the user will raise the daily cap before deploying the app into production. The maximum cap is 1000 GB/day unless you have requested a higher maximum for a high traffic application. Use care when setting the daily cap, as your intent should be **never to hit the daily cap**, because you will then lose data for the remainder of the day and be unable to monitor your application. To change it, use the Daily volume cap option, linked from the Usage and estimated costs page (see below). We've removed the restriction on some subscription types that have credit which could not be used for Application Insights. Previously, if the subscription has a spending limit, the daily cap dialog will have instructions how to remove it and enable the daily cap to be raised beyond 32.3 MB/day.
* **Throttling:** This limits the data rate to 32,000 events per second, averaged over 1 minute.

*What happens if my app exceeds the throttling rate?*

* The volume of data that your app sends is assessed every minute. If it exceeds the per-second rate averaged over the minute, the server refuses some requests. The SDK buffers the data and then tries to resend, spreading a surge out over several minutes. If your app consistently sends data at above the throttling rate, some data will be dropped. (The ASP.NET, Java, and JavaScript SDKs try to resend in this way; other SDKs might simply drop throttled data.) If throttling occurs, you'll see a notification warning that this has happened.

*How do I know how much data my app is sending?*

* Open the **Usage and estimated cost** page to see the daily data volume chart. 
* Or in Metrics Explorer, add a new chart and select **Data point volume** as its metric. Switch on Grouping, and group by **Data type**.

## To reduce your data rate
Here are some things you can do to reduce your data volume:

* Use [Sampling](app-insights-sampling.md). This technology reduces data rate without skewing your metrics, and without disrupting the ability to navigate between related items in Search. In server apps, it operates automatically.
* [Limit the number of Ajax calls that can be reported](app-insights-javascript.md#detailed-configuration) in every page view, or switch off Ajax reporting.
* Switch off collection modules you don't need by [editing ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). For example, you might decide that performance counters or dependency data are inessential.
* Split your telemetry to separate instrumentation keys. 
* Pre-aggregate metrics. If you have put calls to TrackMetric in your app, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Or you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs).

## Managing the maximum daily data volume

You can use the daily volume cap to limit the data collected, but if the cap is met, it will result in a loss of all telemetry sent from your application for the remainder of the day. It is **not advisable** to have your application to hit the daily cap since you are unable to track the health and performance of your application after it is hit.

Instead, use  [Sampling](app-insights-sampling.md) to tune the data volume to the level you'd like, and use the daily cap only as a "last resort" in case your application starts sending much higher volumes of telemetry unexpectedly.

To change the daily cap, in the Configure section of your Application Insights resource, from the **Usage and estimated costs** page, click  **Daily Cap**.

![Adjusting the daily telemetry volume cap](./media/app-insights-pricing/pricing-003.png)

## Sampling
[Sampling](app-insights-sampling.md) is a method of reducing the rate at which telemetry is sent to your app, while still retaining the ability to find related events during diagnostic searches, and still retaining correct event counts.

Sampling is an effective way to reduce charges and stay within your monthly quota. The sampling algorithm retains related items of telemetry, so that, for example, when you use Search, you can find the request related to a particular exception. The algorithm also retains correct counts, so that you see the correct values in Metric Explorer for request rates, exception rates, and other counts.

There are several forms of sampling.

* [Adaptive sampling](app-insights-sampling.md) is the default for the ASP.NET SDK, which automatically adjusts to the volume of telemetry that your app sends. It operates automatically in the SDK in your web app, so that the telemetry traffic on the network is reduced. 
* *Ingestion sampling* is an alternative that operates at the point where telemetry from your app enters the Application Insights service. It doesn't affect the volume of telemetry sent from your app, but it reduces the volume retained by the service. You can use it to reduce the quota used up by telemetry from browsers and other SDKs.

To set ingestion sampling, set the control in the Pricing dialog:

![From the Quota and pricing dialog, click the Samples tile and select a sampling fraction.](./media/app-insights-pricing/pricing-004.png)

> [!WARNING]
> The Data sampling dialog only controls the value of ingestion sampling. It doesn't reflect the sampling rate that is being applied by the Application Insights SDK in your app. If the incoming telemetry has already been sampled at the SDK, ingestion sampling is not applied.
>

To discover the actual sampling rate no matter where it has been applied, use an [Analytics query](app-insights-analytics.md) such as this:

    requests | where timestamp > ago(1d)
    | summarize 100/avg(itemCount) by bin(timestamp, 1h)
    | render areachart

In each retained record, `itemCount` indicates the number of original records that it represents, equal to 1 + the number of previous discarded records. 

## Automation

You can write a script to set the price plan, using Azure Resource Management. [Learn how](app-insights-powershell.md#price).

## Limits summary

[!INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]

## Next steps

* [Sampling](app-insights-sampling.md)

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[start]: app-insights-overview.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/

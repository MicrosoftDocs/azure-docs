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
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 08/11/2018
ms.author: mbullwin

---
# Manage pricing and data volume in Application Insights

> [!NOTE]
> This article describes how to analyze data usage Application Insights.  Refer to the following articles for related information.
> - [Monitoring usage and estimated costs](../monitoring-and-diagnostics/monitoring-usage-and-estimated-costs.md) describes how to view usage and estimated costs across multiple Azure monitoring features for different pricing models. It also describes how to change your pricing model.

Pricing for [Azure Application Insights][start] is based on data volume per application. Each Application Insights resource is charged as a separate service and contributes to the bill for your Azure subscription.

Application Insights has two pricing plans: Basic and Enterprise. The Basic pricing plan is the default plan. It includes all Enterprise plan features, at no additional cost. The Basic plan bills primarily on the volume of data that's ingested. 

The Enterprise plan has a per-node charge, and each node receives a daily data allowance. In the Enterprise pricing plan, you are charged for data ingested above the included allowance. If you use Operations Management Suite, you should choose the Enterprise plan. 

If you have questions about how pricing works for Application Insights, you can post a question in our [forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=ApplicationInsights).

## Pricing plans

For current prices in your currency and region, see [Application Insights pricing][pricing].

> [!NOTE]
> In April 2018, we [introduced](https://azure.microsoft.com/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/) a new pricing model for Azure monitoring. This model adopts a simple "pay-as-you-go" model across the complete portfolio of monitoring services. Learn more about the [new pricing model](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-usage-and-estimated-costs), how to [assess the impact of moving to this model](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-usage-and-estimated-costs#assessing-the-impact-of-the-new-pricing-model) based on your usage patterns, and [how to opt into the new model](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-usage-and-estimated-costs#moving-to-the-new-pricing-model).

### Basic plan

The Basic plan is the default pricing plan when a new Application Insights resource is created. The Basic plan is optimal for all customers except those who have an Operations Management Suite subscription.

* In the Basic plan, you are charged by data volume. Data volume is the number of bytes of telemetry received by Application Insights. Data volume is measured as the size of the uncompressed JSON data package that's received by Application Insights from your application. For [tabular data imported to Analytics](https://docs.microsoft.com/azure/application-insights/app-insights-analytics-import), data volume is measured as the uncompressed size of files that are sent to Application Insights.
* Your application's data volume charges are now reported on a new billing meter named **Data Ingestion** as of April 2018. This new meter is be shared across monitoring technologies such as Applications Insights and Log Analytics and is currently under the service name **App Services** (and soon changing to **Log Analytics**). 
* [Live Metrics Stream](app-insights-live-stream.md) data isn't counted for pricing purposes.
* [Continuous export](app-insights-export-telemetry.md) and the [Azure Log Analytics connector](https://go.microsoft.com/fwlink/?LinkId=833039&amp;clcid=0x409) are available at no extra charge in the Basic plan as of April 2018.

### Enterprise plan and Operations Management Suite subscription entitlements

Customers who purchase Operations Management Suite E1 and E2 can get Application Insights Enterprise as an additional component at no additional cost as [previously announced](https://blogs.technet.microsoft.com/msoms/2017/05/19/azure-application-insights-enterprise-as-part-of-operations-management-suite-subscription/). Specifically, each unit of Operations Management Suite E1 and E2 includes an entitlement to one node of the Application Insights Enterprise plan. Each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no additional cost. The plan is described in more detailed later in the article. 

Because this plan is applicable only to customers with an Operations Management Suite subscription, customers who don't have an Operations Management Suite subscription don't see an option to select this plan.

> [!NOTE]
> To ensure that you get this entitlement, your Application Insights resources must be in the Enterprise pricing plan. This entitlement applies only as nodes. Application Insights resources in the Basic plan don't realize any benefit. 
> This entitlement isn't visible in the estimated costs shown in the **Usage and estimated cost** pane. Also, if you move a subscription to the new Azure monitoring pricing model in April 2018, the Basic plan is the only plan available. Moving a subscription to the new Azure monitoring pricing model isn't advisable if you have an Operations Management Suite subscription.

For more information about the Enterprise plan, see [Enterprise pricing details](app-insights-pricing-enterprise-details.md).

### Multi-step web tests

[Multi-step web tests](app-insights-monitor-web-app-availability.md#multi-step-web-tests) incur an additional charge. Multi-step web tests are web tests that perform a sequence of actions.

There's no separate charge for *ping tests* of a single page. Telemetry from ping tests and multi-step tests is charged the same as other telemetry from your app.

## Review pricing plans and estimate costs

Application Insights makes it easy to understand the pricing plans that are available, and what your costs are likely to be based on recent usage patterns. To get started, in the Azure portal, for the Application Insights resource, go to the **Usage and estimated costs** pane:

![Choose pricing](./media/app-insights-pricing/pricing-001.png)

A. Review your data volume for the month. This includes all the data that's received and retained (after any [sampling](app-insights-sampling.md)) from your server and client apps, and from availability tests.  
B. A separate charge is made for [multi-step web tests](app-insights-monitor-web-app-availability.md#multi-step-web-tests). (This doesn't include simple availability tests, which are included in the data volume charge.)  
C. View data volume trends for the past month.  
D. Enable data ingestion [sampling](app-insights-sampling.md).   
E. Set the daily data volume cap.  

Application Insights charges are added to your Azure bill. You can see details of your Azure bill in the **Billing** section of the Azure portal, or in the [Azure billing portal](https://account.windowsazure.com/Subscriptions). 

![In the left menu, select Billing](./media/app-insights-pricing/02-billing.png)

## Data rate
The volume of data you send is limited in three ways:

* **Sampling**: You can use sampling to reduce the amount of telemetry that's sent from your server and client apps, with minimal distortion of metrics. Sampling is the primary tool you can use to tune the amount of data you send. Learn more about [sampling features](app-insights-sampling.md). 
* **Daily cap**: When you create an Application Insights resource in the Azure portal, the daily cap is set to 100 GB/day. When you create an Application Insights resource in Visual Studio, the default is small (only 32.3 MB/day). The daily cap default is set to facilitate testing. It's intended that the user will raise the daily cap before deploying the app into production. 

    The maximum cap is 1,000 GB/day unless you request a higher maximum for a high-traffic application. 

    Use care when you set the daily cap. Your intent should be to *never hit the daily cap*. If you hit the daily cap, you lose data for the remainder of the day, and you can't monitor your application. To change the daily cap, use the **Daily volume cap** option. You can access this option in the **Usage and estimated costs** pane (this is described in more detail later in the article).
    We've removed the restriction on some subscription types that have credit that couldn't be used for Application Insights. Previously, if the subscription has a spending limit, the daily cap dialog has instructions to remove the spending limit and enable the daily cap to be raised beyond 32.3 MB/day.
* **Throttling**: Throttling limits the data rate to 32,000 events per second, averaged over 1 minute per instrumentation key.

*What happens if my app exceeds the throttling rate?*

* The volume of data that your app sends is assessed every minute. If it exceeds the per-second rate averaged over the minute, the server refuses some requests. The SDK buffers the data and then tries to resend it. It spreads out a surge over several minutes. If your app consistently sends data at more than the throttling rate, some data will be dropped. (The ASP.NET, Java, and JavaScript SDKs try to resend data this way; other SDKs might simply drop throttled data.) If throttling occurs, a notification warning alerts you that this has occurred.

*How do I know how much data my app is sending?*

You can use one of the following options to see how much data your app is sending:

* Go to the **Usage and estimated cost** pane to see the daily data volume chart. 
* In Metrics Explorer, add a new chart. For the chart metric, select **Data point volume**. Turn on **Grouping**, and then group by **Data type**.

## Reduce your data rate
Here are some things you can do to reduce your data volume:

* Use [Sampling](app-insights-sampling.md). This technology reduces your data rate without skewing your metrics. You don't lose the ability to navigate between related items in Search. In server apps, sampling operates automatically.
* [Limit the number of Ajax calls that can be reported](app-insights-javascript.md#detailed-configuration) in every page view, or switch off Ajax reporting.
* [Edit ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md) to turn off collection modules that you don't need. For example, you might decide that performance counters or dependency data are inessential.
* Split your telemetry among separate instrumentation keys. 
* Pre-aggregate metrics. If you put calls to TrackMetric in your app, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Or, you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs).

## Manage the maximum daily data volume

You can use the daily volume cap to limit the data collected. However, if the cap is met, a loss of all telemetry sent from your application for the remainder of the day occurs. It is *not advisable* to have your application hit the daily cap. You can't track the health and performance of your application after it reaches the daily cap.

Instead of using the daily volume cap, use [sampling](app-insights-sampling.md) to tune the data volume to the level you want. Then, use the daily cap only as a "last resort" in case your application unexpectedly begins to send much higher volumes of telemetry.

To change the daily cap, in the **Configure** section of your Application Insights resource, in the **Usage and estimated costs** pane, select  **Daily Cap**.

![Adjust the daily telemetry volume cap](./media/app-insights-pricing/pricing-003.png)

## Sampling
[Sampling](app-insights-sampling.md) is a method of reducing the rate at which telemetry is sent to your app, while retaining the ability to find related events during diagnostic searches. You also retain correct event counts.

Sampling is an effective way to reduce charges and stay within your monthly quota. The sampling algorithm retains related items of telemetry so, for example, when you use Search, you can find the request related to a particular exception. The algorithm also retains correct counts so you see the correct values in Metric Explorer for request rates, exception rates, and other counts.

There are several forms of sampling.

* [Adaptive sampling](app-insights-sampling.md) is the default for the ASP.NET SDK. Adaptive sampling automatically adjusts to the volume of telemetry that your app sends. It operates automatically in the SDK in your web app so that telemetry traffic on the network is reduced. 
* *Ingestion sampling* is an alternative that operates at the point where telemetry from your app enters the Application Insights service. Ingestion sampling doesn't affect the volume of telemetry sent from your app, but it reduces the volume that's retained by the service. You can use ingestion sampling to reduce the quota that's used up by telemetry from browsers and other SDKs.

To set ingestion sampling, go to the  **Pricing** pane:

![In the Quota and pricing pane, select the Samples tile, and then select a sampling fraction](./media/app-insights-pricing/pricing-004.png)

> [!WARNING]
> The **Data sampling** pane controls only the value of ingestion sampling. It doesn't reflect the sampling rate that's applied by the Application Insights SDK in your app. If the incoming telemetry has already been sampled in the SDK, ingestion sampling isn't applied.
>

To discover the actual sampling rate, no matter where it's been applied, use an [Analytics query](app-insights-analytics.md). The query looks like this:

    requests | where timestamp > ago(1d)
    | summarize 100/avg(itemCount) by bin(timestamp, 1h)
    | render areachart

In each retained record, `itemCount` indicates the number of original records that it represents. It's equal to 1 + the number of previous discarded records. 

## Automation

You can write a script to set the price plan by using Azure Resource Management. [Learn how](app-insights-powershell.md#price).

## Limits summary

[!INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]

## Disable daily cap e-mails

To disable the daily volume cap e-mails, under the **Configure** section of your Application Insights resource, in the **Usage and estimated costs** pane, select  **Daily Cap**. There are settings to send e-mail when the cap is reached, as well as when an adjustable warning level has been reached. If you wish to disable all daily cap volume related emails uncheck both boxes.

## Next steps

* [Sampling](app-insights-sampling.md)

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[start]: app-insights-overview.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/
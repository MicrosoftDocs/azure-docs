<properties 
	pageTitle="Manage pricing and quota for Application Insights" 
	description="Choose the price plan you need" 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/11/2015" 
	ms.author="awills"/>

# Manage pricing and quota for Application Insights

*Application Insights is in preview.*

[Pricing][pricing] for [Visual Studio Application Insights][start] is based on data volume per application. There's a substantial Free tier in which you get most of the features with some limitations.

Each Application Insights resource is charged as a separate service, and contributes to the bill for your subscription to Azure.

[See the pricing scheme][pricing].

## Review quota and price plan for your Application Insights resource

You can open the Quota + Pricing blade from your application resource's Settings.

![Choose Settings, Quota + pricing.](./media/app-insights-pricing/01-pricing.png)

Your choice of pricing scheme affects:

* [Monthly Quota](#monthly-quota) - the amount of telemetry you can analyze each month.
* [Data rate](#data-rate) - the maximum rate at which data from your app can be processed.
* [Retention](#data-retention) - how long data is kept in  the Application Insights portal for you to view.
* [Continuous export](#continuous-export) - whether you can export data to other tools and services.

These limits are set separately for each Application Insights resource.

### Free Premium trial

When you first create a new Application Insights resource, it starts in the Free tier.

At any time, you can switch to the 30 day free Premium trial. This gives you the benefits of the Premium tier. After 30 days, it will automatically revert to whatever tier you were in before - unless you explicitly choose another tier. You select the tier you'd like at any time during the trial period, but you'll still get the free trial until the end of the 30-day period.


## Monthly Quota

* In each calendar month, your application can send up to a specified quantity of telemetry to Application Insights. See the [pricing scheme][pricing] for the  actual numbers. 
* The quota depends on the pricing tier that you have chosen.
* The quota is counted from midnight UTC on the first day of each month.
* The Data points chart shows how much of your quota has been used up this month.
* The quota is measured in *data points.* A single data point is a call to one of the Track methods, whether called explicitly in your code, or by one of the standard telemetry modules. Data points include:
 * Each row you see in [diagnostic search](app-insights-diagnostic-search.md). 
 * Each raw measurement of a [metric](app-insights-metrics-explorer.md) such as a performance counter. (The points you see on the charts are usually aggregates of multiple raw data points.)
 * Each point on the [web test (availability)](app-insights-monitor-web-app-availability.md) charts. 
* *Session data* is not counted in the quota. This includes counts of users, sessions, environment and device data.


### Overage

If your application sends more than the monthly quota, you can:

* Pay for additional data. See the [pricing scheme][pricing] for details. You can choose this option in advance. This option isn't available in the Free pricing tier.
* Upgrade your pricing tier.
* Do nothing. Session data will continue to be recorded, but other data will not appear in diagnostic search or in metrics explorer.


### How much data am I sending?

The chart at the bottom of the pricing blade shows your application's data point volume, grouped by data point type. (You can also create this chart in Metric Explorer.)

![At the bottom of the pricing blade](./media/app-insights-pricing/03-allocation.png)

Click the chart for more detail, or drag across it and click (+) for the detail of a time range.


## Data rate

In addition to the monthly quota, there are throttling limits on the data rate. For the free [pricing tier][pricing] the limit is 200 data points/second averaged over 5 minutes and for the paid tiers it is 500/s averaged over 1 minute. 

There are three buckets which are counted separately:

* [TrackTrace calls](app-insights-api-custom-events-metrics.md#track-trace) and [captured logs](app-insights-asp-net-trace-logs.md)
* [Exceptions](app-insights-api-custom-events-metrics.md#track-exception), limited to 50 points/s.
* All other telemetry (page views, sessions, requests, dependencies, metrics, custom events, web test results).

If your app sends more than the limit for several minutes, some of the data may be dropped. You'll see a notification warning that this has happened.

### Tips for reducing your data rate

If you encounter the throttling limits, here are some things you can do:

* Switch off collection modules you don't need by [editing ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md). For example, you might decide that performance counters or dependency data are inessential.
* Pre-aggregate metrics. If you have put calls to TrackMetric in your app, you can reduce traffic by using the overload that accepts your calculation of the average and standard deviation of a batch of measurements. Or you can use a [pre-aggregating package](https://www.myget.org/gallery/applicationinsights-sdk-labs). 


### Name limits

1.	Maximum of 200 unique metric names and 200 unique property names for your application. Metrics include data send via TrackMetric as well as measurements on other  data types such as Events.  [Metrics and property names][api] are global per instrumentation key not scoped to data type.
2.	[Properties][apiproperties] can be used for filtering and group by only while they have less than 100 unique values for each property. After the unique values exceed 100, the property can still be used for search and filtering but no longer for filters.
3.	Standard properties such as Request Name and Page URL are limited to 1000 unique values per week. After 1000 unique values, additional values are marked as "Other values." The original value can still be used for full text search and filtering.

## Data retention

Your pricing tier determines how long data is kept in the portal, and therefore how far back you can set the time ranges.


* Raw data points (that is, instances that you can inspect in Diagnostic Search): between 7 and 30 days.
* Aggregated data (that is, counts, averages and other statistical data that you see in Metric Explorer) are retained at a grain of 1 minute for 30 days, and 1 hour or 1 day (depending on type) for at least 13 months.




## Review the bill for your subscription to Azure

Application Insights charges are added to your Azure bill. You can see details of your Azure bill on the Billing section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions). 

![On the side menu, choose Billing.](./media/app-insights-pricing/02-billing.png)

## Limits summary

[AZURE.INCLUDE [application-insights-limits](../../includes/application-insights-limits.md)]


<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[start]: app-insights-overview.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/

 
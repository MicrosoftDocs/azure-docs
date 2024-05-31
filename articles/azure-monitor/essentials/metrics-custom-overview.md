---
title: Custom metrics in Azure Monitor (preview)
description: Learn about custom metrics in Azure Monitor and how they're modeled.
author: EdB-MSFT
ms.service: azure-monitor
ms-author: edbaynash
ms.topic: conceptual
ms.date: 01/07/2024
ms.reviewer: priyamishra
---
# Custom metrics in Azure Monitor (preview)

Azure makes some metrics available to you out of the box. These metrics are called [standard or platform](./metrics-supported.md). Custom metrics are performance indicators or business-specific metrics that can be collected via your application's telemetry, the Azure Monitor Agent, a diagnostics extension that runs on your Azure resources, or an external monitoring system. Once custom metrics are published to Azure Monitor, you can browse, query, and alert on them along side the standard Azure metrics.

Azure Monitor custom metrics are currently in public preview.

## Methods to send custom metrics

Custom metrics can be sent to Azure Monitor via several methods:

- Use Azure Application Insights SDK to instrument your application by sending custom telemetry to Azure Monitor.
- Install the [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) on your Windows or Linux Azure virtual machine or virtual machine scale set and use a [data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) to send performance counters to Azure Monitor metrics.
- Install the Azure Diagnostics extension on your [Azure VM](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md), [Virtual Machine Scale Set](../essentials/collect-custom-metrics-guestos-resource-manager-vmss.md), [classic VM](../essentials/collect-custom-metrics-guestos-vm-classic.md), or [classic cloud service](../essentials/collect-custom-metrics-guestos-vm-cloud-service-classic.md). Then send performance counters to Azure Monitor.
- Install the [InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) on your Azure Linux VM. Send metrics by using the Azure Monitor output plug-in.
- Send custom metrics [directly to the Azure Monitor REST API](./metrics-store-custom-rest-api.md).

## Pricing model and retention

In general, there's no cost to ingest standard metrics (platform metrics) into an Azure Monitor metrics store, but custom metrics incur costs when they enter general availability. Queries to the metrics API do incur costs. For details on when billing is enabled for custom metrics and metrics queries, check the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). 

Custom metrics are retained for the [same amount of time as platform metrics](../essentials/data-platform-metrics.md#retention-of-metrics).

> [!NOTE]
> Metrics sent to Azure Monitor via the Application Insights SDK are billed as ingested log data. They incur additional metrics charges only if the Application Insights feature [Enable alerting on custom metric dimensions](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) has been selected. This checkbox sends data to the Azure Monitor metrics database by using the custom metrics API to allow the more complex alerting. Learn more about the [Application Insights pricing model](../cost-usage.md) and [prices in your region](https://azure.microsoft.com/pricing/details/monitor/).

## Custom metric definitions

Each metric data point published contains a namespace, name, and dimension information. The first time a custom metric is emitted to Azure Monitor, a metric definition is automatically created. This new metric definition is then discoverable on any resource that the metric is emitted from via the metric definitions. There's no need to predefine a custom metric in Azure Monitor before it's emitted.  

> [!NOTE]
> Application Insights, the diagnostics extension, and the InfluxData Telegraf agent are already configured to emit metric values against the correct regional endpoint and carry all the preceding properties in each emission.


## Using custom metrics

After custom metrics are submitted to Azure Monitor, you can browse through them via the Azure portal and query them via the Azure Monitor REST APIs. You can also create alerts on them to notify you when certain conditions are met.

> [!NOTE]
> You need to have a reader or contributor role to view custom metrics. See [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader).

### Browse your custom metrics via the Azure portal

1. Go to the [Azure portal](https://portal.azure.com).
1. Select the **Monitor** pane.
1. Select **Metrics**.
1. Select a resource that you've emitted custom metrics against.
1. Select the metrics namespace for your custom metric.
1. Select the custom metric.

For more information on viewing metrics in the Azure portal, see [Analyze metrics with Azure Monitor metrics explorer](./analyze-metrics.md).


## Latency and storage retention

A newly added metric or a newly added dimension to a metric might take up to 3 minutes to appear. After the data is in the system, it should appear in less than 30 seconds 99 percent of the time.

If you delete a metric or remove a dimension, the change can take a week to a month to be deleted from the system.

## Quotas and limits

Azure Monitor imposes the following usage limits on custom metrics:

|Category|Limit|
|---|---|
|Total active time series in a subscription per region|50,000|
|Dimension keys per metric|10|
|String length for metric namespaces, metric names, dimension keys, and dimension values|256 characters|
|The combined length of all custom metric names, using utf-8 encoding|64 KB| 

An active time series is defined as any unique combination of metric, dimension key, or dimension value that has had metric values published in the past 12 hours.

To understand the limit of 50,000 on time series, consider the following metric:

> *Server response time* with Dimensions: *Region*, *Department*, *CustomerID*

With this metric, if you have 10 regions, 20 departments, and 100 customers that gives you 10 x 20 x 100 = 20,000 time series.

If you have 100 regions, 200 departments, and 2,000 customers, that gives you 100 x 200 x 2,000 = 40 million time series, which is far over the limit just for this metric alone.

Again, this limit isn't for an individual metric. It's for the sum of all such metrics across a subscription and region.

Follow the steps below to see your current total active time series metrics, and more information to assist with troubleshooting.

1. Navigate to the Monitor section of the Azure portal.
1. Select **Metrics** on the left hand side.
1. Under **Select a scope**, check the applicable subscription and resource groups.
1. Under **Refine scope**, choose **Custom Metric Usage** and the desired location.
1. Select the **Apply** button.
1. Choose either **Active Time Series**, **Active Time Series Limit**, or **Throttled Time Series**.

There's a limit of 64 KB on the combined length of all custom metrics names, assuming utf-8 or 1 byte per character. If the 64-KB limit is exceeded, metadata for additional metrics won't be available. The metric names for additional custom metrics won't appear in the Azure portal in selection fields, and won't be returned by the API in requests for metric definitions. The metric data is still available and can be queried.

When the limit has been exceeded, reduce the number of metrics you're sending or shorten the length of their names. It then takes up to two days for the new metrics' names to appear. 

To avoid reaching the limit, don't include variable or dimensional aspects in your metric names.
For example, the metrics for server CPU usage,`CPU_server_12345678-319d-4a50-b27e-1234567890ab` and `CPU_server_abcdef01-319d-4a50-b27e-abcdef012345` should be defined as metric `CPU` and with a `Server` dimension.

## Design limitations and considerations

**Using Application Insights for the purpose of auditing.** The Application Insights telemetry pipeline is optimized for minimizing the performance impact and limiting the network traffic from monitoring your application. As such, it throttles or samples (takes only a percentage of your telemetry and ignores the rest) if the initial dataset becomes too large. Because of this behavior, you can't use it for auditing purposes because some records are likely to be dropped.

**Metrics with a variable in the name.** Don't use a variable as part of the metric name. Use a constant instead. Each time the variable changes its value, Azure Monitor generates a new metric. Azure Monitor then quickly hits the limit on the number of metrics. Generally, when developers want to include a variable in the metric name, they really want to track multiple time series within one metric and should use dimensions instead of variable metric names.

**High-cardinality metric dimensions.** Metrics with too many valid values in a dimension (a *high cardinality*) are much more likely to hit the 50,000 limit. In general, you should never use a constantly changing value in a dimension. Timestamp, for example, should never be a dimension. You can use server, customer, or product ID, but only if you have a smaller number of each of those types.

As a test, ask yourself if you would ever chart such data on a graph. If you have 10 or maybe even 100 servers, it might be useful to see them all on a graph for comparison. But if you have 1,000, the resulting graph would likely be difficult or impossible to read. A best practice is to keep it to fewer than 100 valid values. Up to 300 is a gray area. If you need to go over this amount, use Azure Monitor custom logs instead.

If you have a variable in the name or a high-cardinality dimension, the following issues can occur:

- Metrics become unreliable because of throttling.
- Metrics Explorer won't work.
- Alerting and notifications become unpredictable.
- Costs can increase unexpectedly. Microsoft isn't charging for custom metrics with dimensions while this feature is in public preview. After charges start in the future, you'll incur unexpected charges. The plan is to charge for metrics consumption based on the number of time series monitored and number of API calls made.

If the metric name or dimension value is populated with an identifier or high-cardinality dimension by mistake, you can easily fix it by removing the variable part.

But if high cardinality is essential for your scenario, the aggregated metrics are probably not the right choice. Switch to using custom logs (that is, trackMetric API calls with [trackEvent](../app/api-custom-events-metrics.md#trackevent)). However, consider that logs don't aggregate values, so every single entry will be stored. As a result, if you have a large volume of logs in a small time period (1 million a second, for example), it can cause throttling and ingestion delays.

## Next steps

Use custom metrics from various services:

 - [Send custom metrics to the Azure Monitor using the REST API](./metrics-store-custom-rest-api.md)
 - [Virtual machine](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md)
 - [Virtual Machine Scale Set](../essentials/collect-custom-metrics-guestos-resource-manager-vmss.md)
 - [Azure virtual machine (classic)](../essentials/collect-custom-metrics-guestos-vm-classic.md)
 - [Linux virtual machine using the Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md)\
 - [Classic cloud service](../essentials/collect-custom-metrics-guestos-vm-cloud-service-classic.md)

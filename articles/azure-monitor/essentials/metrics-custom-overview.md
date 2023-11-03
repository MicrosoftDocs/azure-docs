---
title: Custom metrics in Azure Monitor (preview)
description: Learn about custom metrics in Azure Monitor and how they're modeled.
author: EdB-MSFT
ms.service: azure-monitor
ms-author: edbaynash
ms.topic: conceptual
ms.date: 06/01/2021
ms.reviewer: priyamishra
---
# Custom metrics in Azure Monitor (preview)

As you deploy resources and applications in Azure, start collecting telemetry to gain insights into their performance and health. Azure makes some metrics available to you out of the box. These metrics are called [standard or platform](./metrics-supported.md). 

Collect custom performance indicators or business-specific metrics to provide deeper insights. These *custom* metrics can be collected via your application telemetry, an agent that runs on your Azure resources, or even an outside-in monitoring system. They can then be submitted directly to Azure Monitor. Once custom metrics are published to Azure Monitor, you can browse, query, and alert on them for your Azure resources and applications along side the standard Azure metrics.

Azure Monitor custom metrics are currently in public preview.

## Methods to send custom metrics

Custom metrics can be sent to Azure Monitor via several methods:

- Instrument your application by using the Azure Application Insights SDK and send custom telemetry to Azure Monitor.
- Install the Azure Monitor agent (preview) on your [Windows or Linux Azure VM](../agents/azure-monitor-agent-overview.md). Use a [data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) to send performance counters to Azure Monitor metrics.
- Install the Azure Diagnostics extension on your [Azure VM](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md), [Virtual Machine Scale Set](../essentials/collect-custom-metrics-guestos-resource-manager-vmss.md), [classic VM](../essentials/collect-custom-metrics-guestos-vm-classic.md), or [classic cloud service](../essentials/collect-custom-metrics-guestos-vm-cloud-service-classic.md). Then send performance counters to Azure Monitor.
- Install the [InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) on your Azure Linux VM. Send metrics by using the Azure Monitor output plug-in.
- Send custom metrics [directly to the Azure Monitor REST API](./metrics-store-custom-rest-api.md), `https://<azureregion>.monitoring.azure.com/<AzureResourceID>/metrics`.

## Pricing model and retention

For details on when billing is enabled for custom metrics and metrics queries, check the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). In summary, there's no cost to ingest standard metrics (platform metrics) into an Azure Monitor metrics store, but custom metrics incur costs when they enter general availability. Queries to the metrics API do incur costs.

Custom metrics are retained for the [same amount of time as platform metrics](../essentials/data-platform-metrics.md#retention-of-metrics).

> [!NOTE]
> Metrics sent to Azure Monitor via the Application Insights SDK are billed as ingested log data. They incur additional metrics charges only if the Application Insights feature [Enable alerting on custom metric dimensions](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) has been selected. This checkbox sends data to the Azure Monitor metrics database by using the custom metrics API to allow the more complex alerting. Learn more about the [Application Insights pricing model](../cost-usage.md) and [prices in your region](https://azure.microsoft.com/pricing/details/monitor/).

## How to send custom metrics

When you send custom metrics to Azure Monitor, each data point, or value, reported in the metrics must include the following information.

### Authentication

To submit custom metrics to Azure Monitor, the entity that submits the metric needs a valid Microsoft Entra token in the **Bearer** header of the request. Supported ways to acquire a valid bearer token include:

- [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). You can use a managed identity to give resources permissions to carry out certain operations. An example is allowing a resource to emit metrics about itself. A resource, or its managed identity, can be granted **Monitoring Metrics Publisher** permissions on another resource. With this permission, the managed identity can also emit metrics for other resources.
- [Microsoft Entra service principal](../../active-directory/develop/app-objects-and-service-principals.md). In this scenario, a Microsoft Entra application, or service, can be assigned permissions to emit metrics about an Azure resource. To authenticate the request, Azure Monitor validates the application token by using Microsoft Entra public keys. The existing **Monitoring Metrics Publisher** role already has this permission. It's available in the Azure portal.

  The service principal, depending on what resources it emits custom metrics for, can be given the **Monitoring Metrics Publisher** role at the scope required. Examples are a subscription, resource group, or specific resource.

> [!TIP]
> When you request a Microsoft Entra token to emit custom metrics, ensure that the audience or resource that the token is requested for is `https://monitoring.azure.com/`. Be sure to include the trailing slash.

### Subject

The subject property captures which Azure resource ID the custom metric is reported for. This information is encoded in the URL of the API call. Each API can submit metric values for only a single Azure resource.

> [!NOTE]
> You can't emit custom metrics against the resource ID of a resource group or subscription.

### Region

The region property captures the Azure region where the resource you're emitting metrics for is deployed. Metrics must be emitted to the same Azure Monitor regional endpoint as the region where the resource is deployed. For example, custom metrics for a VM deployed in West US must be sent to the WestUS regional Azure Monitor endpoint. The region information is also encoded in the URL of the API call.

> [!NOTE]
> During the public preview, custom metrics are available in only a subset of Azure regions. A list of supported regions is documented in a [later section of this article](#supported-regions).

### Timestamp

Each data point sent to Azure Monitor must be marked with a timestamp. This timestamp captures the date and time at which the metric value is measured or collected. Azure Monitor accepts metric data with timestamps as far as 20 minutes in the past and 5 minutes in the future. The timestamp must be in ISO 8601 format.

### Namespace

Namespaces are a way to categorize or group similar metrics together. By using namespaces, you can achieve isolation between groups of metrics that might collect different insights or performance indicators. For example, you might have a namespace called **contosomemorymetrics** that tracks memory-use metrics which profile your app. Another namespace called **contosoapptransaction** might track all metrics about user transactions in your application.

### Name

The name property is the name of the metric that's being reported. Usually, the name is descriptive enough to help identify what's measured. An example is a metric that measures the number of memory bytes used on a VM. It might have a metric name like **Memory Bytes In Use**.

### Dimension keys

A dimension is a key/value pair that helps describe other characteristics about the metric that's being collected. By using the other characteristics, you can collect more information about the metric, which allows for deeper insights.

For example, the **Memory Bytes In Use** metric might have a dimension key called **Process** that captures how many bytes of memory each process on a VM consumes. By using this key, you can filter the metric to see how much memory specific processes use or to identify the top five processes by memory usage.

Dimensions are optional, and not all metrics have dimensions. A custom metric can have up to 10 dimensions.

### Dimension values

When you're reporting a metric data point, for each dimension key on the reported metric, there's a corresponding dimension value. For example, you might want to report the memory that ContosoApp uses on your VM:

* The metric name would be **Memory Bytes in Use**.
* The dimension key would be **Process**.
* The dimension value would be **ContosoApp.exe**.

When you're publishing a metric value, you can specify only a single dimension value per dimension key. If you collect the same memory utilization for multiple processes on the VM, you can report multiple metric values for that timestamp. Each metric value would specify a different dimension value for the **Process** dimension key.

Although dimensions are optional, if a metric post defines dimension keys, corresponding dimension values are mandatory.

### Metric values

Azure Monitor stores all metrics at 1-minute granularity intervals. During a given minute, a metric might need to be sampled several times. An example is CPU utilization. Or a metric might need to be measured for many discrete events, such as sign-in transaction latencies.

To limit the number of raw values that you have to emit and pay for in Azure Monitor, locally pre-aggregate and emit the aggregated values:

* **Min**: The minimum observed value from all the samples and measurements during the minute.
* **Max**: The maximum observed value from all the samples and measurements during the minute.
* **Sum**: The summation of all the observed values from all the samples and measurements during the minute.
* **Count**: The number of samples and measurements taken during the minute.

For example, if there were four sign-in transactions to your app during a minute, the resulting measured latencies for each might be:

|Transaction 1|Transaction 2|Transaction 3|Transaction 4|
|---|---|---|---|
|7 ms|4 ms|13 ms|16 ms|

Then the resulting metric publication to Azure Monitor would be:

* Min: 4
* Max: 16
* Sum: 40
* Count: 4

If your application can't pre-aggregate locally and needs to emit each discrete sample or event immediately upon collection, you can emit the raw measure values. For example, each time a sign-in transaction occurs on your app, you publish a metric to Azure Monitor with only a single measurement. So, for a sign-in transaction that took 12 milliseconds, the metric publication would be:

* Min: 12
* Max: 12
* Sum: 12
* Count: 1

With this process, you can emit multiple values for the same metric/dimension combination during a given minute. Azure Monitor then takes all the raw values emitted for a given minute and aggregates them.

### Sample custom metric publication

In the following example, you create a custom metric called **Memory Bytes in Use** under the metric namespace **Memory Profile** for a virtual machine. The metric has a single dimension called **Process**. For the timestamp, metric values are emitted for two processes.

```json
{
    "time": "2018-08-20T11:25:20-7:00",
    "data": {

      "baseData": {

        "metric": "Memory Bytes in Use",
        "namespace": "Memory Profile",
        "dimNames": [
          "Process"
        ],
        "series": [
          {
            "dimValues": [
              "ContosoApp.exe"
            ],
            "min": 10,
            "max": 89,
            "sum": 190,
            "count": 4
          },
          {
            "dimValues": [
              "SalesApp.exe"
            ],
            "min": 10,
            "max": 23,
            "sum": 86,
            "count": 4
          }
        ]
      }
    }
  }
```

> [!NOTE]
> Application Insights, the diagnostics extension, and the InfluxData Telegraf agent are already configured to emit metric values against the correct regional endpoint and carry all the preceding properties in each emission.

## Custom metric definitions

Each metric data point published contains a namespace, name, and dimension information. The first time a custom metric is emitted to Azure Monitor, a metric definition is automatically created. This new metric definition is then discoverable on any resource that the metric is emitted from via the metric definitions. There's no need to predefine a custom metric in Azure Monitor before it's emitted.

> [!NOTE]
> Azure Monitor doesn't support defining **Units** for a custom metric.

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

## Supported regions

During the public preview, the ability to publish custom metrics is available only in a subset of Azure regions. This restriction means that metrics can be published only for resources in one of the supported regions. For more information on Azure regions, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).

The following table lists supported Azure regions for custom metrics. It also lists the corresponding endpoints that metrics for resources in those regions should be published to. The Azure region code used in the endpoint prefix is just the name of the region with whitespace removed.

|Azure region |Regional endpoint prefix|
|---|---|
| All Public Cloud Regions | https://<azure_region_code>.monitoring.azure.com |

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

With this metric, if you have 10 regions, 20 departments, and 100 customers, that gives you 10 x 20 x 100 = 20,000 time series.

If you have 100 regions, 200 departments, and 2,000 customers, that gives you 100 x 200 x 2,000 = 40 million time series, which is far over the limit just for this metric alone.

Again, this limit isn't for an individual metric. It's for the sum of all such metrics across a subscription and region.

Follow the steps below to see your current total active time series metrics, and more information to assist with troubleshooting.

1. Navigate to the Monitor section of the Azure portal.
1. Select **Metrics** on the left hand side.
1. Under **Select a scope**, check the applicable subscription and resource groups.
1. Under **Refine scope**, choose **Custom Metric Usage** and the desired location.
1. Select the **Apply** button.
1. Choose either **Active Time Series**, **Active Time Series Limit**, or **Throttled Time Series**.

There is a limit of 64 KB on the combined length of all custom metrics names, assuming utf-8 or 1 byte per character. If the 64-KB limit is exceeded, metadata for additional metrics won't be available. The metric names for additional custom metrics won't appear in the Azure portal in selection fields, and won't be returned by the API in requests for metric definitions. The metric data is still available and can be queried.

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

 - [Virtual machine](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md)
 - [Virtual Machine Scale Set](../essentials/collect-custom-metrics-guestos-resource-manager-vmss.md)
 - [Azure virtual machine (classic)](../essentials/collect-custom-metrics-guestos-vm-classic.md)
 - [Linux virtual machine using the Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md)
 - [REST API](./metrics-store-custom-rest-api.md)
 - [Classic cloud service](../essentials/collect-custom-metrics-guestos-vm-cloud-service-classic.md)

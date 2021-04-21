---
title: Custom metrics in Azure Monitor (Preview)
description: Learn about custom metrics in Azure Monitor and how they are modeled.
author: anirudhcavale
ms.author: ancav
services: azure-monitor
ms.topic: conceptual
ms.date: 04/13/2021
---
# Custom metrics in Azure Monitor (Preview)

As you deploy resources and applications in Azure, you'll want to start collecting telemetry to gain insights into their performance and health. Azure makes some metrics available to you out of the box. These metrics are called [standard or platform](./metrics-supported.md). However, they're limited in nature. 

You might want to collect some custom performance indicators or business-specific metrics to provide deeper insights. These **custom** metrics can be collected via your application telemetry, an agent that runs on your Azure resources, or even an outside-in monitoring system and submitted directly to Azure Monitor. After they're published to Azure Monitor, you can browse, query, and alert on custom metrics for your Azure resources and applications side by side with the standard metrics emitted by Azure.

Azure Monitor custom metrics are current in public preview. 

## Methods to send custom metrics

Custom metrics can be sent to Azure Monitor via several methods:
- Instrument your application by using the Azure Application Insights SDK and send custom telemetry to Azure Monitor. 
- Install the Azure Monitor Agent (Preview) on your [Windows or Linux Azure VM](../agents/azure-monitor-agent-overview.md) and use a [data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) to send performance counters to Azure Monitor metrics.
- Install the Windows Azure Diagnostics (WAD) extension on your [Azure VM](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md), [virtual machine scale set](../essentials/collect-custom-metrics-guestos-resource-manager-vmss.md), [classic VM](../essentials/collect-custom-metrics-guestos-vm-classic.md), or [classic Cloud Services](../essentials/collect-custom-metrics-guestos-vm-cloud-service-classic.md) and send performance counters to Azure Monitor. 
- Install the [InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) on your Azure Linux VM and send metrics by using the Azure Monitor output plug-in.
- Send custom metrics [directly to the Azure Monitor REST API](./metrics-store-custom-rest-api.md), `https://<azureregion>.monitoring.azure.com/<AzureResourceID>/metrics`.

## Pricing model and retention

Check the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/) for details on when billing will be enabled for custom metrics and metrics queries. Specific price details for all metrics, including custom metrics and metric queries are available on this page. In summary, there is no cost to ingest standard metrics (platform metrics) into Azure Monitor metrics store, but custom metrics will incur costs when they enter general availability. Metric API queries do incur costs.

Custom metrics are retained for the [same amount of time as platform metrics](../essentials/data-platform-metrics.md#retention-of-metrics). 

> [!NOTE]  
> Metrics sent to Azure Monitor via the Application Insights SDK are billed as ingested log data. They only incur additional metrics charges only if the Application Insights feature [Enable alerting on custom metric dimensions](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) has been selected. This checkbox sends data to the Azure Monitor metrics database using the custom metrics API to allow the more complex alerting.  Learn more about the [Application Insights pricing model](../app/pricing.md#pricing-model) and [prices in your region](https://azure.microsoft.com/pricing/details/monitor/).


## How to send custom metrics

When you send custom metrics to Azure Monitor, each data point, or value, reported must include the following information.

### Authentication
To submit custom metrics to Azure Monitor, the entity that submits the metric needs a valid Azure Active Directory (Azure AD) token in the **Bearer** header of the request. There are a few supported ways to acquire a valid bearer token:
1. [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Gives an identity to an Azure resource itself, such as a VM. Managed Service Identity (MSI) is designed to give resources permissions to carry out certain operations. An example is allowing a resource to emit metrics about itself. A resource, or its MSI, can be granted **Monitoring Metrics Publisher** permissions on another resource. With this permission, the MSI can emit metrics for other resources as well.
2. [Azure AD Service Principal](../../active-directory/develop/app-objects-and-service-principals.md). In this scenario, an Azure AD application, or service, can be assigned permissions to emit metrics about an Azure resource.
To authenticate the request, Azure Monitor validates the application token by using Azure AD public keys. The existing **Monitoring Metrics Publisher** role already has this permission. It's available in the Azure portal. The service principal, depending on what resources it emits custom metrics for, can be given the **Monitoring Metrics Publisher** role at the scope required. Examples are a subscription, resource group, or specific resource.

> [!TIP]  
> When you request an Azure AD token to emit custom metrics, ensure that the audience or resource the token is requested for is `https://monitoring.azure.com/`. Be sure to include the trailing '/'.

### Subject
This property captures which Azure resource ID the custom metric is reported for. This information will be encoded in the URL of the API call being made. Each API can only submit metric values for a single Azure resource.

> [!NOTE]  
> You can't emit custom metrics against the resource ID of a resource group or subscription.


### Region
This property captures what Azure region the resource you're emitting metrics for is deployed in. Metrics must be emitted to the same Azure Monitor regional endpoint as the region the resource is deployed in. For example, custom metrics for a VM deployed in West US must be sent to the WestUS regional Azure Monitor endpoint. The region information is also encoded in the URL of the API call.

> [!NOTE]  
> During the public preview, custom metrics are only available in a subset of Azure regions. A list of supported regions is documented in a later section of this article.
>
>

### Timestamp
Each data point sent to Azure Monitor must be marked with a timestamp. This timestamp captures the DateTime at which the metric value is measured or collected. Azure Monitor accepts metric data with timestamps as far as 20 minutes in the past and 5 minutes in the future. The timestamp must be in ISO 8601 format.

### Namespace
Namespaces are a way to categorize or group similar metrics together. By using namespaces, you can achieve isolation between groups of metrics that might collect different insights or performance indicators. For example, you might have a namespace called **contosomemorymetrics** that tracks memory-use metrics which profile your app. Another namespace called **contosoapptransaction** might track all metrics about user transactions in your application.

### Name
**Name** is the name of the metric that's being reported. Usually, the name is descriptive enough to help identify what's measured. An example is a metric that measures the number of memory bytes used on a given VM. It might have a metric name like **Memory Bytes In Use**.

### Dimension keys
A dimension is a key or value pair that helps describe additional characteristics about the metric being collected. By using the additional characteristics, you can collect more information about the metric, which allows for deeper insights. For example, the **Memory Bytes In Use** metric might have a dimension key called **Process** that captures how many bytes of memory each process on a VM consumes. By using this key, you can filter the metric to see how much memory-specific processes use or to identify the top five processes by memory usage.
Dimensions are optional, not all metrics may have dimensions. A custom metric can have up to 10 dimensions.

### Dimension values
When reporting a metric data point, for each dimension key on the metric being reported, there's a corresponding dimension value. For example, you might want to report the memory used by the ContosoApp on your VM:

* The metric name would be **Memory Bytes in Use**.
* The dimension key would be **Process**.
* The dimension value would be **ContosoApp.exe**.

When publishing a metric value, you can only specify a single dimension value per dimension key. If you collect the same memory utilization for multiple processes on the VM, you can report multiple metric values for that timestamp. Each metric value would specify a different dimension value for the **Process** dimension key.
Dimensions are optional, not all metrics may have dimensions. If a metric post defines dimension keys, corresponding dimension values are mandatory.

### Metric values
Azure Monitor stores all metrics at one-minute granularity intervals. We understand that during a given minute, a metric might need to be sampled several times. An example is CPU utilization. Or it might need to be measured for many discrete events. An example is sign-in transaction latencies. To limit the number of raw values you have to emit and pay for in Azure Monitor, you can locally pre-aggregate and emit the values:

* **Min**: The minimum observed value from all the samples and measurements during the minute.
* **Max**: The maximum observed value from all the samples and measurements during the minute.
* **Sum**: The summation of all the observed values from all the samples and measurements during the minute.
* **Count**: The number of samples and measurements taken during the minute.

For example, if there were four sign-in transactions to your app during a given a minute, the resulting measured latencies for each might be as follows:

|Transaction 1|Transaction 2|Transaction 3|Transaction 4|
|---|---|---|---|
|7 ms|4 ms|13 ms|16 ms|

Then the resulting metric publication to Azure Monitor would be as follows:
* Min: 4
* Max: 16
* Sum: 40
* Count: 4

If your application is unable to pre-aggregate locally and needs to emit each discrete sample or event immediately upon collection, you can emit the raw measure values. For example, each time a sign-in transaction occurs on your app, you publish a metric to Azure Monitor with only a single measurement. So for a sign-in transaction that took 12 ms, the metric publication would be as follows:
* Min: 12
* Max: 12
* Sum: 12
* Count: 1

With this process, you can emit multiple values for the same metric plus dimension combination during a given minute. Azure Monitor then takes all the raw values emitted for a given minute and aggregates them together.

### Sample custom metric publication
In the following example, you create a custom metric called **Memory Bytes in Use** under the metric namespace **Memory Profile** for a virtual machine. The metric has a single dimension called **Process**. For the given timestamp, we emit metric values for two different processes:

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
> Application Insights, the diagnostics extension, and the InfluxData Telegraf agent are already configured to emit metric values against the correct regional endpoint and carry all of the preceding properties in each emission.
>
>

## Custom metric definitions
There's no need to predefine a custom metric in Azure Monitor before it's emitted. Each metric data point published contains namespace, name, and dimension information. So the first time a custom metric is emitted to Azure Monitor, a metric definition is automatically created. This metric definition is then discoverable on any resource the metric is emitted against via the metric definitions.

> [!NOTE]  
> Azure Monitor doesn't yet support defining **Units** for a custom metric.

## Using custom metrics
After custom metrics are submitted to Azure Monitor, you can browse them via the Azure portal and query them via the Azure Monitor REST APIs. You can also create alerts on them to notify you when certain conditions are met.

> [!NOTE]
> You need to be a reader or contributor role to view custom metrics. See [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader). 

### Browse your custom metrics via the Azure portal
1.    Go to the [Azure portal](https://portal.azure.com).
2.    Select the **Monitor** pane.
3.    Select **Metrics**.
4.    Select a resource you've emitted custom metrics against.
5.    Select the metrics namespace for your custom metric.
6.    Select the custom metric.

> [!NOTE]
> See [Getting started with Azure Metrics Explorer](./metrics-getting-started.md) for more info on viewing metrics in the Azure portal.

## Supported regions
During the public preview, the ability to publish custom metrics is available only in a subset of Azure regions. This restriction means that metrics can be published only for resources in one of the supported regions. See [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/) for more info on Azure regions. The Azure region code used in the below endpoints is just the name of the region with whitespace removed The following table lists the set of supported Azure regions for custom metrics. It also lists the corresponding endpoints that metrics for resources in those regions should be published to:

|Azure region |Regional endpoint prefix|
|---|---|
| All Public Cloud Regions | https://<azure_region_code>.monitoring.azure.com |
| **Azure Government** | |
| US Gov Arizona | https:\//usgovarizona.monitoring.azure.us |
| **China** | |
| China East 2 | https:\//chinaeast2.monitoring.azure.cn |

## Latency and storage retention

Adding a brand new metric or a new dimension being added to a metric may take up to 2 to 3 minutes to appear. Once in the system, data should appear in less than 30 seconds 99% of the time. 

If you delete a metric or remove a dimension, the change can take a week to a month to be deleted from the system.

## Quotas and limits
Azure Monitor imposes the following usage limits on custom metrics:

|Category|Limit|
|---|---|
|Active time series/subscriptions/region|50,000|
|Dimension keys per metric|10|
|String length for metric namespaces, metric names, dimension keys, and dimension values|256 characters|

An active time series is defined as any unique combination of metric, dimension key, or dimension value that has had metric values published in the past 12 hours.

To understand the 50k time series limit, consider the following metric:

*Server response time* with Dimensions: *Region*, *Department*, *CustomerID*

With this metric, if you have 10 regions, 20 departments and 100 customers that gives you
10 x 20 x 100 = 2000 time-series. 

If you have 100 regions, 200 departments and 2000 customers
100 x 200 x 2000 = 40,000,000 time-series, which is far over the limit just for this metric alone. 

Again, this limit is not for an individual metric. It’s for the sum of all such metrics across a subscription and region.  

## Design limitations and considerations

**Do not use Application Insights for the purpose of auditing** – The Application Insights telemetry pipeline is optimized for minimizing the performance impact and limiting the network traffic from monitoring your application. As such, it throttles or samples (takes only a percentage of your telemetry and ignores the rest) if the initial dataset becomes too large. Because of this behavior, you cannot use it for auditing purposes as some records are likely to be dropped. 

**Metrics with a variable in the name** – Do not use a variable as part of the metric name, use a constant instead. Each time the variable changes its value, Azure Monitor will generate a new metric, quickly hitting the limits on the number of metrics. Generally, when the developers want to include a variable in the metric name, they really want to track multiple timeseries within one metric and should use dimensions instead of variable metric names. 

**High cardinality metric dimensions** - Metrics with too many valid values in a dimension (a “high cardinality”) are much more likely to hit the 50k limit. In general, you should never use a constantly changing value in a dimension or metric name. Timestamp, for example, should NEVER be a dimension. Server, customer or productid could be used, but only if you have a smaller number of each of those types. As a test, ask yourself if you would ever chart such data on a graph.  If you have 10 or maybe even 100 servers, it might be useful to see them all on a graph for comparison. But if you have 1000, the resulting graph would likely be difficult if not impossible to read. Best practice is to keep it to fewer to 100 valid values. Up to 300 is a grey area.  If you need to go over this amount, use Azure Monitor custom logs instead.   

If you have a variable in the name or a high cardinality dimension, the following can occur:
- Metrics become unreliable due to throttling
- Metrics Explorer doesn’t work
- Alerting and notifications become unpredictable
- Costs can increase unexpectedably -  Microsoft is not charging while the custom metrics with dimensions are in public preview. However, once charges start in the future, you will incur unexpected charges. The plan is to charge for metrics consumption based on the number of time-series monitored and number of API calls made.  

## Next steps
Use custom metrics from different services: 
 - [Virtual Machines](../essentials/collect-custom-metrics-guestos-resource-manager-vm.md)
 - [Virtual machine scale set](../essentials/collect-custom-metrics-guestos-resource-manager-vmss.md)
 - [Azure Virtual Machines (classic)](../essentials/collect-custom-metrics-guestos-vm-classic.md)
 - [Linux Virtual Machine using the Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md)
 - [REST API](./metrics-store-custom-rest-api.md)
 - [Classic Cloud Services](../essentials/collect-custom-metrics-guestos-vm-cloud-service-classic.md)

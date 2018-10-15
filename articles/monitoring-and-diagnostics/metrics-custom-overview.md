---
title: Custom Metrics in Azure Monitor
description: Learn about custom metrics in Azure Monitor and how they are modeled.
author: ancav
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ancav
ms.component: metrics
---
# Custom Metrics in Azure Monitor

As you deploy resources and applications in Azure, you'll want to start collecting telemetry to gain insights into their performance and health. Azure makes some metric available to you out-of-the-box as you deploy resources. These are called standard or platform metrics. However, these metrics are limited in nature. You may wish to collect some custom performance indicators or business-specific metrics to provide deeper insights.
These "custom" metrics can be collected via your application telemetry, an agent running on your Azure resources, or even outside-in monitoring system and submitted directly to Azure Monitor. Once published to Azure Monitor, you can browse, query, and alert on custom metrics for your Azure resources and applications side by side the standard metrics emitted by Azure.

## Send custom metrics
Custom Metrics can be sent to Azure Monitor via a variety of methods.
- Instrument your application using the Application Insights SDK and send custom telemetry to Azure Monitor 
- Install the Windows Diagnostics Extension on your [Azure VM](metrics-store-custom-guestos-resource-manager-vm.md), [Virtual Machine Scale set](metrics-store-custom-guestos-resource-manager-vmss.md), [classic VM](metrics-store-custom-guestos-classic-vm.md), or [Classic Cloud Service](metrics-store-custom-guestos-classic-cloud-service.md) and send performance counters to Azure Monitor 
- Install the [InfluxDB Telegraf agent](metrics-store-custom-linux-telegraf.md) on your Azure Linux VM and send metrics using the Azure Monitor Output Plugin
- Send custom metrics [directly to Azure Monitor REST API](metrics-store-custom-rest-api.md) https://<azureregion>.monitoring.azure.com/<AzureResourceID>/metrics

When you send custom metrics to Azure Monitor, each data point (or value) reported must include the following information:

### Authentication
To submit custom metrics to Azure Monitor the entity submitting the metric needs to have a valid Azure Active Directory token in the "Bearer" header of the request. There are a few supported ways to acquire a valid bearer token:
1. [Managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) - Gives an identity to an Azure Resource itself (such as a VM). MSI was designed to give resources permissions to carry out certain operations – for example,  allowing a resource to emit metrics about itself. A resource (or its MSI) can be granted "Monitoring Metrics Publisher" permissions on another resource, thereby enabling the MSI to emit metrics for other resources as well.
2. [AAD Service Principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals) - The scenario here is an AAD application (service) can be assigned permissions to emit metrics about an Azure resource.
To authenticate the request, Azure Monitor validates the Application token using AAD public keys. The existing "Monitoring Metrics Publisher" role already has this permission, which is available in the Azure portal. The service principal, depending on what resources it will be emitting custom metrics for, can be given "Monitoring Metrics Publisher" role at the scope required (subscription, resource group, or specific resource).

> [!NOTE]
> When requesting an AAD token to emit custom metrics ensure the audience/resource the token is being requested for is https://monitoring.azure.com/ (be sure to include the trailing '/')

### Subject
This property captures which Azure resource ID the custom metric is reported for. This information will be encoded in the URL of the API call being made. Each API can only submit metric values for a single Azure resource.

> [!NOTE]
> You cannot emit custom metrics against the resource ID of a resource group or subscription.
>
>

### Region
This property captures what Azure region the resource you are emitting metrics for is deployed in. Metrics must be emitted to the same Azure Monitor regional endpoint as the region the resource is deployed in. For example, custom metrics for a VM are deployed in West US must be sent to the WestUS regional Azure Monitor endpoint. The region information is also encoded in the URL of the API call.

> [!NOTE]
> During the public preview Custom Metrics is only available in a subset of Azure Regions. A list of supported regions is documented in a later section of this article.
>
>

### Timestamp
Each data point sent to Azure Monitor must be marked with a timestamp. This timestamp captures the datetime at which the metric value was measured/collected. Azure Monitor will accept metric data with timestamps as far as 20 minutes in the past, and as far as 5 minutes in the future.

### Namespace
Namespaces are a way to categorize or group similar metrics together. Namespaces allow you to achieve isolation between groups of metrics that may be collecting different insights or performance indicators. For example, you could have a namespace called *ContosoMemoryMetrics* that is used track memory use metrics that profile your app and another namespace called *ContosoAppTransaction* that tracks all metrics about user transactions in your application.

### Name
The name of the metric that is being reported. Usually the name is descriptive enough to help identify what is being measured. For example, a metric that is measuring the number of bytes of memory being utilized on a given VM could have a metric name like "Memory Bytes In Use".

### Dimension Keys
A dimension is a key/value pair that helps describe additional characteristics about the metric being collected. The additional characteristics enable collecting more information about the metric that allows for deeper insights. For example, the "Memory Bytes In Use" metric could have a dimension key called "Process", that captures how many bytes of memory each process on a VM is consuming. This enables you to filter the metric to see how much memory-specific processes are using, or to identify the Top 5 processes by memory usage.
Each custom metric can have up to 10 dimensions.

### Dimension Values
When reporting a metric datapoint, for each dimension key on the metric being reported, there is a corresponding dimension value. For example,  if you wanted to report the memory used by the ContosoApp on your VM:

* The metric name would be *Memory Bytes in Use*
* The dimension key would be *Process*
* The dimension value would be *ContosoApp.exe*

When publishing a metric value, you can only specify a single dimension value per dimension key. If you collect the same Memory utilization for multiple processes on the VM, you could report multiple metric values for that timestamp. Each metric value would specify a different dimension value for the Process dimension key.

### Metric Values
Azure Monitor stores all metrics at one-minute granularity intervals. We understand that a metric may need to be sampled multiple times (ex. CPU Utilization) or measured for many discrete events (ex. sign in Transaction Latencies) during a given minute. To limit the number of raw values you have to emit and pay for in Azure Monitor, you can locally pre-aggregate and emit the values:

* Min: The minimum observed value from all the samples/measurements during the minute
* Max: The maximum observed value from all the samples/measurements during the minute
* Sum: The summation of all the observed values from all the sample/measurements during the minute
* Count: The number of samples/measurements taken during the minute

For example, if there were 4 sign-in transactions to your app during a given a minute and the resulting measured latencies for each were:

|Transaction 1|Transaction 2|Transaction 3|Transaction 4|
|---|---|---|---|
|7 ms|4 ms|13 ms|16 ms|
|

The resulting metric publication to Azure Monitor would be:
* Min: 4
* Max: 16
* Sum: 40
* Count: 4

If your application is unable to pre-aggregate locally and needs to emit each discrete sample or event immediately upon collection, you can emit the raw measure values.
For example, each time a sign-in transaction occurred on your app you would publish a metric to Azure Monitor with only a single measurement. So, for a sign-in transaction that took 12 ms then metric publication would be:
* Min: 12
* Max: 12
* Sum: 12
* Count: 1

This process allows you to emit multiple values for the same metric + dimension combination during a given minute. Azure Monitor will then take all the raw values emitted for a given minute and aggregate them together.

### Sample custom metric publication
In the following example, you create a custom metric called "Memory Bytes in Use", under the metric namespace "Memory Profile" for a Virtual Machine. The metric has a single dimension called "Process". For the given timestamp, we are emitting metric values for two different processes:

```json
{
    "time": "2018-08-20T11:25:20-7:00",
    "data": {

      "baseData": {

        "metric": "Memory Bytes in Use",
        "namespace": "Memory Profile",
        "dimNames": [
          "Process"        ],
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
> Application Insights, the Windows Azure Diagnostics extension, and the InfluxData Telegraf agent are already configured to emit metric values against the correct regional endpoint and carry all of the above properties in each emission.
>
>

## Custom Metric Definitions
There is no need to pre-define a custom metric in Azure Monitor before it is emitted. Since each metric data point published contains namespace, name, and dimension information, the first time a custom metric is emitted to Azure Monitor a metric definition is automatically created. This metric definition is then discoverable on any resource the metric was emitted against via the metric definitions.

> [!NOTE]
> Azure Monitor doesn’t yet support defining "Units" for a custom metric.

## Using Custom Metrics
Once custom metrics are submitted to Azure Monitor you can browse them via the Azure portal, query them via the Azure Monitor REST APIs, or create alerts on them so you can be notified when certain conditions are met.
### Browse your custom metrics via the Azure portal
1.	Go to the [Azure portal](https://portal.azure.com)
2.	Select the Monitor blade
3.	Click Metrics
4.	Select a resource you have emitted custom metrics against
5.	Select the metrics namespace for your custom metric
6.	Select the custom metric

## Supported Regions
During the public preview, the ability to publish custom metrics is only available in a subset of Azure regions. This means metrics can only be published for resources in one of the supported regions. The table below lists out the set of supported Azure regions for custom metrics and the corresponding endpoint metrics for resources in those regions should be published to.

|Azure Region|Regional endpoint prefix|
|---|---|
|East US|https://eastus.monitoring.azure.com/|
|South Central US|https://southcentralus.monitoring.azure.com/|
|West Central US|https://westcentralus.monitoring.azure.com/|
|West US 2|https://westus2.monitoring.azure.com/|
|Southeast Asia|https://southeastasia.monitoring.azure.com/|
|North Europe|https://northeurope.monitoring.azure.com/|
|West Europe|https://westeurope.monitoring.azure.com/|

## Quotas and Limits
Azure Monitor imposes the following usage limits on custom metrics.

|Category|Limit|
|---|---|
|Active Time Series/subscriptions/region|50,000|
|Dimension Keys per metric|10|
|String length for metric namespaces, metric names, dimension keys, and dimension values|256 characters|
An active time series is defined as any unique combination of metric, dimension key, dimension value that has had metric values published in the past 12 hours.

## Next steps
Use custom metrics from different services 
 - [Virtual Machine](metrics-store-custom-guestos-resource-manager-vm.md)
 - [Virtual Machine Scale set](metrics-store-custom-guestos-resource-manager-vmss.md)
 - [Virtual Machine (classic)](metrics-store-custom-guestos-classic-vm.md)
 - [Linux Virtual Machine using Telegraf agent](metrics-store-custom-linux-telegraf.md)
 - [REST API](metrics-store-custom-rest-api.md)
 - [Cloud Service (classic)](metrics-store-custom-guestos-classic-cloud-service.md)
 
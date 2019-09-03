---
title: Understanding Consumption plan costs in Azure Functions
description: Learn how to better estimate the costs that you may incur when running your function app in a Consumption plan in Azure.
author: ggailey777
ms.author: glenga
ms.date: 8/31/2019
ms.topic: conceptual
ms.service: azure-functions
manager: gwallace
# Customer intent: As a cloud developer, I want to understand the overall costs of running my code in Azure Functions so that I can make better architectural and business decisions.
---

# Understanding Consumption plan costs

There are currently three types of hosting plans for app that run in Azure Functions, with each plan having its own pricing model: 

* [**Consumption plan**](functions-scale.md#consumption-plan): you are only charged for the time that your function app runs. This plan includes a [free grant][pricing page] on a per subscription basis.
* [**Premium plan**](functions-scale.md#premium-plan): provides you with the same features and scaling mechanism as the Consumption plan, but with enhanced performance and VNET access. To learn more, see [Azure Functions Premium plan](functions-premium-plan.md).
* [**Dedicated (App Service) plan**](functions-scale.md#app-service-plan) (basic tier or higher): when you need to run in dedicated VMs or in isolation, use custom images, or want to use your excess App Service plan capacity. Uses [regular App Service plan billing](https://azure.microsoft.com/en-us/pricing/details/app-service/). 

You chose the plan that best supports your function performance and cost requirements. To learn more, see [Azure Functions scale and hosting](functions-scale.md).

This article deals only with the the Consumption plan, since this plan results in variable costs. 

## Overall costs of using Functions

When estimating the overall cost of running your functions in any plan, remember that the Functions runtime uses several other Azure services, which are each billed separately. Of course when pricing a Functions-base topology, any triggers and bindings you have that integrate with other Azure services require you to create and pay for those additional services. 

For functions running in a Consumption plan, the total cost is the execution cost of your functions, plus the cost of bandwidth and additional services. 

When estimating the overall costs of your function app topology using current service prices, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=functions). 

### Storage account

Each function app requires that you have an associated General Purpose [Azure Storage account](../storage/common/storage-introduction.md#types-of-storage-accounts), which is [billed separately](https://azure.microsoft.com/pricing/details/storage/). This account is used internally by the Functions runtime, but you can also use it for Storage triggers and bindings. If you don't have a storage account, one is created for you when the function app is created. 

### Application Insights

Functions relies on [Application Insights](../azure-monitor/app/app-insights-overview.md) to provide a high-performance monitoring experience for your function apps. While not required, we recommend that you [enable Application Insights integration](functions-monitoring.md#enable-application-insights-integration). A free grant of telemetry data is included every month. To learn more, see [the Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/).

### Network bandwidth

You don't pay for data transfer between Azure services in the same region. However, you can incur costs for outbound data transfers to another region or outside of Azure. To learn more, see [Bandwidth pricing details](https://azure.microsoft.com/en-us/pricing/details/bandwidth/).

## Consumption plan costs

The execution *cost* of a single function execution is measured in *GB-seconds*, which is calculated by combining its memory usage with its execution time. A function that runs for longer costs more, as does a function that consumes more memory. 

Consider a simple case where the amount of memory used by the function stays constant. In this case, calculating the cost is simple multiplication. For example, say that your function consumed 0.5 GB for 3 seconds. Then the execution cost is just  `0.5GB * 3s = 1.5 GB-seconds`. 

Once you take into account that memory usage can change over time, the calculation is best described as the integral of memory usage over time.  The system does this calculation by sampling the memory usage of the process (along with child processes) at regular intervals. As mentioned on the [pricing page], memory usage is rounded up to the nearest 128 MB bucket. This means that when your process is using 160 MB, you are charged for 256 MB. The process of calculating memory usage and rounding up takes into account concurrency, which is multiple concurrent function executions in the same process.

> [!NOTE]
> While CPU usage isn't directly considered in execution cost, it can have an impact on the cost when it affects the execution time of the function.

To fix a lower bound on your estimates, it's useful to know the minimum costs of an execution. As detailed on the [pricing page], when a function runs for less than 100ms, an execution time of 100ms is used as the basis of the calculation. This means that the minimum cost of an execution is determined by multiplying the minimum amount of memory (128 MB) and the minimum execution time (100ms): `0.125 GB * 0.1s = 0.0125 GB-sec`. 

## Behaviors affecting execution time

The following behaviors of your functions can impact the execution time:

+ **Triggers and bindings**: The time taken to read input from and write output to your [function bindings](functions-triggers-bindings.md) is counted as execution time. For example, when your function uses an output binding to write a message to an Azure storage queue, your execution time includes the time taken to write the message to the queue, which is included in the calculation of the function cost. 

+ **Asynchronous execution**: The time that your function waits for the results of an async request (`await` in C#) is counted as execution time. The GB-second calculation is based on the start and end time of the function and the memory usage over that period. What is happening over that time in terms of CPU activity is not factored into the calculation. You may be able to reduce costs during asynchronous operations by using [Durable Functions](durable/durable-functions-overview.md). You are not billed for time spent at awaits in orchestrator functions.

## Viewing cost-related data

The [cost analysis functionality](../billing/billing-understand-your-bill.md#option-2-compare-the-usage-and-costs-in-the-azure-portal) in the Azure portal provides a quick overview of the cost of your functions in terms of real-world currency. 

[[/images/billing/costmanagement.PNG]]

The relevant entries are:
* Compute Requests (in 10s) - this is the `Total Executions` meter listed on the pricing page. In Azure Monitor this metric is called `Execution Count`.
* Compute Duration (in GB-seconds) - this is the `Execution Time` meter listed on the pricing page. In Azure Monitor, this metric is called `Function Execution Units` and is measured in MB milliseconds (discussed further below).

### How granular is this cost information? Can I get a per execution cost?

In terms of real world currency, the cost information is available per day, per resource (i.e. per Function App, **not** per function). You can retrieve per minute, per resource data in terms of `Execution Count` and `Function Execution Units` from Azure Metrics.

Per execution cost information is [not currently available](https://github.com/Azure/azure-functions-host/issues/1451). 

### How can I view graphs of execution count and GB-seconds?

You can do this with the [metrics explorer](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-metrics#to-access-all-metrics-in-a-single-place). Here is an example of viewing `Function Execution Units`:

[[/images/billing/azuremetrics-executionunits.PNG]]

This screen shows a total of 9.2 million `Function Execution Units` consumed in the last hour. As mentioned above, this metric is measured in MB milliseconds. To convert this to GB-seconds, divide by 1,024,000. So in this case, my Function App consumed `9,200,000 / 1,024,000 = 8.98` GB-seconds in the last hour.

### How can I access execution count and GB-seconds programmatically?

The same metrics shown above are available through the [Azure Monitor REST API](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-metrics#access-metrics-via-the-rest-api). 

The [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/) also has commands for retrieving metrics. You can use the CLI directly from the portal using the [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview). Here's an example of retrieving per-minute data:

`az monitor metrics list --resource /subscriptions/<subid>/resourceGroups/pbconsumptionexample/providers/Microsoft.Web/sites/pbconsumptionexample --metric FunctionExecutionUnits,FunctionExecutionCount --aggregation Total --interval PT1M`

This command returns a payload with fragments that look like this:
```
      "name": {
        "additionalProperties": {},
        "localizedValue": "Function Execution Units",
        "value": "FunctionExecutionUnits"
      },
      "resourceGroup": "pbconsumptionexample",
      "timeseries": [
        {
          "additionalProperties": {},
          "data": [
            {
              "additionalProperties": {},
              "average": null,
              "count": null,
              "maximum": null,
              "minimum": null,
              "timeStamp": "2018-04-13T23:40:00+00:00",
              "total": 153600.0
            }
          ],
          "metadatavalues": []
        }
      ],
```
This particular response shows that from `2018-04-13T23:40` to `2018-04-13T23:41`, my app consumed 153,600 MB milliseconds (0.15 GB-seconds).

### How can I get more information about the memory usage of my app?

Because Function Execution Units are a combination of execution time and your memory usage, they are not a great metric to use when you're only trying to understand just your memory usage (and potentially optimize your app to use less memory). For this we recommend using the performance counter data collected by App Insights when you [enable it](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring#enable-application-insights-integration) for Azure Functions. You can then access this data using the [App Insights Analytics](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring#query-telemetry-data) portal by running the following query:

```
performanceCounters
| where name == "Private Bytes"
| project timestamp, name, value, cloud_RoleInstance
```
|timestamp|name|value|
|----|---|---|
|2018-04-13T23:30:03.633	|Private Bytes	|44,662,784	|
|2018-04-13T23:30:40.613	|Private Bytes	|44,699,648	|

Please note that there have been some reports of this performance counter being incorrect in some cases. Further investigation is required and the issue is tracked [here](https://github.com/Azure/Azure-Functions/issues/762).

Ideally, this information would also be available as a metric through Azure Monitor. This feature request is tracked [here](https://github.com/Azure/Azure-Functions/issues/726).

### Does App Insights expose more fine-grained information than Azure Monitor?

In some cases, yes. Azure Monitor tracks metrics at the resource level (i.e. the Function App), while our App Insights integration can emit per-function metrics. Here is an example analytics query to get the average duration per function:

```
customMetrics
| where name contains "Duration"
| extend averageDuration = valueSum / valueCount
| summarize averageDurationMilliseconds=avg(averageDuration) by name
```

|name|averageDurationMilliseconds|
|----|---|
|TimerTriggerCSharp1 Duration|	0.9007444311 |
|TimerTriggerCSharp2 Duration|	808.5745516667|

### Why is my execution count showing as zero for apps in an app service plan?

Its a known issue, see [here](https://github.com/Azure/Azure-Functions/issues/750).

[pricing page]:https://azure.microsoft.com/pricing/details/functions/
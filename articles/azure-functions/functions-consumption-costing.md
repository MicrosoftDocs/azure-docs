---
title: Understanding Consumption plan costs in Azure Functions
description: Learn how to better estimate the costs that you may incur when running your function app in a Consumption plan in Azure.
author: ggailey777
ms.author: glenga
ms.date: 7/23/2019
ms.topic: conceptual
ms.service: azure-functions
manager: gwallace
---

# Understanding Consumption plan costs

There are currently three types of hosting plans for app that run in Azure Functions, with each plan having its own pricing model: 

* [**Consumption plan**](functions-scale.md#consumption-plan): you are only charged for the time that your function app runs. This plan includes a [free grant](https://azure.microsoft.com/pricing/details/functions/) on a per subscription basis.
* [**Premium plan**](functions-scale.md#premium-plan): provides you with the same features and scaling mechanism as the Consumption plan, but with enhanced performance and VNET access. To learn more, see [Azure Functions Premium plan](functions-premium-plan.md).
* [**Dedicated (App Service) plan**](functions-scale.md#app-service-plan) (basic tier or higher): when you need to run in dedicated VMs or in isolation, use custom images, or want to use your excess App Service plan capacity. Uses [regular App Service plan billing](https://azure.microsoft.com/en-us/pricing/details/app-service/). 

You chose the plan that best supports your function performance and cost requirements. To learn more, see [Azure Functions scale and hosting](functions-scale.md).

This article deals only with the the Consumption plan, since this plan results in variable costs. To learn more about how to estimate costs when running in a Con

## Overall costs of using Functions

When estimating the overall cost of running your functions in the Consumption plan, remember that the Functions runtime uses several other Azure services, which are each billed separately. Of course when pricing a Functions-base topology, any triggers and bindings you have that integrate with other Azure services require you to create and pay for those additional services. The total cost is the execution cost of your functions, plus the cost of bandwidth and additional services.

### Storage account

Each function app requires that you have an associated General Purpose [Azure Storage account](../storage/common/storage-introduction.md#types-of-storage-accounts), which is [billed separately](https://azure.microsoft.com/pricing/details/storage/). This account is used internally by the Functions runtime, but you can also use it for Storage triggers and bindings. If you don't have a storage account, one is created for you when the function app is created. 

### Application Insights

Functions relies on [Application Insights](../azure-monitor/app/app-insights-overview.md) to provide a high-performance monitoring experience for your function apps. While not required, we recommend that you [enable Application Insights integration](functions-monitoring.md#enable-application-insights-integration). A free grant of telemetry data is included every month. To learn more, see [the Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/).

### Network bandwidth

You don't pay for data transfer between Azure services in the same region. However, you can incur costs for outbound data transfers to another region or outside of Azure. To learn more, see [Bandwidth pricing details](https://azure.microsoft.com/en-us/pricing/details/bandwidth/).

### What is a GB second and how is it calculated?

The execution "cost" of a single function execution is calculated by combining its memory usage with its execution time. A function that runs for longer costs more, as does a function that consumes more memory. If the amount of memory used by the function stays constant, then it's a simple multiplication - e.g if your function consumed 0.5 GB for 3 seconds, then the cost is `0.5GB * 3s = 1.5 GB-seconds`. 

Once you take into account that memory usage can change over time, the calculation is best described as the integral of memory usage over time.  The system does this calculation by sampling the memory usage of the process (and child processes) at regular intervals. As mentioned on the [pricing page][consumptionpricing], memory usage is rounded up to the nearest 128 MB bucket (so if your process is using 160 MB you are charged for 256 MB). This process of calculating memory usage and rounding up takes concurrency (multiple concurrent function executions in the same process) into account.

### Is CPU usage factored into the GB second calculation?

Not directly. Indirectly, CPU usage can have an impact on the cost because it might impact the execution time of the function.

### What is the minimum GB second cost of a function execution?

To determine this we can take the minimum amount of memory (128 MB) and the minimum execution time (100ms - if a function runs for less than 100ms then the system uses an execution time of 100ms in the calculation, as mentioned on the [pricing page]) and multiply them together i.e. `0.125 GB * 0.1s = 0.0125 GB-sec`.

### How can I get a quick summary of my functions related costs?

The [cost analysis functionality](https://docs.microsoft.com/en-us/azure/billing/billing-understand-your-bill#option-2-review-your-invoice-and-compare-with-the-usage-and-costs-in-the-azure-portal) in the Azure Portal can give you a quick overview of the cost of your functions in terms of real-world currency. 

[[/images/billing/costmanagement.PNG]]

The relevant entries are:
* Compute Requests (in 10s) - this is the `Total Executions` meter listed on the pricing page. In Azure Monitor this metric is called `Execution Count`.
* Compute Duration (in GB Seconds) - this is the `Execution Time` meter listed on the pricing page. In Azure Monitor, this metric is called `Function Execution Units` and is measured in MB milliseconds (discussed further below).

### How granular is this cost information? Can I get a per execution cost?

In terms of real world currency, the cost information is available per day, per resource (i.e. per Function App, **not** per function). You can retrieve per minute, per resource data in terms of `Execution Count` and `Function Execution Units` from Azure Metrics.

Per execution cost information is not currently available. There is an open feature request tracking that [here](https://github.com/Azure/azure-functions-host/issues/1451).

### How can I view graphs of execution count and GB seconds?

You can do this with the [metrics explorer](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-metrics#to-access-all-metrics-in-a-single-place). Here is an example of viewing `Function Execution Units`:

[[/images/billing/azuremetrics-executionunits.PNG]]

This screen shows a total of 9.2 million `Function Execution Units` consumed in the last hour. As mentioned above, this metric is measured in MB milliseconds. To convert this to GB seconds, divide by 1,024,000. So in this case, my Function App consumed `9,200,000 / 1,024,000 = 8.98` GB seconds in the last hour.

### How can I access execution count and GB seconds programmatically?

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
This particular response shows that from `2018-04-13T23:40` to `2018-04-13T23:41`, my app consumed 153,600 MB milliseconds (0.15 GB seconds).

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

### Am I billed for "await time" ?

This question is typically asked in the context of a C# function that does an async operation and waits for the result, e.g. `await Task.Delay(1000)` or `await client.GetAsync("http://google.com")`. The answer is yes - the GB second calculation is based on the start and end time of the function and the memory usage over that period. What actually happens over that time in terms of CPU activity is not factored into the calculation.

One exception to this rule is if you are using durable functions. You are not billed for time spent at awaits in orchestrator functions.

### Am I billed for input/output bindings?

Yes. For example, if your function uses an output binding to write a message to an Azure storage queue, your execution time includes the time taken to write the message to the queue and is included in the calculation of the function cost.

### Why is my execution count showing as zero for apps in an app service plan?

Its a known issue, see [here](https://github.com/Azure/Azure-Functions/issues/750).

[consumptionpricing]:https://azure.microsoft.com/en-us/pricing/details/functions/
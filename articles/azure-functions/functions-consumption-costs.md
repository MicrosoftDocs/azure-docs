---
title: Estimating consumption-based costs in Azure Functions
description: Learn how to better estimate the costs that you might incur when running your function app in either the Consumption plan or the Flex Consumption plan in Azure Functions.
ms.date: 02/10/2025
ms.topic: conceptual
ms.custom:
  - build-2024
  - ignite-2024
  - build-2025
# Customer intent: As a cloud developer, I want to understand the overall costs of running my code in a dynamic plan in Azure Functions so that I can make better architectural and business decisions.
---

# Estimating consumption-based costs

This article shows you how to estimate plan costs for both the [Flex Consumption plan](flex-consumption-plan.md) and the legacy [Consumption plan](consumption-plan.md). 

Choose the hosting option that best supports the feature, performance, and cost requirements for your function executions. For more information, see [Azure Functions scale and hosting](functions-scale.md).

This article focuses on the two consumption plans because billing in these plans depends on active periods of executions inside each instance. 

[!INCLUDE [functions-consumption-plans-compare-tabs](../../includes/functions-consumption-plans-compare-tabs.md)]

Durable Functions can also run in both of these plans. For more information about the cost considerations when using Durable Functions, see [Durable Functions billing](./durable/durable-functions-billing.md).

## Consumption-based costs

The way that consumption-based costs are calculated, including free grants, depends on the specific plan. For the most current cost and grant information, see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

### [Flex Consumption plan](#tab/flex-consumption-plan)

[!INCLUDE [functions-flex-consumption-billing-table](../../includes/functions-flex-consumption-billing-table.md)]

This diagram shows how on-demand costs are determined in this plan: 

:::image type="content" source="media/flex-consumption-plan/billing-graph.png" alt-text="Graph of Flex Consumption plan on-demand costs based on both load (instance count) and time.":::

In addition to execution time, when you use one or more always ready instances, you pay a lower, baseline rate for the number of always ready instances you maintain. Execution time for always ready instances might be cheaper than execution time on instances with on demand execution.   

> [!IMPORTANT]
> This article uses on-demand pricing to help you understand example calculations. Always check the current costs on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) when estimating costs you might incur while running your functions in the Flex Consumption plan. 

Consider a function app that has only HTTP triggers with these basic facts:

+ HTTP triggers handle 40 constant requests per second.
+ HTTP triggers handle 10 concurrent requests.
+ The instance memory size is 2,048 MB. 
+ You configure _no always ready instances_, which means the app can scale to zero.

In a situation like this, pricing depends more on the kind of work done during code execution. Let's look at two workload scenarios:

+ **CPU-bound workload:** In a CPU-bound workload, there's no advantage to processing multiple requests in parallel in the same instance. This limitation means that you're better off distributing each request to its own instance so requests complete as quickly as possible without contention. In this scenario, set a low [HTTP trigger concurrency](./functions-concurrency.md#http-trigger-concurrency) of `1`. With 10 concurrent requests, the app scales to a steady state of roughly 10 instances, and each instance is continuously active processing one request at a time. 

    Because the size of each instance is ~2 GB, the consumption for a single continuously active instance is `2 GB * 3600 s = 7200 GB-s`. Assuming an on-demand execution rate of $0.000026 GB-s (without any free grants applied), the cost becomes `$0.1872 USD` per hour per instance. Because the CPU-bound app scales to 10 instances, the total hourly rate for execution time is `$1.872 USD`.

    Similarly, the on-demand per-execution charge (without any free grants) of 40 requests per second is equal to `40 * 3600 = 144,000` or `0.144 million` executions per hour. Assuming an on-demand rate of `$0.40` per million executions, the total (grant-free) hourly cost of executions is `0.144 * $0.40`, which is `$0.0576` per hour.
    
    In this scenario, the total hourly cost of running on-demand on 10 instances is `$1.872 + $0.0576s = $1.9296 USD`.

+ **IO bound workload:** In an IO-bound workload, most of the application time is spent waiting on incoming request, which might be limited by network throughput or other upstream factors. Because of the limited inputs, the code can process multiple operations concurrently without negative impacts. In this scenario, assume you can process all 10 concurrent requests on the same instance. 

    Because consumption charges are based only on the memory of each active instance, the consumption charge calculation is simply `2 GB * 3600 s = 7200 GB-s`, which at the assumed on-demand execution rate (without any free grants applied) is `$0.1872 USD` per hour for the single instance.

    As in the CPU-bound scenario, the on-demand per-execution charge (without any free grants) of 40 requests per second is equal to `40 * 3600 = 144,000` or 0.144 million executions per hour. In this case, the total (grant-free) hourly cost of executions `0.144 * $0.40`, which is `$0.0576` per hour.

    In this scenario, the total hourly cost of running on-demand a single instance is `$0.1872 + $0.0576 = $0.245 USD`. 

### [Consumption plan](#tab/consumption-plan)

The execution _cost_ of a single function execution is measured in _GB-seconds_. Execution cost is calculated by combining memory usage with execution time. A function that runs longer costs more, as does a function that consumes more memory. 

Consider a case where the amount of memory used by the function stays constant. In this case, calculating the cost is simple multiplication. For example, if your function consumes 0.5 GB for 3 seconds, the execution cost is `0.5GB * 3s = 1.5 GB-seconds`. 

Because memory usage changes over time, the calculation is essentially the integral of memory usage over time. The system performs this calculation by sampling the memory usage of the process (along with child processes) at regular intervals. As mentioned on the [pricing page], memory usage is rounded up to the nearest 128-MB bucket. When your process uses 160 MB, you pay for 256 MB. The calculation takes into account concurrency, which is multiple concurrent function executions in the same process.

> [!NOTE]
> While CPU usage isn't directly considered in execution cost, it can affect the cost when it influences the execution time of the function.

For an HTTP-triggered function, when an error occurs before your function code begins to execute, you aren't charged for an execution. This means that 401 responses from the platform due to API key validation or the App Service Authentication / Authorization feature don't count against your execution cost. Similarly, 5xx status code responses aren't counted when they occur in the platform before your function processes the request. A 5xx response generated by the platform after your function code starts to execute is still counted as an execution, even when the error isn't raised from your function code.

---

## Behaviors affecting execution time

The following behaviors of your functions can affect the execution time:

+ **Triggers and bindings**: The time taken to read input from and write output to your [function bindings](functions-triggers-bindings.md) counts as execution time. For example, when your function uses an output binding to write a message to an Azure storage queue, your execution time includes the time taken to write the message to the queue, which is included in the calculation of the function cost. 

+ **Asynchronous execution**: The time that your function waits for the results of an async request (`await` in C#) counts as execution time. The GB-second calculation is based on the start and end time of the function and the memory usage over that period. What happens over that time in terms of CPU activity isn't factored into the calculation. You might be able to reduce costs during asynchronous operations by using [Durable Functions](durable/durable-functions-overview.md). You're not billed for time spent at awaits in orchestrator functions.

## Viewing and estimating costs from metrics

In [your invoice](../cost-management-billing/understand/download-azure-invoice.md), you can view the cost-related data along with the actual billed costs. However, this invoice data is a monthly aggregate for a past invoice period.  

This section shows you how to use metrics, both app-level and function executions, to estimate costs for running your function apps. 

### Function app-level metrics

[!INCLUDE [functions-monitor-metrics-consumption](../../includes/functions-monitor-metrics-consumption.md)]


### Function-level metrics

Memory usage is important when estimating costs of your function executions. However, the way memory usage impacts your costs depends on the specific plan type:

### [Flex Consumption plan](#tab/flex-consumption-plan)

In the Flex Consumption plan, you pay for the time the instance runs based on your chosen [instance size](./flex-consumption-plan.md#instance-sizes), which has a set memory limit. For more information, see [Billing](flex-consumption-plan.md#billing).

### [Consumption plan](#tab/consumption-plan)

In the Consumption plan, billing is based on function execution units that combine execution time and memory usage. For more information, see [Billing](consumption-plan.md#billing). 

Memory data isn't a metric currently available through Azure Monitor. However, if you want to model or optimize the memory usage of your app, you can use the performance counter data collected by Application Insights.  

---

If you haven't already done so, [enable Application Insights in your function app](configure-monitoring.md#enable-application-insights-integration). With this integration enabled, you can [query this telemetry data in the portal](analyze-telemetry-data.md#query-telemetry-data). 

You can use either [Azure Monitor metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started) in the [Azure portal] or REST APIs to get Monitor Metrics data.

[!INCLUDE [functions-consumption-metrics-queries](../../includes/functions-consumption-metrics-queries.md)]

## Other related costs

When estimating the overall cost of running your functions in any plan, remember that the Functions runtime uses several other Azure services, which are each billed separately. When you estimate pricing for function apps, any triggers and bindings you have that integrate with other Azure services require you to create and pay for those other services. 

For functions running in a Consumption plan, the total cost is the execution cost of your functions, plus the cost of bandwidth and other services. 

When estimating the overall costs of your function app and related services, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=functions). 

| Related cost | Description |
| ------------ | ----------- |
| **Storage account** | Each function app requires that you have an associated General Purpose [Azure Storage account](../storage/common/storage-introduction.md#types-of-storage-accounts), which is [billed separately](https://azure.microsoft.com/pricing/details/storage/). This account is used internally by the Functions runtime, but you can also use it for Storage triggers and bindings. If you don't have a storage account, one is created for you when the function app is created. To learn more, see [Storage account requirements](storage-considerations.md#storage-account-requirements).|
| **Application Insights** | Functions relies on [Application Insights](/azure/azure-monitor/app/app-insights-overview) to provide a high-performance monitoring experience for your function apps. While not required, you should [enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration). A free grant of telemetry data is included every month. To learn more, see [the Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). |
| **Network bandwidth** | You can incur costs for data transfer depending on the direction and scenario of the data movement. To learn more, see [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/). |

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Monitoring function apps](functions-monitoring.md)

[pricing page]:https://azure.microsoft.com/pricing/details/functions/
[Azure portal]: https://portal.azure.com

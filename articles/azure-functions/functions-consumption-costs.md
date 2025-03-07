---
title: Estimating consumption-based costs in Azure Functions
description: Learn how to better estimate the costs that you might incur when running your function app in either the Consumption plan or the Flex Consumption plan in Azure Functions.
ms.date: 02/10/2025
ms.topic: conceptual
ms.custom:
  - build-2024
  - ignite-2024
# Customer intent: As a cloud developer, I want to understand the overall costs of running my code in a dynamic plan in Azure Functions so that I can make better architectural and business decisions.
---

# Estimating consumption-based costs

This article shows you how to estimate plan costs for the Flex Consumption and Consumption hosting plans. 

Azure Functions currently offers these different hosting options for your function apps, with each option having its own hosting plan pricing model: 

| Plan | Description |
| ---- | ----------- |
| [**Flex Consumption plan**](flex-consumption-plan.md)| You pay for execution time on the instances on which your functions are running, plus any _always ready_ instances. Instances are dynamically added and removed based on the number of incoming events. This is the recommended dynamic scale plan, which also supports virtual network integration. |
| [**Premium**](functions-premium-plan.md) | Provides you with the same features and scaling mechanism as the Consumption plan, but with enhanced performance and virtual network integration. Cost is based on your chosen pricing tier. To learn more, see [Azure Functions Premium plan](functions-premium-plan.md). |
| [**Dedicated (App Service)**](dedicated-plan.md) <br/>(basic tier or higher) | When you need to run in dedicated VMs or in isolation, use custom images, or want to use your excess App Service plan capacity. Uses [regular App Service plan billing](https://azure.microsoft.com/pricing/details/app-service/). Cost is based on your chosen pricing tier.|
| [**Container Apps**](functions-container-apps-hosting.md) | Create and deploy containerized function apps in a fully managed environment hosted by Azure Container Apps, which lets you run your functions alongside other microservices, APIs, websites, and workflows as container-hosted programs. |  
| [**Consumption**](consumption-plan.md) | You're only charged for the time that your function app runs. This plan includes a [free grant][pricing page] on a per subscription basis.|

You should always choose the option that best supports the feature, performance, and cost requirements for your function executions. To learn more, see [Azure Functions scale and hosting](functions-scale.md).

This article focuses on Flex Consumption and Consumption plans because in these plans billing depends on active periods of executions inside each instance. 

Durable Functions can also run in both of these plans. To learn more about the cost considerations when using Durable Functions, see [Durable Functions billing](./durable/durable-functions-billing.md).

## Consumption-based costs

The way that consumption-based costs are calculated, including free grants, depends on the specific plan. For the most current cost and grant information, see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

### [Flex Consumption plan](#tab/flex-consumtion-plan)

[!INCLUDE [functions-flex-consumption-billing-table](../../includes/functions-flex-consumption-billing-table.md)]

This diagram represents how on-demand costs are determined in this plan: 

:::image type="content" source="media/flex-consumption-plan/billing-graph.png" alt-text="Graph of Flex Consumption plan on-demand costs based on both load (instance count) and time.":::

In addition to execution time, when using one or more always ready instances, you're also billed at a lower, baseline rate for the number of always ready instances you maintain. Execution time for always ready instances might be cheaper than execution time on instances with on demand execution.   

> [!IMPORTANT]
> In this article, on-demand pricing is used to help understand example calculations. Always check the current costs in the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/) when estimating costs you might incur while running your functions in the Flex Consumption plan. 

Consider a function app that is comprised only of HTTP triggers with and these basic facts:

+ HTTP triggers handle 40 constant requests per second.
+ HTTP triggers handle 10 concurrent requests.
+ The instance memory size setting is `2048 MB`. 
+ There are _no always ready instances configured_, which means the app can scale to zero.

In a situation like this, the pricing depends more on the kind of work being done during code execution. Let's look at two workload scenarios:

+ **CPU-bound workload:** In a CPU-bound workload, there's no advantage to processing multiple requests in parallel in the same instance. This means that you're better off distributing each request to its own instance so requests complete as a quickly as possible without contention. In this scenario, you should set a low [HTTP trigger concurrency](./functions-concurrency.md#http-trigger-concurrency) of `1`. With 10 concurrent requests, the app scales to a steady state of roughly 10 instances, and each instance is continuously active processing one request at a time. 

    Because the size of each instance is ~2 GB, the consumption for a single continuously active instance is `2 GB * 3600 s = 7200 GB-s`. Assuming an on-demand execution rate of $0.000026 GB-s (without any free grants applied) becomes `$0.1872 USD` per hour per instance. Because the CPU-bound app is scaled to 10 instance, the total hourly rate for execution time is `$1.872 USD`.

    Similarly, the on-demand per-execution charge (without any free grants) of 40 requests per second is equal to `40 * 3600 = 144,000` or `0.144 million` executions per hour. Assuming an on-demand rate of `$0.40` per million executions, the total (grant-free) hourly cost of executions is `0.144 * $0.40`, which is `$0.0576` per hour.
    
    In this scenario, the total hourly cost of running on-demand on 10 instances is `$1.872 + $0.0576s = $1.9296 USD`.

+ **IO bound workload:** In an IO-bound workload, most of the application time is spent waiting on incoming request, which might be limited by network throughput or other upstream factors. Because of the limited inputs, the code can process multiple operations concurrently without negative impacts. In this scenario, assume you can process all 10 concurrent requests on the same instance. 

    Because consumption charges are based only on the memory of each active instance, the consumption charge calculation is simply `2 GB * 3600 s = 7200 GB-s`, which at the assumed on-demand execution rate (without any free grants applied) is `$0.1872 USD` per hour for the single instance.

    As in the CPU-bound scenario, the on-demand per-execution charge (without any free grants) of 40 requests per second is equal to `40 * 3600 = 144,000` or 0.144 million executions per hour. In this case, the total (grant-free) hourly cost of executions `0.144 * $0.40`, which is `$0.0576` per hour.

    In this scenario, the total hourly cost of running on-demand on a single instance is `$0.1872 + $0.0576 = $0.245 USD`. 

### [Consumption plan](#tab/consumption-plan)

The execution _cost_ of a single function execution is measured in _GB-seconds_. Execution cost is calculated by combining its memory usage with its execution time. A function that runs for longer costs more, as does a function that consumes more memory. 

Consider a case where the amount of memory used by the function stays constant. In this case, calculating the cost is simple multiplication. For example, say that your function consumed 0.5 GB for 3 seconds. Then the execution cost is `0.5GB * 3s = 1.5 GB-seconds`. 

Since memory usage changes over time, the calculation is essentially the integral of memory usage over time. The system does this calculation by sampling the memory usage of the process (along with child processes) at regular intervals. As mentioned on the [pricing page], memory usage is rounded up to the nearest 128-MB bucket. When your process is using 160 MB, you're charged for 256 MB. The calculation takes into account concurrency, which is multiple concurrent function executions in the same process.

> [!NOTE]
> While CPU usage isn't directly considered in execution cost, it can have an impact on the cost when it affects the execution time of the function.

For an HTTP-triggered function, when an error occurs before your function code begins to execute you aren't charged for an execution. This means that 401 responses from the platform due to API key validation or the App Service Authentication / Authorization feature don't count against your execution cost. Similarly, 5xx status code responses aren't counted when they occur in the platform before your function processes the request. A 5xx response generated by the platform after your function code has started to execute is still counted as an execution, even when the error isn't raised from your function code.

---

## Other related costs

When estimating the overall cost of running your functions in any plan, remember that the Functions runtime uses several other Azure services, which are each billed separately. When you estimate pricing for function apps, any triggers and bindings you have that integrate with other Azure services require you to create and pay for those other services. 

For functions running in a Consumption plan, the total cost is the execution cost of your functions, plus the cost of bandwidth and other services. 

When estimating the overall costs of your function app and related services, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=functions). 

| Related cost | Description |
| ------------ | ----------- |
| **Storage account** | Each function app requires that you have an associated General Purpose [Azure Storage account](../storage/common/storage-introduction.md#types-of-storage-accounts), which is [billed separately](https://azure.microsoft.com/pricing/details/storage/). This account is used internally by the Functions runtime, but you can also use it for Storage triggers and bindings. If you don't have a storage account, one is created for you when the function app is created. To learn more, see [Storage account requirements](storage-considerations.md#storage-account-requirements).|
| **Application Insights** | Functions relies on [Application Insights](/azure/azure-monitor/app/app-insights-overview) to provide a high-performance monitoring experience for your function apps. While not required, you should [enable Application Insights integration](configure-monitoring.md#enable-application-insights-integration). A free grant of telemetry data is included every month. To learn more, see [the Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/). |
| **Network bandwidth** | You can incur costs for data transfer depending on the direction and scenario of the data movement. To learn more, see [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/). |

## Behaviors affecting execution time

The following behaviors of your functions can affect the execution time:

+ **Triggers and bindings**: The time taken to read input from and write output to your [function bindings](functions-triggers-bindings.md) is counted as execution time. For example, when your function uses an output binding to write a message to an Azure storage queue, your execution time includes the time taken to write the message to the queue, which is included in the calculation of the function cost. 

+ **Asynchronous execution**: The time that your function waits for the results of an async request (`await` in C#) is counted as execution time. The GB-second calculation is based on the start and end time of the function and the memory usage over that period. What is happening over that time in terms of CPU activity isn't factored into the calculation. You might be able to reduce costs during asynchronous operations by using [Durable Functions](durable/durable-functions-overview.md). You're not billed for time spent at awaits in orchestrator functions.

## Viewing cost-related data

In [your invoice](../cost-management-billing/understand/download-azure-invoice.md), you can view the cost-related data of **Total Executions - Functions** and **Execution Time - Functions**, along with the actual billed costs. However, this invoice data is a monthly aggregate for a past invoice period. 

### Function app-level metrics

To better understand the costs of your functions, you can use Azure Monitor to view cost-related metrics currently being generated by your function apps. 

[!INCLUDE [functions-monitor-metrics-consumption](../../includes/functions-monitor-metrics-consumption.md)]

### Function-level metrics

Function execution units are a combination of execution time and your memory usage, which makes it a difficult metric for understanding memory usage. Memory data isn't a metric currently available through Azure Monitor. However, if you want to optimize the memory usage of your app, can use the performance counter data collected by Application Insights.  

If you haven't already done so, [enable Application Insights in your function app](configure-monitoring.md#enable-application-insights-integration). With this integration enabled, you can [query this telemetry data in the portal](analyze-telemetry-data.md#query-telemetry-data). 

You can use either [Azure Monitor metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started) in the [Azure portal] or REST APIs to get Monitor Metrics data.

[!INCLUDE [functions-consumption-metrics-queries](../../includes/functions-consumption-metrics-queries.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Monitoring function apps](functions-monitoring.md)

[pricing page]:https://azure.microsoft.com/pricing/details/functions/
[Azure portal]: https://portal.azure.com

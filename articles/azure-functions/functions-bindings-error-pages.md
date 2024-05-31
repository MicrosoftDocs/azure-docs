---
title: Azure Functions error handling and retry guidance
description: Learn how to handle errors and retry events in Azure Functions, with links to specific binding errors, including information on retry policies.
ms.topic: conceptual
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 04/24/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions error handling and retries

Handling errors in Azure Functions is important to help you avoid lost data, avoid missed events, and monitor the health of your application. It's also an important way to help you understand the retry behaviors of event-based triggers.

This article describes general strategies for error handling and the available retry strategies.

> [!IMPORTANT]
> Preview retry policy support for certain triggers was removed in December 2022. Retry policies for supported triggers are now generally available (GA). For a list of extensions that currently support retry policies, see the [Retries](#retries) section. 

## Handling errors

Errors that occur in an Azure function can come from:

- Use of built-in Functions [triggers and bindings](functions-triggers-bindings.md).
- Calls to APIs of underlying Azure services.
- Calls to REST endpoints.
- Calls to client libraries, packages, or third-party APIs.

To avoid loss of data or missed messages, it's important to practice good error handling. This table describes some recommended error-handling practices and provides links to more information.

| Recommendation | Details | 
| ---- | ---- |
| **Enable Application Insights** | Azure Functions integrates with Application Insights to collect error data, performance data, and runtime logs. You should use Application Insights to discover and better understand errors that occur in your function executions. To learn more, see [Monitor Azure Functions](functions-monitoring.md). |
| **Use structured error handling** | Capturing and logging errors is critical to monitoring the health of your application. The top-most level of any function code should include a try/catch block. In the catch block, you can capture and log errors. For information about what errors might be raised by bindings, see [Binding error codes](#binding-error-codes). Depending on your specific retry strategy, you might also raise a new exception to run the function again.  |
| **Plan your retry strategy** | Several Functions bindings extensions provide built-in support for retries and others let you define retry policies, which are implemented by the Functions runtime. For triggers that don't provide retry behaviors, you should consider implementing your own retry scheme. For more information, see [Retries](#retries).|
| **Design for idempotency** | The occurrence of errors when you're processing data can be a problem for your functions, especially when you're processing messages. It's important to consider what happens when the error occurs and how to avoid duplicate processing. To learn more, see [Designing Azure Functions for identical input](functions-idempotent.md). |

## Retries

There are two kinds of retries available for your functions:
* Built-in retry behaviors of individual trigger extensions
* Retry policies provided by the Functions runtime

The following table indicates which triggers support retries and where the retry behavior is configured. It also links to more information about errors that come from the underlying services.

| Trigger/binding | Retry source | Configuration |
| ---- | ---- | ----- |
| Azure Cosmos DB | [Retry policies](#retry-policies) | Function-level |
| Blob Storage | [Binding extension](functions-bindings-storage-blob-trigger.md#poison-blobs) |  [host.json](functions-bindings-storage-queue.md#host-json) |
| Event Grid | [Binding extension](../event-grid/delivery-and-retry.md) | Event subscription |
| Event Hubs | [Retry policies](#retry-policies) | Function-level |
| Kafka | [Retry policies](#retry-policies) | Function-level |
| Queue Storage | [Binding extension](functions-bindings-storage-queue-trigger.md#poison-messages) | [host.json](functions-bindings-storage-queue.md#host-json) |
| RabbitMQ | [Binding extension](functions-bindings-rabbitmq-trigger.md#dead-letter-queues) | [Dead letter queue](https://www.rabbitmq.com/dlx.html) |
| Service Bus | [Binding extension](functions-bindings-service-bus-trigger.md) | [host.json](functions-bindings-service-bus.md#hostjson-settings)<sup>*</sup> |
| Timer | [Retry policies](#retry-policies) | Function-level |

<sup>*</sup>Requires version 5.x of the Azure Service Bus extension. In older extension versions, retry behaviors are implemented by the [Service Bus dead letter queue](../service-bus-messaging/service-bus-dead-letter-queues.md#maximum-delivery-count).

## Retry policies

Azure Functions lets you define retry policies for specific trigger types, which are enforced by the runtime. These trigger types currently support retry policies:

+ [Azure Cosmos DB](./functions-bindings-cosmosdb-v2-trigger.md)
+ [Event Hubs](./functions-bindings-event-hubs-trigger.md) 
+ [Kafka](./functions-bindings-kafka-trigger.md)
+ [Timer](./functions-bindings-timer.md)
 
::: zone pivot="programming-language-python"  
Retry support is the same for both v1 and v2 Python programming models.
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript"
Retry policies aren't supported in version 1.x of the Functions runtime.
::: zone-end

The retry policy tells the runtime to rerun a failed execution until either successful completion occurs or the maximum number of retries is reached.

A retry policy is evaluated when a function executed by a supported trigger type raises an uncaught exception. As a best practice, you should catch all exceptions in your code and raise new exceptions for any errors that you want to result in a retry.

> [!IMPORTANT]
> Event Hubs checkpoints aren't written until after the retry policy for the execution has completed. Because of this behavior, progress on the specific partition is paused until the current batch is done processing.
>
> The version 5.x of the Event Hubs extension supports additional retry capabilities for interactions between the Functions host and the event hub.  For more information, see `clientRetryOptions` in the [Event Hubs host.json reference](functions-bindings-event-hubs.md#host-json).

### Retry strategies

You can configure two retry strategies that are supported by policy:

#### [Fixed delay](#tab/fixed-delay)

A specified amount of time is allowed to elapse between each retry.

#### [Exponential backoff](#tab/exponential-backoff)

The first retry waits for the minimum delay. On subsequent retries, time is added exponentially to the initial duration for each retry, until the maximum delay is reached. Exponential back-off adds some small randomization to delays to stagger retries in high-throughput scenarios.

---

When running in a Consumption plan, you are only billed for time your function code is executing. You aren't billed for the wait time between executions in either of these retry strategies.

### Max retry counts

You can configure the maximum number of times that a function execution is retried before eventual failure. The current retry count is stored in memory of the instance.

It's possible for an instance to have a failure between retry attempts. When an instance fails during a retry policy, the retry count is lost. When there are instance failures, the Event Hubs trigger is able to resume processing and retry the batch on a new instance, with the retry count reset to zero. The timer trigger doesn't resume on a new instance.

This behavior means that the maximum retry count is a best effort. In some rare cases, an execution could be retried more than the requested maximum number of times. For Timer triggers, the retries can be less than the maximum number requested.

### Retry examples
::: zone pivot="programming-language-python,programming-language-csharp" 
Examples are provided for both fixed delay and exponential backoff strategies. To see examples for a specific strategy, you must first select that strategy in the previous tab.
::: zone-end
::: zone pivot="programming-language-csharp"

#### [Isolated worker model](#tab/isolated-process/fixed-delay)

Function-level retries are supported with the following NuGet packages:

- [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) >= 1.9.0
- [Microsoft.Azure.Functions.Worker.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs) >= 5.2.0
- [Microsoft.Azure.Functions.Worker.Extensions.Kafka](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kafka) >= 3.8.0
- [Microsoft.Azure.Functions.Worker.Extensions.Timer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Timer) >= 4.2.0

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Timer/TimerFunction.cs" id="docsnippet_fixed_delay_retry_example" :::

|Property  | Description |
|---------|-------------|
|MaxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|DelayInterval|The delay used between retries. Specify it as a string with the format `HH:mm:ss`.|

#### [In-process model](#tab/in-process/fixed-delay)

Retries require NuGet package [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) >= 3.0.23

```csharp
[FunctionName("EventHubTrigger")]
[FixedDelayRetry(5, "00:00:10")]
public static async Task Run([EventHubTrigger("myHub", Connection = "EventHubConnection")] EventData[] events, ILogger log)
{
// ...
}
```

|Property  | Description |
|---------|-------------|
|MaxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|DelayInterval|The delay used between retries. Specify it as a string with the format `HH:mm:ss`.|

#### [Isolated worker model](#tab/isolated-process/exponential-backoff)

Function-level retries are supported with the following NuGet packages:

- [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) >= 1.9.0
- [Microsoft.Azure.Functions.Worker.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs) >= 5.2.0
- [Microsoft.Azure.Functions.Worker.Extensions.Kafka](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kafka) >= 3.8.0
- [Microsoft.Azure.Functions.Worker.Extensions.Timer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Timer) >= 4.2.0

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" id="docsnippet_exponential_backoff_retry_example" :::

#### [In-process model](#tab/in-process/exponential-backoff)

Retries require NuGet package [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) >= 3.0.23

```csharp
[FunctionName("EventHubTrigger")]
[ExponentialBackoffRetry(5, "00:00:04", "00:15:00")]
public static async Task Run([EventHubTrigger("myHub", Connection = "EventHubConnection")] EventData[] events, ILogger log)
{
// ...
}
```

|Property  | Description |
|---------|-------------|
|MaxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|MinimumInterval|The minimum retry delay. Specify it as a string with the format `HH:mm:ss`.|
|MaximumInterval|The maximum retry delay. Specify it as a string with the format `HH:mm:ss`.|

---
::: zone-end
::: zone pivot="programming-language-powershell"

Here's an example of a retry policy defined in the *function.json* file:

#### [Fixed delay](#tab/fixed-delay)

[!INCLUDE [functions-retry-fixed-delay-json](../../includes/functions-retry-fixed-delay-json.md)]

#### [Exponential backoff](#tab/exponential-backoff)

[!INCLUDE [functions-retry-exponential-backoff-json](../../includes/functions-retry-exponential-backoff-json.md)]

---

You can set these properties on retry policy definitions:

[!INCLUDE [functions-retry-function-json-definitions](../../includes/functions-retry-function-json-definitions.md)]

::: zone-end  
::: zone pivot="programming-language-javascript" 
The way you define the retry policy for the trigger depends on your Node.js version.

#### [Node.js v4](#tab/node-v4)

Here's an example of a Timer trigger function that uses a fixed delay retry strategy:

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/timerTriggerWithRetry.js" :::

#### [Node.js v3](#tab/node-v3)

Here's an example of a fixed delay retry policy defined in the *function.json* file:

[!INCLUDE [functions-retry-fixed-delay-json](../../includes/functions-retry-fixed-delay-json.md)]

---

::: zone-end  
::: zone pivot="programming-language-typescript"  
The way you define the retry policy for the trigger depends on your Node.js version.

#### [Node.js v4](#tab/node-v4)

Here's an example of a Timer trigger function that uses a fixed delay retry strategy:

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/timerTriggerWithRetry.ts" :::

#### [Node.js v3](#tab/node-v3)

Here's an example of a fixed delay retry policy defined in the *function.json* file:

[!INCLUDE [functions-retry-fixed-delay-json](../../includes/functions-retry-fixed-delay-json.md)]

---

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
You can set these properties on retry policy definitions:

[!INCLUDE [functions-retry-function-json-definitions](../../includes/functions-retry-function-json-definitions.md)]

::: zone-end  
::: zone pivot="programming-language-python"  
#### [Python v2 model](#tab/python-v2/fixed-delay)

Here's an example of a Timer trigger function that uses a fixed delay retry strategy:

:::code language="python" source="~/azure-functions-python-worker/tests/endtoend/retry_policy_functions/fixed_strategy/function_app.py" :::

#### [Python v2 model](#tab/python-v2/exponential-backoff)

Here's an example of a Timer trigger function that uses an exponential backoff retry strategy:

:::code language="python" source="~/azure-functions-python-worker/tests/endtoend/retry_policy_functions/exponential_strategy/function_app.py" :::

#### [Python v1 model](#tab/python-v1/fixed-delay)

The retry policy is defined in the function.json file:

[!INCLUDE [functions-retry-fixed-delay-json](../../includes/functions-retry-fixed-delay-json.md)]

Here's an example of a Timer trigger function that uses a fixed delay retry strategy:

```Python
import azure.functions
import logging


def main(mytimer: azure.functions.TimerRequest, context: azure.functions.Context) -> None:
    logging.info(f'Current retry count: {context.retry_context.retry_count}')

    if context.retry_context.retry_count == context.retry_context.max_retry_count:
        logging.warn(
            f"Max retries of {context.retry_context.max_retry_count} for "
            f"function {context.function_name} has been reached")

```

#### [Python v1 model](#tab/python-v1/exponential-backoff)

Here's an example of an exponential backoff retry policy defined in the *function.json* file:

[!INCLUDE [functions-retry-exponential-backoff-json](../../includes/functions-retry-exponential-backoff-json.md)]

---

You can set these properties on retry policy definitions:

#### [Python v2 model](#tab/python-v2)

|Property  | Description |
|---------|-------------|
|strategy|Required. The retry strategy to use. Valid values are `fixed_delay` or `exponential_backoff`.|
|max_retry_count|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|delay_interval|The delay used between retries when you're using a `fixed_delay` strategy. Specify it as a string with the format `HH:mm:ss`.|
|minimum_interval|The minimum retry delay when you're using an `exponential_backoff` strategy. Specify it as a string with the format `HH:mm:ss`.|
|maximum_interval|The maximum retry delay when you're using `exponential_backoff` strategy. Specify it as a string with the format `HH:mm:ss`.|

#### [Python v1 model](#tab/python-v1)

[!INCLUDE [functions-retry-function-json-definitions](../../includes/functions-retry-function-json-definitions.md)]

---

::: zone-end  
::: zone pivot="programming-language-java"

#### [Fixed delay](#tab/fixed-delay)

```java
@FunctionName("TimerTriggerJava1")
@FixedDelayRetry(maxRetryCount = 4, delayInterval = "00:00:10")
public void run(
    @TimerTrigger(name = "timerInfo", schedule = "0 */5 * * * *") String timerInfo,
    final ExecutionContext context
) {
    context.getLogger().info("Java Timer trigger function executed at: " + LocalDateTime.now());
}
```

#### [Exponential backoff](#tab/exponential-backoff)

```java
@FunctionName("TimerTriggerJava1")
@ExponentialBackoffRetry(maxRetryCount = 5 , maximumInterval = "00:15:00", minimumInterval = "00:00:10")
public void run(
    @TimerTrigger(name = "timerInfo", schedule = "0 */5 * * * *") String timerInfo,
    final ExecutionContext context
) {
    context.getLogger().info("Java Timer trigger function executed at: " + LocalDateTime.now());
}
```

|Element  | Description |
|---------|-------------|
|maxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|delayInterval|The delay used between retries when you're using a `fixedDelay` strategy. Specify it as a string with the format `HH:mm:ss`.|
|minimumInterval|The minimum retry delay when you're using an `exponentialBackoff` strategy. Specify it as a string with the format `HH:mm:ss`.|
|maximumInterval|The maximum retry delay when you're using `exponentialBackoff` strategy. Specify it as a string with the format `HH:mm:ss`.|

---

::: zone-end

## Binding error codes

When you're integrating with Azure services, errors might originate from the APIs of the underlying services. Information that relates to binding-specific errors is available in the "Exceptions and return codes" sections of the following articles:

+ [Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb)
+ [Blob Storage](functions-bindings-storage-blob-output.md#exceptions-and-return-codes)
+ [Event Grid](../event-grid/troubleshoot-errors.md)
+ [Event Hubs](functions-bindings-event-hubs-output.md#exceptions-and-return-codes)
+ [IoT Hub](functions-bindings-event-iot-output.md#exceptions-and-return-codes)
+ [Notification Hubs](functions-bindings-notification-hubs.md#exceptions-and-return-codes)
+ [Queue Storage](functions-bindings-storage-queue-output.md#exceptions-and-return-codes)
+ [Service Bus](functions-bindings-service-bus-output.md#exceptions-and-return-codes)
+ [Table Storage](functions-bindings-storage-table-output.md#exceptions-and-return-codes)

## Next steps

+ [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md)
+ [Best practices for reliable Azure functions](functions-best-practices.md)

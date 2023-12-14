---
title: Azure Functions error handling and retry guidance
description: Learn how to handle errors and retry events in Azure Functions, with links to specific binding errors, including information on retry policies.
ms.topic: conceptual
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 01/03/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Functions error handling and retries

Handling errors in Azure Functions is important to help you avoid lost data, avoid missed events, and monitor the health of your application. It's also an important way to help you understand the retry behaviors of event-based triggers.

This article describes general strategies for error handling and the available retry strategies.

> [!IMPORTANT]
> We're removing retry policy support in the runtime for triggers other than Timer, Kafka, and Event Hubs after this feature becomes generally available (GA). Preview retry policy support for all triggers other than Timer and Event Hubs was removed in December 2022. For more information, see the [Retries](#retries) section.

## Handling errors

Errors that occur in an Azure function can result from any of the following:

- Use of built-in Azure Functions [triggers and bindings](functions-triggers-bindings.md)
- Calls to APIs of underlying Azure services
- Calls to REST endpoints
- Calls to client libraries, packages, or third-party APIs

To avoid loss of data or missed messages, it's important to practice good error handling. This section describes some recommended error-handling practices and provides links to more information.

### Enable Application Insights

Azure Functions integrates with Application Insights to collect error data, performance data, and runtime logs. You should use Application Insights to discover and better understand errors that occur in your function executions. To learn more, see [Monitor Azure Functions](functions-monitoring.md).

### Use structured error handling

Capturing and logging errors is critical to monitoring the health of your application. The top-most level of any function code should include a try/catch block. In the catch block, you can capture and log errors. For information about what errors might be raised by bindings, see [Binding error codes](#binding-error-codes).

### Plan your retry strategy

Several Functions bindings extensions provide built-in support for retries. In addition, the runtime lets you define retry policies for Timer, Kafka, and Event Hubs-triggered functions. To learn more, see [Retries](#retries). For triggers that don't provide retry behaviors, you might want to implement your own retry scheme.

### Design for idempotency

The occurrence of errors when you're processing data can be a problem for your functions, especially when you're processing messages. It's important to consider what happens when the error occurs and how to avoid duplicate processing. To learn more, see [Designing Azure Functions for identical input](functions-idempotent.md).

## Retries

There are two kinds of retries available for your functions:
* Built-in retry behaviors of individual trigger extensions
* Retry policies provided by the Functions runtime

The following table indicates which triggers support retries and where the retry behavior is configured. It also links to more information about errors that come from the underlying services.

| Trigger/binding | Retry source | Configuration |
| ---- | ---- | ----- |
| Azure Cosmos DB | [Retry policies](#retry-policies) | Function-level |
| Azure Blob Storage | [Binding extension](functions-bindings-storage-blob-trigger.md#poison-blobs) |  [host.json](functions-bindings-storage-queue.md#host-json) |
| Azure Event Grid | [Binding extension](../event-grid/delivery-and-retry.md) | Event subscription |
| Azure Event Hubs | [Retry policies](#retry-policies) | Function-level |
| Azure Queue Storage | [Binding extension](functions-bindings-storage-queue-trigger.md#poison-messages) | [host.json](functions-bindings-storage-queue.md#host-json) |
| RabbitMQ | [Binding extension](functions-bindings-rabbitmq-trigger.md#dead-letter-queues) | [Dead letter queue](https://www.rabbitmq.com/dlx.html) |
| Azure Service Bus | [Binding extension](../service-bus-messaging/service-bus-dead-letter-queues.md) | [Dead letter queue](../service-bus-messaging/service-bus-dead-letter-queues.md#maximum-delivery-count) |
|Timer | [Retry policies](#retry-policies) | Function-level |
|Kafka | [Retry policies](#retry-policies) | Function-level |

### Retry policies

Starting with version 3.x of the Azure Functions runtime, you can define retry policies for Timer, Kafka, and Event Hubs triggers that are enforced by the Functions runtime.

The retry policy tells the runtime to rerun a failed execution until either successful completion occurs or the maximum number of retries is reached.

A retry policy is evaluated when a Timer, Kafka, or Event Hubs-triggered function raises an uncaught exception. As a best practice, you should catch all exceptions in your code and rethrow any errors that you want to result in a retry.

> [!IMPORTANT]
> Event Hubs checkpoints won't be written until the retry policy for the execution has finished. Because of this behavior, progress on the specific partition is paused until the current batch has finished.
>
> The Event Hubs v5 extension supports additional retry capabilities for interactions between the Functions host and the event hub.  Please refer to the `clientRetryOptions` in [the Event Hubs section of the host.json](functions-bindings-event-hubs.md#host-json) file for more information.

#### Retry strategies

You can configure two retry strategies that are supported by policy:

# [Fixed delay](#tab/fixed-delay)

A specified amount of time is allowed to elapse between each retry.

# [Exponential backoff](#tab/exponential-backoff)

The first retry waits for the minimum delay. On subsequent retries, time is added exponentially to the initial duration for each retry, until the maximum delay is reached. Exponential back-off adds some small randomization to delays to stagger retries in high-throughput scenarios.

---

#### Max retry counts

You can configure the maximum number of times that a function execution is retried before eventual failure. The current retry count is stored in memory of the instance.

It's possible for an instance to have a failure between retry attempts. When an instance fails during a retry policy, the retry count is lost. When there are instance failures, the Event Hubs trigger is able to resume processing and retry the batch on a new instance, with the retry count reset to zero. The timer trigger doesn't resume on a new instance.

This behavior means that the maximum retry count is a best effort. In some rare cases, an execution could be retried more than the requested maximum number of times. For Timer triggers, the retries can be less than the maximum number requested.

#### Retry examples

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process/fixed-delay)

Function-level retries are supported with the following NuGet packages:

- [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) >= 1.9.0
- [Microsoft.Azure.Functions.Worker.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs) >= 5.2.0
- [Microsoft.Azure.Functions.Worker.Extensions.Kafka](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kafka) >= 3.8.0
- [Microsoft.Azure.Functions.Worker.Extensions.Timer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Timer) >= 4.2.0

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Timer/TimerFunction.cs" id="docsnippet_fixed_delay_retry_example" :::

|Property  | Description |
|---------|-------------|
|MaxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|DelayInterval|The delay that's used between retries. Specify it as a string with the format `HH:mm:ss`.|

# [In-process model](#tab/in-process/fixed-delay)

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
|DelayInterval|The delay that's used between retries. Specify it as a string with the format `HH:mm:ss`.|

# [Isolated worker model](#tab/isolated-process/exponential-backoff)

Function-level retries are supported with the following NuGet packages:

- [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk) >= 1.9.0
- [Microsoft.Azure.Functions.Worker.Extensions.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs) >= 5.2.0
- [Microsoft.Azure.Functions.Worker.Extensions.Kafka](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kafka) >= 3.8.0
- [Microsoft.Azure.Functions.Worker.Extensions.Timer](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Timer) >= 4.2.0

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" id="docsnippet_exponential_backoff_retry_example" :::

# [In-process model](#tab/in-process/exponential-backoff)

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
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

Here's the retry policy in the *function.json* file:

# [Fixed delay](#tab/fixed-delay)

```json
{
    "disabled": false,
    "bindings": [
        {
            ....
        }
    ],
    "retry": {
        "strategy": "fixedDelay",
        "maxRetryCount": 4,
        "delayInterval": "00:00:10"
    }
}
```

# [Exponential backoff](#tab/exponential-backoff)

```json
{
    "disabled": false,
    "bindings": [
        {
            ....
        }
    ],
    "retry": {
        "strategy": "exponentialBackoff",
        "maxRetryCount": 5,
        "minimumInterval": "00:00:10",
        "maximumInterval": "00:15:00"
    }
}
```

---

|*function.json* property  | Description |
|---------|-------------|
|strategy|Required. The retry strategy to use. Valid values are `fixedDelay` or `exponentialBackoff`.|
|maxRetryCount|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|delayInterval|The delay that's used between retries when you're using a `fixedDelay` strategy. Specify it as a string with the format `HH:mm:ss`.|
|minimumInterval|The minimum retry delay when you're using an `exponentialBackoff` strategy. Specify it as a string with the format `HH:mm:ss`.|
|maximumInterval|The maximum retry delay when you're using `exponentialBackoff` strategy. Specify it as a string with the format `HH:mm:ss`.|

::: zone-end
::: zone pivot="programming-language-python"

Here's a Python sample that uses the retry context in a function:

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

::: zone-end
::: zone pivot="programming-language-java"

# [Fixed delay](#tab/fixed-delay)

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

# [Exponential backoff](#tab/exponential-backoff)

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
|delayInterval|The delay that's used between retries when you're using a `fixedDelay` strategy. Specify it as a string with the format `HH:mm:ss`.|
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

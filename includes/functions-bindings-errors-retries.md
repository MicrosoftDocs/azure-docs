---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/01/2020
ms.author: glenga
---

Errors raised in an Azure Functions can come from any of the following origins:

- Use of built-in Azure Functions [triggers and bindings](..\articles\azure-functions\functions-triggers-bindings.md)
- Calls to APIs of underlying Azure services
- Calls to REST endpoints
- Calls to client libraries, packages, or third-party APIs

Following good error handling practices is important to avoid loss of data or missed messages. Recommended error handling practices include the following actions:

- [Enable Application Insights](../articles/azure-functions/functions-monitoring.md)
- [Use structured error handling](#use-structured-error-handling)
- [Design for idempotency](../articles/azure-functions/functions-idempotent.md)
- [Implement retry policies](#retry-policies-preview) (where appropriate)

### Use structured error handling

Capturing and logging errors is critical to monitoring the health of your application. The top-most level of any function code should include a try/catch block. In the catch block, you can capture and log errors.

## Retry policies (preview)

A retry policy can be defined on any function for any trigger type in your function app.  The retry policy re-executes a function until either successful execution or until the maximum number of retries occur.  Retry policies can be defined for all functions in an app or for individual functions.  By default, a function app won't retry messages (aside from the [specific triggers that have a retry policy on the trigger source](#using-retry-support-on-top-of-trigger-resilience)).  A retry policy is evaluated whenever an execution results in an uncaught exception.  As a best practice, you should catch all exceptions in your code and rethrow any errors that should result in a retry.  Event Hubs and Azure Cosmos DB checkpoints won't be written until the retry policy for the execution has completed, meaning progressing on that partition is paused until the current batch has completed.

### Retry policy options

The following options are available for defining a retry policy.

**Max Retry Count** is the maximum number of times an execution is retried before eventual failure. A value of `-1` means to retry indefinitely. The current retry count is stored in memory of the instance. It's possible that an instance has a failure between retry attempts.  When an instance fails during a retry policy, the retry count is lost.  When there are instance failures, triggers like Event Hubs, Azure Cosmos DB, and Queue storage are able to resume processing and retry the batch on a new instance, with the retry count reset to zero.  Other triggers, like HTTP and timer, don't resume on a new instance.  This means that the max retry count is a best effort, and in some rare cases an execution could be retried more than the maximum, or for triggers like HTTP and timer be retried less than the maximum.

**Retry Strategy** controls how retries behave.  The following are two supported retry options:

| Option | Description|
|---|---|
|**`fixedDelay`**| A specified amount of time is allowed to elapse between each retry,|
| **`exponentialBackoff`**| The first retry waits for the minimum delay. On subsequent retries, time is added exponentially to the initial duration for each retry, until the maximum delay is reached.  Exponential back-off adds some small randomization to delays to stagger retries in high-throughput scenarios.|

#### App level configuration

A retry policy can be defined for all functions in an app [using the `host.json` file](../articles/azure-functions/functions-host-json.md#retry). 

#### Function level configuration

A retry policy can be defined for a specific function.  Function-specific configuration takes priority over app-level configuration.

#### Fixed delay retry

# [C#](#tab/csharp)

Retries require NuGet package [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) >= 3.0.23

```csharp
[FunctionName("EventHubTrigger")]
[FixedDelayRetry(5, "00:00:10")]
public static async Task Run([EventHubTrigger("myHub", Connection = "EventHubConnection")] EventData[] events, ILogger log)
{
// ...
}
```

# [C# Script](#tab/csharp-script)

Here's the retry policy in the *function.json* file:

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
# [JavaScript](#tab/javascript)

Here's the retry policy in the *function.json* file:


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

# [Python](#tab/python)

Here's the retry policy in the *function.json* file:

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

# [Java](#tab/java)

Here's the retry policy in the *function.json* file:


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
---

#### Exponential backoff retry

Retries require NuGet package [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) >= 3.0.23

# [C#](#tab/csharp)

```csharp
[FunctionName("EventHubTrigger")]
[ExponentialBackoffRetry(5, "00:00:04", "00:15:00")]
public static async Task Run([EventHubTrigger("myHub", Connection = "EventHubConnection")] EventData[] events, ILogger log)
{
// ...
}
```

# [C# Script](#tab/csharp-script)

Here's the retry policy in the *function.json* file:

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

# [JavaScript](#tab/javascript)

Here's the retry policy in the *function.json* file:

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

# [Python](#tab/python)

Here's the retry policy in the *function.json* file:

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

# [Java](#tab/java)

Here's the retry policy in the *function.json* file:

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

|function.json property  |Attribute Property | Description |
|---------|---------|---------| 
|strategy|n/a|Required. The retry strategy to use. Valid values are `fixedDelay` or `exponentialBackoff`.|
|maxRetryCount|n/a|Required. The maximum number of retries allowed per function execution. `-1` means to retry indefinitely.|
|delayInterval|n/a|The delay that will be used between retries when using `fixedDelay` strategy.|
|minimumInterval|n/a|The minimum retry delay when using `exponentialBackoff` strategy.|
|maximumInterval|n/a|The maximum retry delay when using `exponentialBackoff` strategy.| 

### Retry limitations during preview

- For .NET projects, you may need to manually pull in a version of [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) >= 3.0.23.
- In the consumption plan, the app may be scaled down to zero while retrying the final messages in a queue.
- In the consumption plan, the app may be scaled down while performing retries.  For best results, choose a retry interval <= 00:01:00 and <= 5 retries.

## Using retry support on top of trigger resilience

The function app retry policy is independent of any retries or resiliency that the trigger provides.  The function retry policy will only layer on top of a trigger resilient retry.  For example, if using Azure Service Bus, by default queues have a message delivery count of 10.  The default delivery count means after 10 attempted deliveries of a queue message, Service Bus will deadletter the message.  You can define a retry policy for a function that has a Service Bus trigger, but the retries will layer on top of the Service Bus delivery attempts.  

For instance, if you used the default Service Bus delivery count of 10, and defined a function retry policy of 5.  The message would first dequeue, incrementing the service bus delivery account to 1.  If every execution failed, after five attempts to trigger the same message, that message would be marked as abandoned.  Service Bus would immediately requeue the message, it would trigger the function and increment the delivery count to 2.  Finally, after 50 eventual attempts (10 service bus deliveries * five function retries per delivery), the message would be abandoned and trigger a deadletter on service bus.

> [!WARNING]
> It is not recommended to set the delivery count for a trigger like Service Bus Queues to 1, meaning the message would be deadlettered immediately after a single function retry cycle.  This is because triggers provide resiliency with retries, while the function retry policy is best effort and may result in less than the desired total number of retries.

### Triggers with additional resiliency or retries

The following triggers support retries at the trigger source:

* [Azure Blob storage](../articles/azure-functions/functions-bindings-storage-blob.md)
* [Azure Queue storage](../articles/azure-functions/functions-bindings-storage-queue.md)
* [Azure Service Bus (queue/topic)](../articles/azure-functions/functions-bindings-service-bus.md)

By default, these triggers retry requests up to five times. After the fifth retry, both the Azure Queue storage and Azure Service Bus trigger write a message to a [poison queue](../articles/azure-functions/functions-bindings-storage-queue-trigger.md#poison-messages).

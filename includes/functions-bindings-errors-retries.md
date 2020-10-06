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

Following solid error handling practices is important to avoid loss of data or missed messages. Recommended error handling practices include the following actions:

- [Enable Application Insights](../articles/azure-functions/functions-monitoring.md)
- [Use structured error handling](#use-structured-error-handling)
- [Design for idempotency](../articles/azure-functions/functions-idempotent.md)
- [Implement retry policies](#retry-policies) (where appropriate)

### Use structured error handling

Capturing and publishing errors is critical to monitoring the health of your application. The top-most level of any function code should include a try/catch block. In the catch block, you can capture and publish errors.

## Retry policies

A retry policy can be defined on any function for any trigger in an app.  The retry policy re-executes a function until the maximum number of retries or a successful execution.  Retry policies can be defined for all functions in an app or for individual functions.  By default a function app won't retry messages (aside from the [specific triggers that have a retry policy on the trigger source](#trigger-specific-retry-support)).  A retry policy will be evaluated whenever an execution results in an uncaught exception.  The best practice is for all exceptions to be caught in user code, and for those errors that should result in a retry to throw.  Event Hubs and Cosmos DB checkpoints won't be written until the retry policy for the execution has completed, meaning progressing on that partition will be paused until the current batch has completed.

### Retry policy options

The following options are available for defining a retry policy.

**Max Retry Count** is the maximum number of times an execution should be retried before eventual failure.  A value of `-1` means to retry indefinitely.  The current retry count is stored in memory of the instance.  It is possible that an instance has a failure between retry attempts.  If an instance failed during a retry policy, the retry count would be lost.  If there are instance failures, triggers like Event Hubs, Cosmos DB, and Queues would be able to resume processing and retry the batch on a new instance, with the retry count reset to zero.  Other triggers like HTTP and timer would not resume on a new instance.  This means that the max retry count is a best effort, and in some rare cases an execution could be retried more than the maximum, or for triggers like HTTP and timer be retried less than the maximum.

**Retry Strategy** is how retries will behave.  There are two valid options, `fixedDelay` and `exponentialBackoff`.  

Fixed delay will wait a specified amount of time between each retry.  

Exponential backoff will do the first retry for the minimum delay, and then exponentially add to that duration for each retry until the maximum delay is reached.  Exponential backoff adds some small randomization to delays to stagger retries in high throughput scenarios.

#### App level configuration

A retry policy can be defined for all functions in an app [using the `host.json` file](../articles/azure-functions/functions-host-json.md#retry). 

#### Function level configuration

A retry policy can be defined for a specific function.  Function-specific configuration will take priority over app level configuration.

# [C#](#tab/csharp)

#### Fixed delay retry

```csharp
[FunctionName("EventHubTrigger")]
[FixedDelayRetry(5, "00:00:10")]
public static async Task Run([EventHubTrigger("myHub", Connection = "EventHubConnection")] EventData[] events, ILogger log)
{
// ...
}
```

#### Exponential backoff retry

```csharp
[FunctionName("EventHubTrigger")]
[exponentialBackoffRetry(5, "00:00:04", "00:15:00")]
public static async Task Run([EventHubTrigger("myHub", Connection = "EventHubConnection")] EventData[] events, ILogger log)
{
// ...
}
```

# [C# Script](#tab/csharp-script)

Here's the retry policy in the *function.json* file:

#### Fixed delay retry

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

#### Exponential backoff retry

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

#### Fixed delay retry

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

#### Exponential backoff retry

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

#### Fixed delay retry

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

#### Exponential backoff retry

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

#### Fixed delay retry

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

#### Exponential backoff retry

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

## Trigger specific retry support

Some triggers provide retries at the trigger source.  These trigger retries can be used in addition to or as a replacement for the function app host retry policy.  If a fixed number of retries are desired, you should use the trigger-specific retry policy over the generic host retry policy.  The following triggers support retries at the trigger source:

* [Azure Blob storage](../articles/azure-functions/functions-bindings-storage-blob.md)
* [Azure Queue storage](../articles/azure-functions/functions-bindings-storage-queue.md)
* [Azure Service Bus (queue/topic)](../articles/azure-functions/functions-bindings-service-bus.md)

By default, these triggers retry requests up to five times. After the fifth retry, both the Azure Queue storage and Azure Service Bus trigger write a message to a [poison queue](../articles/azure-functions/functions-bindings-storage-queue-trigger.md#poison-messages).


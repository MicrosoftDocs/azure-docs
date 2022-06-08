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

## Retry policies

A retry policy can be defined on timer and event hubs triggers.  The retry policy re-executes a function until either successful execution or until the maximum number of retries occur.   

> [!NOTE]
> Retry policies are only available in [Azure Function runtime](../articles/azure-functions/functions-versions.md) version ~3 or later.

A retry policy is evaluated whenever an execution results in an uncaught exception.  As a best practice, you should catch all exceptions in your code and rethrow any errors that should result in a retry.  Event Hubs checkpoints won't be written until the retry policy for the execution has completed, meaning progressing on that partition is paused until the current batch has completed.

### Retry policy options

The following options are available for defining a retry policy.

**Max Retry Count** is the maximum number of times an execution is retried before eventual failure. A value of `-1` means to retry indefinitely. The current retry count is stored in memory of the instance. It's possible that an instance has a failure between retry attempts.  When an instance fails during a retry policy, the retry count is lost.  When there are instance failures, triggers like Event Hubs are able to resume processing and retry the batch on a new instance, with the retry count reset to zero.  Other triggers, like timer, don't resume on a new instance.  This means that the max retry count is a best effort, and in some rare cases an execution could be retried more than the maximum, or for triggers like timer be retried less than the maximum.

**Retry Strategy** controls how retries behave.  The following are two supported retry options:

| Option | Description|
|---|---|
|**`fixedDelay`**| A specified amount of time is allowed to elapse between each retry,|
| **`exponentialBackoff`**| The first retry waits for the minimum delay. On subsequent retries, time is added exponentially to the initial duration for each retry, until the maximum delay is reached.  Exponential back-off adds some small randomization to delays to stagger retries in high-throughput scenarios.|

#### Function level configuration

A retry policy can be defined for a specific function.

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

Here's a Python sample to use retry context in a function:

```Python
import azure.functions
import logging


def main(mytimer: azure.functions.TimerRequest, context: azure.functions.Context) -> None:
    logging.info(f'Current retry count: {context.retry_context.retry_count}')
    
    if context.retry_context.retry_count == context.retry_context.max_retry_count:
        logging.info(
            f"Max retries of {context.retry_context.max_retry_count} for "
            f"function {context.function_name} has been reached")
   
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

# [PowerShell](#tab/powershell)

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

# [C#](#tab/csharp)

Retries require NuGet package [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) >= 3.0.23

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

Here's a Python sample to use retry context in a function:

```Python
import azure.functions
import logging


def main(mytimer: azure.functions.TimerRequest, context: azure.functions.Context) -> None:
    logging.info(f'Current retry count: {context.retry_context.retry_count}')
    
    if context.retry_context.retry_count == context.retry_context.max_retry_count:
        logging.info(
            f"Max retries of {context.retry_context.max_retry_count} for "
            f"function {context.function_name} has been reached")
            
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

# [PowerShell](#tab/powershell)

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
|delayInterval|n/a|The delay that is used between retries when using a `fixedDelay` strategy. Specify as a string with the format `HH:mm:ss`.|
|minimumInterval|n/a|The minimum retry delay when using an `exponentialBackoff` strategy. Specify as a string with the format `HH:mm:ss`.|
|maximumInterval|n/a|The maximum retry delay when using `exponentialBackoff` strategy. Specify as a string with the format `HH:mm:ss`.| 


## Triggers with additional resiliency or retries

Retry policy is currently only supported on Event Hubs and Timer triggers. The following triggers support retries at the trigger source:

* [Azure Blob storage](../articles/azure-functions/functions-bindings-storage-blob.md)
* [Azure Queue storage](../articles/azure-functions/functions-bindings-storage-queue.md)
* [Azure Service Bus (queue/topic)](../articles/azure-functions/functions-bindings-service-bus.md)

By default, most triggers retry requests up to five times. After the fifth retry, both the Azure Queue storage will write a message to a [poison queue](../articles/azure-functions/functions-bindings-storage-queue-trigger.md#poison-messages).  The default Service Bus queue and topic policy will write a message to a [dead-letter queue](../articles/service-bus-messaging/service-bus-dead-letter-queues.md) after 10 attempts.

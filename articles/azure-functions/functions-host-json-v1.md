---
title: host.json reference for Azure Functions 1.x
description: Reference documentation for the Azure Functions host.json file with the v1 runtime.
ms.topic: conceptual
ms.date: 10/19/2018
---

# host.json reference for Azure Functions 1.x

> [!div class="op_single_selector" title1="Select the version of the Azure Functions runtime you are using: "]
> * [Version 1](functions-host-json-v1.md)
> * [Version 2](functions-host-json.md)

The *host.json* metadata file contains configuration options that affect all functions in a function app instance. This article lists the settings that are available for the version 1.x runtime. The JSON schema is at http://json.schemastore.org/host.

> [!NOTE]
> This article is for Azure Functions 1.x.  For a reference of host.json in Functions 2.x and later, see [host.json reference for Azure Functions 2.x](functions-host-json.md).

Other function app configuration options are managed in your [app settings](functions-app-settings.md).

Some host.json settings are only used when running locally in the [local.settings.json](functions-develop-local.md#local-settings-file) file.

## Sample host.json file

The following sample *host.json* files have all possible options specified.


```json
{
    "aggregator": {
        "batchSize": 1000,
        "flushTimeout": "00:00:30"
    },
    "applicationInsights": {
        "sampling": {
          "isEnabled": true,
          "maxTelemetryItemsPerSecond" : 5
        }
    },
    "documentDB": {
        "connectionMode": "Gateway",
        "protocol": "Https",
        "leaseOptions": {
            "leasePrefix": "prefix"
        }
    },
    "eventHub": {
      "maxBatchSize": 64,
      "prefetchCount": 256,
      "batchCheckpointFrequency": 1
    },
    "functions": [ "QueueProcessor", "GitHubWebHook" ],
    "functionTimeout": "00:05:00",
    "healthMonitor": {
        "enabled": true,
        "healthCheckInterval": "00:00:10",
        "healthCheckWindow": "00:02:00",
        "healthCheckThreshold": 6,
        "counterThreshold": 0.80
    },
    "http": {
        "routePrefix": "api",
        "maxOutstandingRequests": 20,
        "maxConcurrentRequests": 10,
        "dynamicThrottlesEnabled": false
    },
    "id": "9f4ea53c5136457d883d685e57164f08",
    "logger": {
        "categoryFilter": {
            "defaultLevel": "Information",
            "categoryLevels": {
                "Host": "Error",
                "Function": "Error",
                "Host.Aggregator": "Information"
            }
        }
    },
    "queues": {
      "maxPollingInterval": 2000,
      "visibilityTimeout" : "00:00:30",
      "batchSize": 16,
      "maxDequeueCount": 5,
      "newBatchThreshold": 8
    },
    "sendGrid": {
        "from": "Contoso Group <admin@contoso.com>"
    },
    "serviceBus": {
      "maxConcurrentCalls": 16,
      "prefetchCount": 100,
      "autoRenewTimeout": "00:05:00",
      "autoComplete": true
    },
    "singleton": {
      "lockPeriod": "00:00:15",
      "listenerLockPeriod": "00:01:00",
      "listenerLockRecoveryPollingInterval": "00:01:00",
      "lockAcquisitionTimeout": "00:01:00",
      "lockAcquisitionPollingInterval": "00:00:03"
    },
    "tracing": {
      "consoleLevel": "verbose",
      "fileLoggingMode": "debugOnly"
    },
    "watchDirectories": [ "Shared" ],
}
```

The following sections of this article explain each top-level property. All are optional unless otherwise indicated.

## aggregator

[!INCLUDE [aggregator](../../includes/functions-host-json-aggregator.md)]

## applicationInsights

[!INCLUDE [applicationInsights](../../includes/functions-host-json-applicationinsights.md)]

## DocumentDB

Configuration settings for the [Azure Cosmos DB trigger and bindings](functions-bindings-cosmosdb.md).

```json
{
    "documentDB": {
        "connectionMode": "Gateway",
        "protocol": "Https",
        "leaseOptions": {
            "leasePrefix": "prefix1"
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|GatewayMode|Gateway|The connection mode used by the function when connecting to the Azure Cosmos DB service. Options are `Direct` and `Gateway`|
|Protocol|Https|The connection protocol used by the function when connection to the Azure Cosmos DB service.  Read [here for an explanation of both modes](../cosmos-db/performance-tips.md#networking)|
|leasePrefix|n/a|Lease prefix to use across all functions in an app.|

## durableTask

[!INCLUDE [durabletask](../../includes/functions-host-json-durabletask.md)]

## eventHub

Configuration settings for [Event Hub triggers and bindings](functions-bindings-event-hubs.md?tabs=functionsv1#hostjson-settings).

## functions

A list of functions that the job host runs. An empty array means run all functions. Intended for use only when [running locally](functions-run-local.md). In function apps in Azure, you should instead follow the steps in [How to disable functions in Azure Functions](disable-function.md) to disable specific functions rather than using this setting.

```json
{
    "functions": [ "QueueProcessor", "GitHubWebHook" ]
}
```

## functionTimeout

Indicates the timeout duration for all functions. In a serverless Consumption plan, the valid range is from 1 second to 10 minutes, and the default value is 5 minutes. In an App Service plan, there is no overall limit and the default is _null_, which indicates no timeout.

```json
{
    "functionTimeout": "00:05:00"
}
```

## healthMonitor

Configuration settings for [Host health monitor](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Host-Health-Monitor).

```
{
    "healthMonitor": {
        "enabled": true,
        "healthCheckInterval": "00:00:10",
        "healthCheckWindow": "00:02:00",
        "healthCheckThreshold": 6,
        "counterThreshold": 0.80
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|enabled|true|Specifies whether the feature is enabled. | 
|healthCheckInterval|10 seconds|The time interval between the periodic background health checks. | 
|healthCheckWindow|2 minutes|A sliding time window used with the `healthCheckThreshold` setting.| 
|healthCheckThreshold|6|Maximum number of times the health check can fail before a host recycle is initiated.| 
|counterThreshold|0.80|The threshold at which a performance counter will be considered unhealthy.| 

## http

Configuration settings for [http triggers and bindings](functions-bindings-http-webhook.md).

```json
{
    "http": {
        "routePrefix": "api",
        "maxOutstandingRequests": 200,
        "maxConcurrentRequests": 100,
        "dynamicThrottlesEnabled": true
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|dynamicThrottlesEnabled|false|When enabled, this setting causes the request processing pipeline to periodically check system performance counters like connections/threads/processes/memory/cpu/etc. and if any of those counters are over a built-in high threshold (80%), requests are rejected with a 429 "Too Busy" response until the counter(s) return to normal levels.|
|maxConcurrentRequests|unbounded (`-1`)|The maximum number of HTTP functions that will be executed in parallel. This allows you to control concurrency, which can help manage resource utilization. For example, you might have an HTTP function that uses a lot of system resources (memory/cpu/sockets) such that it causes issues when concurrency is too high. Or you might have a function that makes outbound requests to a third party service, and those calls need to be rate limited. In these cases, applying a throttle here can help.|
|maxOutstandingRequests|unbounded (`-1`)|The maximum number of outstanding requests that are held at any given time. This limit includes requests that are queued but have not started executing, and any in progress executions. Any incoming requests over this limit are rejected with a 429 "Too Busy" response. That allows callers to employ time-based retry strategies, and also helps you to control maximum request latencies. This only controls queuing that occurs within the script host execution path. Other queues such as the ASP.NET request queue will still be in effect and unaffected by this setting.|
|routePrefix|api|The route prefix that applies to all routes. Use an empty string to remove the default prefix. |

## id

The unique ID for a job host. Can be a lower case GUID with dashes removed. Required when running locally. When running in Azure, we recommend that you not set an ID value. An ID is generated automatically in Azure when `id` is omitted. 

If you share a Storage account across multiple function apps, make sure that each function app has a different `id`. You can omit the `id` property or manually set each function app's `id` to a different value. The timer trigger uses a storage lock to ensure that there will be only one timer instance when a function app scales out to multiple instances. If two function apps share the same `id` and each uses a timer trigger, only one timer runs.

```json
{
    "id": "9f4ea53c5136457d883d685e57164f08"
}
```

## logger

Controls filtering for logs written by an [ILogger](functions-dotnet-class-library.md#ilogger) object or by [context.log](functions-reference-node.md#contextlog-method).

```json
{
    "logger": {
        "categoryFilter": {
            "defaultLevel": "Information",
            "categoryLevels": {
                "Host": "Error",
                "Function": "Error",
                "Host.Aggregator": "Information"
            }
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|categoryFilter|n/a|Specifies filtering by category| 
|defaultLevel|Information|For any categories not specified in the `categoryLevels` array, send logs at this level and above to Application Insights.| 
|categoryLevels|n/a|An array of categories that specifies the minimum log level to send to Application Insights for each category. The category specified here controls all categories that begin with the same value, and longer values take precedence. In the preceding sample *host.json* file, all categories that begin with "Host.Aggregator" log at `Information` level. All other categories that begin with "Host", such as "Host.Executor", log at `Error` level.| 

## queues

Configuration settings for [Storage queue triggers and bindings](functions-bindings-storage-queue.md).

```json
{
    "queues": {
      "maxPollingInterval": 2000,
      "visibilityTimeout" : "00:00:30",
      "batchSize": 16,
      "maxDequeueCount": 5,
      "newBatchThreshold": 8
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxPollingInterval|60000|The maximum interval in milliseconds between queue polls.| 
|visibilityTimeout|0|The time interval between retries when processing of a message fails.| 
|batchSize|16|The number of queue messages that the Functions runtime retrieves simultaneously and processes in parallel. When the number being processed gets down to the `newBatchThreshold`, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function is `batchSize` plus `newBatchThreshold`. This limit applies separately to each queue-triggered function. <br><br>If you want to avoid parallel execution for messages received on one queue, you can set `batchSize` to 1. However, this setting eliminates concurrency only so long as your function app runs on a single virtual machine (VM). If the function app scales out to multiple VMs, each VM could run one instance of each queue-triggered function.<br><br>The maximum `batchSize` is 32. | 
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.| 
|newBatchThreshold|batchSize/2|Whenever the number of messages being processed concurrently gets down to this number, the runtime retrieves another batch.| 

## SendGrid

Configuration setting for the [SendGrind output binding](functions-bindings-sendgrid.md)

```json
{
    "sendGrid": {
        "from": "Contoso Group <admin@contoso.com>"
    }
}    
```

|Property  |Default | Description |
|---------|---------|---------| 
|from|n/a|The sender's email address across all functions.| 

## serviceBus

Configuration setting for [Service Bus triggers and bindings](functions-bindings-service-bus.md).

```json
{ "extensions":
    "serviceBus": {
      "maxConcurrentCalls": 16,
      "prefetchCount": 100,
      "autoRenewTimeout": "00:05:00",
      "autoComplete": true
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxConcurrentCalls|16|The maximum number of concurrent calls to the callback that the message pump should initiate. By default, the Functions runtime processes multiple messages concurrently. To direct the runtime to process only a single queue or topic message at a time, set `maxConcurrentCalls` to 1. | 
|prefetchCount|n/a|The default PrefetchCount that will be used by the underlying ServiceBusReceiver.| 
|autoRenewTimeout|00:05:00|The maximum duration within which the message lock will be renewed automatically.|
|autoComplete|true|When true, the trigger completes the message processing automatically on successful execution of the operation. When false, it is the responsibility of the function to complete the message before returning.|

## singleton

Configuration settings for Singleton lock behavior. For more information, see [GitHub issue about singleton support](https://github.com/Azure/azure-webjobs-sdk-script/issues/912).

```json
{
    "singleton": {
      "lockPeriod": "00:00:15",
      "listenerLockPeriod": "00:01:00",
      "listenerLockRecoveryPollingInterval": "00:01:00",
      "lockAcquisitionTimeout": "00:01:00",
      "lockAcquisitionPollingInterval": "00:00:03"
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|lockPeriod|00:00:15|The period that function level locks are taken for. The locks auto-renew.| 
|listenerLockPeriod|00:01:00|The period that listener locks are taken for.| 
|listenerLockRecoveryPollingInterval|00:01:00|The time interval used for listener lock recovery if a listener lock couldn't be acquired on startup.| 
|lockAcquisitionTimeout|00:01:00|The maximum amount of time the runtime tries to acquire a lock.| 
|lockAcquisitionPollingInterval|n/a|The interval between lock acquisition attempts.| 

## tracing

*Version 1.x*

Configuration settings for logs that you create by using a `TraceWriter` object. To learn more, see [C# Logging].

```json
{
    "tracing": {
      "consoleLevel": "verbose",
      "fileLoggingMode": "debugOnly"
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|consoleLevel|info|The tracing level for console logging. Options are: `off`, `error`, `warning`, `info`, and `verbose`.|
|fileLoggingMode|debugOnly|The tracing level for file logging. Options are `never`, `always`, `debugOnly`.| 

## watchDirectories

A set of [shared code directories](functions-reference-csharp.md#watched-directories) that should be monitored for changes.  Ensures that when code in these directories is changed, the changes are picked up by your functions.

```json
{
    "watchDirectories": [ "Shared" ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to update the host.json file](functions-reference.md#fileupdate)

> [!div class="nextstepaction"]
> [Persist settings in environment variables](functions-app-settings.md)

---
title: host.json reference for Azure Functions
description: Reference documentation for the Azure Functions host.json file.
services: functions
author: tdykstra
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 10/12/2017
ms.author: tdykstra
---

# host.json reference for Azure Functions

The *host.json* metadata file contains global configuration options that affect all functions for a function app. This article lists the settings that are available. The JSON schema is at http://json.schemastore.org/host.

There are other global configuration options in [app settings](functions-app-settings.md) and in the [local.settings.json](functions-run-local.md#local-settings-file) file.

## Sample host.json file

The following sample *host.json* file has all possible options specified.

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
    "eventHub": {
      "maxBatchSize": 64,
      "prefetchCount": 256,
      "batchCheckpointFrequency": 1
    },
    "functions": [ "QueueProcessor", "GitHubWebHook" ],
    "functionTimeout": "00:05:00",
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
    "serviceBus": {
      "maxConcurrentCalls": 16,
      "prefetchCount": 100,
      "autoRenewTimeout": "00:05:00"
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

Specifies how many function invocations are aggregated when [calculating metrics for Application Insights](functions-monitoring.md#configure-the-aggregator). 

```json
{
    "aggregator": {
        "batchSize": 1000,
        "flushTimeout": "00:00:30"
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|batchSize|1000|Maximum number of requests to aggregate.| 
|flushTimeout|00:00:30|Maximum time period to aggregate.| 

Function invocations are aggregated when the first of the two limits are reached.

## applicationInsights

Controls the [sampling feature in Application Insights](functions-monitoring.md#configure-sampling).

```json
{
    "applicationInsights": {
        "sampling": {
          "isEnabled": true,
          "maxTelemetryItemsPerSecond" : 5
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|isEnabled|false|Enables or disables sampling.| 
|maxTelemetryItemsPerSecond|5|The threshold at which sampling begins.| 

## eventHub

Configuration setting for [Event Hub triggers and bindings](functions-bindings-event-hubs.md).

```json
{
    "eventHub": {
      "maxBatchSize": 64,
      "prefetchCount": 256,
      "batchCheckpointFrequency": 1
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxBatchSize|64|The maximum event count received per receive loop.|
|prefetchCount|n/a|The default PrefetchCount that will be used by the underlying EventProcessorHost.| 
|batchCheckpointFrequency|1|The number of event batches to process before creating an EventHub cursor checkpoint.| 

## functions

A list of functions that the job host will run.  An empty array means run all functions.  Intended for use only when [running locally](functions-run-local.md). In function apps, use the *function.json* `disabled` property rather than this property in *host.json*.

```json
{
    "functions": [ "QueueProcessor", "GitHubWebHook" ]
}
```

## functionTimeout

Indicates the timeout duration for all functions. In Consumption plans, the valid range is from 1 second to 10 minutes, and the default value is 5 minutes. In App Service plans, there is no limit and the default value is null, which indicates no timeout.

```json
{
    "functionTimeout": "00:05:00"
}
```

## http

Configuration settings for [http triggers and bindings](functions-bindings-http-webhook.md).

```json
{
    "http": {
        "routePrefix": "api",
        "maxOutstandingRequests": 20,
        "maxConcurrentRequests": 10,
        "dynamicThrottlesEnabled": false
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|routePrefix|api|The route prefix that applies to all routes. Use an empty string to remove the default prefix. |
|maxOutstandingRequests|-1|The maximum number of outstanding requests that will be held at any given time (-1 means unbounded). The limit includes requests that are queued but have not started executing, as well as any in-progress executions. Any incoming requests over this limit are rejected with a 429 "Too Busy" response. Callers can use that response to employ time-based retry strategies. This setting controls only queuing that occurs within the job host execution path. Other queues, such as the ASP.NET request queue, are unaffected by this setting. |
|maxConcurrentRequests|-1|The maximum number of HTTP functions that will be executed in parallel (-1 means unbounded). For example, you could set a limit if your HTTP functions use too many system resources when concurrency is high. Or if your functions make outbound requests to a third-party service, those calls might need to be rate-limited.|
|dynamicThrottlesEnabled|false|Causes the request processing pipeline to periodically check system performance counters. Counters include connections, threads, processes, memory, and cpu. If any of the counters are over a built-in threshold (80%), requests are rejected with a 429 "Too Busy" response until the counter(s) return to normal levels.|

## id

The unique ID for a job host. Can be a lower case GUID with dashes removed. Required when running locally. When running in Azure Functions, an ID is generated automatically if `id` is omitted.

```json
{
    "id": "9f4ea53c5136457d883d685e57164f08"
}
```

## logger

Controls filtering for logs written by an [ILogger object](functions-monitoring.md#write-logs-in-c-functions) or by [context.log](functions-monitoring.md#write-logs-in-javascript-functions).

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
|batchSize|16|The number of queue messages to retrieve and process in parallel. The maximum is 32.| 
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.| 
|newBatchThreshold|batchSize/2|The threshold at which a new batch of messages are fetched.| 

## serviceBus

Configuration setting for [Service Bus triggers and bindings](functions-bindings-service-bus.md).

```json
{
    "serviceBus": {
      "maxConcurrentCalls": 16,
      "prefetchCount": 100,
      "autoRenewTimeout": "00:05:00"
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|maxConcurrentCalls|16|The maximum number of concurrent calls to the callback that the message pump should initiate. | 
|prefetchCount|n/a|The default PrefetchCount that will be used by the underlying MessageReceiver.| 
|autoRenewTimeout|00:05:00|The maximum duration within which the message lock will be renewed automatically.| 

## singleton

Configuration settings for Singleton lock behavior. For more information, see [GitHub issue about singleton support](https://github.com/Azure/azure-webjobs-sdk-script/issues/912).

```json
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
|lockAcquisitionTimeout|00:01:00|The maximum amount of time the runtime will try to acquire a lock.| 
|lockAcquisitionPollingInterval|n/a|The interval between lock acquisition attempts.| 

## tracing

Configuration settings for logs that you create by using a `TraceWriter` object. See [C# Logging](functions-reference-csharp.md#logging) and [Node.js Logging](functions-reference-node.md#writing-trace-output-to-the-console). 

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

## durableTask

[Task hub](durable-functions-task-hubs.md) name for [Durable Functions](durable-functions-overview.md).

```json
{
  "durableTask": {
    "HubName": "MyTaskHub"
  }
}
```

Task hub names must start with a letter and consist of only letters and numbers. If not specified, the default task hub name for a function app is **DurableFunctionsHub**. For  more information, see [Task hubs](durable-functions-task-hubs.md).


## Next steps

> [!div class="nextstepaction"]
> [Learn how to update the host.json file](functions-reference.md#fileupdate)

> [!div class="nextstepaction"]
> [See global settings in environment variables](functions-app-settings.md)

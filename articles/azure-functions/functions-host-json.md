---
title: host.json reference for Azure Functions 2.x
description: Reference documentation for the Azure Functions host.json file with the v2 runtime.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/08/2018
ms.author: glenga
---

# host.json reference for Azure Functions 2.x  

> [!div class="op_single_selector" title1="Select the version of the Azure Functions runtime you are using: "]
> * [Version 1](functions-host-json-v1.md)
> * [Version 2](functions-host-json.md)

The *host.json* metadata file contains global configuration options that affect all functions for a function app. This article lists the settings that are available for the v2 runtime.  

> [!NOTE]
> This article is for Azure Functions 2.x.  For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

Other function app configuration options are managed in your [app settings](functions-app-settings.md).

Some host.json settings are only used when running locally in the [local.settings.json](functions-run-local.md#local-settings-file) file.

## Sample host.json file

The following sample *host.json* files have all possible options specified.

```json
{
    "version": "2.0",
    "aggregator": {
        "batchSize": 1000,
        "flushTimeout": "00:00:30"
    },
    "extensions": {
        "cosmosDb": {},
        "durableTask": {},
        "eventHubs": {},
        "http": {},
        "queues": {},
        "sendGrid": {},
        "serviceBus": {}
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
    "logging": {
        "fileLoggingMode": "debugOnly",
        "logLevel": {
          "Function.MyFunction": "Information",
          "default": "None"
        },
        "applicationInsights": {
            "samplingSettings": {
              "isEnabled": true,
              "maxTelemetryItemsPerSecond" : 5
            }
        }
    },
    "singleton": {
      "lockPeriod": "00:00:15",
      "listenerLockPeriod": "00:01:00",
      "listenerLockRecoveryPollingInterval": "00:01:00",
      "lockAcquisitionTimeout": "00:01:00",
      "lockAcquisitionPollingInterval": "00:00:03"
    },
    "watchDirectories": [ "Shared", "Test" ],
    "managedDependency": {
        "enabled": true
    }
}
```

The following sections of this article explain each top-level property. All are optional unless otherwise indicated.

## aggregator

[!INCLUDE [aggregator](../../includes/functions-host-json-aggregator.md)]

## applicationInsights

This setting is a child of [logging](#logging).

Controls the [sampling feature in Application Insights](./functions-monitoring.md#configure-sampling).

```json
{
    "applicationInsights": {
        "samplingSettings": {
          "isEnabled": true,
          "maxTelemetryItemsPerSecond" : 5
        }
    }
}
```

> [!NOTE]
> Log sampling may cause some executions to not show up in the Application Insights monitor blade.

|Property  |Default | Description |
|---------|---------|---------| 
|isEnabled|true|Enables or disables sampling.| 
|maxTelemetryItemsPerSecond|5|The threshold at which sampling begins.| 

## cosmosDb

Configuration setting can be found in [Cosmos DB triggers and bindings](functions-bindings-cosmosdb-v2.md#host-json).

## durableTask

Configuration setting can be found in [bindings for Durable Functions](durable/durable-functions-bindings.md#host-json).

## eventHub

Configuration settings can be found in [Event Hub triggers and bindings](functions-bindings-event-hubs.md#host-json). 

## extensions

Property that returns an object that contains all of the binding-specific settings, such as [http](#http) and [eventHub](#eventhub).

## functions

A list of functions that the job host runs. An empty array means run all functions. Intended for use only when [running locally](functions-run-local.md). In function apps in Azure, you should instead follow the steps in [How to disable functions in Azure Functions](disable-function.md) to disable specific functions rather than using this setting.

```json
{
    "functions": [ "QueueProcessor", "GitHubWebHook" ]
}
```

## functionTimeout

Indicates the timeout duration for all functions. In a serverless Consumption plan, the valid range is from 1 second to 10 minutes, and the default value is 5 minutes. In an App Service plan, there is no overall limit and the default depends on the runtime version. In version 2.x, the default value for an App Service plan is 30 minutes. In version 1.x, it's *null*, which indicates no timeout.

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
|healthCheckWindow|2 minutes|A sliding time window used in conjunction with the `healthCheckThreshold` setting.| 
|healthCheckThreshold|6|Maximum number of times the health check can fail before a host recycle is initiated.| 
|counterThreshold|0.80|The threshold at which a performance counter will be considered unhealthy.| 

## http

Configuration settings can be found in [http triggers and bindings](functions-bindings-http-webhook.md).

[!INCLUDE [functions-host-json-http](../../includes/functions-host-json-http.md)]

## logging

Controls the logging behaviors of the function app, including Application Insights.

```json
"logging": {
    "fileLoggingMode": "debugOnly",
    "logLevel": {
      "Function.MyFunction": "Information",
      "default": "None"
    },
    "console": {
        ...
    },
    "applicationInsights": {
        ...
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|fileLoggingMode|debugOnly|Defines what level of file logging is enabled.  Options are `never`, `always`, `debugOnly`. |
|logLevel|n/a|Object that defines the log category filtering for functions in the app. Version 2.x follows the ASP.NET Core layout for log category filtering. This lets you filter logging for specific functions. For more information, see [Log filtering](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#log-filtering) in the ASP.NET Core documentation. |
|console|n/a| The [console](#console) logging setting. |
|applicationInsights|n/a| The [applicationInsights](#applicationinsights) setting. |

## console

This setting is a child of [logging](#logging). It controls the console logging when not in debugging mode.

```json
{
    "logging": {
    ...
        "console": {
          "isEnabled": "false"
        },
    ...
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|isEnabled|false|Enables or disables console logging.| 

## queues

Configuration settings can be found in [Storage queue triggers and bindings](functions-bindings-storage-queue.md#host-json).  

## sendGrid

Configuration setting can be found in [SendGrid triggers and bindings](functions-bindings-sendgrid.md#host-json).

## serviceBus

Configuration setting can be found in [Service Bus triggers and bindings](functions-bindings-service-bus.md#host-json).

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
|lockAcquisitionTimeout|00:01:00|The maximum amount of time the runtime will try to acquire a lock.| 
|lockAcquisitionPollingInterval|n/a|The interval between lock acquisition attempts.| 

## version

The version string `"version": "2.0"` is required for a function app that targets the v2 runtime.

## watchDirectories

A set of [shared code directories](functions-reference-csharp.md#watched-directories) that should be monitored for changes.  Ensures that when code in these directories is changed, the changes are picked up by your functions.

```json
{
    "watchDirectories": [ "Shared" ]
}
```

## managedDependency

Managed dependency is a preview feature that is currently only supported with PowerShell based functions. It enables dependencies to be automatically managed by the service. When the enabled property is set to true, the [requirements.psd1](functions-reference-powershell.md#dependency-management) file will be processed. Dependencies will be updated when any minor versions are released.

```json
{
    "managedDependency": {
        "enabled": true
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to update the host.json file](functions-reference.md#fileupdate)

> [!div class="nextstepaction"]
> [See global settings in environment variables](functions-app-settings.md)

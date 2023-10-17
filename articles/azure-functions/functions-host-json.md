---
title: host.json reference for Azure Functions 2.x
description: Reference documentation for the Azure Functions host.json file with the v2 runtime.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 07/10/2023
---

# host.json reference for Azure Functions 2.x and later 

> [!div class="op_single_selector" title1="Select the version of the Azure Functions runtime you are using: "]
> * [Version 1](functions-host-json-v1.md)
> * [Version 2+](functions-host-json.md)

The host.json metadata file contains configuration options that affect all functions in a function app instance. This article lists the settings that are available starting with version 2.x of the Azure Functions runtime.  

> [!NOTE]
> This article is for Azure Functions 2.x and later versions.  For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

Other function app configuration options are managed depending on where the function app runs:

+ **Deployed to Azure**: in your [application settings](functions-app-settings.md) 
+ **On your local computer**: in the [local.settings.json](functions-develop-local.md#local-settings-file) file.

Configurations in host.json related to bindings are applied equally to each function in the function app. 

You can also [override or apply settings per environment](#override-hostjson-values) using application settings.

## Sample host.json file

The following sample *host.json* file for version 2.x+ has all possible options specified (excluding any that are for internal use only).

```json
{
    "version": "2.0",
    "aggregator": {
        "batchSize": 1000,
        "flushTimeout": "00:00:30"
    },
    "concurrency": { 
            "dynamicConcurrencyEnabled": true, 
            "snapshotPersistenceEnabled": true 
        },
    "extensions": {
        "blobs": {},
        "cosmosDb": {},
        "durableTask": {},
        "eventHubs": {},
        "http": {},
        "queues": {},
        "sendGrid": {},
        "serviceBus": {}
    },
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[1.*, 2.0.0)"
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
              "maxTelemetryItemsPerSecond" : 20,
              "evaluationInterval": "01:00:00",
              "initialSamplingPercentage": 100.0, 
              "samplingPercentageIncreaseTimeout" : "00:00:01",
              "samplingPercentageDecreaseTimeout" : "00:00:01",
              "minSamplingPercentage": 0.1,
              "maxSamplingPercentage": 100.0,
              "movingAverageRatio": 1.0,
              "excludedTypes" : "Dependency;Event",
              "includedTypes" : "PageView;Trace"
            },
            "dependencyTrackingOptions": {
                "enableSqlCommandTextInstrumentation": true
            },
            "enableLiveMetrics": true,
            "enableDependencyTracking": true,
            "enablePerformanceCountersCollection": true,            
            "httpAutoCollectionOptions": {
                "enableHttpTriggerExtendedInfoCollection": true,
                "enableW3CDistributedTracing": true,
                "enableResponseHeaderInjection": true
            },
            "snapshotConfiguration": {
                "agentEndpoint": null,
                "captureSnapshotMemoryWeight": 0.5,
                "failedRequestLimit": 3,
                "handleUntrackedExceptions": true,
                "isEnabled": true,
                "isEnabledInDeveloperMode": false,
                "isEnabledWhenProfiling": true,
                "isExceptionSnappointsEnabled": false,
                "isLowPrioritySnapshotUploader": true,
                "maximumCollectionPlanSize": 50,
                "maximumSnapshotsRequired": 3,
                "problemCounterResetInterval": "24:00:00",
                "provideAnonymousTelemetry": true,
                "reconnectInterval": "00:15:00",
                "shadowCopyFolder": null,
                "shareUploaderProcess": true,
                "snapshotInLowPriorityThread": true,
                "snapshotsPerDayLimit": 30,
                "snapshotsPerTenMinutesLimit": 1,
                "tempFolder": null,
                "thresholdForSnapshotting": 1,
                "uploaderProxy": null
            }
        }
    },
    "managedDependency": {
        "enabled": true
    },
    "singleton": {
      "lockPeriod": "00:00:15",
      "listenerLockPeriod": "00:01:00",
      "listenerLockRecoveryPollingInterval": "00:01:00",
      "lockAcquisitionTimeout": "00:01:00",
      "lockAcquisitionPollingInterval": "00:00:03"
    },
    "watchDirectories": [ "Shared", "Test" ],
    "watchFiles": [ "myFile.txt" ]
}
```

The following sections of this article explain each top-level property. All are optional unless otherwise indicated.

## aggregator

[!INCLUDE [aggregator](../../includes/functions-host-json-aggregator.md)]

## applicationInsights

This setting is a child of [logging](#logging).

Controls options for Application Insights, including [sampling options](./configure-monitoring.md#configure-sampling).

For the complete JSON structure, see the earlier [example host.json file](#sample-hostjson-file).

> [!NOTE]
> Log sampling may cause some executions to not show up in the Application Insights monitor blade. To avoid log sampling, add `excludedTypes: "Request"` to the `samplingSettings` value.

| Property | Default | Description |
| --------- | --------- | --------- | 
| samplingSettings | n/a | See [applicationInsights.samplingSettings](#applicationinsightssamplingsettings). |
| dependencyTrackingOptions | n/a | See [applicationInsights.dependencyTrackingOptions](#applicationinsightsdependencytrackingoptions). |
| enableLiveMetrics | true | Enables live metrics collection. |
| enableDependencyTracking | true | Enables dependency tracking. |
| enablePerformanceCountersCollection | true | Enables Kudu performance counters collection. |
| liveMetricsInitializationDelay | 00:00:15 | For internal use only. |
| httpAutoCollectionOptions | n/a | See [applicationInsights.httpAutoCollectionOptions](#applicationinsightshttpautocollectionoptions). |
| snapshotConfiguration | n/a | See [applicationInsights.snapshotConfiguration](#applicationinsightssnapshotconfiguration). |

### applicationInsights.samplingSettings

For more information about these settings, see [Sampling in Application Insights](../azure-monitor/app/sampling.md). 

|Property | Default | Description |
| --------- | --------- | --------- | 
| isEnabled | true | Enables or disables sampling. | 
| maxTelemetryItemsPerSecond | 20 | The target number of telemetry items logged per second on each server host. If your app runs on many hosts, reduce this value to remain within your overall target rate of traffic. | 
| evaluationInterval | 01:00:00 | The interval at which the current rate of telemetry is reevaluated. Evaluation is performed as a moving average. You might want to shorten this interval if your telemetry is liable to sudden bursts. |
| initialSamplingPercentage| 100.0 | The initial sampling percentage applied at the start of the sampling process to dynamically vary the percentage. Don't reduce value while you're debugging. |
| samplingPercentageIncreaseTimeout | 00:00:01 | When the sampling percentage value changes, this property determines how soon afterwards Application Insights is allowed to raise sampling percentage again to capture more data. |
| samplingPercentageDecreaseTimeout | 00:00:01 | When the sampling percentage value changes, this property determines how soon afterwards Application Insights is allowed to lower sampling percentage again to capture less data. |
| minSamplingPercentage | 0.1 | As sampling percentage varies, this property determines the minimum allowed sampling percentage. |
| maxSamplingPercentage | 100.0 | As sampling percentage varies, this property determines the maximum allowed sampling percentage. |
| movingAverageRatio | 1.0 | In the calculation of the moving average, the weight assigned to the most recent value. Use a value equal to or less than 1. Smaller values make the algorithm less reactive to sudden changes. |
| excludedTypes | null | A semi-colon delimited list of types that you don't want to be sampled. Recognized types are: `Dependency`, `Event`, `Exception`, `PageView`, `Request`, and `Trace`. All instances of the specified types are transmitted; the types that aren't specified are sampled. |
| includedTypes | null | A semi-colon delimited list of types that you want to be sampled; an empty list implies all types. Type listed in `excludedTypes` override types listed here. Recognized types are: `Dependency`, `Event`, `Exception`, `PageView`, `Request`, and `Trace`. Instances of the specified types are sampled; the types that aren't specified or implied are transmitted without sampling. |

### applicationInsights.httpAutoCollectionOptions

|Property | Default | Description |
| --------- | --------- | --------- | 
| enableHttpTriggerExtendedInfoCollection | true | Enables or disables extended HTTP request information for HTTP triggers: incoming request correlation headers, multi-instrumentation keys support, HTTP method, path, and response. |
| enableW3CDistributedTracing | true | Enables or disables support of W3C distributed tracing protocol (and turns on legacy correlation schema). Enabled by default if `enableHttpTriggerExtendedInfoCollection` is true. If `enableHttpTriggerExtendedInfoCollection` is false, this flag applies to outgoing requests only, not incoming requests. |
| enableResponseHeaderInjection | true | Enables or disables injection of multi-component correlation headers into responses. Enabling injection allows Application Insights to construct an Application Map to  when several instrumentation keys are used. Enabled by default if `enableHttpTriggerExtendedInfoCollection` is true. This setting doesn't apply if `enableHttpTriggerExtendedInfoCollection` is false. |

### applicationInsights.dependencyTrackingOptions

|Property | Default | Description |
| --------- | --------- | --------- | 
| enableSqlCommandTextInstrumentation | false | Enables collection of the full text of SQL queries, which is disabled by default. For more information on collecting SQL query text, see [Advanced SQL tracking to get full SQL query](../azure-monitor/app/asp-net-dependencies.md#advanced-sql-tracking-to-get-full-sql-query). |

### applicationInsights.snapshotConfiguration

For more information on snapshots, see [Debug snapshots on exceptions in .NET apps](../azure-monitor/app/snapshot-debugger.md) and [Troubleshoot problems enabling Application Insights Snapshot Debugger or viewing snapshots](/troubleshoot/azure/azure-monitor/app-insights/snapshot-debugger-troubleshoot).

|Property | Default | Description |
| --------- | --------- | --------- | 
| agentEndpoint | null | The endpoint used to connect to the Application Insights Snapshot Debugger service. If null, a default endpoint is used. |
| captureSnapshotMemoryWeight | 0.5 | The weight given to the current process memory size when checking if there's enough memory to take a snapshot. The expected value is a greater than 0 proper fraction (0 < CaptureSnapshotMemoryWeight < 1). |
| failedRequestLimit | 3 | The limit on the number of failed requests to request snapshots before the telemetry processor is disabled.|
| handleUntrackedExceptions | true | Enables or disables tracking of exceptions that aren't tracked by Application Insights telemetry. |
| isEnabled | true | Enables or disables snapshot collection | 
| isEnabledInDeveloperMode | false | Enables or disables snapshot collection is enabled in developer mode. |
| isEnabledWhenProfiling | true | Enables or disables snapshot creation even if the Application Insights Profiler is collecting a detailed profiling session. |
| isExceptionSnappointsEnabled | false | Enables or disables filtering of exceptions. |
| isLowPrioritySnapshotUploader | true | Determines whether to run the SnapshotUploader process at below normal priority. |
| maximumCollectionPlanSize | 50 | The maximum number of problems that we can track at any time in a range from one to 9999. |
| maximumSnapshotsRequired | 3 | The maximum number of snapshots collected for a single problem, in a range from one to 999. A problem may be thought of as an individual throw statement in your application. Once the number of snapshots collected for a problem reaches this value, no more snapshots will be collected for that problem until problem counters are reset (see `problemCounterResetInterval`) and the `thresholdForSnapshotting` limit is reached again. |
| problemCounterResetInterval | 24:00:00 | How often to reset the problem counters in a range from one minute to seven days. When this interval is reached, all problem counts are reset to zero. Existing problems that have already reached the threshold for doing snapshots, but haven't yet generated the number of snapshots in `maximumSnapshotsRequired`, remain active. |
| provideAnonymousTelemetry | true | Determines whether to send anonymous usage and error telemetry to Microsoft. This telemetry may be used if you contact Microsoft to help troubleshoot problems with the Snapshot Debugger. It is also used to monitor usage patterns. |
| reconnectInterval | 00:15:00 | How often we reconnect to the Snapshot Debugger endpoint. Allowable range is one minute to one day. |
| shadowCopyFolder | null | Specifies the folder to use for shadow copying binaries. If not set, the folders specified by the following environment variables are tried in order: Fabric_Folder_App_Temp, LOCALAPPDATA, APPDATA, TEMP. |
| shareUploaderProcess | true | If true, only one instance of SnapshotUploader will collect and upload snapshots for multiple apps that share the InstrumentationKey. If set to false, the SnapshotUploader will be unique for each (ProcessName, InstrumentationKey) tuple. |
| snapshotInLowPriorityThread | true | Determines whether or not to process snapshots in a low IO priority thread. Creating a snapshot is a fast operation but, in order to upload a snapshot to the Snapshot Debugger service, it must first be written to disk as a minidump. That happens in the SnapshotUploader process. Setting this value to true uses low-priority IO to write the minidump, which won't compete with your application for resources. Setting this value to false speeds up minidump creation at the expense of slowing down your application. |
| snapshotsPerDayLimit | 30 | The maximum number of snapshots allowed in one day (24 hours). This limit is also enforced on the Application Insights service side. Uploads are rate limited to 50 per day per application (that is, per instrumentation key). This value helps prevent creating additional snapshots that will eventually be rejected during upload. A value of zero removes the limit entirely, which isn't recommended. |
| snapshotsPerTenMinutesLimit | 1 | The maximum number of snapshots allowed in 10 minutes. Although there is no upper bound on this value, exercise caution increasing it on production workloads because it could impact the performance of your application. Creating a snapshot is fast, but creating a minidump of the snapshot and uploading it to the Snapshot Debugger service is a much slower operation that will compete with your application for resources (both CPU and I/O). |
| tempFolder | null | Specifies the folder to write minidumps and uploader log files. If not set, then *%TEMP%\Dumps* is used. |
| thresholdForSnapshotting | 1 | How many times Application Insights needs to see an exception before it asks for snapshots. |
| uploaderProxy | null | Overrides the proxy server used in the Snapshot Uploader process. You may need to use this setting if your application connects to the internet via a proxy server. The Snapshot Collector runs within your application's process and will use the same proxy settings. However, the Snapshot Uploader runs as a separate process and you may need to configure the proxy server manually. If this value is null, then Snapshot Collector will attempt to autodetect the proxy's address by examining `System.Net.WebRequest.DefaultWebProxy` and passing on the value to the Snapshot Uploader. If this value isn't null, then autodetection isn't used and the proxy server specified here will be used in the Snapshot Uploader. |

## blobs

Configuration settings can be found in [Storage blob triggers and bindings](functions-bindings-storage-blob.md#hostjson-settings).  

## console

This setting is a child of [logging](#logging). It controls the console logging when not in debugging mode.

```json
{
    "logging": {
    ...
        "console": {
          "isEnabled": false,
          "DisableColors": true
        },
    ...
    }
}
```

|Property  |Default | Description |
|---------|---------|---------| 
|DisableColors|false| Suppresses log formatting in the container logs on Linux. Set to true if you are seeing unwanted ANSI control characters in the container logs when running on Linux. |
|isEnabled|false|Enables or disables console logging.| 

## Azure Cosmos DB

Configuration settings can be found in [Azure Cosmos DB triggers and bindings](functions-bindings-cosmosdb-v2.md#hostjson-settings).

## customHandler

Configuration settings for a custom handler. For more information, see [Azure Functions custom handlers](functions-custom-handlers.md#configuration).

```json
"customHandler": {
  "description": {
    "defaultExecutablePath": "server",
    "workingDirectory": "handler",
    "arguments": [ "--port", "%FUNCTIONS_CUSTOMHANDLER_PORT%" ]
  },
  "enableForwardingHttpRequest": false
}
```

|Property | Default | Description |
| --------- | --------- | --------- |
| defaultExecutablePath | n/a | The executable to start as the custom handler process. It is a required setting when using custom handlers and its value is relative to the function app root. |
| workingDirectory | *function app root* | The working directory in which to start the custom handler process. It is an optional setting and its value is relative to the function app root. |
| arguments | n/a | An array of command line arguments to pass to the custom handler process. |
| enableForwardingHttpRequest | false | If set, all functions that consist of only an HTTP trigger and HTTP output is forwarded the original HTTP request instead of the custom handler [request payload](functions-custom-handlers.md#request-payload). |

## durableTask

Configuration setting can be found in [bindings for Durable Functions](durable/durable-functions-bindings.md#host-json).

## concurrency

Enables dynamic concurrency for specific bindings in your function app. For more information, see [Dynamic concurrency](./functions-concurrency.md#dynamic-concurrency). 

```json
    { 
        "concurrency": { 
            "dynamicConcurrencyEnabled": true, 
            "snapshotPersistenceEnabled": true 
        } 
    } 
```

|Property | Default | Description |
| --------- | --------- | --------- |
| dynamicConcurrencyEnabled | false | Enables dynamic concurrency behaviors for all triggers supported by this feature, which is off by default. |
| snapshotPersistenceEnabled | true | Learned concurrency values are periodically persisted to storage so new instances start from those values instead of starting from 1 and having to redo the learning. |

## eventHub

Configuration settings can be found in [Event Hub triggers and bindings](functions-bindings-event-hubs.md#host-json). 

## extensions

Property that returns an object that contains all of the binding-specific settings, such as [http](#http) and [eventHub](#eventhub).

## extensionBundle 

Extension bundles let you add a compatible set of Functions binding extensions to your function app. To learn more, see [Extension bundles for local development](functions-bindings-register.md#extension-bundles).

[!INCLUDE [functions-extension-bundles-json](../../includes/functions-extension-bundles-json.md)]

## functions

A list of functions that the job host runs. An empty array means run all functions. Intended for use only when [running locally](functions-run-local.md). In function apps in Azure, you should instead follow the steps in [How to disable functions in Azure Functions](disable-function.md) to disable specific functions rather than using this setting.

```json
{
    "functions": [ "QueueProcessor", "GitHubWebHook" ]
}
```

## functionTimeout

Indicates the timeout duration for all function executions. It follows the timespan string format. 

| Plan type | Default (min) | Maximum (min) |
| -- | -- | -- |
| Consumption | 5 | 10 |
| Premium<sup>1</sup> | 30 | -1 (unbounded)<sup>2</sup> |
| Dedicated (App Service) | 30 | -1 (unbounded)<sup>2</sup> |

<sup>1</sup> Premium plan execution is only guaranteed for 60 minutes, but technically unbounded.   
<sup>2</sup> A value of `-1` indicates unbounded execution, but keeping a fixed upper bound is recommended.

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

Configuration settings can be found in [http triggers and bindings](functions-bindings-http-webhook.md#hostjson-settings).

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
|fileLoggingMode|debugOnly|Determines the file logging behavior when running in Azure. Options are `never`, `always`, and `debugOnly`. This setting isn't used when running locally. When possible, you should use Application Insights when debugging your functions in Azure. Using `always` negatively impacts your app's cold start behavior and data throughput. The default `debugOnly` setting generates log files when you are debugging using the Azure portal. |
|logLevel|n/a|Object that defines the log category filtering for functions in the app. This setting lets you filter logging for specific functions. For more information, see [Configure log levels](configure-monitoring.md#configure-log-levels). |
|console|n/a| The [console](#console) logging setting. |
|applicationInsights|n/a| The [applicationInsights](#applicationinsights) setting. |

## managedDependency

Managed dependency is a feature that is currently only supported with PowerShell based functions. It enables dependencies to be automatically managed by the service. When the `enabled` property is set to `true`, the `requirements.psd1` file is processed. Dependencies are updated when any minor versions are released. For more information, see [Managed dependency](functions-reference-powershell.md#dependency-management) in the PowerShell article.

```json
{
    "managedDependency": {
        "enabled": true
    }
}
```

## queues

Configuration settings can be found in [Storage queue triggers and bindings](functions-bindings-storage-queue.md#host-json).  

## sendGrid

Configuration setting can be found in [SendGrid triggers and bindings](functions-bindings-sendgrid.md#host-json).

## serviceBus

Configuration setting can be found in [Service Bus triggers and bindings](functions-bindings-service-bus.md).

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

This value indicates the schema version of host.json. The version string `"version": "2.0"` is required for a function app that targets the v2 runtime, or a later version. There are no host.json schema changes between v2 and v3.

## watchDirectories

A set of [shared code directories](functions-reference-csharp.md#watched-directories) that should be monitored for changes.  Ensures that when code in these directories is changed, the changes are picked up by your functions.

```json
{
    "watchDirectories": [ "Shared" ]
}
```

## watchFiles

An array of one or more names of files that are monitored for changes that require your app to restart.  This guarantees that when code in these files are changed, the updates are picked up by your functions.

```json
{
    "watchFiles": [ "myFile.txt" ]
}
```

## Override host.json values

There may be instances where you wish to configure or modify specific settings in a host.json file for a specific environment, without changing the host.json file itself. You can override specific host.json values by creating an equivalent value as an application setting. When the runtime finds an application setting in the format `AzureFunctionsJobHost__path__to__setting`, it overrides the equivalent host.json setting located at `path.to.setting` in the JSON. When expressed as an application setting, the dot (`.`) used to indicate JSON hierarchy is replaced by a double underscore (`__`). 

For example, say that you wanted to disable Application Insight sampling when running locally. If you changed the local host.json file to disable Application Insights, this change might get pushed to your production app during deployment. The safer way to do this is to instead create an application setting as `"AzureFunctionsJobHost__logging__applicationInsights__samplingSettings__isEnabled":"false"` in the `local.settings.json` file. You can see this in the following `local.settings.json` file, which doesn't get published:

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "{storage-account-connection-string}",
        "FUNCTIONS_WORKER_RUNTIME": "{language-runtime}",
        "AzureFunctionsJobHost__logging__applicationInsights__samplingSettings__isEnabled":"false"
    }
}
```

Overriding host.json settings using environment variables follows the ASP.NET Core naming conventions. When the element structure includes an array, the numeric array index should be treated as an additional element name in this path. For more information, see [Naming of environment variables](/aspnet/core/fundamentals/configuration/#naming-of-environment-variables). 

## Next steps

> [!div class="nextstepaction"]
> [Learn how to update the host.json file](functions-reference.md#fileupdate)

> [!div class="nextstepaction"]
> [See global settings in environment variables](functions-app-settings.md)

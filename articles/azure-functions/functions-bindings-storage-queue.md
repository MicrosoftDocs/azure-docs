---
title: Azure Queue storage trigger and bindings for Azure Functions overview
description: Understand how to use the Azure Queue storage trigger and output binding in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/18/2020
ms.author: cshoe
ms.custom: cc996988-fb4f-47
---

# Azure Queue storage trigger and bindings for Azure Functions overview

Azure Functions can run as new Azure Queue storage messages are created and can write queue messages within a function.

| Action | Type |
|---------|---------|
| Run a function as queue storage data changes | [Trigger](./functions-bindings-storage-queue-trigger.md) |
| Write queue storage messages |[Output binding](./functions-bindings-storage-queue-output.md) |

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

#### Storage extension 5.x and higher

A new version of the Storage bindings extension is available as a [preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/5.0.0-beta.3). This preview introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For .NET applications, it also changes the types that you can bind to, replacing the types from `WindowsAzure.Storage` and `Microsoft.Azure.Storage` with newer types from [Azure.Storage.Queues](/dotnet/api/azure.storage.queues).

> [!NOTE]
> The preview package is not included in an extension bundle and must be installed manually. For .NET apps, add a reference to the package. For all other app types, see [Update your extensions].

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

<a name="host-json"></a>  

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example *host.json* file below contains only the version 2.x+ settings for this binding. For more information about global configuration settings in versions 2.x and beyond, see [host.json reference for Azure Functions](functions-host-json.md).

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

```json
{
    "version": "2.0",
    "extensions": {
        "queues": {
            "maxPollingInterval": "00:00:02",
            "visibilityTimeout" : "00:00:30",
            "batchSize": 16,
            "maxDequeueCount": 5,
            "newBatchThreshold": 8,
            "messageEncoding": "base64"
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|maxPollingInterval|00:01:00|The maximum interval between queue polls. The minimum interval is 00:00:00.100 (100 ms). Intervals increment up to `maxPollingInterval`. The default value of `maxPollingInterval` is 00:01:00 (1 min). `maxPollingInterval` must not be less than 00:00:00.100 (100 ms). In Functions 2.x and later, the data type is a `TimeSpan`. In Functions 1.x, it is in milliseconds.|
|visibilityTimeout|00:00:00|The time interval between retries when processing of a message fails. |
|batchSize|16|The number of queue messages that the Functions runtime retrieves simultaneously and processes in parallel. When the number being processed gets down to the `newBatchThreshold`, the runtime gets another batch and starts processing those messages. So the maximum number of concurrent messages being processed per function is `batchSize` plus `newBatchThreshold`. This limit applies separately to each queue-triggered function. <br><br>If you want to avoid parallel execution for messages received on one queue, you can set `batchSize` to 1. However, this setting eliminates concurrency as long as your function app runs only on a single virtual machine (VM). If the function app scales out to multiple VMs, each VM could run one instance of each queue-triggered function.<br><br>The maximum `batchSize` is 32. |
|maxDequeueCount|5|The number of times to try processing a message before moving it to the poison queue.|
|newBatchThreshold|N*batchSize/2|Whenever the number of messages being processed concurrently gets down to this number, the runtime retrieves another batch.<br><br>`N` represents the number of vCPUs available when running on App Service or Premium Plans. Its value is `1` for the Consumption Plan.|
|messageEncoding|base64| This setting is only available in [extension version 5.0.0 and higher](#storage-extension-5x-and-higher). It represents the encoding format for messages. Valid values are `base64` and `none`.|

## Next steps

- [Run a function as queue storage data changes (Trigger)](./functions-bindings-storage-queue-trigger.md)
- [Write queue storage messages (Output binding)](./functions-bindings-storage-queue-output.md)

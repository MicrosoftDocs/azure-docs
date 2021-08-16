---
title: Azure Service Bus bindings for Azure Functions
description: Learn to send Azure Service Bus triggers and bindings in Azure Functions.
author: craigshoemaker

ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 02/19/2020
ms.author: cshoe
ms.custom: fasttrack-edit
---

# Azure Service Bus bindings for Azure Functions

Azure Functions integrates with [Azure Service Bus](https://azure.microsoft.com/services/service-bus) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Service Bus allows you to build functions that react to and send queue or topic messages.

| Action | Type |
|---------|---------|
| Run a function when a Service Bus queue or topic message is created | [Trigger](./functions-bindings-service-bus-trigger.md) |
| Send Azure Service Bus messages |[Output binding](./functions-bindings-service-bus-output.md) |

## Add to your Functions app

> [!NOTE]
> The Service Bus binding doesn't currently support authentication using a managed identity. Instead, please use a [Service Bus shared access signature](../service-bus-messaging/service-bus-authentication-and-authorization.md#shared-access-signature).

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 4.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus/
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

#### Service Bus extension 5.x and higher

A new version of the Service Bus bindings extension is available as a [preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus/5.0.0-beta.2). This preview introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For .NET applications, it also changes the types that you can bind to, replacing the types from `Microsoft.ServiceBus.Messaging` and `Microsoft.Azure.ServiceBus` with newer types from [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus).

> [!NOTE]
> The preview package is not included in an extension bundle and must be installed manually. For .NET apps, add a reference to the package. For all other app types, see [Update your extensions].

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.


<a name="host-json"></a>  

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example host.json file below contains only the settings for this binding. For more information about global configuration settings, see [host.json reference for Azure Functions version](functions-host-json.md).

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "prefetchCount": 100,
            "messageHandlerOptions": {
                "autoComplete": true,
                "maxConcurrentCalls": 32,
                "maxAutoRenewDuration": "00:05:00"
            },
            "sessionHandlerOptions": {
                "autoComplete": false,
                "messageWaitTimeout": "00:00:30",
                "maxAutoRenewDuration": "00:55:00",
                "maxConcurrentSessions": 16
            },
            "batchOptions": {
                "maxMessageCount": 1000,
                "operationTimeout": "00:01:00"
                "autoComplete": true
            }
        }
    }
}
```

If you have `isSessionsEnabled` set to `true`, the `sessionHandlerOptions` is honored.  If you have `isSessionsEnabled` set to `false`, the `messageHandlerOptions` is honored.

|Property  |Default | Description |
|---------|---------|---------|
|prefetchCount|0|Gets or sets the number of messages that the message receiver can simultaneously request.|
|messageHandlerOptions.maxAutoRenewDuration|00:05:00|The maximum duration within which the message lock will be renewed automatically.|
|messageHandlerOptions.autoComplete|true|Whether the trigger should automatically call complete after processing, or if the function code will manually call complete.<br><br>Setting to `false` is only supported in C#.<br><br>If set to `true`, the trigger completes the message automatically if the function execution completes successfully, and abandons the message otherwise.<br><br>When set to `false`, you are responsible for calling [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) methods to complete, abandon, or deadletter the message. If an exception is thrown (and none of the `MessageReceiver` methods are called), then the lock remains. Once the lock expires, the message is re-queued with the `DeliveryCount` incremented and the lock is automatically renewed.<br><br>In non-C# functions, exceptions in the function results in the runtime calls `abandonAsync` in the background. If no exception occurs, then `completeAsync` is called in the background. |
|messageHandlerOptions.maxConcurrentCalls|16|The maximum number of concurrent calls to the callback that the message pump should initiate per scaled instance. By default, the Functions runtime processes multiple messages concurrently.|
|sessionHandlerOptions.maxConcurrentSessions|2000|The maximum number of sessions that can be handled concurrently per scaled instance.|
|batchOptions.maxMessageCount|1000| The maximum number of messages sent to the function when triggered. |
|batchOptions.operationTimeout|00:01:00| A time span value expressed in `hh:mm:ss`. |
|batchOptions.autoComplete|true| See the above description for `messageHandlerOptions.autoComplete`. |

### Additional settings for version 5.x+

The example host.json file below contains only the settings for version 5.0.0 and higher of the Service Bus extension.

```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "retryOptions":{
                "mode": "exponential",
                "tryTimeout": "00:01:00",
                "delay": "00:00:00.80",
                "maxDelay": "00:01:00",
                "maxRetries": 3
            },
            "prefetchCount": 0,
            "autoCompleteMessages": true,
            "maxAutoLockRenewalDuration": "00:05:00",
            "maxConcurrentCalls": 16,
            "maxConcurrentSessions": 8,
            "maxMessages": 1000,
            "sessionIdleTimeout": "00:01:00"
        }
    }
}
```

When using service bus extension version 5.x and higher, the following global configuration settings are supported in addition to the 2.x settings in `ServiceBusOptions`.

|Property  |Default | Description |
|---------|---------|---------|
|prefetchCount|0|Gets or sets the number of messages that the message receiver can simultaneously request.|
|autoCompleteMessages|true|Determines whether or not to automatically complete messages after successful execution of the function and should be used in place of the `autoComplete` configuration setting.|
|maxAutoLockRenewalDuration|00:05:00|This should be used in place of `maxAutoRenewDuration`|
|maxConcurrentCalls|16|The maximum number of concurrent calls to the callback that the message pump should initiate per scaled instance. By default, the Functions runtime processes multiple messages concurrently.|
|maxConcurrentSessions|8|The maximum number of sessions that can be handled concurrently per scaled instance.|
|maxMessages|1000|The maximum number of messages that will be passed to each function call. This only applies for functions that receive a batch of messages.|
|sessionIdleTimeout|n/a|The maximum amount of time to wait for a message to be received for the currently active session. After this time has elapsed, the processor will close the session and attempt to process another session.|

### Retry settings

In addition to the above configuration properties when using version 5.x and higher of the service bus extension, you can also configure `RetryOptions` from within the `ServiceBusOptions`. These settings determine whether a failed operation should be retried, and, if so, the amount of time to wait between retry attempts. The options also control the amount of time allowed for receiving messages and other interactions with the Service Bus service.

|Property  |Default | Description |
|---------|---------|---------|
|mode|Exponential|The approach to use for calculating retry delays. The default exponential mode will retry attempts with a delay based on a back-off strategy where each attempt will increase the duration that it waits before retrying. The `Fixed` mode will retry attempts at fixed intervals with each delay having a consistent duration.|
|tryTimeout|00:01:00|The maximum duration to wait for an operation per attempt.|
|delay|00:00:00.80|The delay or back-off factor to apply between retry attempts.|
|maxDelay|00:01:00|The maximum delay to allow between retry attempts|
|maxRetries|3|The maximum number of retry attempts before considering the associated operation to have failed.|

---

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)

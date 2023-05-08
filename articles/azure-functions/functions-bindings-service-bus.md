---
title: Azure Service Bus bindings for Azure Functions
description: Learn to send Azure Service Bus triggers and bindings in Azure Functions.
ms.assetid: daedacf0-6546-4355-a65c-50873e74f66b
ms.topic: reference
ms.date: 12/12/2022
ms.custom: fasttrack-edit
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Service Bus bindings for Azure Functions

Azure Functions integrates with [Azure Service Bus](https://azure.microsoft.com/services/service-bus) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Service Bus allows you to build functions that react to and send queue or topic messages.

| Action | Type |
|---------|---------|
| Run a function when a Service Bus queue or topic message is created | [Trigger](./functions-bindings-service-bus-trigger.md) |
| Send Azure Service Bus messages |[Output binding](./functions-bindings-service-bus-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.servicebus).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x, or a later version.

---

The functionality of the extension varies depending on the extension version:

# [Extension 5.x+](#tab/extensionv5/in-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus).

This extension version is available by installing the [NuGet package], version 5.x or later.

# [Functions 2.x+](#tab/functionsv2/in-process)

Working with the trigger and bindings requires that you reference the appropriate NuGet package. Install NuGet package, versions < 5.x. 

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

# [Extension 5.x+](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus).

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.ServiceBus), version 5.x.

# [Functions 2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.ServiceBus), version 4.x.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support the isolated worker process.

# [Extension 5.x+](#tab/extensionv5/csharp-script)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This version allows you to bind to types from [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus).

This extension is available from the extension bundle v3 by adding the following lines in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

# [Functions 2.x+](#tab/functionsv2/csharp-script)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

---

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Service Bus binding is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

You can add this version of the extension from the extension bundle v3 by adding or replacing the following code in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functions1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end

<a name="host-json"></a>  

## host.json settings

This section describes the configuration settings available for this binding, which depends on the runtime and extension version.

# [Extension 5.x+](#tab/extensionv5)

```json
{
    "version": "2.0",
    "extensions": {
        "serviceBus": {
            "clientRetryOptions":{
                "mode": "exponential",
                "tryTimeout": "00:01:00",
                "delay": "00:00:00.80",
                "maxDelay": "00:01:00",
                "maxRetries": 3
            },
            "prefetchCount": 0,
            "transportType": "amqpWebSockets",
            "webProxy": "https://proxyserver:8080",
            "autoCompleteMessages": true,
            "maxAutoLockRenewalDuration": "00:05:00",
            "maxConcurrentCalls": 16,
            "maxConcurrentSessions": 8,
            "maxMessageBatchSize": 1000,
            "sessionIdleTimeout": "00:01:00",
            "enableCrossEntityTransactions": false
        }
    }
}
```

The `clientRetryOptions` settings only apply to interactions with the Service Bus service. They don't affect retries of function executions. For more information, see [Retries](functions-bindings-error-pages.md#retries).


|Property  |Default | Description |
|---------|---------|---------|
|**mode**|`Exponential`|The approach to use for calculating retry delays. The default exponential mode retries attempts with a delay based on a back-off strategy where each attempt increases the wait duration before retrying. The `Fixed` mode retries attempts at fixed intervals with each delay having a consistent duration.|
|**tryTimeout**|`00:01:00`|The maximum duration to wait for an operation per attempt.|
|**delay**|`00:00:00.80`|The delay or back-off factor to apply between retry attempts.|
|**maxDelay**|`00:01:00`|The maximum delay to allow between retry attempts|
|**maxRetries**|`3`|The maximum number of retry attempts before considering the associated operation to have failed.|
|**prefetchCount**|`0`|Gets or sets the number of messages that the message receiver can simultaneously request.|
| **transportType**| amqpTcp | The protocol and transport that is used for communicating with Service Bus. Available options: `amqpTcp`, `amqpWebSockets`|
| **webProxy**| n/a | The proxy to use for communicating with Service Bus over web sockets. A proxy cannot be used with the `amqpTcp` transport. |
|**autoCompleteMessages**|`true`|Determines whether or not to automatically complete messages after successful execution of the function and should be used in place of the `autoComplete` configuration setting.|
|**maxAutoLockRenewalDuration**|`00:05:00`|The maximum duration within which the message lock will be renewed automatically. This setting only applies for functions that receive a single message at a time.|
|**maxConcurrentCalls**|`16`|The maximum number of concurrent calls to the callback that should be initiated per scaled instance. By default, the Functions runtime processes multiple messages concurrently. This setting is used only when the `isSessionsEnabled` property or attribute on [the trigger](functions-bindings-service-bus-trigger.md) is set to `false`. This setting only applies for functions that receive a single message at a time.|
|**maxConcurrentSessions**|`8`|The maximum number of sessions that can be handled concurrently per scaled instance. This setting is used only when the `isSessionsEnabled` property or attribute on [the trigger](functions-bindings-service-bus-trigger.md) is set to `true`. This setting only applies for functions that receive a single message at a time.|
|**maxMessageBatchSize**|`1000`|The maximum number of messages that will be passed to each function call. This setting only applies for functions that receive a batch of messages.|
|**sessionIdleTimeout**|n/a|The maximum amount of time to wait for a message to be received for the currently active session. After this time has elapsed, the session will be closed and the function will attempt to process another session. 
|**enableCrossEntityTransactions**|`false`|Whether or not to enable transactions that span multiple entities on a Service Bus namespace.|

# [Functions 2.x+](#tab/functionsv2)

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
                "operationTimeout": "00:01:00",
                "autoComplete": true
            }
        }
    }
}
```

When you set the `isSessionsEnabled` property or attribute on [the trigger](functions-bindings-service-bus-trigger.md) to `true`, the `sessionHandlerOptions` is honored.  When you set the `isSessionsEnabled` property or attribute on [the trigger](functions-bindings-service-bus-trigger.md) to `false`, the `messageHandlerOptions` is honored.

|Property  |Default | Description |
|---------|---------|---------|
|**prefetchCount**|`0`|Gets or sets the number of messages that the message receiver can simultaneously request.|
|**maxAutoRenewDuration**|`00:05:00`|The maximum duration within which the message lock will be renewed automatically.|
|**autoComplete**|`true`|Whether the trigger should automatically call complete after processing, or if the function code manually calls complete.<br><br>Setting to `false` is only supported in C#.<br><br>When set to `true`, the trigger completes the message, session, or batch automatically when the function execution completes successfully, and abandons the message otherwise.<br><br>When set to `false`, you are responsible for calling [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) methods to complete, abandon, or deadletter the message, session, or batch. When an exception is thrown (and none of the `MessageReceiver` methods are called), then the lock remains. Once the lock expires, the message is re-queued with the `DeliveryCount` incremented and the lock is automatically renewed.<br><br>In non-C# functions, exceptions in the function results in the runtime calls `abandonAsync` in the background. If no exception occurs, then `completeAsync` is called in the background. |
|**maxConcurrentCalls**|`16`|The maximum number of concurrent calls to the callback that the message pump should initiate per scaled instance. By default, the Functions runtime processes multiple messages concurrently.|
|**maxConcurrentSessions**|`2000`|The maximum number of sessions that can be handled concurrently per scaled instance.|
|**maxMessageCount**|`1000`| The maximum number of messages sent to the function when triggered. |
|**operationTimeout**|`00:01:00`| A time span value expressed in `hh:mm:ss`. |

# [Functions 1.x](#tab/functionsv1)

For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

---

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus/
[Update your extensions]: ./functions-bindings-register.md

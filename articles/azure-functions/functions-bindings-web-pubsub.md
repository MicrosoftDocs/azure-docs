---
title: Azure Functions Web PubSub bindings
description: Understand how to use Web PubSub bindings with Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 09/02/2024
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Web PubSub bindings for Azure Functions

This set of articles explains how to authenticate, send real-time messages to clients connected to [Azure Web PubSub](https://azure.microsoft.com/products/web-pubsub/) by using Azure Web PubSub bindings in Azure Functions.

| Action | Type |
|---------|---------|
| Handle client events from Web PubSub  | [Trigger binding](./functions-bindings-web-pubsub-trigger.md) |
| Handle client events from Web PubSub with HTTP trigger, or return client access URL and token | [Input binding](./functions-bindings-web-pubsub-input.md)
| Invoke service APIs | [Output binding](./functions-bindings-web-pubsub-output.md) |

[Samples](https://github.com/Azure/azure-webpubsub/tree/main/samples/functions)

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app:

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.WebPubSub/).

# [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package].

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

## Install bundle

The Web PubSub extension is part of an [extension bundle], which is specified in your host.json project file. When you create a project that targets version 3.x or later, you should already have this bundle installed. To learn more, see [extension bundle].

::: zone-end
::: zone pivot="programming-language-java"

> [!NOTE]
> The Web PubSub extensions for Java is not supported yet.

::: zone-end

## Key concepts

![Diagram showing the workflow of Azure Web PubSub service working with Function Apps.](../azure-web-pubsub/media/reference-functions-bindings/functions-workflow.png)

(1)-(2) `WebPubSubConnection` input binding with HttpTrigger to generate client connection.

(3)-(4) `WebPubSubTrigger` trigger binding or `WebPubSubContext` input binding with HttpTrigger to handle service request.

(5)-(6) `WebPubSub` output binding to request service do something.

## Connection string settings

By default, an application setting named `WebPubSubConnectionString` is used to store your Web PubSub connection string. When you choose to use a different setting name for your connection, you must explicitly set that as the key name in your binding definitions. During local development, you must also add this setting to the `Values` collection in the the [_local.settings.json_ file](./functions-develop-local.md#local-settings-file).

> [!IMPORTANT]
> A connection string includes the authorization information required for your application to access Azure Web PubSub service. The access key inside the connection string is similar to a root password for your service. For optimal security, your function app should use managed idenities when connecting to the Web PubSub service instead of using a connection string. For more information, see [Authorize a managed identity request by using Microsoft Entra ID](../azure-web-pubsub/howto-authorize-from-managed-identity.md). 

For details on how to configure and use Web PubSub and Azure Functions together, refer to [Tutorial: Create a serverless notification app with Azure Functions and Azure Web PubSub service](../azure-web-pubsub/tutorial-serverless-notification.md).

## Next steps

- [Handle client events from Web PubSub  (Trigger binding)](./functions-bindings-web-pubsub-trigger.md)
- [Handle client events from Web PubSub with HTTP trigger, or return client access URL and token (Input binding)](./functions-bindings-web-pubsub-input.md)
- [Invoke service APIs  (Output binding)](./functions-bindings-web-pubsub-output.md)

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSub
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

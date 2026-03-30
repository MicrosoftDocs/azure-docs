---
title: Azure Functions Web PubSub bindings
description: Understand how to use Web PubSub bindings with Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 1/21/2026
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Web PubSub bindings for Azure Functions

This set of articles explains how to authenticate, send real-time messages to clients connected to [Azure Web PubSub](https://azure.microsoft.com/products/web-pubsub/) by using Azure Web PubSub bindings in Azure Functions.

| Action | Type |
|---------|---------|
| Handle client events from Web PubSub  | [Trigger binding](./functions-bindings-web-pubsub-trigger.md) |
| Handle client events from Web PubSub with HTTP trigger, or return client access URL and token | [Input binding](./functions-bindings-web-pubsub-input.md) |
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

[!INCLUDE [functions-install-extension-bundle](../../includes/functions-install-extension-bundle.md)]

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

## Connection

You can use [connection string](#connection-string) or [Microsoft Entra identity](#identity-based-connections) to connect to Azure Web PubSub service.

### Connection String

By default, an application setting named `WebPubSubConnectionString` is used to store your Web PubSub connection string. When you choose to use a different setting name for your connection, you must explicitly set that as the key name in your binding definitions. During local development, you must also add this setting to the `Values` collection in the [_local.settings.json_ file](./functions-develop-local.md#local-settings-file).

> [!IMPORTANT]
> A connection string includes the authorization information required for your application to access Azure Web PubSub service. The access key inside the connection string is similar to a root password for your service. For optimal security, your function app should use [managed identities](#identity-based-connections) when connecting to the Web PubSub service instead of using a connection string.

For details on how to configure and use Web PubSub and Azure Functions together, refer to [Tutorial: Create a serverless notification app with Azure Functions and Azure Web PubSub service](../azure-web-pubsub/tutorial-serverless-notification.md).

### Identity-based connections

If you're using Azure Web PubSub Functions Extensions v1.10.0 or higher, instead of using a connection string with an access key, you can configure your function app to authenticate to Azure Web PubSub using a Microsoft Entra identity.

This approach removes the need to manage secrets and is recommended for production workloads.

#### Prerequisites

Make sure the Microsoft Entra identity used by your function app has been granted an appropriate Azure RBAC role on the target Web PubSub resource:

- [Azure Web PubSub Owner](../role-based-access-control/built-in-roles/web-and-mobile.md#web-pubsub-service-owner)

#### Configuration

Identity-based connections in Azure Functions use a set of settings that share a common prefix. By default, Azure Web PubSub Functions extensions look for settings with the prefix `WebPubSubConnectionString`. You can customize this prefix by setting the `connection` property in your trigger or binding.

For Azure Web PubSub, the service-specific setting you must provide is the service endpoint URI:

| Property | Environment variable template | Description | Required |
|---|---|---|---|
| Service URI | `WebPubSubConnectionString__serviceUri` | The URI of your Web PubSub service endpoint. | Yes |

When hosted in the Azure Functions service, identity-based connections use a [managed identity](../app-service/overview-managed-identity.md?toc=%2fazure%2fazure-functions%2ftoc.json). The system-assigned identity is used by default, although a user-assigned identity can be specified. For more information on how to customize the identity, [Common properties for identity-based connections](./functions-reference.md#common-properties-for-identity-based-connections).

When run in other contexts, such as local development, your developer identity is used instead, although this can be customized. See [Local development with identity-based connections](./functions-reference.md#local-development-with-identity-based-connections).

#### Example configuration

The following example shows how to configure identity-based with default settings:

```json
{
  "WebPubSubConnectionString__serviceUri": "https://your-webpubsub.webpubsub.azure.com"
}
```


> [!NOTE]
> When using `local.settings.json` file at local, [Azure App Configuration](../azure-app-configuration/quickstart-azure-functions-csharp.md), or [Key Vault](/azure/key-vault/general/overview) to provide settings for identity-based connections, replace `__` with `:` in the setting name to ensure names are resolved correctly.
>
> For example, `WebPubSubConnectionString:serviceUri`.

## Next steps

- [Handle client events from Web PubSub  (Trigger binding)](./functions-bindings-web-pubsub-trigger.md)
- [Handle client events from Web PubSub with HTTP trigger, or return client access URL and token (Input binding)](./functions-bindings-web-pubsub-input.md)
- [Invoke service APIs  (Output binding)](./functions-bindings-web-pubsub-output.md)

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSub
[core tools]: ./functions-run-local.md
[extension bundle]: ./extension-bundles.md
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack


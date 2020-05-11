---
title: Azure Functions SignalR Service bindings
description: Understand how to use SignalR Service bindings with Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/28/2019
ms.author: cshoe
---

# SignalR Service bindings for Azure Functions

This set of articles explains how to authenticate and send real-time messages to clients connected to [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/) by using SignalR Service bindings in Azure Functions. Azure Functions supports input and output bindings for SignalR Service.

| Action | Type |
|---------|---------|
| Return the service endpoint URL and access token | [Input binding](./functions-bindings-signalr-service-input.md) |
| Send SignalR Service messages |[Output binding](./functions-bindings-signalr-service-output.md) |

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SignalRService
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./install-update-binding-extensions-manual.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

For details on how to configure and use SignalR Service and Azure Functions together, refer to [Azure Functions development and configuration with Azure SignalR Service](../azure-signalr/signalr-concept-serverless-development-config.md).

### Annotations library (Java only)

To use the SignalR Service annotations in Java functions, you need to add a dependency to the *azure-functions-java-library-signalr* artifact (version 1.0 or higher) to your *pom.xml* file.

```xml
<dependency>
    <groupId>com.microsoft.azure.functions</groupId>
    <artifactId>azure-functions-java-library-signalr</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Next steps

- [Return the service endpoint URL and access token (Input binding)](./functions-bindings-signalr-service-input.md)
- [Send SignalR Service messages  (Output binding)](./functions-bindings-signalr-service-output.md) 

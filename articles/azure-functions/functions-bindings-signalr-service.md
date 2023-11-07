---
title: Azure Functions SignalR Service bindings
description: Understand how to use SignalR Service bindings with Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/04/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# SignalR Service bindings for Azure Functions

This set of articles explains how to authenticate and send real-time messages to clients connected to [Azure SignalR Service](https://azure.microsoft.com/services/signalr-service/) by using SignalR Service bindings in Azure Functions. Azure Functions runtime version 2.x and higher supports input and output bindings for SignalR Service.

| Action | Type |
|---------|---------|
| Handle messages from SignalR Service | [Trigger binding](./functions-bindings-signalr-service-trigger.md) |
| Return the service endpoint URL and access token | [Input binding](./functions-bindings-signalr-service-input.md) |
| Send SignalR Service messages |[Output binding](./functions-bindings-signalr-service-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.SignalRService/).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package].

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  

## Install bundle    

The SignalR Service extension is part of an [extension bundle], which is specified in your host.json project file. When you create a project that targets version 3.x or later, you should already have this bundle installed. To learn more, see [extension bundle].

::: zone-end  
::: zone pivot="programming-language-java"  

## Add dependency   

To use the SignalR Service annotations in Java functions, you need to add a dependency to the *azure-functions-java-library-signalr* artifact (version 1.0 or higher) to your *pom.xml* file.

```xml
<dependency>
    <groupId>com.microsoft.azure.functions</groupId>
    <artifactId>azure-functions-java-library-signalr</artifactId>
    <version>1.0.0</version>
</dependency>
```
::: zone-end 

## Connection string settings

Add the `AzureSignalRConnectionString` key to the _host.json_ file that points to the application setting with your connection string. For local development, this value may exist in the _local.settings.json_ file.

For details on how to configure and use SignalR Service and Azure Functions together, refer to [Azure Functions development and configuration with Azure SignalR Service](../azure-signalr/signalr-concept-serverless-development-config.md).

## Next steps

- [Handle messages from SignalR Service  (Trigger binding)](./functions-bindings-signalr-service-trigger.md)
- [Return the service endpoint URL and access token (Input binding)](./functions-bindings-signalr-service-input.md)
- [Send SignalR Service messages  (Output binding)](./functions-bindings-signalr-service-output.md)

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SignalRService
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

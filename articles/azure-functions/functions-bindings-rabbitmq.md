---
title: Azure RabbitMQ bindings for Azure Functions
description: Learn to send Azure RabbitMQ triggers and bindings in Azure Functions.
author: cachai2
ms.assetid: 
ms.topic: reference
ms.date: 11/15/2021
ms.author: cachai
ms.custom:
zone_pivot_groups: programming-languages-set-functions
---


# RabbitMQ bindings for Azure Functions overview

> [!NOTE]
> The RabbitMQ bindings are only fully supported on **Premium and Dedicated** plans. Consumption is not supported.

Azure Functions integrates with [RabbitMQ](https://www.rabbitmq.com/) via [triggers and bindings](./functions-triggers-bindings.md). The Azure Functions RabbitMQ extension allows you to send and receive messages using the RabbitMQ API with Functions.

| Action | Type |
|---------|---------|
| Run a function when a RabbitMQ message comes through the queue | [Trigger](./functions-bindings-rabbitmq-trigger.md) |
| Send RabbitMQ messages |[Output binding](./functions-bindings-rabbitmq-output.md) |

## Add to your Functions app

To get started with developing with this extension, make sure you first [set up a RabbitMQ endpoint](https://github.com/Azure/azure-functions-rabbitmq-extension/wiki/Setting-up-a-RabbitMQ-Endpoint). To learn more about RabbitMQ, check out their [getting started page](https://www.rabbitmq.com/getstarted.html).

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running functions on .NET 5.0 in Azure](../articles/azure-functions/dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

<!-- Update the Extension version tabs to reflect on the extension versions supported for the particular bindings. 
The first set of 2-way tabs are displayed when the In-process tab is selected (in the include above), otherwise the second set for isolated-process are displayed. If you have questions, ping glenga.-->

# [Extension v3.x](#tab/extensionv3/in-process)

<!-- An example of a preview NuGet package for WebJobs might look like the following: 

Preview version of the extension that supports new Event Grid binding parameter types of [Azure.Messaging.CloudEvent](/dotnet/api/azure.messaging.cloudevent) and [Azure.Messaging.EventGrid.EventGridEvent](/dotnet/api/azure.messaging.eventgrid.eventgridevent).

Add the preview extension to your project by installing the [NuGet package], version 3.x. 
-->

# [Extension v2.x](#tab/extensionv2/in-process)

<!-- Must include at least the WebJobs NuGet package link and specific major version.-->

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. 

# [Extension v3.x](#tab/extensionv3/isolated-process)

<!-- Must link to the specific version package under www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.*. An example for a preview package version might look like the following:

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid), version 3.x.
-->

# [Extension v2.x](#tab/extensionv2/isolated-process)

<!-- Must include at least the NuGet package link under www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.* and specific major version.-->

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated process.

# [Extension v3.x](#tab/extensionv3/csharp-script)

<!-- Should contain the same intro content as the #tab/extensionv3/in-process tab.-->

You can install this version of the extension in your function app by registering the [extension bundle], version 3.x.

# [Extension v2.x](#tab/extensionv2/csharp-script)

<!-- Should contain the same intro content as the #tab/extensionv3/in-process tab.-->

You can install this version of the extension in your function app by registering the [extension bundle], version 3.x.

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell,programming-language-typescript"  

## Install bundle    

The <!--{Extension name}--> is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

You can add this version of the extension from the preview extension bundle v3 by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[3.*, 4.0.0)"
  }
}
```

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functionsv1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end

## Next steps

<!--Use the next step links from the original article.-->

[extension bundle]: ./functions-bindings-register.md#extension-bundles

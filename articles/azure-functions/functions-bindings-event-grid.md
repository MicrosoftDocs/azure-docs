---
title: Azure Event Grid bindings for Azure Functions
description: Understand how to handle Event Grid events in Azure Functions.

ms.topic: reference
ms.date: 03/04/2022
ms.custom: fasttrack-edit
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Event Grid bindings for Azure Functions

This reference shows how to connect to Azure Event Grid using Azure Functions triggers and bindings.  

[!INCLUDE [functions-event-grid-intro](../../includes/functions-event-grid-intro.md)] 

| Action | Type |
|---------|---------|
| Run a function when an Event Grid event is dispatched | [Trigger][trigger] |
| Sends an Event Grid event | [Output binding][binding] |
| Control the returned HTTP status code |  [HTTP endpoint](../event-grid/receive-events.md) | 


::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running functions on .NET 5.0 in Azure](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Extension v3.x](#tab/extensionv3/in-process)

This version of the extension supports updated Event Grid binding parameter types of [Azure.Messaging.CloudEvent](/dotnet/api/azure.messaging.cloudevent) and [Azure.Messaging.EventGrid.EventGridEvent](/dotnet/api/azure.messaging.eventgrid.eventgridevent).

Add this version of the extension to your project by installing the [NuGet package], version 3.x.

# [Extension v2.x](#tab/extensionv2/in-process)

Supports the default Event Grid binding parameter type of [Microsoft.Azure.EventGrid.Models.EventGridEvent](/dotnet/api/microsoft.azure.eventgrid.models.eventgridevent). Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

Add the extension to your project by installing the [NuGet package], version 2.x.

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

The Event Grid output binding is only available for Functions 2.x and higher.

# [Extension v3.x](#tab/extensionv3/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid), version 3.x.

# [Extension v2.x](#tab/extensionv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid), version 2.x. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated process. 

The Event Grid output binding is only available for Functions 2.x and higher.

# [Extension v3.x](#tab/extensionv3/csharp-script)

This version of the extension supports updated Event Grid binding parameter types of [Azure.Messaging.CloudEvent](/dotnet/api/azure.messaging.cloudevent) and [Microsoft.Azure.EventGrid.Models.EventGridEvent](/dotnet/api/microsoft.azure.eventgrid.models.eventgridevent).

You can install this version of the extension in your function app by registering the [extension bundle], version 3.x. 

# [Extension v2.x](#tab/extensionv2/csharp-script)

Supports the default Event Grid binding parameter type of [Microsoft.Azure.EventGrid.Models.EventGridEvent](/dotnet/api/microsoft.azure.eventgrid.models.eventgridevent). Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

The Event Grid output binding is only available for Functions 2.x and higher.

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Event Grid extension is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the Event Grid binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

You can add this version of the extension from the extension bundle v3 by adding or replacing the following configuration in your `host.json` file:

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

# [Functions 1.x](#tab/functionsv1)

The Event Grid output binding is only available for Functions 2.x and higher. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

---

::: zone-end

## Next steps

* If you have questions, submit an issue to the team [here](https://github.com/Azure/azure-sdk-for-net/issues)
* [Event Grid trigger][trigger]
* [Event Grid output binding][binding]
* [Run a function when an Event Grid event is dispatched](./functions-bindings-event-grid-trigger.md)
* [Dispatch an Event Grid event](./functions-bindings-event-grid-trigger.md)

[binding]: functions-bindings-event-grid-output.md
[trigger]: functions-bindings-event-grid-trigger.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid
[Update your extensions]: ./functions-bindings-register.md


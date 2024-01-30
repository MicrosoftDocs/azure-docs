---
title: Azure Event Grid bindings for Azure Functions
description: Understand how to handle Event Grid events in Azure Functions.

ms.topic: reference
ms.date: 03/04/2022
ms.custom: fasttrack-edit, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions
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

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

In a variation of this model, Functions can be run using [C# scripting], which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Extension v3.x](#tab/extensionv3/in-process)

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 3.x._

This version of the extension supports updated Event Grid binding parameter types of [Azure.Messaging.CloudEvent][CloudEvent] and [Azure.Messaging.EventGrid.EventGridEvent][EventGridEvent].

Add this version of the extension to your project by installing the [NuGet package], version 3.x.

# [Extension v2.x](#tab/extensionv2/in-process)

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 2.x._

Supports the default Event Grid binding parameter type of [Microsoft.Azure.EventGrid.Models.EventGridEvent](/dotnet/api/microsoft.azure.eventgrid.models.eventgridevent). Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger, or switch to **Extension v3.x**.

Add the extension to your project by installing the [NuGet package], version 2.x.

# [Functions 1.x](#tab/functionsv1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](../../includes/functions-runtime-1x-retirement-note.md)]

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger, or switch to **Extension v3.x**. To do so, you will need to [upgrade your application to Functions 4.x].

The Event Grid output binding is only available for Functions 2.x and higher.

# [Extension v3.x](#tab/extensionv3/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid), version 3.x.

# [Extension v2.x](#tab/extensionv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid), version 2.x. Event Grid extension versions earlier than 3.x don't support [CloudEvents schema](../event-grid/cloudevents-schema.md#azure-functions). To consume this schema, instead use an HTTP trigger.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support the isolated worker process. 

The Event Grid output binding is only available for Functions 2.x and higher.

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java,programming-language-powershell"  

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

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [Isolated worker model](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  

# [In-process model](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
---

Choose a version to see binding type details for the mode and version.

# [Extension v3.x](#tab/extensionv3/in-process)

The Event Grid extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|
| Event Grid trigger | [CloudEvent]<br/>[EventGridEvent]<br/>[BinaryData]<br/>[Newtonsoft.Json.Linq.JObject][JObject]<br/>`string` |
| Event Grid output (single event) | [CloudEvent]<br/>[EventGridEvent]<br/>[BinaryData]<br/>[Newtonsoft.Json.Linq.JObject][JObject]<br/>`string` |
| Event Grid output (multiple events) | `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the single event types |

# [Extension v2.x](#tab/extensionv2/in-process)

This version of the extension supports parameter types according to the table below. It doesn't support for the [CloudEvents schema], which is exclusive to **Extension v3.x**.

| Binding | Parameter types |
|-|-|
| Event Grid trigger | [Microsoft.Azure.EventGrid.Models.EventGridEvent]<br/>[Newtonsoft.Json.Linq.JObject][JObject]<br/>`string` |
| Event Grid output | [Microsoft.Azure.EventGrid.Models.EventGridEvent]<br/>[Newtonsoft.Json.Linq.JObject][JObject]<br/>`string` |

# [Functions 1.x](#tab/functionsv1/in-process)

This version of the extension supports parameter types according to the table below. It doesn't support for the [CloudEvents schema], which is exclusive to **Extension v3.x**.

| Binding | Parameter types |
|-|-|
| Event Grid trigger | [Newtonsoft.Json.Linq.JObject][JObject]<br/>`string` |
| Event Grid output | [Newtonsoft.Json.Linq.JObject][JObject]<br/>`string` |

# [Extension v3.x](#tab/extensionv3/isolated-process)

The isolated worker process supports parameter types according to the tables below. Support for binding to `Stream`, and to types from [Azure.Messaging] is in preview.

**Event Grid trigger**

[!INCLUDE [functions-bindings-event-grid-trigger-dotnet-isolated-types](../../includes/functions-bindings-event-grid-trigger-dotnet-isolated-types.md)]

**Event Grid output binding**

[!INCLUDE [functions-bindings-event-grid-output-dotnet-isolated-types](../../includes/functions-bindings-event-grid-output-dotnet-isolated-types.md)]

# [Extension v2.x](#tab/extensionv2/isolated-process)

Earlier versions of this extension in the isolated worker process only support binding to strings and plain-old CLR object (POCO) types. Additional options are available to **Extension v3.x**.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process. To use the isolated worker model, [upgrade your application to Functions 4.x].

---

[CloudEvent]: /dotnet/api/azure.messaging.cloudevent
[EventGridEvent]: /dotnet/api/azure.messaging.eventgrid.eventgridevent
[BinaryData]: /dotnet/api/system.binarydata

[JObject]: https://www.newtonsoft.com/json/help/html/t_newtonsoft_json_linq_jobject.htm
[Microsoft.Azure.EventGrid.Models.EventGridEvent]: /dotnet/api/microsoft.azure.eventgrid.models.eventgridevent
[upgrade your application to Functions 4.x]: ./migrate-version-1-version-4.md

:::zone-end

## host.json settings

The Event Grid trigger uses a webhook HTTP request, which can be configured using the same [*host.json* settings as the HTTP Trigger](functions-bindings-http-webhook.md#hostjson-settings).

## Next steps

* If you have questions, submit an issue to the team [here](https://github.com/Azure/azure-sdk-for-net/issues)
* [Event Grid trigger][trigger]
* [Event Grid output binding][binding]
* [Run a function when an Event Grid event is dispatched](./functions-bindings-event-grid-trigger.md)
* [Dispatch an Event Grid event](./functions-bindings-event-grid-trigger.md)

[Azure.Messaging]: /dotnet/api/azure.messaging
[Azure.Messaging.EventGrid]: /dotnet/api/azure.messaging.eventgrid

[binding]: functions-bindings-event-grid-output.md
[trigger]: functions-bindings-event-grid-trigger.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid
[Update your extensions]: ./functions-bindings-register.md

[CloudEvents schema]: ../event-grid/cloudevents-schema.md#azure-functions

[C# scripting]: ./functions-reference-csharp.md

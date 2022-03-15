---
author: craigshoemaker
ms.service: azure-functions
ms.topic: include
ms.date: 02/21/2020
ms.author: cshoe
---

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

# [Extension v5.x+](#tab/extensionv5/in-process)

[!INCLUDE [functions-bindings-event-hubs-extension-5](functions-bindings-event-hubs-extension-5.md)] 

This version uses the new newer Event Hubs binding type [Azure.Messaging.EventHubs.EventData](/dotnet/api/azure.messaging.eventhubs.eventdata).

This extension version is available by installing the [NuGet package], version 5.x

# [Extension v3.x+](#tab/extensionv3/in-process)

Supports the original Event Hubs binding parameter type of [Microsoft.Azure.EventHubs.EventData](/dotnet/api/microsoft.azure.eventhubs.eventdata).

Add the extension to your project by installing the [NuGet package], version 3.x or 4.x.

# [Extension v5.x+](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-event-hubs-extension-5](functions-bindings-event-hubs-extension-5.md)] 

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs), version 5.x.

# [Extension v3.x+](#tab/extensionv3/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventHubs), version 4.x.

# [Extension v5.x+](#tab/extensionv5/csharp-script)

[!INCLUDE [functions-bindings-event-hubs-extension-5](functions-bindings-event-hubs-extension-5.md)]  

This version uses the new newer Event Hubs binding type [Azure.Messaging.EventHubs.EventData](/dotnet/api/azure.messaging.eventhubs.eventdata).

You can install this version of the extension in your function app by registering the [extension bundle], version 3.x.

# [Extension v3.x+](#tab/extensionv3/csharp-script)

Supports the original Event Hubs binding parameter type of [Microsoft.Azure.EventHubs.EventData](/dotnet/api/microsoft.azure.eventhubs.eventdata).

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x. 

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Event Hubs extension is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the Event Grid binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv5)

[!INCLUDE [functions-bindings-event-hubs-extension-5](functions-bindings-event-hubs-extension-5.md)] 

You can add this version of the extension from the extension bundle v3 by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.3.0, 4.0.0)"
  }
}
```

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv3)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

---

::: zone-end

## host.json settings
<a name="host-json"></a>

The [host.json](../articles/azure-functions/functions-host-json.md#eventhub) file contains settings that control behavior for the Event Hubs trigger. The configuration is different depending on the Azure Functions version.

[!INCLUDE [functions-host-json-event-hubs](../articles/azure-functions/../../includes/functions-host-json-event-hubs.md)]

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs
[extension bundle]: ../articles/azure-functions/functions-bindings-register.md#extension-bundles
[Update your extensions]: ../articles/azure-functions/functions-bindings-register.md
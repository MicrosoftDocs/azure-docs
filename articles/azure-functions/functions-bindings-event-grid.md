---
title: Event Grid trigger for Azure Functions
description: Understand how to use Event Grid triggers in Azure Functions.
services: functions
documentationcenter: na
author: tdykstra
manager: cfowler
editor: ''
tags: ''
keywords:

ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/21/2017
ms.author: tdykstra
---

# Event Grid trigger for Azure Functions

This article explains how to work with [Event Grid](../event-grid/overview.md) triggers in Azure Functions.

The Event Grid trigger responds to HTTP requests from an Event Grid subscription.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Example

See the language-specific example:

* [C#](#c-example)
* [C# script (.csx)](#c-script-example)
* [JavaScript](#javascript-example)

### Trigger - C# example

The following example shows a [C# function](functions-dotnet-class-library.md) that ...

```cs
```

### Trigger - C# script example

The following example shows a trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function ...

Here's the binding data in the *function.json* file:

```json
```

The [Configuration](#configuration) section explains these properties.

Here's the C# script code:

```csharp
```

### Trigger - JavaScript example

The following example shows a trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function ...

Here's the binding data in the *function.json* file:

```json
```

The [Configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
```
     
## Attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [EventGridTrigger](https://github.com/Azure/azure-functions-eventgrid-extension/blob/master/src/EventGridExtension/EventGridTriggerAttribute.cs) attribute, defined in NuGet package [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid).

Here's an `EventGridTrigger` attribute in a method signature:

```csharp
[FunctionName("HttpTriggerCSharp")]
public static HttpResponseMessage Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, WebHookType = "genericJson")] HttpRequestMessage req)
{
    ...
}
 ```

For a complete example, see [C# example](#c-example).

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. There are no properties to set in the `HttpTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
| **type** | n/a| Required - must be set to `eventGridTrigger`. |
| **direction** | n/a| Required - must be set to `in`. |
| **name** | n/a| Required - the variable name used in function code for the request or request body. |

## Usage

For C# and F# functions, you can declare the type of your trigger input to be either `HttpRequestMessage` or a custom type. If you choose `HttpRequestMessage`, you get full access to the request object. For a custom type, Functions tries to parse the JSON request body to set the object properties. 

For JavaScript functions, the Functions runtime provides the request body instead of the request object. For more information, see the [JavaScript trigger example](#trigger---javascript-example).

<!--Look for an include or a deep link to schema ref docs -->

## Testing locally

The EventGrid trigger only works when the function runs in Azure.  However, you can use an HTTP trigger to simulate an EventGrid trigger to test locally.

Under the covers, the EventGrid trigger is basically an HTTP trigger with the following built-in custom processing:

* Send an appropriate response to the initial subscription-verification HTTP request from Event Grid.
* Trigger function invocation on receipt of events (HTTP requests) from Event Grid. One request may include an array of events. In that case, trigger a function invocation for each element of the array.

The following C# code duplicates this process by using an HTTP trigger.



## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

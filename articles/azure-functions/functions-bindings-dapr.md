---
title: Dapr trigger and bindings for Azure Functions
description: Learn to use the Dapr trigger and bindings in Azure Functions.

ms.topic: reference
ms.date: 04/17/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr trigger and bindings for Azure Functions

Azure Functions integrates with [Dapr](https://docs.dapr.io/) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Dapr allows you to build functions that react to changes in Dapr data as well as read and write values.

| Action | Type |
|---------|---------|
| Trigger a Dapr binding, service invocation, or topic subscription | [Trigger](./functions-bindings-dapr-trigger.md) |
| Pull in Dapr state and secrets | [Input binding](./functions-bindings-dapr-input.md) |
| Send a value to a Dapr topic or output binding |[Output binding](./functions-bindings-dapr-output.md) |


::: zone pivot="programming-language-csharp"

## Install extension
The extension NuGet package you install depends on the C# mode you're using in your function app:

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

---

The functionality of the extension varies depending on the extension version:

# [Extension 5.x and higher](#tab/extensionv5/in-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

This extension is available by installing the [Dapr.AzureFunction.Extension NuGet package](https://www.nuget.org/packages/Dapr.AzureFunctions.Extension#dotnet-cli), version 0.10.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Dapr.AzureFunctions.Extension --version 0.10.0-preview01
``` 

# [Functions 2.x and higher](#tab/functionsv2/in-process)



# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

[!INCLUDE [functions-bindings-supports-identity-connections-note](../../includes/functions-bindings-supports-identity-connections-note.md)]

Add the extension to your project by installing the [Dapr.AzureFunction.Extension NuGet package](https://www.nuget.org/packages/Dapr.AzureFunctions.Extension#dotnet-cli), version 0.10.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Dapr.AzureFunctions.Extension --version 0.10.0-preview01
``` 

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)


# [Functions 1.x](#tab/functionsv1/isolated-process)


---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"

<!-- Do the manual func install extension stuff here. -->
::: zone-end

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [In-process class library](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  

---

Choose a version to see binding type details for the mode and version. 

# [Extension 5.x and higher](#tab/extensionv5/in-process)

The Dapr extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Dapr trigger | [daprBindingTrigger]<br/>[daprServiceInvocationTrigger]<br/>[daprTopicTrigger]|
| Dapr input | [daprState]<br/>[daprSecret] |
| Dapr output | [daprState][dapr-state-output]<br/>[daprInvoke]<br/>[daprPublish]<br/>[daprBinding] |

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-azurefunction). 

# [Functions 2.x and higher](#tab/functionsv2/in-process)


# [Functions 1.x](#tab/functionsv1/in-process)


# [Extension 5.x and higher](#tab/extensionv5/isolated-process)

The isolated worker process supports parameter types according to the table below. Binding to string parameters is currently the only option that is generally available. 

| Binding | Parameter types | Preview parameter types<sup>1</sup> |
|-|-|-| 
| Dapr trigger | `string` | [daprBindingTrigger]<br/>[daprServiceInvocationTrigger]<br/>[daprTopicTrigger]|
| Dapr input | `string` | [daprState]<br/>[daprSecret] |
| Dapr output | `string` | [daprState][dapr-state-output]<br/>[daprInvoke]<br/>[daprPublish]<br/>[daprBinding] |


# [Functions 2.x and higher](#tab/functionsv2/isolated-process)


# [Functions 1.x](#tab/functionsv1/isolated-process)


---

[daprBindingTrigger]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/triggers.md#input-binding-trigger
[daprServiceInvocationTrigger]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/triggers.md#service-invocation-trigger
[daprTopicTrigger]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/triggers.md#topic-trigger

[daprState]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/input-bindings.md#state-input-binding
[daprSecret]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/input-bindings.md#state-input-binding

[dapr-state-output]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/output-bindings.md#topic-publish-output-binding
[daprInvoke]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/output-bindings.md#service-invocation-output-binding
[daprPublish]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/output-bindings.md#topic-publish-output-binding
[daprBinding]: https://github.com/Azure/azure-functions-dapr-extension/blob/master/docs/output-bindings.md#topic-publish-output-binding

::: zone-end

## host.json settings

This section describes the function app configuration settings available for functions that use this binding. These settings only apply when using extension version 5.0.0 and higher. The example host.json file below contains only the version 2.x+ settings for this binding. For more information about function app configuration settings in versions 2.x and later versions, see [host.json reference for Azure Functions](functions-host-json.md).

> [!NOTE]
> This section doesn't apply to extension versions before 5.0.0. For those earlier versions, there aren't any function app-wide configuration settings for Dapr.

```json
{
    "version": "2.0"
}
```

## Next steps
- [Trigger a Dapr binding, service invocation, or topic subscription](./functions-bindings-dapr-trigger.md)
- [Pull in Dapr state and secrets](./functions-bindings-dapr-input.md)
- [Send a value to a Dapr topic or output binding](./functions-bindings-dapr-output.md)
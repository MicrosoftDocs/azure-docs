---
title: Dapr trigger and bindings for Azure Functions
description: Learn to use the Dapr trigger and bindings in Azure Functions.
ms.topic: reference
ms.date: 05/03/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

# Dapr trigger and bindings for Azure Functions

Azure Functions integrates with [Dapr](https://docs.dapr.io/) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Dapr allows you to build functions that react to changes in Dapr data as well as read and write values.

| Action  | Type |
|---------|---------|
| Trigger on a Dapr input binding | [daprBindingTrigger](./functions-bindings-dapr-trigger-input.md) |
| Trigger on a Dapr service invocation | [daprServiceInvocationTrigger](./functions-bindings-dapr-trigger-svc-invoke.md) |
| Trigger on a Dapr topic subscription | [daprTopicTrigger](./functions-bindings-dapr-trigger-topic.md) |
| Pull in Dapr state for an execution | [daprState](./functions-bindings-dapr-input-state.md) |
| Pull in Dapr secrets for an execution | [daprSecret](./functions-bindings-dapr-input-secret.md) |
| Save a value to a Dapr state |[daprState](./functions-bindings-dapr-output-state.md) |
| Invoke another Dapr app |[daprInvoke](./functions-bindings-dapr-output-invoke.md) |
|Publish a message to a Dapr topic |[daprPublish](./functions-bindings-dapr-output-publish.md) |
| Send a value to a Dapr output binding |[daprBinding](./functions-bindings-dapr-output.md) |

::: zone-end

::: zone pivot="programming-language-csharp"

## Install extension
The extension NuGet package you install depends on the C# mode you're using in your function app:

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

---

The functionality of the extension varies depending on the extension version:

# [Functions 2.x and higher](#tab/functionsv2/in-process)

This extension is available by installing the [Dapr.AzureFunction.Extension NuGet package](https://www.nuget.org/packages/Dapr.AzureFunctions.Extension#dotnet-cli), version 0.10.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Dapr.AzureFunctions.Extension --version 0.10.0-preview01
``` 

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [Dapr.AzureFunction.Extension NuGet package](https://www.nuget.org/packages/Dapr.AzureFunctions.Extension#dotnet-cli), version 0.10.x.

Using the .NET CLI:

```dotnetcli
dotnet add package Dapr.AzureFunctions.Extension --version 0.10.0-preview01
``` 

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python"

## Install bundle

You need to manually install the Dapr extension into your project and opt-out of using default extensions. Before you begin, verify you have .NET Core SDK installed.

1. If the `host.json` file in your project has the `extensionBundle` property and values:
   1. Open the `host.json` file from the root directory of the project. 
   1. Remove `extensionBundle` propery and values.
   1. Save file.

1. Run the following command:

   ```powershell
   func extensions install -p Dapr.AzureFunctions.Extension -v 0.10.0-preview01
   ```

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

# [Functions 2.x and higher](#tab/functionsv2/in-process)

The Dapr extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Dapr trigger | [daprBindingTrigger]<br/>[daprServiceInvocationTrigger]<br/>[daprTopicTrigger]|
| Dapr input | [daprState]<br/>[daprSecret] |
| Dapr output | [daprState][dapr-state-output]<br/>[daprInvoke]<br/>[daprPublish]<br/>[daprBinding] |

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-azurefunction). 


# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

The isolated worker process supports parameter types according to the table below. Binding to string parameters is currently the only option that is generally available. 

| Binding | Parameter types | Preview parameter types<sup>1</sup> |
|-|-|-| 
| Dapr trigger | `string` | [daprBindingTrigger]<br/>[daprServiceInvocationTrigger]<br/>[daprTopicTrigger]|
| Dapr input | `string` | [daprState]<br/>[daprSecret] |
| Dapr output | `string` | [daprState][dapr-state-output]<br/>[daprInvoke]<br/>[daprPublish]<br/>[daprBinding] |

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

::: zone pivot="programming-language-csharp, programming-language-javascript,programming-language-python"

## host.json settings

This section describes the function app configuration settings available for functions that use this binding. These settings only apply when using extension version 5.0.0 and higher. The example host.json file below contains only the version 2.x+ settings for this binding. For more information about function app configuration settings in versions 2.x and later versions, see [host.json reference for Azure Functions](functions-host-json.md).

> [!NOTE]
> This section doesn't apply to extension versions before 5.0.0. For those earlier versions, there aren't any function app-wide configuration settings for Dapr.

```json
{
    "version": "2.0"
}
```

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

> [!NOTE]
> Currently, Dapr triggers and bindings are only supported in C#, JavaScript, and Python. 

::: zone-end

## Next steps
- Triggers 
  - [Dapr input binding](./functions-bindings-dapr-trigger-input.md)
  - [Dapr service invocation](./functions-bindings-dapr-trigger-svc-invoke.md)
  - [Dapr topic](./functions-bindings-dapr-trigger-topic.md)
- Input
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
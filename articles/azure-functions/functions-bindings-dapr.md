---
title: Dapr extension for Azure Functions
description: Learn to use the Dapr trigger and bindings in Azure Functions.
ms.topic: reference
ms.date: 05/15/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr trigger and bindings for Azure Functions

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-python,programming-language-powershell"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr extension for Azure Functions is a set of tools and services that allow developers to easily integrate Azure Functions with the [Distributed Application Runtime (Dapr)](https://docs.dapr.io/) platform. 

Azure Functions is an event-driven programming where [triggers and bindings](./functions-triggers-bindings.md) are key features, with which you can easily build event-driven serverless applications. Dapr provides a set of building blocks and best practices for building distributed applications, including microservices, state management, pub/sub messaging, and more.

With the integration between Dapr and Functions, you can build functions that react to events from Dapr or external systems.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-python"


| Action  | Direction | Type |
|---------|-----------|------|
| Trigger on a Dapr input binding | N/A | [daprBindingTrigger](./functions-bindings-dapr-trigger-input.md) |
| Trigger on a Dapr service invocation | N/A | [daprServiceInvocationTrigger](./functions-bindings-dapr-trigger-svc-invoke.md) |
| Trigger on a Dapr topic subscription | N/A | [daprTopicTrigger](./functions-bindings-dapr-trigger-topic.md) |
| Pull in Dapr state for an execution | In | [daprState](./functions-bindings-dapr-input-state.md) |
| Pull in Dapr secrets for an execution | In | [daprSecret](./functions-bindings-dapr-input-secret.md) |
| Save a value to a Dapr state | Out | [daprState](./functions-bindings-dapr-output-state.md) |
| Invoke another Dapr app | Out | [daprInvoke](./functions-bindings-dapr-output-invoke.md) |
|Publish a message to a Dapr topic | Out | [daprPublish](./functions-bindings-dapr-output-publish.md) |
| Send a value to a Dapr output binding | Out | [daprBinding](./functions-bindings-dapr-output.md) |

::: zone-end

::: zone pivot="programming-language-csharp"

## Install extension
The extension NuGet package you install depends on the C# mode [in-process](functions-dotnet-class-library.md) or [isolated worker process](dotnet-isolated-process-guide.md) you're using in your function app:

# [In-process](#tab/in-process)

This extension is available by installing the [NuGet package](https://www.nuget.org/packages?q=Functions.Extensions.Dapr&frameworks=&tfms=&packagetype=&prerel=true&sortby=relevance), version 0.14.0-preview01.

Using the .NET CLI:

```dotnetcli
dotnet add package Dapr.AzureFunctions.Extension --version 0.10.0-preview01
``` 

# [Isolated process](#tab/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages?q=Functions.Extensions.Dapr&frameworks=&tfms=&packagetype=&prerel=true&sortby=relevance), version 0.14.0-preview01.

Using the .NET CLI:

```dotnetcli
dotnet add package Dapr.AzureFunctions.Extension --version 0.10.0-preview01
``` 

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python"

## Install bundle


# [Preview Bundle v4.x](#tab/preview-bundle-v4x)

You can add the preview extension by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
``` 

---

::: zone-end

::: zone pivot="programming-language-python"


[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]


::: zone-end

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [In-process class library](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  

---

The Dapr extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Dapr trigger | [daprBindingTrigger]<br/>[daprServiceInvocationTrigger]<br/>[daprTopicTrigger]|
| Dapr input | [daprState]<br/>[daprSecret] |
| Dapr output | [daprState][dapr-state-output]<br/>[daprInvoke]<br/>[daprPublish]<br/>[daprBinding] |

For examples using these types, see [the GitHub repository for the extension](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-azurefunction). 


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

## Next steps

Choose one of the following links to review the reference article for a specific Dapr binding type:

- Triggers 
  - [Dapr input binding](./functions-bindings-dapr-trigger-input.md)
  - [Dapr service invocation](./functions-bindings-dapr-trigger-svc-invoke.md)
  - [Dapr topic](./functions-bindings-dapr-trigger-topic.md)
- Input bindings
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
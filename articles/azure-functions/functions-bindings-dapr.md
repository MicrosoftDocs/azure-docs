---
title: Dapr Extension for Azure Functions
description: Learn to use the Dapr triggers and bindings in Azure Functions.
ms.topic: reference
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 11/15/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Extension for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr Extension for Azure Functions is a set of tools and services that allow developers to easily integrate Azure Functions with the [Distributed Application Runtime (Dapr)](https://docs.dapr.io/) platform. 

Azure Functions is an event-driven compute service that provides a set of [triggers and bindings](./functions-triggers-bindings.md) to easily connect with other Azure services. Dapr provides a set of building blocks and best practices for building distributed applications, including microservices, state management, pub/sub messaging, and more.

With the integration between Dapr and Functions, you can build functions that react to events from Dapr or external systems.

| Action  | Direction | Type |
|---------|-----------|------|
| Trigger on a Dapr input binding | N/A | [daprBindingTrigger](./functions-bindings-dapr-trigger.md) |
| Trigger on a Dapr service invocation | N/A | [daprServiceInvocationTrigger](./functions-bindings-dapr-trigger-svc-invoke.md) |
| Trigger on a Dapr topic subscription | N/A | [daprTopicTrigger](./functions-bindings-dapr-trigger-topic.md) |
| Pull in Dapr state for an execution | In | [daprState](./functions-bindings-dapr-input-state.md) |
| Pull in Dapr secrets for an execution | In | [daprSecret](./functions-bindings-dapr-input-secret.md) |
| Save a value to a Dapr state | Out | [daprState](./functions-bindings-dapr-output-state.md) |
| Invoke another Dapr app | Out | [daprInvoke](./functions-bindings-dapr-output-invoke.md) |
|Publish a message to a Dapr topic | Out | [daprPublish](./functions-bindings-dapr-output-publish.md) |
| Send a value to a Dapr output binding | Out | [daprBinding](./functions-bindings-dapr-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension
The extension NuGet package you install depends on the C# mode [in-process](functions-dotnet-class-library.md) or [isolated worker process](dotnet-isolated-process-guide.md) you're using in your function app:

# [In-process](#tab/in-process)

This extension is available by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Dapr), version 0.17.0-preview01.

Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.WebJobs.Extensions.Dapr --prerelease
``` 

# [Isolated process](#tab/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Dapr), version 0.17.0-preview01.

Using the .NET CLI:

```dotnetcli
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Dapr --prerelease
``` 

---

::: zone-end

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python"

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

## Dapr enablement

You can configure Dapr using various [arguments and annotations][dapr-args] based on the runtime context. You can configure Dapr for Azure Functions through two channels:

- Infrastructure as Code (IaC) templates, as in Bicep or Azure Resource Manager (ARM) templates
- The Azure portal

When using an IaC template, specify the following arguments in the `properties` section of the container app resource definition.

# [Bicep](#tab/bicep1)

```bicep
DaprConfig: {
  enabled: true
  appId: '${envResourceNamePrefix}-funcapp'
  appPort: 3001
  httpReadBufferSize: ''
  httpMaxRequestSize: ''
  logLevel: ''
  enableApiLogging: true
}
```

# [ARM](#tab/arm1)

```json
"DaprConfig": {
  "enabled": true,
  "appId": "${envResourceNamePrefix}-funcapp",
  "appPort": 3001,
  "httpReadBufferSize": "",
  "httpMaxRequestSize": "",
  "logLevel": "",
  "enableApiLogging": true
}
```
---

The above Dapr configuration values are considered application-scope changes. When you run a container app in multiple-revision mode, changes to these settings won't create a new revision. Instead, all existing revisions are restarted to ensure they're configured with the most up-to-date values.

When configuring Dapr using the Azure portal, navigate to your function app and select **Dapr** from the left-side menu:

:::image type="content" source="media/functions-bindings-dapr/dapr-enablement-portal.png" alt-text="Screenshot demonstrating where to find Dapr enablement for a Function App in the Azure portal." :::

## Dapr ports and listeners

When you're triggering a function from Dapr, the extension exposes port `3001` automatically to listen to incoming requests from the Dapr sidecar.  

> [!IMPORTANT]
> Port `3001` is only exposed and listened to if a Dapr trigger is defined in the function app. When using Dapr, the sidecar waits to receive a response from the defined port before completing instantiation. _Do not_ define the `dapr.io/port` annotation or `--app-port` unless you have a trigger. Doing so may lock your application from the Dapr sidecar. 
> 
> If you're only using input and output bindings, port `3001` doesn't need to be exposed or defined.

By default, when Azure Functions tries to communicate with Dapr, it calls Dapr over the port resolved from the environment variable `DAPR_HTTP_PORT`. If that variable is null, it defaults to port `3500`.  

You can override the Dapr address used by input and output bindings by setting the `DaprAddress` property in the `function.json` for the binding (or the attribute). By default, it uses `http://localhost:{DAPR_HTTP_PORT}`.

The function app still exposes another port and endpoint for things like HTTP triggers, which locally defaults to `7071`, but in a container, defaults to `80`.

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [In-process class library](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  

---

The Dapr Extension supports parameter types according to the table below.

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

## Try out the Dapr Extension for Azure Functions

Learn how to use the Dapr Extension for Azure Functions via the provided samples.

| Samples | Description |
|-|-| 
| [Quickstart][dapr-quickstart] | Get started using the Dapr Pub/sub binding and `HttpTrigger`. |
| [Dapr Kafka][dapr-kafka] | Learn how to use the Azure Functions Dapr Extension with the Kafka bindings Dapr component. |
| [.NET In-process][dapr-in-proc] | Learn how to use Azure Functions in-process model to integrate with multiple Dapr components in .NET, like Service Invocation, Pub/sub, Bindings, and State Management. |
| [.NET Isolated][dapr-isolated] | Integrate with Dapr components in .NET using the Azure Functions out-of-proc (OOP) execution model. |

[dapr-quickstart]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/quickstarts/dotnet-isolated
[dapr-kafka]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/python-v2-azurefunction#3-dapr-binding
[dapr-in-proc]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-azurefunction
[dapr-isolated]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-isolated-azurefunction

::: zone-end

::: zone pivot="programming-language-java"

## Try out the Dapr Extension for Azure Functions

Learn how to use the Dapr Extension for Azure Functions via the provided samples.

| Samples | Description |
|-|-| 
| [Java Functions][dapr-java] | Learn how to use the Azure Functions Dapr Extension using Java. |

[dapr-java]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/java-azurefunction

::: zone-end

::: zone pivot="programming-language-javascript"

## Try out the Dapr Extension for Azure Functions

Learn how to use the Dapr Extension for Azure Functions via the provided samples.

| Samples | Description |
|-|-| 
| [Quickstart][dapr-quickstart] | Get started using the Dapr Pub/sub binding and `HttpTrigger`. |
| [Dapr Kafka][dapr-kafka] | Learn how to use the Azure Functions Dapr Extension with the Kafka bindings Dapr component. |
| [JavaScript][dapr-js] | Run a JavaScript Dapr function application and integrate with Dapr Service Invocation, Pub/sub, Bindings, and State Management using Azure Functions. |

[dapr-quickstart]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/quickstarts/javascript
[dapr-kafka]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/javascript-azurefunction#3-dapr-binding
[dapr-js]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/javascript-azurefunction

::: zone-end

::: zone pivot="programming-language-powershell"

## Try out the Dapr Extension for Azure Functions

Learn how to use the Dapr Extension for Azure Functions via the provided samples.

| Samples | Description |
|-|-| 
| [PowerShell Functions][dapr-powershell] | Learn how to use the Azure Functions Dapr Extension with PowerShell. |

[dapr-powershell]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/powershell-azurefunction

::: zone-end

::: zone pivot="programming-language-python"

## Try out the Dapr Extension for Azure Functions

Learn how to use the Dapr Extension for Azure Functions via the provided samples.

| Samples | Description |
|-|-| 
| [Dapr Kafka][dapr-kafka] | Learn how to use the Azure Functions Dapr Extension with the Kafka bindings Dapr component. |
| [Python v1][dapr-python] | Run a Dapr-ized Python application and use the Azure Functions Python v1 programming model to integrate with Dapr components. |
| [Python v2][dapr-python-2] | Launch a Dapr application using the Azure Functions Python v2 programming model to integrate with Dapr components. |

[dapr-kafka]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-isolated-azurefunction#3-dapr-binding
[dapr-python]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/python-azurefunction
[dapr-python-2]: https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/python-v2-azurefunction

::: zone-end

## Next steps

[Learn more about Dapr.](https://docs.dapr.io/)

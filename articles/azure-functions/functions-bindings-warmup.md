---
title: Azure Functions warmup trigger
description: Understand how to use the warmup trigger in Azure Functions.
keywords: azure functions, functions, event processing, warmup, cold start, premium, dynamic compute, serverless architecture
ms.service: azure-functions
ms.topic: reference
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 09/04/2023
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions warmup trigger

This article explains how to work with the warmup trigger in Azure Functions. A warmup trigger is invoked when an instance is added to scale a running function app. The warmup trigger lets you define a function that runs when a new instance of your function app is started. You can use a warmup trigger to preload custom dependencies so your functions are ready to start processing requests immediately. Some actions for a warmup trigger might include opening connections, loading dependencies, or running any other custom logic before your app begins receiving traffic.

The following considerations apply when using a warmup trigger:

* The warmup trigger isn't available to apps running on the [Consumption plan](./consumption-plan.md).
* The warmup trigger isn't supported on version 1.x of the Functions runtime.  
* Support for the warmup trigger is provided by default in all development environments. You don't have to manually install the package or register the extension.
* There can be only one warmup trigger function per function app, and it can't be invoked after the instance is already running.
* The warmup trigger is only called during scale-out operations, not during restarts or other nonscaling startups. Make sure your logic can load all required dependencies without relying on the warmup trigger. Lazy loading is a good pattern to achieve this goal.
* Dependencies created by warmup trigger should be shared with other functions in your app. To learn more, see [Static clients](manage-connections.md#static-clients).
* If the [built-in authentication](../app-service/overview-authentication-authorization.md) (also known as Easy Auth) is used, [HTTPS Only](../app-service/configure-ssl-bindings.md#enforce-https) should be enabled for the warmup trigger to get invoked.

## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [Isolated worker model](#tab/isolated-process)

The following example shows a [C# function](dotnet-isolated-process-guide.md) that runs on each new instance when added to your app. 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Warmup/Warmup.cs" range="4-18":::

# [In-process model](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that runs on each new instance when added to your app. 

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
 
namespace WarmupSample
{

    //Declare shared dependencies here

    public static class Warmup
    {
        [FunctionName("Warmup")]
        public static void Run([WarmupTrigger()] WarmupContext context,
            ILogger log)
        {
            //Initialize shared dependencies here
            
            log.LogInformation("Function App instance is warm.");
        }
    }
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

The following example shows a warmup trigger that runs when each new instance is added to your app.

```java
@FunctionName("Warmup")
public void warmup( @WarmupTrigger Object warmupContext, ExecutionContext context) {
    context.getLogger().info("Function App instance is warm.");
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

The following example shows a warmup trigger [JavaScript function](functions-reference-node.md) that runs on each new instance when added to your app.

```javascript
import { app } from "@azure/functions";

app.warmup('warmupTrigger1', {
    handler: (warmupContext, context) => {
        context.log('Function App instance is warm.');
    },
});
```

# [Model v3](#tab/nodejs-v3)

The following example shows a warmup trigger in a *function.json* file and a [JavaScript function](functions-reference-node.md) that runs on each new instance when added to your app.

Here's the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "warmupTrigger",
            "direction": "in",
            "name": "warmupContext"
        }
    ]
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```JavaScript
module.exports = async function (warmupContext, context) {
    context.log('Function App instance is warm.');
};
```

::: zone-end
::: zone pivot="programming-language-typescript"
# [Model v4](#tab/nodejs-v4)

The following example shows a warmup trigger [JavaScript function](functions-reference-node.md) that runs on each new instance when added to your app.

```TypeScript
import { app, InvocationContext, WarmupContextOptions } from "@azure/functions";

export async function warmupFunction(warmupContext: WarmupContextOptions, context: InvocationContext): Promise<void> {
    context.log('Function App instance is warm.');
}

app.warmup('warmup', {
    handler: warmupFunction,
});
```

# [Model v3](#tab/nodejs-v3)
TypeScript samples aren't documented for model v3.

::: zone-end
::: zone pivot="programming-language-powershell"  
Here's the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "warmupTrigger",
            "direction": "in",
            "name": "warmupContext"
        }
    ]
}
```
PowerShell example code pending.

<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows a warmup trigger in a *function.json* file and a [Python function](functions-reference-python.md) that runs on each new instance when it'is added to your app.

Your function must be named `warmup` (case-insensitive) and there can only be one warmup function per app.

Here's the *function.json* file:

```json
{
    "bindings": [
        {
            "type": "warmupTrigger",
            "direction": "in",
            "name": "warmupContext"
        }
    ]
}
```

For more information, see [Configuration](#configuration).

Here's the Python code:

```python
import logging
import azure.functions as func


def main(warmupContext: func.Context) -> None:
    logging.info('Function App instance is warm.')
```

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use the `WarmupTrigger` attribute to define the function. C# script instead uses a [function.json configuration file](#configuration).

# [Isolated worker model](#tab/isolated-process)

Use the `WarmupTrigger` attribute to define the function. This attribute has no parameters.

# [In-process model](#tab/in-process)

Use the `WarmupTrigger` attribute to define the function. This attribute has no parameters.   

---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

Warmup triggers don't require annotations. Just use a name of `warmup` (case-insensitive) for the `FunctionName` annotation.

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

# [Model v4](#tab/nodejs-v4)

There are no properties that need to be set on the `options` object passed to the `app.warmup()` method.

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file. 

|function.json property |Description|
|---------|----------------------|
| **type** | Required - must be set to `warmupTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code. A `name` of `warmupContext` is recommended for the binding parameter.|

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. 

|function.json property |Description|
|---------|----------------------|
| **type** | Required - must be set to `warmupTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code. A `name` of `warmupContext` is recommended for the binding parameter.|

::: zone-end   

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The following considerations apply to using a warmup function in C#:

# [Isolated worker model](#tab/isolated-process)

- Your function must be named `warmup` (case-insensitive) using the `Function` attribute.
- A return value attribute isn't required.
- Use the `Microsoft.Azure.Functions.Worker.Extensions.Warmup` package
- You can pass an object instance to the function.

# [In-process model](#tab/in-process)

- Your function must be named `warmup` (case-insensitive) using the `FunctionName` attribute.
- A return value attribute isn't required.
- You must be using version `3.0.5` of the `Microsoft.Azure.WebJobs.Extensions` package, or a later version. 
- You can pass a `WarmupContext` instance to the function.

---

::: zone-end  
::: zone pivot="programming-language-java"
Your function must be named `warmup` (case-insensitive) using the `FunctionName` annotation. 
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
# [Model v4](#tab/nodejs-v4)
See the list of considerations at the top of the page for general usage advice.
# [Model v3](#tab/nodejs-v3)
The function type in _function.json_ must be set to `warmupTrigger`.
::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"
The function type in function.json must be set to `warmupTrigger`.
::: zone-end  

## Next steps

+ [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
+ [Learn more about Premium plan](functions-premium-plan.md)  

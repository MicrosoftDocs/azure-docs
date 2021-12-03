---
title: Azure Functions warmup trigger
description: Understand how to use the warmup trigger in Azure Functions.
documentationcenter: na
author: craigshoemaker
manager: gwallace
keywords: azure functions, functions, event processing, warmup, cold start, premium, dynamic compute, serverless architecture

ms.service: azure-functions
ms.topic: reference
ms.custom: devx-track-csharp
ms.date: 12/09/2021
ms.author: cshoe
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Functions warm-up trigger

This article explains how to work with the warmup trigger in Azure Functions. A warmup trigger is invoked when an instance is added to scale a running function app. You can use a warmup trigger to pre-load custom dependencies during the [pre-warming process](./functions-premium-plan.md#pre-warmed-instances) so that your functions are ready to start processing requests immediately.

> [!NOTE]
> The warmup trigger isn't supported for function apps running in a Consumption plan.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that runs on each new instance when it's added to your app. A return value attribute isn't required.

- Your function must be named ```warmup``` (case-insensitive) and there may only be one warmup function per app.
- To use warmup as a .NET class library function, make sure you have a package reference to **Microsoft.Azure.WebJobs.Extensions >= 3.0.5**

  ```text
  <PackageReference Include="Microsoft.Azure.WebJobs.Extensions" Version="3.0.5" />
  ```

Placeholder comments show where in the application to declare and initialize shared dependencies. 
[Learn more about shared dependencies here](./manage-connections.md#client-code-examples).

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
            
            log.LogInformation("Function App instance is warm 🌞🌞🌞");
        }
    }
}
```

# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Warmup/Warmup.cs" range="9-18":::

# [C# Script](#tab/csharp-script)

The following example shows a warmup trigger in a *function.json* file and a [C# script function](functions-reference-csharp.md) that runs on each new instance when it's added to your app.

Your function must be named ```warmup``` (case-insensitive), and there may only be one warmup function per app.

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

For more information, see [Examples](#tabpanel_2_csharp-script).

```cs
public static void Run(WarmupContext warmupContext, ILogger log)
{
    log.LogInformation("Function App instance is warm 🌞🌞🌞");  
}
```

---

::: zone-end
::: zone pivot="programming-language-java"

The following example shows a warmup trigger that runs when each new instance is added to your app.

Your function must be named `warmup` (case-insensitive) and there may only be one warmup function per app.

```java
@FunctionName("Warmup")
public void run( ExecutionContext context) {
       context.getLogger().info("Function App instance is warm 🌞🌞🌞");
}
```

::: zone-end  
::: zone pivot="programming-language-javascript"  

The following example shows a warmup trigger in a *function.json* file and a [JavaScript function](functions-reference-node.md) that runs on each new instance when it's added to your app.

Your function must be named ```warmup``` (case-insensitive) and there may only be one warmup function per app.

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

The [configuration](#tabpanel_2_csharp-script) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function (context, warmupContext) {
    context.log('Function App instance is warm 🌞🌞🌞');
};
```

::: zone-end  
::: zone pivot="programming-language-powershell"  

<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows a warmup trigger in a *function.json* file and a [Python function](functions-reference-python.md) that runs on each new instance when it'is added to your app.

Your function must be named ```warmup``` (case-insensitive) and there may only be one warmup function per app.

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
    logging.info('Function App instance is warm 🌞🌞🌞')
```

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the `WarmupTrigger` attribute to define the function. C# script instead uses a *function.json* configuration file.

The attribute's constructor takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**warmupContext** |Description 1|
|**context** | Description 2|

# [In-process](#tab/in-process)

This example demonstrates how to use the [warmup](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/dev/src/WebJobs.Extensions/Extensions/Warmup/Trigger/WarmupTriggerAttribute.cs) attribute.

Note that your function must be called ```Warmup``` and there can only be one warmup function per app.

```csharp
 [FunctionName("Warmup")]
        public static void Run(
            [WarmupTrigger()] WarmupContext context, ILogger log)
        {
            ...
        }
```

For a complete example, see the [example](#tabpanel_1_in-process).

# [Isolated process](#tab/isolated-process)

This example demonstrates how to use the [warmup](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/dev/src/WebJobs.Extensions/Extensions/Warmup/Trigger/WarmupTriggerAttribute.cs) attribute.

Note that your function must be called ```Warmup``` and there can only be one warmup function per app.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Warmup/Warmup.cs" range="11-12":::


# [C# script](#tab/csharp-script)

C# script uses a function.json file for configuration instead of attributes.

The following table explains the binding configuration properties for C# script that you set in the *function.json* file. 


The following table explains the binding configuration properties that you set in the *function.json* file and the `WarmupTrigger` attribute.

|function.json property |Description |
|---------|----------------------|
| **type** | Required - must be set to `warmupTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code.|
|**warmupContext** |Description 1|
|**context** | Description 2|

---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

The warmup trigger is not supported in Java as an attribute.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. 

|function.json property |Description|
|---------|----------------------|
| **type** | Required - must be set to `warmupTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code.|

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the warmup trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

No additional information is provided to a warmup triggered function when it is invoked.

# [Isolated process](#tab/isolated-process)

No additional information is provided to a warmup triggered function when it is invoked.

# [C# script](#tab/csharp-script)

No additional information is provided to a warmup triggered function when it is invoked.

---

::: zone-end  
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"
No additional information is provided to a warmup triggered function when it is invoked.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell"  
No additional information is provided to a warmup triggered function when it is invoked.
::: zone-end  
::: zone pivot="programming-language-powershell"  
No additional information is provided to a warmup triggered function when it is invoked.
::: zone-end   
::: zone pivot="programming-language-python"  
No additional information is provided to a warmup triggered function when it is invoked.
::: zone-end  

## Packages - Functions 2.x and higher

The [Microsoft.Azure.WebJobs.Extensions](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions) NuGet package, version **3.0.5 or higher** is required. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/tree/main/src/WebJobs.Extensions/Extensions/Warmup) GitHub repository.

[!INCLUDE [functions-package](../../includes/functions-package-auto.md)]

## Trigger

The warmup trigger lets you define a function that will be run on a new instance when it is added to your running app. You can use a warmup function to open connections, load dependencies, or run any other custom logic before your app will begin receiving traffic.

The warmup trigger is intended to create shared dependencies that will be used by the other functions in your app. [See examples of shared dependencies here](./manage-connections.md#client-code-examples).

## Trigger - limits

* The warmup trigger isn't available to apps running on the [Consumption plan](./consumption-plan.md).
* The warmup trigger is only called during scale-out operations, not during restarts or other non-scale startups. You must ensure your logic can load all necessary dependencies without using the warmup trigger. Lazy loading is a good pattern to achieve this goal.
* The warmup trigger cannot be invoked once an instance is already running.
* There can only be one warmup trigger function per function app.

## Next steps

[Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

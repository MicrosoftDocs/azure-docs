---
title: Azure Functions warmup trigger
description: Understand how to use the warmup trigger in Azure Functions.
documentationcenter: na
author: alexkarcher-msft
manager: gwallace
keywords: azure functions, functions, event processing, warmup, cold start, premium, dynamic compute, serverless architecture

ms.service: azure-functions
ms.topic: reference
ms.date: 11/08/2019
ms.author: alkarche
---

# Azure Functions warm-up trigger

This article explains how to work with the warmup trigger in Azure Functions. The warmup trigger is supported only for function apps running in a [Premium plan](functions-premium-plan.md). A warmup trigger  is invoked when an instance is added to scale a running function app. You can use a warmup trigger to pre-load custom dependencies during the [pre-warming process](./functions-premium-plan.md#pre-warmed-instances) so that your functions are ready to start processing requests immediately. 

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 2.x and higher

The [Microsoft.Azure.WebJobs.Extensions](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions) NuGet package, version **3.0.5 or higher** is required. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Http/) GitHub repository. 

[!INCLUDE [functions-package](../../includes/functions-package-auto.md)]

## Trigger

The warmup trigger lets you define a function that will be run on a new instance when it is added to your running app. You can use a warmup function to open connections, load dependencies, or run any other custom logic before your app will begin receiving traffic. 

The warmup trigger is intended to create shared dependencies that will be used by the other functions in your app. [See examples of shared dependencies here](./manage-connections.md#client-code-examples).

Note that the warmup trigger is only called during scale-out operations, not during restarts or other non-scale startups. You must ensure your logic can load all necessary dependencies without using the warmup trigger. Lazy loading is a good pattern to achieve this.

## Trigger - example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that will run on each new instance when it is added to your app. A return value attribute isn't required.


* Your function must be named ```warmup``` (case-insensitive) and there may only be one warmup function per app.
* To use warmup as a .NET class library function, please make sure you have a package reference to **Microsoft.Azure.WebJobs.Extensions >= 3.0.5**
    * ```<PackageReference Include="Microsoft.Azure.WebJobs.Extensions" Version="3.0.5" />```


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
# [C# Script](#tab/csharp-script)


The following example shows a warmup trigger in a *function.json* file and a [C# script function](functions-reference-csharp.md) that will run on each new instance when it is added to your app.

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

The [configuration](#trigger---configuration) section explains these properties.

Here's C# script code that binds to `HttpRequest`:

```cs
public static void Run(ILogger log)
{
    log.LogInformation("Function App instance is warm 🌞🌞🌞");  
}
```

# [JavaScript](#tab/javascript)

The following example shows a warmup trigger in a *function.json* file and a [JavaScript function](functions-reference-node.md)  that will run on each new instance when it is added to your app.

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

The [configuration](#trigger---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function (context, warmupContext) {
    context.log('Function App instance is warm 🌞🌞🌞');
    context.done();
};
```

# [Python](#tab/python)

The following example shows a warmup trigger in a *function.json* file and a [Python function](functions-reference-python.md) that will run on each new instance when it is added to your app.

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

The [configuration](#trigger---configuration) section explains these properties.

Here's the Python code:

```python
import logging
import azure.functions as func


def main(warmupContext: func.Context) -> None:
    logging.info('Function App instance is warm 🌞🌞🌞')
```

# [Java](#tab/java)

The following example shows a warmup trigger in a *function.json* file and a [Java functions](functions-reference-java.md)  that will run on each new instance when it is added to your app.

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

Here's the Java code:

```java
@FunctionName("Warmup")
public void run( ExecutionContext context) {
       context.getLogger().info("Function App instance is warm 🌞🌞🌞");
}
```

---

## Trigger - attributes

In [C# class libraries](functions-dotnet-class-library.md), the `WarmupTrigger` attribute is available to configure the function.

# [C#](#tab/csharp)

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

For a complete example, see the [trigger example](#trigger---example).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The warmup trigger is not supported in Java as an attribute.

---

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `WarmupTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
| **type** | n/a| Required - must be set to `warmupTrigger`. |
| **direction** | n/a| Required - must be set to `in`. |
| **name** | n/a| Required - the variable name used in function code.|

## Trigger - usage

No additional information is provided to a warmup triggered function when it is invoked.

## Trigger - limits

* The warmup trigger is only available to apps running on the [Premium plan](./functions-premium-plan.md).
* The warmup trigger is only called during scale up operations, not during restarts or other non-scale startups. You must ensure your logic can load all necessary dependencies without using the warmup trigger. Lazy loading is a good pattern to achieve this.
* The warmup trigger cannot be invoked once an instance is already running.
* There can only be one warmup trigger function per function app.

## Next steps

[Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

---
title: Using Redis Output Azure Functions for Azure Cache for Redis (preview)
description: Learn how to use Redis an output Azure Functions 
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 12/19/2023
---

# Azure Cache for Redis output binding for Azure Functions

When a function runs, the Azure Azure Cache for Redis output binding retrieves data from a cache and passes it to the input parameter of the function.

For information on setup and configuration details, see the [overview](functions-bindings-cache.md).

## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

This is an example of the SetDeleters function.

```c#
        [FunctionName(nameof(SetDeleter))]
        public static void Run(
            [RedisPubSubTrigger(Common.connectionStringSetting, "__keyevent@0__:set")] string key,
            [Redis(Common.connectionStringSetting, "DEL")] out string[] arguments,
            ILogger logger)
        {
            logger.LogInformation($"Deleting recently SET key '{key}'");
            arguments = new string[] { key };
        }
```

# [Isolated process](#tab/isolated-process)

<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49":::
-->

---

::: zone-end
::: zone pivot="programming-language-java"

<!--Content and samples from the Java tab in ##Examples go here.-->

```java
public class SetGetter {
    @FunctionName("SetGetter")
    public void run(
            @RedisPubSubTrigger(
                name = "key",
                connectionStringSetting = "redisConnectionString",
                channel = "__keyevent@0__:set")
                String key,
            @RedisInput(
                name = "value",
                connectionStringSetting = "redisConnectionString",
                command = "GET {Message}")
                String value,
            final ExecutionContext context) {
            context.getLogger().info("Key '" + key + "' was set to value '" + value + "'");
    }

```


::: zone-end  
::: zone pivot="programming-language-javascript"  

<!--Content and samples from the JavaScript tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-powershell"  

<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-python"  

<!--Content and samples from the Python tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

<!-- If the attribute's constructor takes parameters, you'll need to include a table like this, where the values are from the original table in the Configuration section:

The attribute's constructor takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**Parameter1** |Description 1|
|**Parameter2** | Description 2|

-->

# [In-process](#tab/in-process)

<!--C# attribute information for the trigger from ## Attributes and annotations goes here, with intro sentence.-->

# [Isolated process](#tab/isolated-process)

<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16":::
-->

---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations
<!-- Equivalent values for the annotation parameters in Java.-->
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file. 
<!-- this get more complex when you support the Python v2 model. -->

<!-- suggestion 

|function.json property |Description|
|---------|---------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |
-->

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  
The parameter type supported by the XXX trigger depends on the Functions runtime version and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information specific to in-process, including types. -->

# [Isolated process](#tab/isolated-process)

<!--Any usage information specific to isolated worker process, including types. -->

---

::: zone-end  
<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-java"
<!--Any usage information from the Java tab in ## Usage. -->
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell"  
<!--Any usage information from the JavaScript tab in ## Usage. -->
::: zone-end  
::: zone pivot="programming-language-powershell"  
<!--Any usage information from the PowerShell tab in ## Usage. -->
::: zone-end   
::: zone pivot="programming-language-python"  
<!--Any usage information from the Python tab in ## Usage. -->
::: zone-end  

<!---## Extra sections

Put any sections with content that doesn't fit into the above section headings down here.  
-->

## host.json settings

<!-- Some bindings don't have this section. If yours doesn't, please remove this section. -->

## Next steps

<!--At least one next step link.-->
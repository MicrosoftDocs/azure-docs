---
title: Using Redis Input Azure Function for Azure Cache for Redis (preview)
description: Learn how to use Redis an input Azure Functions 
author: flang-msft
zone_pivot_groups: programming-languages-set-functions-lang-workers

ms.author: franlanglois
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: reference
ms.date: 12/19/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Cache for Redis input binding for Azure Functions

When a function runs, the Azure Azure Cache for Redis input binding retrieves data from a cache and passes it to the input parameter of the function.

For information on setup and configuration details, see the [overview](functions-bindings-cache.md).

## Example

::: zone pivot="programming-language-csharp"

<!--Optional intro text goes here, followed by the C# modes include.-->

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

More samples for the Azure SQL input binding are available in the GitHub repository.
<!-- link to redis samples -->

This section contains the following examples:
<!-- list of samples -->

The examples refer to a 
<!-- fill in the details superficially. -->

# [In-process](#tab/in-process)

<!--Content and samples from the C# tab in ##Examples go here.-->
Not available in preview.

# [Isolated process](#tab/isolated-process)

Not available in preview.


<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49":::
-->

---

::: zone-end
::: zone pivot="programming-language-java"

Not available in preview.

<!--Content and samples from the Java tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-javascript"  

Not available in preview.

Not available in preview.

<!--Content and samples from the JavaScript tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-powershell"  

Not available in preview.

<!--Content and samples from the PowerShell tab in ##Examples go here.-->

::: zone-end  
::: zone pivot="programming-language-python"  

This section contains the following examples:

- Sample 1
- Sample 2

### Sample 1

Sample 1 refers to trigger-redislist:

The following is sample Python code:

The Python v1 programming model requires you to define bindings in a separate _function.json_ file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

Here's the `__init__.py` file:

```python
import logging

def main(entry: str):
    logging.info(entry)
```

From `function.json`, here's the binding data:

```json
{
  "bindings": [
    {
      "type": "redisListTrigger",
      "listPopFromBeginning": true,
      "connectionStringSetting": "redisLocalhost",
      "key": "listTest",
      "pollingIntervalInMs": 1000,
      "messagesPerWorker": 100,
      "count": 10,
      "name": "entry",
      "direction": "in"
    }
  ],
  "scriptFile": "__init__.py"
}
```


The [configuration](#configuration) section explains these properties.

The following is sample Python code:


### Sample 2
Sample 2 refers to:

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

### [v1](#tab/python-v1)

The following table explains the binding configuration properties that you set in the function.json file.

| function.json Property | Description                                                                                                                                                 | Optional | Default |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|--------:|
| `type`                 | Name of the trigger.                                                                                                                                        | No       |         |
| `listPopFromBeginning` | Whether to delete the stream entries after the function has run. Set to `true`.                                                                             | Yes      | `true`  |
| `connectionString`     | The name of the setting in the `appsettings` that contains the cache connection string. For example: `<cacheName>.redis.cache.windows.net:6380,password...` | No       |         |
| `key`                  | This field can be resolved using `INameResolver`.                                                                                                           | No       |         |
| `pollingIntervalInMs`  | How often to poll Redis in milliseconds.                                                                                                                    | Yes      | `1000`  |
| `messagesPerWorker`    | How many messages each functions instance should process. Used to determine how many instances the function should scale to.                                | Yes      | `100`   |
| `count`                | Number of entries to read from the cache at one time. These are processed in parallel.                                                                      | Yes      | `10`    |
| `name`                 | ?                                                                                                                                                           | Yes      |         |
| `direction`            | Set to `in`.                                                                                                                                                | No       |         |

<!-- suggestion 

|function.json property |Description|
|---------|---------|
| **type** | Required - must be set to `eventGridTrigger`. |
| **direction** | Required - must be set to `in`. |
| **name** | Required - the variable name used in function code for the parameter that receives the event data. |
-->

### [v2](#tab/python-v2)

<!-- this get more complex when you support the Python v2 model. -->

The Python v2 programming model example isn't available in preview.

---

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
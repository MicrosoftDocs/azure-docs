---
title: Dapr State input binding for Azure Functions
description: Learn how to provide Dapr State input binding data to an Azure Function.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr State input binding for Azure Functions

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

The input binding allows you to read Dapr data as input to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

::: zone-end

::: zone pivot="programming-language-csharp"

## Example

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

```csharp
[FunctionName("StateInputBinding")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "state/{key}")] HttpRequest req,
    [DaprState("statestore", Key = "{key}")] string state,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    return new OkObjectResult(state);
}
```

# [Isolated process](#tab/isolated-process)

The following example shows how the custom type is used in both the trigger and a Dapr state output binding.

TODO: current example has in-proc, need to update with out-of-proc

:::code language="csharp" source="https://www.github.com/azure/azure-functions-dapr-extension/samples/dotnet-azurefunction/StateInputBinding.cs" range="8-27"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

## Example

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprState`:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "direction": "in",
      "dataType": "string",
      "name": "state",
      "stateStore": "statestore",
      "key": "{key}"
    }
}
```

Here's the JavaScript code for the Dapr input binding trigger:

```javascript
module.exports = async function (context, req) {
    context.log('Current state of this function: ' + context.bindings.daprState);
};
```

::: zone-end

::: zone pivot="programming-language-python"
## Example

The following example shows a Dapr State input binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprState`:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "direction": "in",
      "dataType": "string",
      "name": "state",
      "stateStore": "statestore",
      "key": "{key}"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(payload, data: str) -> None:
    logging.info('Python function processed a RetrieveOrder request from the Dapr Runtime.')
    logging.info(data)
```

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

In [C# class libraries], use the [DaprState] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to retrieve state. | 
| **Key** | The name of the key to retrieve from the specified state store. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for `DaprState`.

TODO: table has in-proc parameters - need out-of-proc

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to retrieve state. | 
| **Key** | The name of the key to retrieve from the specified state store. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`.  |
|**dataType** |  |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the binding. |
|**key** |  |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr State input binding depends on the Functions runtime version, the extension package version, and the C# modality used.


::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
Access Dapr State input binding using `context.bindings.daprState`.

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr State input binding depends on the Functions runtime version, the extension package version, and the C# modality used.


::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. -->

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## host.json properties

The [host.json] file contains settings that control Dapr trigger behavior. See the [host.json settings](functions-bindings-dapr.md#hostjson-settings) section for details regarding available settings.

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
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
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

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The input binding allows you to read Dapr data as input to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## Example

::: zone-end

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

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

More samples for the Dapr input state binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-isolated-azurefunction/InputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/InputBinding/StateInputBinding.cs" range="15-25"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

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

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log('Current state of this function: ' + context.bindings.daprState);
};
```

::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr State input binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprState`:

```json
{
  "scriptFile": "__init__.py",
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

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use `DaprState` to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to retrieve state. | 
| **Key** | The name of the key to retrieve from the specified state store. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for `DaprStateInput`.

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
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `in`.  |
|**dataType** | The data type used by the state store. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the binding. |
|**key** | The name of the key to retrieve from the specified state store. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage

To use the Dapr state input binding, you'll run `DaprState`. 

You'll also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)



::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr state input binding, you'll define your `daprState` binding in a functions.json file. 

You'll also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)


::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage

To use a Dapr state input binding, you'll define your `daprState` binding in a functions.json file. 

You'll also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

## Next steps

Choose one of the following links to review the reference article for a specific Dapr binding type:

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
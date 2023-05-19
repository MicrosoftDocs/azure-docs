---
title: Dapr State output binding for Azure Functions
description: Learn how to provide Dapr State output binding data to an Azure Function.
ms.topic: reference
ms.date: 05/15/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr State output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The output binding allows you to read Dapr data as output to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## Example

::: zone-end

::: zone pivot="programming-language-csharp"


A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]
   

# [In-process](#tab/in-process)

The following example demonstrates using the Dapr state output binding to persist a new state into the state store. 

```csharp
[FunctionName("StateOutputBinding")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "state/{key}")] HttpRequest req,
    [DaprState("statestore", Key = "{key}")] IAsyncCollector<string> state,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    await state.AddAsync(requestBody);

    return new OkResult();
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr output state binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/blob/master/samples/dotnet-isolated-azurefunction/OutputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/StateOutputBinding.cs" range="16-28"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprState` output:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "direction": "out",
      "name": "dapr",
      "stateStore": "statestore",
      "key": "{key}",
      "daprAddress": "%daprAddress%"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.bindings.dapr = {
        // stateStore: 'statestore-if-not-in-function.json'
        // key: 'key-if-not-in-function.json'
        value: req.body
    };
};
```

::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr State output binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprState`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": 
    {
      "type": "daprState",
      "stateStore": "%StateStoreName%",
      "direction": "out",
      "name": "order",
      "key": "order"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(payload,
         order: func.Out[str]) -> None:
    logging.info('Python function processed a CreateNewOrder request from the Dapr Runtime.')  
    payload_json = json.loads(payload)
    logging.info(payload_json["data"])
    order.set(json.dumps(payload_json["data"]))
```

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprState` to trigger a Dapr output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to save state. | 
| **Key** | The name of the key to save state within the state store. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprStateOutput`.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to save state. | 
| **Key** | The name of the key to save state within the state store. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the state store. |
|**key** | The name of the key to save state within the state store. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
To use the Dapr state output binding, you'll run `DaprState`. 

You'll also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr state output binding, you'll define your `daprState` binding in a functions.json file.  

You'll also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr state output binding, you'll define your `daprState` binding in a functions.json file.  

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
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
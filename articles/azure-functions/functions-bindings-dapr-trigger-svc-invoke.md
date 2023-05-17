---
title: Dapr Service Invocation trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr service invocation data changes.
ms.topic: reference
ms.date: 05/15/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Service Invocation trigger for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

Azure Functions can be triggered using the following Dapr events.

There are no templates for triggers in Dapr in the functions tooling today. Start your project with another trigger type (e.g. Storage Queues) and then modify the function.json or attributes.

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## Example

::: zone-end

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]
   

# [In-process](#tab/in-process)

```csharp
[FunctionName("CreateNewOrder")]
public static void Run(
    [DaprServiceInvocationTrigger] JObject payload,
    [DaprState("%StateStoreName%", Key = "order")] out JToken order,
    ILogger log)
{
    log.LogInformation("C# function processed a CreateNewOrder request from the Dapr Runtime.");

    // payload must be of the format { "data": { "value": "some value" } }
    order = payload["data"];
}
```

# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/CreateNewOrder.cs" range="8-32"::: 
 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprServiceInvocationTrigger",
      "name": "payload"
    }
  ]
}
```

Here's the JavaScript code for the Dapr Service Invocation trigger:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a RetrieveOrder request from the Dapr Runtime.");

    // print the fetched state value
    context.log(context.bindings.data);
};
```
::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr Service Invocation trigger, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "type": "daprServiceInvocationTrigger",
      "name": "payload",
      "direction": "in"
    }
  ]
}
```

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

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprServiceInvocationTrigger` to trigger a Dapr service invocation binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **MethodName** | _Optional._ The name of the method the Dapr caller should use. If not specified, the name of the function is used as the method name. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprServiceInvocationTrigger`.

| Parameter | Description | 
| --------- | ----------- | 
| **MethodName** | _Optional._ The name of the method the Dapr caller should use. If not specified, the name of the function is used as the method name. | 

---

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprServiceInvocationTrigger`.|
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`.  |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr Service Invocation trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr Service Invocation trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr Service Invocation trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

## Next steps

Choose one of the following links to review the reference article for a specific Dapr binding type:

- Triggers 
  - [Dapr input binding](./functions-bindings-dapr-trigger-input.md)
  - [Dapr topic](./functions-bindings-dapr-trigger-topic.md)
- Input
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
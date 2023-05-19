---
title: Dapr Binding output binding for Azure Functions
description: Learn how to provide Dapr Binding output binding data to an Azure Function.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Binding output binding for Azure Functions

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

The following example demonstrates using a Dapr service invocation trigger and a Dapr output binding to read and process a binding request.

```csharp
[FunctionName("SendMessageToKafka")]
public static async Task Run(
    [DaprServiceInvocationTrigger] JObject payload,
    [DaprBinding(BindingName = "%KafkaBindingName%", Operation = "create")] IAsyncCollector<object> messages,
    ILogger log)
{
    log.LogInformation("C#  function processed a SendMessageToKafka request.");
    await messages.AddAsync(payload);
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr output invoke binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/blob/master/samples/dotnet-isolated-azurefunction/OutputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/SendMessageToKafka.cs" range="8-39"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprBinding`:

```json
{
  "bindings": 
    {
      "type": "daprBinding",
      "direction": "out",
      "bindingName": "%KafkaBindingName%",
      "operation": "create",
      "name": "messages"
    }
}
```
For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context) {
    context.log("Node HTTP trigger function processed a request.");
    context.bindings.messages = { "data": context.bindings.args };
};
```

::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr Binding output binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprBinding`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": 
    {
      "type": "daprBinding",
      "direction": "out",
      "bindingName": "%KafkaBindingName%",
      "operation": "create",
      "name": "messages"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(args, messages: func.Out[bytes]) -> None:
    logging.info('Python processed a SendMessageToKafka request from the Dapr Runtime.')
    messages.set(json.dumps({"data": args}))
```

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprBinding` to trigger a Dapr output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr binding. | 
| **Operation** | The configured binding operation. | 


# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprBindingOutput`.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr binding. | 
| **Operation** | The configured binding operation. | 

---

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBinding`. |
|**direction** | Must be set to `out`. |
|**bindingname** | The name of the binding. |
|**operation** | The binding operation. |
|**name** | The name of the variable that represents the Dapr data in function code. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
To use the Dapr output binding, you'll run `DaprBinding`. 

You'll also need to set up a Dapr output binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr output binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Use output bindings to interface with external resources](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr output binding, you'll define your `daprBinding` binding in a functions.json file.  

You'll also need to set up a Dapr output binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr output binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Use output bindings to interface with external resources](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr output binding, you'll define your `daprBinding` binding in a functions.json file.  

You'll also need to set up a Dapr output binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr output binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Use output bindings to interface with external resources](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

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
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)


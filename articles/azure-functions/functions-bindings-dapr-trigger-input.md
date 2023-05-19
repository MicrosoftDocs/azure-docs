---
title: Dapr Input Bindings trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr input binding data changes.
ms.topic: reference
ms.date: 05/15/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Input Bindings trigger for Azure Functions

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
[FunctionName("ConsumeMessageFromKafka")]
public static void Run(
    // Note: the value of BindingName must match the binding name in components/kafka-bindings.yaml
    [DaprBindingTrigger(BindingName = "%KafkaBindingName%")] JObject triggerData,
    ILogger log)
{
    log.LogInformation("Hello from Kafka!");
    log.LogInformation($"Trigger data: {triggerData}");
}
```
 
# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/Trigger/ConsumeMessageFromKafka.cs" range="8-29"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

The following example shows Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprBindingTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprBindingTrigger",
      "bindingName": "%KafkaBindingName%",
      "name": "triggerData"
    }
  ]
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context) {
    context.log("Hello from Kafka!");

    context.log(`Trigger data: ${context.bindings.triggerData}`);
};
```

::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr Input Binding trigger, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprBindingTrigger`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "type": "daprBindingTrigger",
      "bindingName": "sample-topic",
      "name": "triggerData",
      "direction": "in"
    }
  ]
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(triggerData: str) -> None:
    logging.info('Hello from Kafka!')
    logging.info('Trigger data: ' + triggerData)
```

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprBindingTrigger` to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr trigger. If not specified, the name of the function is used as the trigger name. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprBindingTrigger`.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr trigger. If not specified, the name of the function is used as the trigger name. | 

---

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. |
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
To use the Dapr Input Binding trigger, you'll run `DaprBindingTrigger`. 

You'll also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr Input Binding trigger, you'll define your `daprBindingTrigger` binding in a functions.json file.  

You'll also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr Input Binding trigger, you'll define your `daprBindingTrigger` binding in a functions.json file.  

You'll also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

## Next steps

Choose one of the following links to review the reference article for a specific Dapr binding type:

- Triggers 
  - [Dapr service invocation](./functions-bindings-dapr-trigger-svc-invoke.md)
  - [Dapr topic](./functions-bindings-dapr-trigger-topic.md)
- Input
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
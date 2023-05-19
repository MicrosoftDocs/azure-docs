---
title: Dapr Topic trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr topic data changes.
ms.topic: reference
ms.date: 05/15/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Topic trigger for Azure Functions

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
[FunctionName("TransferEventBetweenTopics")]
public static void Run(
    [DaprTopicTrigger("%PubSubName%", Topic = "A")] CloudEvent subEvent,
    [DaprPublish(PubSubName = "%PubSubName%", Topic = "B")] out DaprPubSubEvent pubEvent,
    ILogger log)
{
    log.LogInformation("C# function processed a TransferEventBetweenTopics request from the Dapr Runtime.");


    pubEvent = new DaprPubSubEvent("Transfer from Topic A: " + subEvent.Data);
}
```

 
# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/Trigger/TransferEventBetweenTopics.cs" range="20-29"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprTopicTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprTopicTrigger",
      "pubsubname": "messagebus",
      "topic": "B",
      "name": "subEvent"
    }
  ]
}
```

Here's the JavaScript code for the Dapr Topic trigger:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a PrintTopicMessage request from the Dapr Runtime.");
    context.log(`Topic B received a message: ${context.bindings.subEvent.data}.`);
};
```


::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr Topic trigger, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprTopicTrigger`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "type": "daprTopicTrigger",
      "pubsubname": "messagebus",
      "topic": "B",
      "name": "subEvent",
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

def main(subEvent) -> None:
    logging.info('Python function processed a PrintTopicMessage request from the Dapr Runtime.')
    subEvent_json = json.loads(subEvent)
    logging.info("Topic B received a message: " + subEvent_json["data"])
```

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprTopicTrigger` to trigger a Dapr pub/sub binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **PubSubName** | The name of the Dapr pub/sub. | 
| **Topic** | The name of the Dapr topic. | 

# [Isolated process](#tab/isolated-process)

| Parameter | Description | 
| --------- | ----------- | 
| **PubSubName** | The name of the Dapr pub/sub. | 
| **Topic** | The name of the Dapr topic. | 

---

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprTopicTrigger`. |
|**pubsubname** | The name of the Dapr pub/sub component type. |
|**topic** | Name of the topic. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`.  |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr Topic trigger, you'll run `DaprTopicTrigger`. 

You'll also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)


::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr Topic trigger, you'll define your `daprTopicTrigger` binding in a functions.json file.  

You'll also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr Topic trigger, you'll define your `daprTopicTrigger` binding in a functions.json file.  

You'll also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

::: zone-end

## Next steps

Choose one of the following links to review the reference article for a specific Dapr binding type:

- Triggers 
  - [Dapr input binding](./functions-bindings-dapr-trigger-input.md)
  - [Dapr service invocation](./functions-bindings-dapr-trigger-svc-invoke.md)
- Input
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
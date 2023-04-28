---
title: Dapr Topic trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr topic data changes.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Topic trigger for Azure Functions

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

Azure Functions can be triggered using the following Dapr events.

There are no templates for triggers in Dapr in the functions tooling today. Start your project with another trigger type (e.g. Storage Queues) and then modify the function.json or attributes.

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## Example

::: zone-end

::: zone pivot="programming-language-csharp"


A C# function can be created using one of the following C# modes:

* [In-process class library](../articles/azure-functions/functions-dotnet-class-library.md): compiled C# function that runs in the same process as the Functions runtime. 
* [Isolated worker process class library](../articles/azure-functions/dotnet-isolated-process-guide.md): compiled C# function that runs in a worker process that is isolated from the runtime. Isolated worker process is required to support C# functions running on non-LTS versions .NET and the .NET Framework.     

# [In-process](#tab/in-process)

```csharp
[FunctionName("PrintTopicMessage")]
public static void Run(
    [DaprTopicTrigger("%PubSubName%", Topic = "B")] CloudEvent subEvent,
    ILogger log)
{
    log.LogInformation("C# function processed a PrintTopicMessage request from the Dapr Runtime.");
    log.LogInformation($"Topic B received a message: {subEvent.Data}.");
}
```

 
# [Isolated process](#tab/isolated-process)

TODO: current example is in-proc, need to update with out-of-proc
<!--

:::code language="csharp" source="https://www.github.com/azure/azure-functions-dapr-extension/samples/dotnet-azurefunction/PrintTopicMessage.cs" range="8-26"::: 
-->

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
---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function.

# [In-process](#tab/in-process)

In [C# class libraries], use the [DaprTopicTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **PubSubName** | The name of the Dapr pub/sub. | 
| **Topic** | The name of the Dapr topic. | 

# [Isolated process](#tab/isolated-process)

C# attribute information for the trigger goes here with an intro sentence. 
TODO: table has in-proc parameters - need out-of-proc

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
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr Topic trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information from the C# tab in ## Usage. -->
 
# [Isolated process](#tab/isolated-process)

<!--If available, call out any usage information from the linked example in the worker repo. -->


---

::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr Topic trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
TODO: Need usage content. 

Included text: The parameter type supported by the Dapr Topic trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. -->

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## host.json properties

The _host.json_ file contains settings that control Dapr trigger behavior. See the [host.json settings](functions-bindings-dapr.md#hostjson-settings) section for details regarding available settings.

::: zone-end
 
::: zone pivot="programming-language-java,programming-language-powershell"

> [!NOTE]
> Currently, Dapr triggers and bindings are only supported in C#, JavaScript, and Python. 

::: zone-end

## Next steps
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
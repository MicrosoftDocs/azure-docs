---
title: Dapr trigger for Azure Functions
description: Learn how to run an Azure Function as Dapr data changes.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr trigger for Azure Functions

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

Azure Functions can be triggered using the following Dapr events.

There are no templates for triggers in Dapr in the functions tooling today. Start your project with another trigger type (e.g. Storage Queues) and then modify the function.json or attributes.

::: zone-end

::: zone pivot="programming-language-java, programming-language-powershell"

> [!IMPORTANT]
> Dapr triggers for Java are currently under development and not available for Azure Functions.

::: zone-end

::: zone pivot="programming-language-csharp"

## Examples

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

### Input Binding trigger

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

### Service Invocation trigger

```csharp
[FunctionName("RetrieveOrder")]
public static void Run(
    [DaprServiceInvocationTrigger] object args,
    [DaprState("%StateStoreName%", Key = "order")] string data,
    ILogger log)
{
    log.LogInformation("C# function processed a RetrieveOrder request from the Dapr Runtime.");
    // print the fetched state value
    log.LogInformation(data);
}
```

### Topic trigger

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

<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49"::: 

-->


# [C# Script](#tab/csharp-script)

### Input Binding trigger

The following shows a Dapr binding trigger in a _function.json_ file and code that uses the binding. 

```json
{
    "type": "daprBindingTrigger",
    "bindingName": "myKafkaBinding",
    "name": "triggerData",
    "direction": "in"
}
```

Here's the C# script code:

```csharp

```

### Service Invocation trigger

The following shows a Dapr binding trigger in a _function.json_ file and code that uses the binding. 

```json
{
    "type": "daprServiceInvocationTrigger",
    "name": "triggerData",
    "direction": "in"
}
```

Here's the C# script code:

```csharp

```

### Topic trigger

The following shows a Dapr binding trigger in a _function.json_ file and code that uses the binding. 

```json
{
    "type": "daprTopicTrigger",
    "pubsubname": "pubsub",
    "topic": "myTopic",
    "name": "triggerData",
    "direction": "in"
}
```

Here's the C# script code:

```csharp

```


---

::: zone-end 

::: zone pivot="programming-language-javascript"
## Examples

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

### Input Binding trigger

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

Here's the JavaScript code for the Dapr input binding trigger:

```javascript
module.exports = async function (context) {
    context.log("Hello from Kafka!");

    context.log(`Trigger data: ${context.bindings.triggerData}`);
};
```

### Service Invocation trigger

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

Here's the JavaScript code for the Dapr service invocation trigger:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a RetrieveOrder request from the Dapr Runtime.");

    // print the fetched state value
    context.log(context.bindings.data);
};
```


### Topic trigger

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

Here's the JavaScript code for the Dapr topic trigger:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a PrintTopicMessage request from the Dapr Runtime.");
    context.log(`Topic B received a message: ${context.bindings.subEvent.data}.`);
};
```


::: zone-end

::: zone pivot="programming-language-python"
## Examples

The following example shows a Dapr trigger binding. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python

```

# [v1](#tab/python-v1)

### Input Binding trigger

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

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(triggerData: str) -> None:
    logging.info('Hello from Kafka!')
    logging.info('Trigger data: ' + triggerData)
```

### Service Invocation trigger

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

### Topic trigger

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
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

### Input Binding trigger

In [C# class libraries], use the [DaprBindingTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr trigger. If not specified, the name of the function is used as the trigger name. | 

### Service Invocation trigger

In [C# class libraries], use the [DaprServiceInvocationTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **MethodName** | Optional. The name of the method the Dapr caller should use. If not specified, the name of the function is used as the method name. | 

### Topic trigger

In [C# class libraries], use the [DaprBindingTrigger] to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **PubSubName** | The name of the Dapr pub/sub. | 
| **Topic** | The name of the Dapr topic. | 

# [Isolated process](#tab/isolated-process)

<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16"::: 

-->

# [C# Script](#tab/csharp-script)

C# script uses a _function.json_ file for configuration instead of attributes.

### Input Binding trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

### Service Invocation trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprServiceInvocationTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

### Topic trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprTopicTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**pubsubname** |  |
|**topic** |  |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

---

::: zone-end

::: zone pivot="programming-language-javascript"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

### Input Binding trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |

### Service Invocation trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprServiceInvocationTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**name** | The name of the variable that represents the Dapr data in function code. |


### Topic trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprTopicTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**pubsubname** |  |
|**topic** |  |
|**name** | The name of the variable that represents the Dapr data in function code. |


::: zone-end

::: zone pivot="programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the _function.json_ file.

### Input Binding trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

### Service Invocation trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprServiceInvocationTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

### Topic trigger

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprTopicTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**pubsubname** |  |
|**topic** |  |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#examples) for complete examples.

## Usage
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [In-process](#tab/in-process)

<!--Any usage information from the C# tab in ## Usage. -->
 
# [Isolated process](#tab/isolated-process)

<!--If available, call out any usage information from the linked example in the worker repo. -->

# [C# Script](#tab/csharp-script)


---

::: zone-end

<!--Any of the below pivots can be combined if the usage info is identical.-->
::: zone pivot="programming-language-javascript"

See the [Example section](#examples) for complete examples.

## Usage
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#examples) for complete examples.

## Usage
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. -->

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## host.json properties

The [host.json] file contains settings that control Dapr trigger behavior. See the [host.json settings](functions-bindings-dapr.md#hostjson-settings) section for details regarding available settings.

::: zone-end

## Next steps
- [Pull in Dapr state and secrets](./functions-bindings-dapr-input.md)
- [Send a value to a Dapr topic or output binding](./functions-bindings-dapr-output.md)
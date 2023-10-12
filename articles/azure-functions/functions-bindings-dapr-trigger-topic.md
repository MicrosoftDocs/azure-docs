---
title: Dapr Topic trigger for Azure Functions
description: Learn how to run Azure Functions as Dapr topic data changes.
ms.topic: reference
ms.date: 10/11/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Topic trigger for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

Azure Functions can be triggered on a Dapr topic subscription using the following Dapr events.

For information on setup and configuration details of the Dapr extension, see the [Dapr extension overview](./functions-bindings-dapr.md).

## Example

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

::: zone pivot="programming-language-java"

Here's the Java code for subscribing to a topic using the Dapr Topic trigger:

```java
@FunctionName("PrintTopicMessage")
public String run(
        @DaprTopicTrigger(
            pubSubName = "%PubSubName%",
            topic = "B")
        String payload,
        final ExecutionContext context) throws JsonProcessingException {
    Logger logger = context.getLogger();
    logger.info("Java function processed a PrintTopicMessage request from the Dapr Runtime.");
```

::: zone-end

::: zone pivot="programming-language-javascript"

> [!NOTE]  
> The [Node.js v4 model for Azure Functions](functions-reference-node.md?pivots=nodejs-model-v4) isn't currently available for use with the Dapr extension during the preview.  

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

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code for the Dapr Topic trigger:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a PrintTopicMessage request from the Dapr Runtime.");
    context.log(`Topic B received a message: ${context.bindings.subEvent.data}.`);
};
```


::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprTopicTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprTopicTrigger",
      "pubsubname": "%PubSubName%",
      "topic": "B",
      "name": "subEvent",
      "direction": "in"
    }
  ]
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

In code:

```powershell
using namespace System
using namespace Microsoft.Azure.WebJobs
using namespace Microsoft.Extensions.Logging
using namespace Microsoft.Azure.WebJobs.Extensions.Dapr
using namespace Newtonsoft.Json.Linq

param (
    $subEvent
)

Write-Host "PowerShell function processed a PrintTopicMessage request from the Dapr Runtime."

# Convert the object to a JSON-formatted string with ConvertTo-Json
$jsonString = $subEvent["data"] | ConvertTo-Json -Compress

Write-Host "Topic B received a message: $jsonString"
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr Topic trigger, which uses the [v2 Python programming model](functions-reference-python.md). To use the `daprTopicTrigger` in your Python function app code:

```python
import logging
import json
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="PrintTopicMessage")
@app.dapr_topic_trigger(arg_name="subEvent", pub_sub_name="%PubSubName%", topic="B", route="B")
def main(subEvent) -> None:
    logging.info('Python function processed a PrintTopicMessage request from the Dapr Runtime.')
    subEvent_json = json.loads(subEvent)
    logging.info("Topic B received a message: " + subEvent_json["data"])
```

 
# [Python v1](#tab/v1)

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
For more information about *function.json* file properties, see the [Configuration](#configuration) section.

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

# [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), use the `DaprTopicTrigger` to trigger a Dapr pub/sub binding, which supports the following properties.

| Parameter | Description |
| --------- | ----------- |
| **PubSubName** | The name of the Dapr pub/sub. | 
| **Topic** | The name of the Dapr topic. |

# [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), use the `DaprTopicTrigger` to define a Dapr topic trigger, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **PubSubName** | The name of the Dapr pub/sub. |
| **Topic** | The name of the Dapr topic. |

---

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprTopicTrigger` annotation allows you to create a function that runs when a topic is received. 

| Element | Description |
| ------- | ----------- |
| **pubSubName** | The name of the Dapr pub/sub. |
| **topic** | The name of the Dapr topic. |

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|-----------------------|------------|
|**pubsubname** | The name of the Dapr pub/sub component type. |
|**topic** | Name of the topic. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_topic_trigger` that you set in your Python code.

|Property | Description | Can be sent via Attribute | Can be sent via RequestBody |
|---------|-------------|  :---------------------:  |  :-----------------------:  |
|**pub_sub_name** | The name of the Dapr subscription component type. | :heavy_check_mark: | :x: |
|**topic** | The subscription topic. | :heavy_check_mark: | :x: |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description | Can be sent via Attribute | Can be sent via RequestBody |
|-----------------------|-------------|  :---------------------:  |  :-----------------------:  |
|**pubsubname** | The name of the Dapr subscription component type. | :heavy_check_mark: | :x: |
|**topic** | Name of the topic. | :heavy_check_mark: | :x: |

::: zone-end

See the [Example section](#example) for complete examples.

## Usage


To use a Dapr Topic trigger, start by setting up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprTopicTrigger` in Python v2, set up your project with the correct dependencies.

1. [Create and activate a virtual environment](https://learn.microsoft.com/azure/azure-functions/create-first-function-cli-python?tabs=macos%2Cbash%2Cazure-cli&pivots=python-mode-decorators#create-venv). 

1. In your `requirements.text` file, add the following line:

   ```txt
   azure-functions==1.18.0b3
   ```

1. In the terminal, install the Python library.

   ```bash
   pip install -r .\requirements.txt
   ```

1. Modify your `local.setting.json` file with the following configuration:

   ```json
   "PYTHON_ISOLATE_WORKER_DEPENDENCIES":1
   ```

# [Python v1](#tab/v1)

The Python v1 model requires no additional changes, aside from setting up the pub/sub component.

---

::: zone-end

## Next steps

[Learn more about Dapr publish and subscribe.](https://docs.dapr.io/developing-applications/building-blocks/pubsub/)

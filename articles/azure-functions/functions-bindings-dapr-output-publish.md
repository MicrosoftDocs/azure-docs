---
title: Dapr Publish output binding for Azure Functions
description: Learn how to provide Dapr Publish output binding data using Azure Functions.
ms.topic: reference
ms.date: 08/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Publish output binding for Azure Functions

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-python,programming-language-powershell"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr publish output binding allows you to publish a message to a Dapr topic during a function execution.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

## Example

::: zone-end

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

# [In-process](#tab/in-process)

The following example demonstrates using a Dapr publish output binding to perform a Dapr publish operation to a pub/sub component and topic. 

```csharp
[FunctionName("PublishOutputBinding")]
public static void Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "topic/{topicName}")] HttpRequest req,
    [DaprPublish(PubSubName = "%PubSubName%", Topic = "{topicName}")] out DaprPubSubEvent pubSubEvent,
    ILogger log)
{
    string requestBody = new StreamReader(req.Body).ReadToEnd();
    pubSubEvent = new DaprPubSubEvent(requestBody);
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr output publish binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/blob/master/samples/dotnet-isolated-azurefunction/OutputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/PublishOutputBinding.cs" range="16-25"::: 

---

::: zone-end 

::: zone pivot="programming-language-java"

The following example creates a `"TransferEventBetweenTopics"` function using the `DaprPublishOutput` binding with an [`DaprTopicTrigger`](./functions-bindings-dapr-trigger-topic.md):


```java
@FunctionName("TransferEventBetweenTopics")
public String run(
        @DaprTopicTrigger(
            pubSubName = "%PubSubName%",
            topic = "A")
            String request,
        @DaprPublishOutput(
            pubSubName = "%PubSubName%",
            topic = "B")
        OutputBinding<String> payload,
        final ExecutionContext context) throws JsonProcessingException {
    context.getLogger().info("Java function processed a TransferEventBetweenTopics request from the Dapr Runtime.");
}
```
::: zone-end

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprPublish`:

```json
{
  "bindings": 
    {
      "type": "daprPublish",
      "direction": "out",
      "pubsubname": "messagebus",
      "topic": "{topicName}",
      "name": "payload"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code: 

```javascript
module.exports = async function (context, req) {
    context.log("Node HTTP trigger function processed a request.");
    context.bindings.payload = { payload: req.body };
    context.done(null);
};
```

::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprPublish`:

```json
{
  "bindings": 
    {
      "type": "daprPublish",
      "direction": "out",
      "name": "pubEvent",
      "pubsubname": "%PubSubName%",
      "topic": "B"
    }
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

# Example to use Dapr Service Invocation Trigger and Dapr State Output binding to persist a new state into statestore
param (
    $subEvent
)

Write-Host "PowerShell function processed a TransferEventBetweenTopics request from the Dapr Runtime."

# Convert the object to a JSON-formatted string with ConvertTo-Json
$jsonString = $subEvent["data"]

$messageFromTopicA = "Transfer from Topic A: $jsonString".Trim()

$publish_output_binding_req_body = @{
    "payload" = $messageFromTopicA
}

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name pubEvent -Value $publish_output_binding_req_body
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr Publish output binding, which uses the [v2 Python programming model](functions-reference-python.md). To use `daprPublish` in your Python function app code:

```python
import logging
import json
import azure.functions as func

dapp = func.DaprFunctionApp()

@dapp.function_name(name="TransferEventBetweenTopics")
@dapp.dapr_topic_trigger(arg_name="subEvent", pub_sub_name="%PubSubName%", topic="A", route="A")
@dapp.dapr_publish_output(arg_name="pubEvent", pub_sub_name="%PubSubName%", topic="B")
def main(subEvent, pubEvent: func.Out[bytes]) -> None:
    logging.info('Python function processed a TransferEventBetweenTopics request from the Dapr Runtime.')
    subEvent_json = json.loads(subEvent)
    payload = "Transfer from Topic A: " + str(subEvent_json["data"])
    pubEvent.set(json.dumps({"payload": payload}).encode('utf-8'))
```

 
# [Python v1](#tab/v1)

The following example shows a Dapr Publish output binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprPublish`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": 
    {
      "type": "daprPublish",
      "direction": "out",
      "name": "pubEvent",
      "pubsubname": "messagebus",
      "topic": "B"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the Python code:

```python
def main(subEvent,
         pubEvent: func.Out[bytes]) -> None:
    logging.info('Python function processed a TransferEventBetweenTopics request from the Dapr Runtime.')
    subEvent_json = json.loads(subEvent)
    payload = "Transfer from Topic A: " + str(subEvent_json["data"])
    pubEvent.set(json.dumps({"payload": payload }))
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprPublish` to trigger a Dapr output binding, which supports the following properties.

|function.json property | Description|
|---------|----------------------|
| **PubSubName** | The name of the Dapr pub/sub to send the message. |
| **Topic** | The name of the Dapr topic to send the message. |

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprPublishOutput`.

|function.json property | Description|
|---------|----------------------|
| **PubSubName** | The name of the Dapr pub/sub to send the message. |
| **Topic** | The name of the Dapr topic to send the message. |


---

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprPublishOutput` annotation allows you to create a function that publishes a message. 

| Element | Description | 
| --------- | ----------- | 
| **pubSubName** | The name of the Dapr pub/sub to send the message. | 
| **topic** | The name of the Dapr topic to send the message. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprPublish`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**pubsubname** | The name of the publisher component service. |
|**topic** | The name/identifier of the publisher topic. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_publish_output` that you set in your Python code.

|Property | Description|
|---------|----------------------|
|**arg_name** | Argument/variable name that should match with the parameter of the function. In the example, this value is set to `pubEvent`. |
|**pub_sub_name** | The name of the publisher event. |
|**topic** | The publisher topic name/identifier. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprPublish`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**pubsubname** | The name of the publisher component service. |
|**topic** | The name/identifier of the publisher topic. |

---

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-java, programming-language-javascript, programming-language-powershell, programming-language-python"

See the [Example section](#example) for complete examples.

## Usage

::: zone-end

::: zone pivot="programming-language-csharp"

To use the Dapr publish output binding, run `DaprPublish`. 

You also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

::: zone-end

::: zone pivot="programming-language-java"

See the [Example section](#example) for complete examples.

To use the Dapr publish output binding, run `DaprPublishOutput`. 

You also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

To use a Dapr publish output binding, define your `daprPublish` binding in a functions.json file.  

You also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprPublish` in Python v2, set up your project with the correct dependencies.

1. In your `requirements.text` file, add the following line:

   ```txt
   azure-functions==1.18.0b1
   ```

1. Modify your `local.setting.json` file with the following configuration:

   ```json
   "PYTHON_ISOLATE_WORKER_DEPENDENCIES":1
   ```

You also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

# [Python v1](#tab/v1)

To use a Dapr publish output binding, define your `daprPublish` binding in a functions.json file.  

You also need to set up a Dapr pub/sub component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr pub/sub component specs](https://docs.dapr.io/reference/components-reference/supported-pubsub/)
- [How to: Publish a message and subscribe to a topic](https://docs.dapr.io/developing-applications/building-blocks/pubsub/howto-publish-subscribe/)

---

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
  - [Dapr output](./functions-bindings-dapr-output.md)


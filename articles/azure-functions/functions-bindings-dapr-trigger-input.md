---
title: Dapr Input Bindings trigger for Azure Functions
description: Learn how to run Azure Functions as Dapr input binding data changes.
ms.topic: reference
ms.date: 09/19/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Input Bindings trigger for Azure Functions

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-python,programming-language-powershell"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

Azure Functions can be triggered on a Dapr input binding using the following Dapr events.

There are no templates for triggers in Dapr in the functions tooling today. Start your project with another trigger type (for example, Storage Queues) and then modify the function definition for Dapr.

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

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/Trigger/ConsumeMessageFromKafka.cs" range="19-30"::: 

---

::: zone-end 

::: zone pivot="programming-language-java"

Here's the Java code for the Dapr Input Binding trigger:

```java
@FunctionName("ConsumeMessageFromKafka")
public String run(
        @DaprBindingTrigger(
            bindingName = "%KafkaBindingName%")
)
```
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

::: zone pivot="programming-language-powershell"

The following example shows Dapr triggers in a _function.json_ file and Powershell code that uses those bindings. 

Here's the _function.json_ file for `daprBindingTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprBindingTrigger",
      "bindingName": "%KafkaBindingName%",
      "name": "triggerData",
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
    $triggerData
)

Write-Host "PowerShell function processed a ConsumeMessageFromKafka request from the Dapr Runtime."

$jsonString = $triggerData | ConvertTo-Json

Write-Host "Trigger data: $jsonString"
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr Input Binding trigger, which uses the [v2 Python programming model](functions-reference-python.md). To use the `daprBinding` in your Python function app code:

```python
import logging
import json
import azure.functions as func

dapp = func.DaprFunctionApp()

@dapp.function_name(name="ConsumeMessageFromKafka")
@dapp.dapr_binding_trigger(arg_name="triggerData", binding_name="%KafkaBindingName%")
def main(triggerData: str) -> None:
    logging.info('Python function processed a ConsumeMessageFromKafka request from the Dapr Runtime.')
    logging.info('Trigger data: ' + triggerData)
```

 
# [Python v1](#tab/v1)

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

---

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

::: zone pivot="programming-language-java"

## Annotations

The `DaprBindingTrigger` annotation allows you to create a function that gets triggered by the binding component you created. 

| Element | Description | 
| --------- | ----------- | 
| **bindingName** | The name of the Dapr binding. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. |
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_binding_trigger` that you set in your Python code.

|Property | Description|
|---------|----------------------|
|**arg_name** | Argument/variable name that should match with the parameter of the function. In the example, this value is set to `triggerData`. |
|**binding_name** | The name of the binding. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. |
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. |

---

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-java, programming-language-javascript, programming-language-powershell, programming-language-python"

See the [Example section](#example) for complete examples.

## Usage

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-java"

To use the Dapr Input Binding trigger, run `DaprBindingTrigger`. 

You also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-powershell"

To use a Dapr Input Binding trigger, define your `daprBindingTrigger` binding in a functions.json file.  

You also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprBindingTrigger` in Python v2, set up your project with the correct dependencies.

1. In your `requirements.text` file, add the following line:

   ```txt
   azure-functions==1.18.0b1
   ```

1. Modify your `local.setting.json` file with the following configuration:

   ```json
   "PYTHON_ISOLATE_WORKER_DEPENDENCIES":1
   ```

You also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)


# [Python v1](#tab/v1)

To use a Dapr Input Binding trigger, define your `daprBindingTrigger` binding in a functions.json file.  

You also need to set up a Dapr input binding component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr input binding component specs](https://docs.dapr.io/reference/components-reference/supported-bindings/)
- [How to: Trigger your application with input bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/howto-bindings/)

---


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
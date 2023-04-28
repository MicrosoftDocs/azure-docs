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

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

The output binding allows you to read Dapr data as output to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## Example

::: zone-end

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

- [In-process class library](./functions-dotnet-class-library.md): compiled C# function that runs in the same process as the Functions runtime. 
- [Isolated worker process class library](./dotnet-isolated-process-guide.md): compiled C# function that runs in a worker process that is isolated from the runtime. Isolated worker process is required to support C# functions running on non-LTS versions .NET and the .NET Framework.     
    

# [In-process](#tab/in-process)

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

The following example shows how the custom type is used in both the trigger and a Dapr state output binding.

TODO: current example has in-proc, need to update with out-of-proc
<!--

:::code language="csharp" source="https://www.github.com/azure/azure-functions-dapr-extension/samples/dotnet-azurefunction/SendMessageToKafka.cs" range="8-26"::: 
-->
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

Here's the JavaScript code for the Dapr Binding output binding trigger:

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

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(args, messages: func.Out[bytes]) -> None:
    logging.info('Python processed a SendMessageToKafka request from the Dapr Runtime.')
    messages.set(json.dumps({"data": args}))
```

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function.

# [In-process](#tab/in-process)

In [C# class libraries], use the `HttpTrigger` to trigger a Dapr Binding output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr binding. | 
| **Operation** | The configured binding operation. | 


# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprBinding`.

TODO: table has in-proc parameters - need out-of-proc

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
The parameter type supported by the Dapr Binding output binding depends on the Functions runtime version, the extension package version, and the C# modality used.

TODO: Need usage content. 

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
The parameter type supported by the Dapr Binding output binding depends on the Functions runtime version, the extension package version, and the C# modality used.

TODO: Need usage content. 

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
The parameter type supported by the Dapr Binding output binding depends on the Functions runtime version, the extension package version, and the C# modality used.

TODO: Need usage content. 

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
  - [Dapr topic](./functions-bindings-dapr-trigger-topic.md)
- Input
  - [Dapr state](./functions-bindings-dapr-input-state.md)
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)


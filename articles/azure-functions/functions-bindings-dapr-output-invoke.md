---
title: Dapr invoke output binding for Azure Functions
description: Learn how to provide Dapr invoke output binding data to an Azure Function.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr invoke output binding for Azure Functions

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

The output binding allows you to read Dapr data as output to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

::: zone-end

::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate _function.json_ file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

> [!IMPORTANT]
> The Python v2 programming model is currently in preview.
::: zone-end

::: zone pivot="programming-language-csharp"

## Example

<!--Optional intro text goes here, followed by the C# modes include.-->
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

# [In-process](#tab/in-process)

```csharp
[FunctionName("InvokeOutputBinding")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "invoke/{appId}/{methodName}")] HttpRequest req,
    [DaprInvoke(AppId = "{appId}", MethodName = "{methodName}", HttpVerb = "post")] IAsyncCollector<InvokeMethodParameters> output,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var outputContent = new InvokeMethodParameters
    {
        Body = requestBody
    };
    await output.AddAsync(outputContent);
    return new OkResult();
}
```

# [Isolated process](#tab/isolated-process)

<!--add a link to the extension-specific code example in this repo: https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/Extensions/ as in the following example: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="35-49"::: 

-->


# [C# Script](#tab/csharp-script)

The following examples show Dapr output bindings in a _function.json_ file and C# script (.csx) code that uses the bindings. In the _function.json_ file, todo:

```json

```

Here's the C# script code:

```csharp

```

---

::: zone-end 

::: zone pivot="programming-language-javascript"

## Example

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprBindingTrigger`:

```json
{
  "bindings":
    {
      "type": "daprInvoke",
      "direction": "out",
      "appId": "{appId}",
      "methodName": "{methodName}",
      "httpVerb": "post",
      "name": "payload"
    }
}
```

Here's the JavaScript code for the Dapr output binding trigger:

```javascript
module.exports = async function (context, req) {
    context.log("Node HTTP trigger function processed a request.");
    context.bindings.output = { body: req.body };
    context.done(null);
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

Here's the _function.json_ file for `daprBindingTrigger`:

```json
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
```

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes
Both in-process and isolated process C# libraries use the <!--attribute API here--> attribute to define the function. C# script instead uses a function.json configuration file.

# [In-process](#tab/in-process)

In [C# class libraries], use the [DaprBindingTrigger] to trigger a Dapr output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **BindingName** | The name of the Dapr trigger. If not specified, the name of the function is used as the trigger name. | 

# [Isolated process](#tab/isolated-process)

<!-- C# attribute information for the trigger goes here with an intro sentence. Use a code link like the following to show the method definition: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/EventGrid/EventGridFunction.cs" range="13-16"::: 

-->

# [C# Script](#tab/csharp-script)

C# script uses a _function.json_ file for configuration instead of attributes.

|function.json property | Description|
|---------|----------------------|
|  |  |

::: zone-end

::: zone pivot="programming-language-javascript"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprInvoke`. |
|**direction** | Must be set to `in`. |
|**appId** | The app ID of the applications involved in the invoke binding. |
|**methodName** | The name of the method variable. |
|**httpVerb** | Post . |
|**name** | The name of the variable that represents the Dapr data in function code. |


::: zone-end

::: zone pivot="programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprBindingTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**bindingName** | The name of the binding. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. Exceptions are noted in the [usage](#usage) section. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

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

See the [Example section](#example) for complete examples.

## Usage
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
The parameter type supported by the Event Grid trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

::: zone-end

<!---## Extra sections Put any sections with content that doesn't fit into the above section headings down here. This will likely get moved to another article after the refactor. -->

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

## host.json properties

The [host.json] file contains settings that control Dapr trigger behavior. See the [host.json settings](functions-bindings-dapr.md#hostjson-settings) section for details regarding available settings.

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
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)

::: zone pivot="programming-language-java,programming-language-powershell"

> [!NOTE]
> Currently, Dapr triggers and bindings are only supported in C#, JavaScript, and Python. 

::: zone-end
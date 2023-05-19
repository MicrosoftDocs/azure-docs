---
title: Dapr Invoke output binding for Azure Functions
description: Learn how to provide Dapr Invoke output binding data to an Azure Function.
ms.topic: reference
ms.date: 04/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Invoke output binding for Azure Functions

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

The following example demonstrates using a Dapr invoke output binding to perform a Dapr service invocation operation hosted in another Dapr-ized application. In this example, the function acts like a proxy.

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

More samples for the Dapr output invoke binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-isolated-azurefunction/OutputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/InvokeOutputBinding.cs" range="22-38"::: 

---

::: zone-end 

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprInvoke`:

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

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log("Node HTTP trigger function processed a request.");
    context.bindings.output = { body: req.body };
    context.done(null);
};
```

::: zone-end

::: zone pivot="programming-language-python"

The following example shows a Dapr Invoke output binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprInvoke`:

```json
{
  "scriptFile": "__init__.py",
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

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
def main(req: func.HttpRequest,
         payload: func.Out[bytes]) -> func.HttpResponse:
    logging.info('Python InvokeOutputBinding processed a request.')
    data = req.params.get('data')
```

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprInvoke` to trigger a Dapr output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **AppId** | The Dapr app ID to invoke. |
| **MethodName** | The method name of the app to invoke. |
| **HttpVerb** | _Optional._ HTTP verb to use of the app to invoke. Default is `POST`. |


# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprInvokeOutput`.

| Parameter | Description | 
| --------- | ----------- | 
| **AppId** | The Dapr app ID to invoke. |
| **MethodName** | The method name of the app to invoke. |
| **HttpVerb** | _Optional._ HTTP verb to use of the app to invoke. Default is `POST`. |


---

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprInvoke`. |
|**direction** | Must be set to `out`. |
|**appId** | The app ID of the applications involved in the invoke binding. |
|**methodName** | The name of the method variable. |
|**httpVerb** | Post or get. |
|**name** | The name of the variable that represents the Dapr data in function code. |

::: zone-end

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
To use the Dapr service invocation output binding, you'll run `DaprInvoke`. 

You can learn more about [how to use Dapr service invocation in the official Dapr documentation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/).

::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr invoke output binding, you'll define your `daprInvoke` binding in a functions.json file.  

You can learn more about [how to use Dapr service invocation in the official Dapr documentation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/).

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr invoke output binding, you'll define your `daprInvoke` binding in a functions.json file.  

You can learn more about [how to use Dapr service invocation in the official Dapr documentation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/).
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
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)


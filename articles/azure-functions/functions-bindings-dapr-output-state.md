---
title: Dapr State output binding for Azure Functions
description: Learn how to provide Dapr State output binding data during a function execution in Azure Functions.
ms.topic: reference
ms.date: 08/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr State output binding for Azure Functions

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-python,programming-language-powershell"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr state output binding allows you to save a value to a Dapr state during a function execution.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

## Example

::: zone-end

::: zone pivot="programming-language-csharp"


A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]
   

# [In-process](#tab/in-process)

The following example demonstrates using the Dapr state output binding to persist a new state into the state store. 

```csharp
[FunctionName("StateOutputBinding")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "state/{key}")] HttpRequest req,
    [DaprState("statestore", Key = "{key}")] IAsyncCollector<string> state,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    await state.AddAsync(requestBody);

    return new OkResult();
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr output state binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/blob/master/samples/dotnet-isolated-azurefunction/OutputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/StateOutputBinding.cs" range="16-28"::: 

---

::: zone-end 

::: zone pivot="programming-language-java"

The following example creates a `"CreateNewOrderHttpTrigger"` function using the `DaprStateOutput` binding with an `HttpTrigger`:


```java
@FunctionName("CreateNewOrderHttpTrigger")
public String run(
        @HttpTrigger(
            name = "req",
            methods = {HttpMethod.POST},
            authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
        @DaprStateOutput(
            stateStore = "%StateStoreName%",
            key = "product")
        OutputBinding<String> product,
        final ExecutionContext context) {
    context.getLogger().info("Java HTTP trigger (CreateNewOrderHttpTrigger) processed a request.");
}
```
::: zone-end

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprState` output:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "direction": "out",
      "name": "dapr",
      "stateStore": "statestore",
      "key": "{key}",
      "daprAddress": "%daprAddress%"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.bindings.dapr = {
        // stateStore: 'statestore-if-not-in-function.json'
        // key: 'key-if-not-in-function.json'
        value: req.body
    };
};
```

::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprState` output:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "stateStore": "%StateStoreName%",
      "direction": "out",
      "name": "order",
      "key": "order"
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

param (
    $payload
)

# C# function processed a CreateNewOrder request from the Dapr Runtime.
Write-Host "PowerShell function processed a CreateNewOrder request from the Dapr Runtime."

# Payload must be of the format { "data": { "value": "some value" } }

# Convert the object to a JSON-formatted string with ConvertTo-Json
$jsonString = $payload| ConvertTo-Json

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name order -Value $payload["data"]
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr State output binding, which uses the [v2 Python programming model](functions-reference-python.md). To use `daprState` in your Python function app code:

```python
import logging
import json
import azure.functions as func

dapp = func.DaprFunctionApp()

@dapp.function_name(name="HttpTriggerFunc")
@dapp.route(route="req", auth_level=dapp.auth_level.ANONYMOUS)
@dapp.dapr_state_output(arg_name="state", state_store="statestore", key="newOrder")
def main(req: func.HttpRequest, state: func.Out[str] ) -> str:
    # request body must be passed this way '{\"value\": { \"key\": \"some value\" } }'
    body = req.get_body()
    if body is not None:
        state.set(body.decode('utf-8'))
        logging.info(body.decode('utf-8'))
    else:
        logging.info('req body is none')
    return 'ok'
```

# [Python v1](#tab/v1)

The following example shows a Dapr State output binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprState`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": 
    {
      "type": "daprState",
      "stateStore": "%StateStoreName%",
      "direction": "out",
      "name": "order",
      "key": "order"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(payload,
         order: func.Out[str]) -> None:
    logging.info('Python function processed a CreateNewOrder request from the Dapr Runtime.')  
    payload_json = json.loads(payload)
    logging.info(payload_json["data"])
    order.set(json.dumps(payload_json["data"]))
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprState` to trigger a Dapr output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to save state. | 
| **Key** | The name of the key to save state within the state store. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for the `DaprStateOutput`.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to save state. | 
| **Key** | The name of the key to save state within the state store. | 

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprStateOutput` annotation allows you to create a function that stores state. 

| Element | Description | 
| --------- | ----------- | 
| **stateStore** | The name of the state store to save state. | 
| **key** | The name of the key to save state within the state store. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the state store. |
|**key** | The name of the key to save state within the state store. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_state_output` that you set in your Python code.

|Property | Description|
|---------|----------------------|
|**arg_name** | Argument/variable name that should match with the parameter of the function. In the example, this value is set to `state`. |
|**state_store** | The name of the state store. |
|**key** | The name of the key to save state within the state store. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `out`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the state store. |
|**key** | The name of the key to save state within the state store. |

---

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-java. programming-language-javascript, programming-language-powershell, programming-language-python"

See the [Example section](#example) for complete examples.

## Usage

::: zone-end

::: zone pivot="programming-language-csharp"

To use the Dapr state output binding, run `DaprState`. 

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-java"

To use the Dapr state output binding, run `DaprStateOutput`. 

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

To use a Dapr state output binding, define your `daprState` binding in a functions.json file.  

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprState` in Python v2, set up your project with the correct dependencies.

1. In your `requirements.text` file, add the following line:

   ```txt
   azure-functions==1.18.0b1
   ```

1. Modify your `local.setting.json` file with the following configuration:

   ```json
   PYTHON_ISOLATE_WORKER_DEPENDENCIES:1
   ```

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)


# [Python v1](#tab/v1)

To use a Dapr state output binding, define your `daprState` binding in a functions.json file.  

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

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
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
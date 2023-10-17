---
title: Dapr State output binding for Azure Functions
description: Learn how to provide Dapr State output binding data during a function execution in Azure Functions.
ms.topic: reference
ms.date: 10/11/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr State output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr state output binding allows you to save a value to a Dapr state during a function execution.

For information on setup and configuration details of the Dapr extension, see the [Dapr extension overview](./functions-bindings-dapr.md).

## Example

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

> [!NOTE]  
> The [Node.js v4 model for Azure Functions](functions-reference-node.md?pivots=nodejs-model-v4) isn't currently available for use with the Dapr extension during the preview.  

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

app = func.FunctionApp()

@app.function_name(name="HttpTriggerFunc")
@app.route(route="req", auth_level=dapp.auth_level.ANONYMOUS)
@app.dapr_state_output(arg_name="state", state_store="statestore", key="newOrder")
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

In the [in-process model](./functions-dotnet-class-library.md), use the `DaprState` to define a Dapr state output binding, which supports these parameters:

| Parameter | Description | Can be sent via Attribute | Can be sent via RequestBody |
| --------- | ----------- |  :---------------------:  |  :-----------------------:  |
| **StateStore** | The name of the state store to save state. | :heavy_check_mark: | :x: |
| **Key** | The name of the key to save state within the state store. | :heavy_check_mark: | :heavy_check_mark: | 
| **Value** | _Required._ The value being stored. | :x: | :heavy_check_mark: |

# [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), use the `DaprStateOutput` to define a Dapr state output binding, which supports these parameters:

| Parameter | Description | Can be sent via Attribute | Can be sent via RequestBody |
| --------- | ----------- |  :---------------------:  |  :-----------------------:  |
| **StateStore** | The name of the state store to save state. | :heavy_check_mark: | :x: |
| **Key** | The name of the key to save state within the state store. | :heavy_check_mark: | :heavy_check_mark: | 
| **Value** | _Required._ The value being stored. | :x: | :heavy_check_mark: |
::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprStateOutput` annotation allows you to function access a state store. 

| Element | Description | Can be sent via Attribute | Can be sent via RequestBody |
| ------- | ----------- |  :---------------------:  |  :-----------------------:  |
| **stateStore** | The name of the state store to save state. | :heavy_check_mark: | :x: |
| **key** | The name of the key to save state within the state store. | :heavy_check_mark: | :heavy_check_mark: |
| **value** | _Required._ The value being stored. | :x: | :heavy_check_mark: |

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description| Can be sent via Attribute | Can be sent via RequestBody |
|-----------------------|------------|  :---------------------:  |  :-----------------------:  |
| **stateStore** | The name of the state store to save state. | :heavy_check_mark: | :x: |
| **key** | The name of the key to save state within the state store. | :heavy_check_mark: | :heavy_check_mark: |
| **value** | _Required._ The value being stored. | :x: | :heavy_check_mark: |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_state_output` that you set in your Python code.

|Property | Description| Can be sent via Attribute | Can be sent via RequestBody |
|---------|------------|  :---------------------:  |  :-----------------------:  |
| **stateStore** | The name of the state store to save state. | :heavy_check_mark: | :x: |
| **key** | The name of the key to save state within the state store. | :heavy_check_mark: | :heavy_check_mark: |
| **value** | _Required._ The value being stored. | :x: | :heavy_check_mark: |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the _function.json_ file.

|function.json property | Description| Can be sent via Attribute | Can be sent via RequestBody |
|-----------------------|------------|  :---------------------:  |  :-----------------------:  |
| **stateStore** | The name of the state store to save state. | :heavy_check_mark: | :x: |
| **key** | The name of the key to save state within the state store. | :heavy_check_mark: | :heavy_check_mark: |
| **value** | _Required._ The value being stored. | :x: | :heavy_check_mark: |

---

::: zone-end

If properties are defined in both Attributes and `RequestBody`, priority is given to data provided in `RequestBody`.

See the [Example section](#example) for complete examples.

## Usage

To use the Dapr state output binding, start by setting up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprState` in Python v2, set up your project with the correct dependencies.

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

The Python v1 model requires no additional changes, aside from setting up the state store.

---

::: zone-end

## Next steps

[Learn more about Dapr state management.](https://docs.dapr.io/developing-applications/building-blocks/state-management/)

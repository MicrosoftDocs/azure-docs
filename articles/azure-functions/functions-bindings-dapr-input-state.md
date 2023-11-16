---
title: Dapr State input binding for Azure Functions
description: Learn how to provide Dapr State input binding data during a function execution in Azure Functions.
ms.topic: reference
ms.date: 10/11/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, devx-track-dotnet, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr State input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr state input binding allows you to read Dapr state during a function execution.

For information on setup and configuration details of the Dapr extension, see the [Dapr extension overview](./functions-bindings-dapr.md).

## Example

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

# [In-process](#tab/in-process)

```csharp
[FunctionName("StateInputBinding")]
public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "state/{key}")] HttpRequest req,
    [DaprState("statestore", Key = "{key}")] string state,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    return new OkObjectResult(state);
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr input state binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-isolated-azurefunction/InputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/InputBinding/StateInputBinding.cs" range="15-25"::: 

---

::: zone-end 

::: zone pivot="programming-language-java"

The following example creates a `"RetreveOrder"` function using the `DaprStateInput` binding with the [`DaprServiceInvocationTrigger`](./functions-bindings-dapr-trigger-svc-invoke.md):


```java
@FunctionName("RetrieveOrder")
public String run(
        @DaprServiceInvocationTrigger(
            methodName = "RetrieveOrder") 
        String payload,
        @DaprStateInput(
            stateStore = "%StateStoreName%",
            key = "order")
        String product,
        final ExecutionContext context)
```
::: zone-end

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprState`:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "direction": "in",
      "dataType": "string",
      "name": "state",
      "stateStore": "statestore",
      "key": "{key}"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log('Current state of this function: ' + context.bindings.daprState);
};
```

::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprState`:

```json
{
  "bindings": 
    {
      "type": "daprState",
      "direction": "in",
      "key": "order",
      "stateStore": "%StateStoreName%",
      "name": "order"
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
    $payload, $order
)

# C# function processed a CreateNewOrder request from the Dapr Runtime.
Write-Host "PowerShell function processed a RetrieveOrder request from the Dapr Runtime."

# Convert the object to a JSON-formatted string with ConvertTo-Json
$jsonString = $order | ConvertTo-Json

Write-Host "$jsonString"
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr State input binding, which uses the [v2 Python programming model](functions-reference-python.md). To use the `daprState` binding alongside the `daprServiceInvocationTrigger` in your Python function app code:

```python
import logging
import json
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="RetrieveOrder")
@app.dapr_service_invocation_trigger(arg_name="payload", method_name="RetrieveOrder")
@app.dapr_state_input(arg_name="data", state_store="statestore", key="order")
def main(payload, data: str) :
    # Function should be invoked with this command: dapr invoke --app-id functionapp --method RetrieveOrder  --data '{}'
    logging.info('Python function processed a RetrieveOrder request from the Dapr Runtime.')
    logging.info(data)
```

# [Python v1](#tab/v1)

The following example shows a Dapr State input binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprState`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": 
    {
      "type": "daprState",
      "direction": "in",
      "dataType": "string",
      "name": "state",
      "stateStore": "statestore",
      "key": "{key}"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main(payload, data: str) -> None:
    logging.info('Python function processed a RetrieveOrder request from the Dapr Runtime.')
    logging.info(data)
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), use the `DaprState` to read Dapr state into your function, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **StateStore** | The name of the state store to retrieve state. |
| **Key** | The name of the key to retrieve from the specified state store. | 

# [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), use the `DaprStateInput` to read Dapr state into your function, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **StateStore** | The name of the state store to retrieve state. |
| **Key** | The name of the key to retrieve from the specified state store. |

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprStateInput` annotation allows you to read Dapr state into your function.  

| Element | Description |
| ------- | ----------- |
| **stateStore** | The name of the Dapr state store. |
| **key** | The state store key value. |

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description |
|-----------------------|-------------|
|**stateStore** | The name of the state store. |
|**key** | The name of the key to retrieve from the specified state store. |

::: zone-end

::: zone pivot="programming-language-powershell"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description |
|-----------------------|-------------|
|**key** | The name of the key to retrieve from the specified state store. |
|**stateStore** | The name of the state store. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_state_input` that you set in your Python code.

|Property | Description |
|---------|-------------|
|**state_store** | The name of the state store. |
|**key** | The secret key value. The name of the key to retrieve from the specified state store. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description |
|-----------------------|-------------|
|**stateStore** | The name of the state store. |
|**key** | The name of the key to retrieve from the specified state store. |

--- 

::: zone-end

See the [Example section](#example) for complete examples.

## Usage

To use the Dapr state input binding, start by setting up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)


::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprState` in Python v2, set up your project with the correct dependencies.

1. [Create and activate a virtual environment](./create-first-function-cli-python.md?tabs=macos%2Cbash%2Cazure-cli&pivots=python-mode-decorators#create-venv)

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

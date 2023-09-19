---
title: Dapr State input binding for Azure Functions
description: Learn how to provide Dapr State input binding data during a function execution in Azure Functions.
ms.topic: reference
ms.date: 08/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr State input binding for Azure Functions

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-python,programming-language-powershell"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr state input binding allows you to access Dapr state during a function execution.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

## Example

::: zone-end

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

dapp = func.DaprFunctionApp()

@dapp.function_name(name="RetrieveOrder")
@dapp.dapr_service_invocation_trigger(arg_name="payload", method_name="RetrieveOrder")
@dapp.dapr_state_input(arg_name="data", state_store="statestore", key="order")
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

In [C# class libraries](./functions-dotnet-class-library.md), use `DaprState` to trigger a Dapr input binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to retrieve state. | 
| **Key** | The name of the key to retrieve from the specified state store. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for `DaprStateInput`.

| Parameter | Description | 
| --------- | ----------- | 
| **StateStore** | The name of the state store to retrieve state. | 
| **Key** | The name of the key to retrieve from the specified state store. | 

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprStateInput` annotation allows you to create a function that stores state. 

| Element | Description | 
| --------- | ----------- | 
| **stateStore** | The name of the Dapr state store. | 
| **key** | The state store key value. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `in`.  |
|**dataType** | The data type used by the state store. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the state store. |
|**key** | The name of the key to retrieve from the specified state store. |

::: zone-end

::: zone pivot="programming-language-powershell"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `in`.  |
|**key** | The name of the key to retrieve from the specified state store. |
|**stateStore** | The name of the state store. |
|**name** | The name of the variable that represents the Dapr data in function code. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_state_input` that you set in your Python code.

|Property | Description|
|---------|----------------------|
|**arg_name** | Argument/variable name that should match with the parameter of the function. In the example, this value is set to `data`. |
|**state_store** | The name of the state store. |
|**key** | The secret key value. The name of the key to retrieve from the specified state store. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprState`. |
|**direction** | Must be set to `in`.  |
|**dataType** | The data type used by the state store. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**stateStore** | The name of the state store. |
|**key** | The name of the key to retrieve from the specified state store. |

--- 

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-java, programming-language-javascript, programming-language-powershell, programming-language-python"

See the [Example section](#example) for complete examples.

## Usage

::: zone-end

::: zone pivot="programming-language-csharp"

To use the Dapr state input binding, run `DaprState`. 

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-java"

To use the Dapr state input binding, run `DaprStateInput`. 

You also need to set up a Dapr state store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr state store component specs](https://docs.dapr.io/reference/components-reference/supported-state-stores/)
- [How to: Save state](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-get-save-state/)

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

To use a Dapr state input binding, define your `daprState` binding in a functions.json file. 

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

To use a Dapr state input binding, define your `daprState` binding in a functions.json file. 

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
  - [Dapr secret](./functions-bindings-dapr-input-secret.md)
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
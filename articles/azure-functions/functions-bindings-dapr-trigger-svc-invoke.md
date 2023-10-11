---
title: Dapr Service Invocation trigger for Azure Functions
description: Learn how to run Azure Functions as Dapr service invocation data changes.
ms.topic: reference
ms.date: 10/11/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Service Invocation trigger for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

Azure Functions can be triggered on a Dapr service invocation using the following Dapr events.

For information on setup and configuration details of the Dapr extension, see the [Dapr extension overview](./functions-bindings-dapr.md).

## Example

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]
   

# [In-process](#tab/in-process)

```csharp
[FunctionName("CreateNewOrder")]
public static void Run(
    [DaprServiceInvocationTrigger] JObject payload,
    [DaprState("%StateStoreName%", Key = "order")] out JToken order,
    ILogger log)
{
    log.LogInformation("C# function processed a CreateNewOrder request from the Dapr Runtime.");

    // payload must be of the format { "data": { "value": "some value" } }
    order = payload["data"];
}
```

# [Isolated process](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/CreateNewOrder.cs" range="18-31"::: 
 

---

::: zone-end 

::: zone pivot="programming-language-java"

Here's the Java code for the Dapr Service Invocation trigger:

```java
@FunctionName("CreateNewOrder")
public String run(
        @DaprServiceInvocationTrigger(
            methodName = "CreateNewOrder") 
)
```
::: zone-end

::: zone pivot="programming-language-javascript"

> [!NOTE]  
> The [Node.js v4 model for Azure Functions](functions-reference-node.md?pivots=nodejs-model-v4) isn't currently available for use with the Dapr extension during the preview.  

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprServiceInvocationTrigger",
      "name": "payload"
    }
  ]
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a RetrieveOrder request from the Dapr Runtime.");

    // print the fetched state value
    context.log(context.bindings.data);
};
```
::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "bindings": [
    {
      "type": "daprServiceInvocationTrigger",
      "name": "payload",
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

The following example shows a Dapr Service Invocation trigger, which uses the [v2 Python programming model](functions-reference-python.md). To use the `daprServiceInvocationTrigger` in your Python function app code:

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

The following example shows a Dapr Service Invocation trigger, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "type": "daprServiceInvocationTrigger",
      "name": "payload",
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

def main(payload, data: str) -> None:
    logging.info('Python function processed a RetrieveOrder request from the Dapr Runtime.')
    logging.info(data)
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), use the `DaprServiceInvocationTrigger` to trigger a Dapr service invocation binding, which supports the following properties.

| Parameter | Description |
| --------- | ----------- |
| **MethodName** | _Optional._ The name of the method the Dapr caller should use. If not specified, the name of the function is used as the method name. |

# [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), use the `DaprServiceInvocationTrigger` to define a Dapr service invocation trigger, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **MethodName** | _Optional._ The name of the method the Dapr caller should use. If not specified, the name of the function is used as the method name. |

---

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprServiceInvocationTrigger` annotation allows you to create a function that gets invoked by Dapr runtime. 

| Element | Description |
| ------- | ----------- |
| **methodName** | The method name. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|-----------------------|------------|
|**type** | Must be set to `daprServiceInvocationTrigger`.|
|**name** | The name of the variable that represents the Dapr data in function code. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_service_invocation_trigger` that you set in your Python code.

|Property | Description|
|---------|------------|
|**method_name** | The name of the variable that represents the Dapr data. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description| 
|-----------------------|------------|
|**type** | Must be set to `daprServiceInvocationTrigger`.|
|**name** | The name of the variable that represents the Dapr data in function code. | 

---

::: zone-end

See the [Example section](#example) for complete examples.

## Usage

To use a Dapr Service Invocation trigger, learn more about which components to use with the Service Invocation trigger and how to set them up in the official Dapr documentation.

- [Dapr component specs](https://docs.dapr.io/reference/components-reference/)
- [Dapr service invocation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/)

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprServiceInvocationTrigger` in Python v2, set up your project with the correct dependencies.

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

The Python v1 model requires no additional changes, aside from setting up the service invocation component.

---

::: zone-end

## Next steps

[Learn more about Dapr service invocation.](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/)

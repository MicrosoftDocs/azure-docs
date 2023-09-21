---
title: Dapr Secret input binding for Azure Functions
description: Learn how to access Dapr Secret input binding data during function execution in Azure Functions.
ms.topic: reference
ms.date: 08/17/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Secret input binding for Azure Functions

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-python,programming-language-powershell"

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr secret input binding allows you to read secrets data as input during function execution.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

## Example

::: zone-end

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

# [In-process](#tab/in-process)

```csharp
[FunctionName("RetrieveSecret")]
public static void Run(
    [DaprServiceInvocationTrigger] object args,
    [DaprSecret("kubernetes", "my-secret", Metadata = "metadata.namespace=default")] IDictionary<string, string> secret,
    ILogger log)
{
    log.LogInformation("C# function processed a RetrieveSecret request from the Dapr Runtime.");
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr input secret binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/blob/master/samples/dotnet-isolated-azurefunction/InputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/InputBinding/RetrieveSecret.cs" range="18-35"::: 

---

::: zone-end 

::: zone pivot="programming-language-java"

The following example creates a `"RetreveSecret"` function using the `DaprSecretInput` binding with the [`DaprServiceInvocationTrigger`](./functions-bindings-dapr-trigger-svc-invoke.md):


```java
@FunctionName("RetrieveSecret")
public void run(
    @DaprServiceInvocationTrigger(
        methodName = "RetrieveSecret") Object args,
    @DaprSecretInput(
        secretStoreName = "kubernetes", 
        key = "my-secret", 
        metadata = "metadata.namespace=default") 
        Map<String, String> secret,
    final ExecutionContext context)
```
::: zone-end

::: zone pivot="programming-language-javascript"

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "bindings": 
    {
      "type": "daprSecret",
      "direction": "in",
      "name": "secret",
      "key": "my-secret",
      "secretStoreName": "localsecretstore",
      "metadata": "metadata.namespace=default"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context) {
    context.log("Node function processed a RetrieveSecret request from the Dapr Runtime.");

    // print the fetched secret value
    for( var key in context.bindings.secret)
    {
        context.log(`Stored secret: Key = ${key}, Value =${context.bindings.secret[key]}`);
    }
};
```

::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

```json
{
  "bindings": 
    {
      "type": "daprSecret",
      "direction": "in",
      "name": "secret",
      "key": "my-secret",
      "secretStoreName": "localsecretstore",
      "metadata": "metadata.namespace=default"
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
    $payload, $secret
)

# PowerShell function processed a CreateNewOrder request from the Dapr Runtime.
Write-Host "PowerShell function processed a RetrieveSecretLocal request from the Dapr Runtime."

# Convert the object to a JSON-formatted string with ConvertTo-Json
$jsonString = $secret | ConvertTo-Json

Write-Host "$jsonString"
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr Secret input binding, which uses the [v2 Python programming model](functions-reference-python.md). To use the `daprSecret` binding alongside the `daprServiceInvocationTrigger` in your Python function app code:

```python
import logging
import json
import azure.functions as func

dapp = func.DaprFunctionApp()

@dapp.function_name(name="RetrieveSecret")
@dapp.dapr_service_invocation_trigger(arg_name="payload", method_name="RetrieveSecret")
@dapp.dapr_secret_input(arg_name="secret", secret_store_name="localsecretstore", key="my-secret", metadata="metadata.namespace=default")
def main(payload, secret: str) :
    # Function should be invoked with this command: dapr invoke --app-id functionapp --method RetrieveSecret  --data '{}'
    logging.info('Python function processed a RetrieveSecret request from the Dapr Runtime.')
    secret_dict = json.loads(secret)

    for key in secret_dict:
        logging.info("Stored secret: Key = " + key +
                     ', Value = ' + secret_dict[key])
```

# [Python v1](#tab/v1)

The following example shows a Dapr Secret input binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprSecret`:

```json
{
  "scriptFile": "__init__.py",
  "bindings":
    {
      "type": "daprSecret",
      "direction": "in",
      "name": "secret",
      "key": "my-secret",
      "secretStoreName": "localsecretstore",
      "metadata": "metadata.namespace=default"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the Python code:

```python
import logging
import json
import azure.functions as func

def main (payload, secret) -> None:
    logging.info('Python function processed a RetrieveSecret request from the Dapr Runtime.')
    secret_dict = json.loads(secret)

    for key in secret_dict:
        logging.info("Stored secret: Key = " + key + ', Value = '+ secret_dict[key])
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In [C# class libraries](./functions-dotnet-class-library.md), use the `DaprSecret` to trigger a Dapr output binding, which supports the following properties.

| Parameter | Description | 
| --------- | ----------- | 
| **SecretStoreName** | The name of the secret store to get the secret. | 
| **Key** | The key identifying the name of the secret to get. | 
| **Metadata** | _Optional._ An array of metadata properties in the form `"key1=value1&key2=value2"`. | 

# [Isolated process](#tab/isolated-process)

The following table explains the parameters for `DaprSecretInput`.

| Parameter | Description | 
| --------- | ----------- | 
| **SecretStoreName** | The name of the secret store to get the secret. | 
| **Key** | The key identifying the name of the secret to get. | 
| **Metadata** | _Optional._ An array of metadata properties in the form `"key1=value1&key2=value2"`. | 

---

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprSecretInput` annotation allows you to create a function that fetches a secret. 

| Element | Description | 
| --------- | ----------- | 
| **secretStoreName** | The name of the Dapr secret store. | 
| **key** | The secret key value. | 
| **metadata** | _Optional_. The metadata values. | 

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprSecret`. |
|**direction** | Must be set to `in`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**key** | The secret key value. |
|**secretStoreName** | Name of the secret store as defined in the _local-secret-store.yaml_ component file. |
|**metadata** | The metadata namespace. |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_secret_input` that you set in your Python code.

|Property | Description|
|---------|----------------------|
|**arg_name** | Argument/variable name that should match with the parameter of the function. In the example, this value is set to `secret`. |
|**secret_store_name** | The name of the secret store. |
|**key** | The secret key value. |
|**metadata** | The metadata namespace. |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description|
|---------|----------------------|
|**type** | Must be set to `daprSecret`. |
|**direction** | Must be set to `in`. |
|**name** | The name of the variable that represents the Dapr data in function code. |
|**key** | The secret key value. |
|**secretStoreName** | Name of the secret store as defined in the _local-secret-store.yaml_ component file. |
|**metadata** | The metadata namespace. |

---

::: zone-end

::: zone pivot="programming-language-csharp, programming-language-java, programming-language-javascript, programming-language-powershell, programming-language-python"

See the [Example section](#example) for complete examples.

## Usage

::: zone-end

::: zone pivot="programming-language-csharp"

To use the Dapr secret input binding, run `DaprSecret`. 

You also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)

::: zone-end

::: zone pivot="programming-language-java"

To use the Dapr secret input binding, run `DaprSecretInput`. 

You also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

To use a Dapr secret input binding, define your `daprSecret` binding in a functions.json file.  

You also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.
 
- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprSecret` in Python v2, set up your project with the correct dependencies.

1. In your `requirements.text` file, add the following line:

   ```txt
   azure-functions==1.18.0b1
   ```

1. Modify your `local.setting.json` file with the following configuration:

   ```json
   "PYTHON_ISOLATE_WORKER_DEPENDENCIES":1
   ```

You also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)


# [Python v1](#tab/v1)

To use a Dapr secret input binding, define your `daprSecret` binding in a functions.json file.  

You also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)

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
- Dapr output bindings
  - [Dapr state](./functions-bindings-dapr-output-state.md)
  - [Dapr invoke](./functions-bindings-dapr-output-invoke.md)
  - [Dapr publish](./functions-bindings-dapr-output-publish.md)
  - [Dapr output](./functions-bindings-dapr-output.md)
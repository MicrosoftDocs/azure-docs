---
title: Dapr Secret input binding for Azure Functions
description: Learn how to provide Dapr Secret input binding data to an Azure Function.
ms.topic: reference
ms.date: 05/15/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Secret input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The input binding allows you to read Dapr data as input to an Azure Function.

For information on setup and configuration details, see the [overview](./functions-bindings-dapr.md).

::: zone pivot="programming-language-csharp, programming-language-javascript, programming-language-python"

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

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/InputBinding/RetrieveSecret.cs" range="8-36"::: 

---

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

::: zone pivot="programming-language-python"

The following example shows a Dapr trigger binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprServiceInvocationTrigger`:

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

[!INCLUDE [preview-python](../../includes/functions-dapr-preview-python.md)]

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

::: zone pivot="programming-language-javascript, programming-language-python"

## Configuration
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

::: zone pivot="programming-language-csharp"

See the [Example section](#example) for complete examples.

## Usage
To use the Dapr secret input binding, you'll run `DaprSecret`. 

You'll also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)

::: zone-end

::: zone pivot="programming-language-javascript"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr secret input binding, you'll define your `daprSecret` binding in a functions.json file.  

You'll also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)

::: zone-end

::: zone pivot="programming-language-python"

See the [Example section](#example) for complete examples.

## Usage
To use a Dapr invoke output binding, you'll define your `daprSecret` binding in a functions.json file.  

You'll also need to set up a Dapr secret store component. You can learn more about which component to use and how to set it up in the official Dapr documentation.

- [Dapr secret store component specs](https://docs.dapr.io/reference/components-reference/supported-secret-stores/)
- [How to: Retrieve a secret](https://docs.dapr.io/developing-applications/building-blocks/secrets/howto-secrets/)


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
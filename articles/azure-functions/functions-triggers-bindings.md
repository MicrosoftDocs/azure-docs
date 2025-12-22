---
title: Triggers and Bindings in Azure Functions
description: Learn how to use triggers and bindings to connect your Azure function to online events and cloud-based services.
ms.topic: concept-article
ms.date: 10/10/2025
ms.custom: devdivchpfy22, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
zone_pivot_groups: programming-languages-set-functions
ai-usage: ai-assisted
---

# Azure Functions triggers and bindings

In this article, you learn the high-level concepts surrounding triggers and bindings for functions.

Triggers cause a function to run. A trigger defines how a function is invoked, and a function must have exactly one trigger. Triggers can also pass data into your function, as you would with method calls.

Binding to a function is a way of declaratively connecting your functions to other resources. Bindings either pass data into your function (an *input binding*) or enable you to write data out from your function (an *output binding*) by using *binding parameters*. Your function trigger is essentially a special type of input binding.

You can mix and match bindings to suit your function's specific scenario. Bindings are optional, and a function might have one or multiple input and/or output bindings.

Triggers and bindings let you avoid hardcoding access to other services. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function.

Consider the following examples of how you could implement functions:

| Example scenario | Trigger | Input binding | Output binding |
|-------------|---------|---------------|----------------|
| A new queue message arrives, which runs a function to write to another queue. | Queue<sup>*</sup> | *None* | Queue<sup>*</sup> |
| A scheduled job reads Azure Blob Storage contents and creates a new Azure Cosmos DB document. | Timer | Blob Storage | Azure Cosmos DB |
| Azure Event Grid is used to read an image from Blob Storage and a document from Azure Cosmos DB to send an email. | Event Grid | Blob Storage and Azure Cosmos DB | SendGrid |

<sup>\*</sup> Represents different queues.

These examples aren't meant to be exhaustive, but they illustrate how you can use triggers and bindings together. For a more comprehensive set of scenarios, see [Azure Functions scenarios](functions-scenarios.md).

> [!TIP]
> Azure Functions doesn't require you to use input and output bindings to connect to Azure services. You can always create an Azure SDK client in your code and use it instead for your data transfers. For more information, see [Connect to services](functions-reference.md#connect-to-services).

## Trigger and binding definitions

The following example shows an HTTP-triggered function with an output binding that writes a message to an Azure Storage queue.

::: zone pivot="programming-language-csharp"
For C# class library functions, you configure triggers and bindings by decorating methods and parameters with C# attributes. The specific attribute that you apply might depend on the C# runtime model:

### [Isolated worker model](#tab/isolated-process)

The HTTP trigger (`HttpTrigger`) is defined on the `Run` method for a function named `HttpExample` that returns a `MultiResponse` object:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="11-14":::

This example shows the `MultiResponse` object definition. The object definition returns `HttpResponse` to the HTTP request and writes a message to a storage queue by using a `QueueOutput` binding:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="33-38":::

For more information, see the [C# guide for isolated worker models](dotnet-isolated-process-guide.md#methods-recognized-as-functions).

### [In-process model](#tab/in-process)

The HTTP trigger (`HttpTrigger`) is defined on the `Run` method for a function named `HttpExample`. This function writes to a storage queue that the `Queue` and `StorageAccount` attributes define on the `msg` parameter:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="14-19":::

For more information, see the [C# guide for in-process models](functions-dotnet-class-library.md#methods-recognized-as-functions).

---

Legacy C# script functions use a `function.json` definition file. For more information, see the [Azure Functions C# script (.csx) developer reference](functions-reference-csharp.md).
::: zone-end

::: zone pivot="programming-language-java"
For Java functions, you configure triggers and bindings by annotating specific methods and parameters. This HTTP trigger (`@HttpTrigger`) is defined on the `run` method for a function named `HttpExample`. The function writes to a storage queue named `outqueue` that the `@QueueOutput` annotation defines on the `msg` parameter:

:::code language="java" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/src/main/java/com/function/Function.java" range="16-23":::

For more information, see the [Java developer guide](functions-reference-java.md#triggers-and-annotations).
::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"
The way that you define triggers and bindings for Node.js functions depends on the specific version of Node.js for Azure Functions:

### [v4](#tab/node-v4)

In Node.js for Azure Functions version 4, you configure triggers and bindings by using objects exported from the `@azure/functions` module. For more information, see the [Node.js developer guide](functions-reference-node.md?pivots=nodejs-model-v4#inputs-and-outputs).

### [v3](#tab/node-v3)

In Node.js for Azure Functions version 3, you configure triggers and bindings in a function-specific `function.json` file in the same folder as your code. For more information, see the [Node.js developer guide](functions-reference-node.md?pivots=nodejs-model-v3#inputs-and-outputs).

---

::: zone-end

::: zone pivot="programming-language-javascript"
### [v4](#tab/node-v4)

The `http` method on the exported `app` object defines an HTTP trigger. The `storageQueue` method on `output` defines an output binding on this trigger.

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/storageQueueOutput1.js" :::

### [v3](#tab/node-v3)

This example `function.json` file defines the HTTP trigger function that returns an HTTP response and writes to a storage queue:

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "authLevel": "function",
      "name": "input"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "myQueueItem",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionAppSetting"
    }
  ]
}
```

---

::: zone-end

::: zone pivot="programming-language-typescript"
### [v4](#tab/node-v4)

The `http` method on the exported `app` object defines an HTTP trigger. The `storageQueue` method on `output` defines an output binding on this trigger.

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/storageQueueOutput1.ts" :::

### [v3](#tab/node-v3)

This example `function.json` file defines the HTTP trigger function that returns an HTTP response and writes to a storage queue:

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "authLevel": "function",
      "name": "input"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "queue",
      "direction": "out",
      "name": "myQueueItem",
      "queueName": "outqueue",
      "connection": "MyStorageConnectionAppSetting"
    }
  ]
}
```

::: zone-end

::: zone pivot="programming-language-powershell"
This example `function.json` file defines the function:

:::code language="json" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::

For more information, see the [PowerShell developer guide](functions-reference-powershell.md#bindings).
::: zone-end

::: zone pivot="programming-language-python"
The way that the function is defined depends on the version of Python for Azure Functions:

### [v2](#tab/python-v2)

In Python for Azure Functions version 2, you define the function directly in code by using decorators:

:::code language="python" source="~/functions-docs-python-v2/function_app.py" range="4-9" :::

### [v1](#tab/python-v1)

In Python for Azure Functions version 1, this example `function.json` file defines an HTTP trigger function that returns an HTTP response and writes to a storage queue:

:::code language="json" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::

---

::: zone-end

## Binding considerations

- Not all services support both input and output bindings. See your specific binding extension for [specific code examples for bindings](#code-examples-for-bindings).

- Triggers and bindings are defined differently depending on the development language. Make sure to select your language at the [top](#top) of this article.

- Trigger and binding names are limited to alphanumeric characters and `_`, the underscore.

## Task to add bindings to a function

You can connect your function to other services by using input or output bindings. Add a binding by adding its specific definitions to your function. To learn how, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md).

Azure Functions supports multiple bindings, which must be configured correctly. For example, a function can read data from a queue (input binding) and write data to a database (output binding) simultaneously.

## Supported bindings

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

For information about which bindings are in preview or are approved for production use, see [Supported languages](supported-languages.md).

Specific versions of binding extensions are supported only while the underlying service SDK is supported. Changes to support in the underlying service SDK version affect the support for the consuming extension.

## SDK types

Azure Functions binding extensions use Azure service SDKs to connect to Azure services. The specific SDK types used by bindings can affect how you work with the data in your functions. Some bindings support SDK-specific types that provide richer functionality and better integration with the service, while others use more generic types like strings or byte arrays. When available, using SDK-specific types can provide benefits such as better type safety, easier data manipulation, and access to service-specific features.

This table indicates binding extensions that currently support SDK types:

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-sdk-types-dotnet-isolated](../../includes/functions-sdk-types-dotnet-isolated.md)]

For more information, see [SDK types](dotnet-isolated-process-guide.md#sdk-types) in the C# developer guide.
::: zone-end
::: zone pivot="programming-language-python"

[!INCLUDE [functions-sdk-types-python](../../includes/functions-sdk-types-python.md)]

SDK types are supported only when using the Python v2 programming model. For more information, see [SDK type bindings](./functions-reference-python.md#sdk-type-bindings) in the Python developer guide.
::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-typescript"

| Extension | Types | Support level |
| ----- | ----- | ----- |
| [Azure Blob Storage](functions-bindings-storage-blob.md) | `BlobClient`<br/>`ContainerClient`<br/>`ReadableStream` | Preview |
| [Azure Service Bus](functions-bindings-service-bus.md) | `ServiceBusClient`<br/>`ServiceBusReceiver`<br/>`ServiceBusSender`<br/>`ServiceBusMessage` | Preview |

SDK types are supported only when using the Node v4 programming model. For more information, see [SDK types](./functions-reference-node.md#sdk-types) in the Node.js developer guide.
::: zone-end
::: zone pivot="programming-language-java"

| Extension | Types | Support level |
| ----- | ----- | ----- |
| [Azure Blob Storage](functions-bindings-storage-blob.md) | `BlobClient`<br/>`BlobContainerClient` | Preview |

For more information, see [SDK types](./functions-reference-java.md#sdk-types) in the Java developer guide.
::: zone-end
::: zone pivot="programming-language-powershell"  
>[!IMPORTANT]  
>SDK types aren't currently supported for PowerShell apps.
::: zone-end
## Code examples for bindings

Use the following table to find more examples of specific binding types that show you how to work with bindings in your functions. First, choose the language tab that corresponds to your project.

[!INCLUDE [functions-bindings-code-example-chooser](../../includes/functions-bindings-code-example-chooser.md)]

## Custom bindings

You can create custom input and output bindings. Bindings must be authored in .NET, but they can be consumed from any supported language. For more information about creating custom bindings, see [Creating custom input and output bindings](https://github.com/Azure/azure-webjobs-sdk/wiki/Creating-custom-input-and-output-bindings).

## Related content

- [Binding expressions and patterns](./functions-bindings-expressions-patterns.md)
- [Register Azure Functions binding extensions](./functions-bindings-register.md)
- [Manually run a non-HTTP-triggered function](functions-manually-run-non-http.md)
- [Handling binding errors](./functions-bindings-errors.md)

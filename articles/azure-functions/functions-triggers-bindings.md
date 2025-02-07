---
title: Triggers and bindings in Azure Functions
description: Learn to use triggers and bindings to connect your Azure Function to online events and cloud-based services.
ms.topic: conceptual
ms.date: 10/28/2024
ms.custom: devdivchpfy22, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-ts
zone_pivot_groups: programming-languages-set-functions
ai-usage: ai-assisted
---

# Azure Functions triggers and bindings concepts

In this article, you learn the high-level concepts surrounding functions triggers and bindings.

Triggers cause a function to run. A trigger defines how a function is invoked and a function must have exactly one trigger. Triggers can also pass data into your function, as you would with method calls.

Binding to a function is a way of declaratively connecting your functions to other resources; bindings either pass data into your function (an *input binding*) or enable you to write data out from your function (an *output binding*) using *binding parameters*. Your function trigger is essentially a special type of input binding.

You can mix and match different bindings to suit your function's specific scenario. Bindings are optional and a function might have one or multiple input and/or output bindings.

Triggers and bindings let you avoid hardcoding access to other services. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function. 

Consider the following examples of how you could implement different functions.

| Example scenario | Trigger | Input binding | Output binding |
|-------------|---------|---------------|----------------|
| A new queue message arrives which runs a function to write to another queue. | Queue<sup>*</sup> | *None* | Queue<sup>*</sup> |
| A scheduled job reads Blob Storage contents and creates a new Azure Cosmos DB document. | Timer | Blob Storage | Azure Cosmos DB |
| The Event Grid is used to read an image from Blob Storage and a document from Azure Cosmos DB to send an email. | Event Grid | Blob Storage and Azure Cosmos DB | SendGrid |

<sup>\*</sup> Represents different queues

These examples aren't meant to be exhaustive, but are provided to illustrate how you can use triggers and bindings together. For a more comprehensive set of scenarios, see [Azure Functions scenarios](functions-scenarios.md).

>[!TIP]
>Functions doesn't require you to use input and output bindings to connect to Azure services. You can always create an Azure SDK client in your code and use it instead for your data transfers. For more information, see [Connect to services](functions-reference.md#connect-to-services).

##  Trigger and binding definitions

A function has a single trigger and one or more bindings. The type of binding is either input or output. Not all services support both input and output bindings. See your specific binding extension for [specific bindings code examples](#bindings-code-examples).

Triggers and bindings are defined differently depending on the development language. Make sure to select your language at the [top](#top) of the article.

This example shows an HTTP triggered function with an output binding that writes a message to an Azure Storage queue.

::: zone pivot="programming-language-csharp"
For C# class library functions, triggers and bindings are configured by decorating methods and parameters with C# attributes, where the specific attribute applied might depend on the C# runtime model:

### [Isolated worker model](#tab/isolated-process)

The HTTP trigger (`HttpTrigger`) is defined on the `Run` method for a function named `HttpExample` that returns a `MultiResponse` object:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="11-14":::

This example shows the `MultiResponse` object definition which both returns an `HttpResponse` to the HTTP request and also writes a message to a storage queue using a `QueueOutput` binding: 

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="33-38":::

For more information, see the [C# isolated worker model guide](dotnet-isolated-process-guide.md#methods-recognized-as-functions).

### [In-process model](#tab/in-process)

The HTTP trigger (`HttpTrigger`) is defined on the `Run` method for a function named `HttpExample` that writes to a storage queue defined by the `Queue` and `StorageAccount` attributes on the `msg` parameter:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="14-19":::

For more information, see the [C# in-process model guide](functions-dotnet-class-library.md#methods-recognized-as-functions).

---

Legacy C# Script functions use a function.json definition file. For more information, see the [Azure Functions C# script (.csx) developer reference](functions-reference-csharp.md).
::: zone-end
::: zone pivot="programming-language-java"
For Java functions, triggers and bindings are configured by annotating specific methods and parameters. This HTTP trigger (`@HttpTrigger`) is defined on the `run` method for a function named `HttpTriggerQueueOutput`, which writes to a storage queue defined by the `@QueueOutput` annotation on the `message` parameter:

:::code language="java" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/src/main/java/com/function/Function.java" range="16-23":::

For more information, see the [Java developer guide](functions-reference-java.md#triggers-and-annotations).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
The way that triggers and binding are defined for Node.js functions depends on the specific version of Node.js for Functions:

### [v4](#tab/node-v4)

In Node.js for Functions version 4, you configure triggers and bindings using objects exported from the `@azure/functions` module. For more information, see the [Node.js developer guide](functions-reference-node.md?pivots=nodejs-model-v4#inputs-and-outputs).

### [v3](#tab/node-v3)

In Node.js for Functions version 3, you configure triggers and bindings in a function-specific `function.json` file in the same folder as your code. For more information, see the [Node.js developer guide](functions-reference-node.md?pivots=nodejs-model-v3#inputs-and-outputs).

---

::: zone-end  
This example is an HTTP triggered function that creates a queue item for each HTTP request received.

::: zone pivot="programming-language-javascript"  
### [v4](#tab/node-v4)

The `http` method on the exported `app` object defines an HTTP trigger, and the `storageQueue` method on `output` defines an output binding on this trigger.  

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/storageQueueOutput1.js" :::

### [v3](#tab/node-v3)

This example `function.json` file defines the HTTP trigger function that returns an HTTP response and writes to a storage queue.

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

The `http` method on the exported `app` object defines an HTTP trigger, and the `storageQueue` method on `output` defines an output binding on this trigger.

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/storageQueueOutput1.ts" :::

### [v3](#tab/node-v3)

This example `function.json` file defines the HTTP trigger function that returns an HTTP response and writes to a storage queue.

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
The way that the function is defined depends on the version of Python for Functions:

### [v2](#tab/python-v2)

In Python for Functions version 2, you define the function directly in code using decorators. 

:::code language="python" source="~/functions-docs-python-v2/function_app.py" range="4-9" :::


### [v1](#tab/python-v1)

In Python for Functions version 1, this example `function.json` file defines an HTTP trigger function that returns an HTTP response and writes to a storage queue.

:::code language="json" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::

---

::: zone-end  

## Add bindings to a function

You can connect your function to other services by using input or output bindings. Add a binding by adding its specific definitions to your function. To learn how, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md).  

Azure Functions supports multiple bindings, which must be configured correctly. For example, a function can read data from a queue (input binding) and write data to a database (output binding) simultaneously. 

## Supported bindings

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

For information about which bindings are in preview or are approved for production use, see [Supported languages](supported-languages.md). 

Specific binding extension versions are only supported while the underlying service SDK is supported. Changes to support in the underlying service SDK version affect the support for the consuming extension.

## Bindings code examples

Use the following table to find more examples of specific binding types that show you how to work with bindings in your functions. First, choose the language tab that corresponds to your project. 

[!INCLUDE [functions-bindings-code-example-chooser](../../includes/functions-bindings-code-example-chooser.md)]

## Custom bindings

You can create custom input and output bindings. Bindings must be authored in .NET, but can be consumed from any supported language. For more information about creating custom bindings, see [Creating custom input and output bindings](https://github.com/Azure/azure-webjobs-sdk/wiki/Creating-custom-input-and-output-bindings).

## Related content

- [Binding expressions and patterns](./functions-bindings-expressions-patterns.md)
- [How to register a binding expression](./functions-bindings-register.md)
- Testing:
  - [Strategies for testing your code in Azure Functions](functions-test-a-function.md)
  - [Manually run a non HTTP-triggered function](functions-manually-run-non-http.md)
- [Handling binding errors](./functions-bindings-errors.md)

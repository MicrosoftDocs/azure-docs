---
title: Triggers and bindings in Azure Functions
description: Learn to use triggers and bindings to connect your Azure Function to online events and cloud-based services.
author: craigshoemaker

ms.topic: conceptual
ms.date: 02/18/2019
ms.author: cshoe
---

# Azure Functions triggers and bindings concepts

In this article you learn the high-level concepts surrounding functions triggers and bindings.

Triggers are what cause a function to run. A trigger defines how a function is invoked and a function must have exactly one trigger. Triggers have associated data, which is often provided as the payload of the function. 

Binding to a function is a way of declaratively connecting another resource to the function; bindings may be connected as *input bindings*, *output bindings*, or both. Data from bindings is provided to the function as parameters.

You can mix and match different bindings to suit your needs. Bindings are optional and a function might have one or multiple input and/or output bindings.

Triggers and bindings let you avoid hardcoding access to other services. Your function receives data (for example, the content of a queue message) in function parameters. You send data (for example, to create a queue message) by using the return value of the function. 

Consider the following examples of how you could implement different functions.

| Example scenario | Trigger | Input binding | Output binding |
|-------------|---------|---------------|----------------|
| A new queue message arrives which runs a function to write to another queue. | Queue<sup>*</sup> | *None* | Queue<sup>*</sup> |
|A scheduled job reads Blob Storage contents and creates a new Cosmos DB document. | Timer | Blob Storage | Cosmos DB |
|The Event Grid is used to read an image from Blob Storage and a document from Cosmos DB to send an email. | Event Grid | Blob Storage and  Cosmos DB | SendGrid |
| A webhook that uses Microsoft Graph to update an Excel sheet. | HTTP | *None* | Microsoft Graph |

<sup>\*</sup> Represents different queues

These examples are not meant to be exhaustive, but are provided to illustrate how you can use triggers and bindings together.

###  Trigger and binding definitions

Triggers and bindings are defined differently depending on the development language.

| Language | Triggers and bindings are configured by... |
|-------------|--------------------------------------------|
| C# class library | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;decorating methods and parameters with C# attributes |
| Java | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;decorating methods and parameters with Java annotations  | 
| JavaScript/PowerShell/Python/TypeScript | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;updating [function.json](./functions-reference.md) ([schema](http://json.schemastore.org/function)) |

For languages that rely on function.json, the portal provides a UI for adding bindings in the **Integration** tab. You can also edit the file directly in the portal in the **Code + test** tab of your function. Visual Studio Code lets you easily [add a binding to a function.json file](functions-develop-vs-code.md?tabs=nodejs#add-a-function-to-your-project) by following a convenient set of prompts. 

In .NET and Java, the parameter type defines the data type for input data. For instance, use `string` to bind to the text of a queue trigger, a byte array to read as binary, and a custom type to de-serialize to an object. Since .NET class library functions and Java functions don't rely on *function.json* for binding definitions, they can't be created and edited in the portal. C# portal editing is based on C# script, which uses *function.json* instead of attributes.

To learn more about how to add bindings to existing functions, see [Connect functions to Azure services using bindings](add-bindings-existing-function.md).

For languages that are dynamically typed such as JavaScript, use the `dataType` property in the *function.json* file. For example, to read the content of an HTTP request in binary format, set `dataType` to `binary`:

```json
{
    "dataType": "binary",
    "type": "httpTrigger",
    "name": "req",
    "direction": "in"
}
```

Other options for `dataType` are `stream` and `string`.

## Binding direction

All triggers and bindings have a `direction` property in the [function.json](./functions-reference.md) file:

- For triggers, the direction is always `in`
- Input and output bindings use `in` and `out`
- Some bindings support a special direction `inout`. If you use `inout`, only the **Advanced editor** is available via the **Integrate** tab in the portal.

When you use [attributes in a class library](functions-dotnet-class-library.md) to configure triggers and bindings, the direction is provided in an attribute constructor or inferred from the parameter type.

## Add bindings to a function

You can connect your function to other services by using input or output bindings. Add a binding by adding its specific definitions to your function. To learn how, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md).  

## Supported bindings

[!INCLUDE [Full bindings table](../../includes/functions-bindings.md)]

For information about which bindings are in preview or are approved for production use, see [Supported languages](supported-languages.md).

## Bindings code examples

Use the following table to find examples of specific binding types that show you how to work with bindings in your functions. First, choose the language tab that corresponds to your project. 

[!INCLUDE [functions-bindings-code-example-chooser](../../includes/functions-bindings-code-example-chooser.md)]

## Custom bindings

You can create custom input and output bindings. Bindings must be authored in .NET, but can be consumed from any supported language. For more information about creating custom bindings, see [Creating custom input and output bindings](https://github.com/Azure/azure-webjobs-sdk/wiki/Creating-custom-input-and-output-bindings).

## Resources
- [Binding expressions and patterns](./functions-bindings-expressions-patterns.md)
- [Using the Azure Function return value](./functions-bindings-return-value.md)
- [How to register a binding expression](./functions-bindings-register.md)
- Testing:
  - [Strategies for testing your code in Azure Functions](functions-test-a-function.md)
  - [Manually run a non HTTP-triggered function](functions-manually-run-non-http.md)
- [Handling binding errors](./functions-bindings-errors.md)

## Next steps
> [!div class="nextstepaction"]
> [Register Azure Functions binding extensions](./functions-bindings-register.md)

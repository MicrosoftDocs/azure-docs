---
title: Connect functions to other Azure services 
description: Learn how to add bindings that connect to other Azure services to an existing function in your Azure Functions project.
ms.topic: how-to
ms.date: 04/29/2020
ms.custom: vscode-azure-extension-update-not-needed
#Customer intent: As a developer, I need to know how to add a binding to an existing function so that I can integrate external services to my function.
---

# Connect functions to Azure services using bindings

When you create a function, language-specific trigger code is added in your project from a set of trigger templates. If you want to connect your function to other services by using input or output bindings, you have to add specific binding definitions in your function. To learn more about bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

## Local development       

When you develop functions locally, you need to update the function code to add bindings. Using Visual Studio Code can make it easier to add bindings to a function.  

### Visual Studio Code

When you use Visual Studio Code to develop your function and your function uses a function.json file, the Azure Functions extension can automatically add a binding to an existing function.json file. To learn more, see [Add input and output bindings](functions-develop-vs-code.md#add-input-and-output-bindings).   

### Manually add bindings based on examples

When adding a binding to an existing function, you'll need update both the function code and the function.json configuration file, if used by your language. Both .NET class library and Java functions use attributes instead of function.json, so you'll need to update that instead.

Use the following table to find examples of specific binding types that you can use to guide you in updating an existing function. First, choose the language tab that corresponds to your project. 

[!INCLUDE [functions-bindings-code-example-chooser](../../includes/functions-bindings-code-example-chooser.md)]

## Azure portal

When you develop your functions in the [Azure portal](https://portal.azure.com), you add input and output bindings in the **Integrate** tab for a given function. The new bindings are added to either the function.json file or to the method attributes, depending on your language. The following articles show examples of how to add bindings to an existing function in the portal:

+ [Queue storage output binding](functions-integrate-storage-queue-output-binding.md)
+ [Azure Cosmos DB output binding](functions-integrate-store-unstructured-data-cosmosdb.md)

## Next steps

+ [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md)

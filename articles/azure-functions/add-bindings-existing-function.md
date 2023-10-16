---
title: Connect functions to other Azure services 
description: Learn how to add bindings that connect to other Azure services to an existing function in your Azure Functions project.
ms.topic: how-to
ms.date: 08/18/2023
ms.custom: vscode-azure-extension-update-not-needed, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions    
#Customer intent: As a developer, I need to know how to add a binding to an existing function so that I can integrate external services to my function.
---

# Connect functions to Azure services using bindings

When you create a function, language-specific trigger code is added in your project from a set of trigger templates. If you want to connect your function to other services by using input or output bindings, you have to add specific binding definitions in your function. To learn more about bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

## Local development       

When you develop functions locally, you need to update the function code to add bindings. For languages that use function.json, [Visual Studio Code](#visual-studio-code) provides tooling to add bindings to a function.  

### Manually add bindings based on examples

::: zone pivot="programming-language-csharp"  
When adding a binding to an existing function, you need to add binding-specific attributes to the function definition in code. 
::: zone-end  
::: zone pivot="programming-language-java"  
When adding a binding to an existing function, you need to add binding-specific annotations to the function definition in code.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell"
When adding a binding to an existing function, you need to update the function code and add a definition to the function.json configuration file. 
::: zone-end  
::: zone pivot="programming-language-python"
When adding a binding to an existing function, you need update the function definition, depending on your model:

#### [v2](#tab/python-v2)
You need to add binding-specific annotations to the function definition in code.
#### [v1](#tab/python-v1)
You need to update the function code and add a definition to the function.json configuration file.

---
::: zone-end
[!INCLUDE [functions-add-output-binding-example-all-langs](../../includes/functions-add-output-binding-example-all-languages.md)]

Use the following table to find examples of specific binding types that you can use to guide you in updating an existing function. First, choose the language tab that corresponds to your project. 

[!INCLUDE [functions-bindings-code-example-chooser](../../includes/functions-bindings-code-example-chooser.md)]

### Visual Studio Code

When you use Visual Studio Code to develop your function and your function uses a function.json file, the Azure Functions extension can automatically add a binding to an existing function.json file. To learn more, see [Add input and output bindings](functions-develop-vs-code.md#add-input-and-output-bindings).   

## Azure portal

When you develop your functions in the [Azure portal](https://portal.azure.com), you add input and output bindings in the **Integrate** tab for a given function. The new bindings are added to either the function.json file or to the method attributes, depending on your language. The following articles show examples of how to add bindings to an existing function in the portal:

+ [Queue storage output binding](functions-integrate-storage-queue-output-binding.md)
+ [Azure Cosmos DB output binding](functions-integrate-store-unstructured-data-cosmosdb.md)

## Next steps

+ [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md)

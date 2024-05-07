---
title: Azure OpenAI assistant create output binding for Azure Functions
description: Learn how to use the Azure OpenAI assistant create output binding to {{do soomething}} during function execution in Azure Functions.
ms.topic: reference
ms.date: 04/14/2024
ms.devlang: csharp, java, javascript, powershell, python, typescript
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant create output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant create output binding allows you to create a new assistant chat bot.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](../ai-services/openai/concepts/assistants.md).
::: zone pivot="programming-language-javascript,programming-language-typescript"  
> [!NOTE]  
> References and examples are only provided for the [Node.js v4 model](./functions-reference-node.md?pivots=nodejs-model-v4).
::: zone-end  
::: zone pivot="programming-language-python"  
> [!NOTE]  
> References and examples are only provided for the [Python v2 model](functions-reference-python.md?pivots=python-mode-decorators#development-options).
::: zone-end  

## Example

::: zone pivot="programming-language-csharp"  
A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

### [Isolated process](#tab/isolated-process)

This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantSample/AssistantApis.cs" range="20-45"::: 

### [In-process](#tab/in-process)

[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]

---

::: zone-end  
::: zone pivot="programming-language-java"
{{This comes from the example code comment}} 

:::code language="java" source="~/functions-openai-extension/samples/{{link to the correct sample.java}}" range="{{named is better than range}}":::

{{Add more examples if available}}
::: zone-end  
::: zone pivot="programming-language-javascript"

{{This comes from the example code comment}} 

:::code language="javascript" source="~/functions-openai-extension/samples/{{link to the correct sample.js}}" range="{{named is better than range}}":::

{{Add more examples if available}}

::: zone-end  
::: zone pivot="programming-language-typescript"

This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

:::code language="javascript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantApis.ts" range="7-29":::

 ::: zone-end  
::: zone pivot="programming-language-powershell"  
{{This comes from the example code comment}} 

Here's the _function.json_ file for {{example}}:

:::code language="json" source="~/functions-openai-extension/samples/{{link to the correct function.json}}" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

{{This comes from the example code comment}} 

:::code language="powershell" source="~/functions-openai-extension/samples/{{link to the correct sample.ps1}}" :::

::: zone-end   
::: zone pivot="programming-language-python"  
This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  


:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_apis.py" range="7-22":::

::: zone-end  
<!--- End code examples section -->  
<!--- Begin the actual references (Attributes/Annotations/Properties/Decorators) section 
All of the tables share essentially the same content, which comes from the .NET code definitions and comments.
In an ideal world, these sections would be generated directly from the definitions in the source code. 
-->  
::: zone pivot="programming-language-csharp"  
## Attributes

The specific attribute you apply to define an assistant create output binding depends on your C# process mode. 

### [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), apply `CreateAssistant` to define an assistant create output binding.

### [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), apply `CreateAssistant` to define an assistant create output binding.

---

The attribute supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Id** | The identifier of the assistant to create. |
| **Instructions** | _Optional._ The instructions that are provided to assistant to follow. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `CreateAssistant` annotation enables you to define an assistant create output binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the output binding. |
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional._ The instructions that are provided to assistant to follow. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Are we going to have a specific decorator defined for this binding? Right now, examples are using a generic binding decorator.-->
The `CreateAssistant` decorator supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional._ The instructions that are provided to assistant to follow. |


::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `CreateAssistant`. |
| **direction** | Must be `out`. |
| **name** | The name of the output binding. |
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional._ The instructions that are provided to assistant to follow. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional._ The instructions that are provided to assistant to follow. |
::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

<!---Usage information goes here. This should be brief, language-specific, and related to:
    1. Supported types.
    2. Binding-speficic connection details (if not already covered in the overview article).
-->

## Related content

{{To be added}}

<!--- Add links to:
1. How-to articles.
2. Related references.
3. External references (Azure OpenAI overview, etc.).
-->

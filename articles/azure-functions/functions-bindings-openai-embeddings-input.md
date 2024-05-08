---
title: Azure OpenAI embeddings input binding for Azure Functions
description: Learn how to use the Azure OpenAI embeddings input binding to {{do soomething}} during function execution in Azure Functions.
ms.topic: reference
ms.date: 04/14/2024
ms.devlang: csharp, java, javascript, powershell, python, typescript
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI embeddings input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI embeddings input binding allows you to generate embeddings for inputs. The binding can generate embeddings from files or raw text inputs.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about embeddings in Azure OpenAI Service, see [Understand embeddings in Azure OpenAI Service](../ai-services/openai/concepts/understand-embeddings.md).
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

This example shows how to generate embeddings for a raw text string.

:::code language="csharp" source="~/functions-openai-extension/samples/embeddings/csharp-ooproc/Embeddings/EmbeddingsGenerator.cs" range="38-54"::: 

This example shows how to generate embeddings for text contained in a file on the file syste.

:::code language="csharp" source="~/functions-openai-extension/samples/embeddings/csharp-ooproc/Embeddings/EmbeddingsGenerator.cs" range="60-76"::: 

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

{{This comes from the example code comment}} 

:::code language="typescript" source="~/functions-openai-extension/samples/{{link to the correct sample.ts}}" range="{{named is better than range}}":::

{{Add more examples if available}}

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
{{This comes from the example code comment}} 

:::code language="python" source="~/functions-openai-extension/samples/{{link to the correct sample.py}}" range="{{named is better than range}}":::

{{Add more examples if available}}

::: zone-end  
<!--- End code examples section -->  
<!--- Begin the actual references (Attributes/Annotations/Properties/Decorators) sections 
All of the tables share essentially the same content, which comes from the .NET code definitions and comments.
In an ideal world, these sections would be generated directly from the definitions in the source code. 
-->  
::: zone pivot="programming-language-csharp"  
## Attributes

The specific attribute you apply to define an embeddings input binding depends on your C# process mode. 

### [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), apply `EmbeddingsInput` to define an embeddings input binding.

### [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), apply `EmbeddingsInput` to define an embeddings input binding.

---

The attribute supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Model** | Gets or sets the ID of the model to use. Changing the default embeddings model is a breaking change, since any changes will be stored in a vector database for lookup. Changing the default model can cause the lookups to start misbehaving if they don't match the data that was previously ingested into the vector database. |
| **MaxChunkLength** | _Optional_. Gets or sets the maximum number of characters to chunk the input into. At the time of writing, the maximum input tokens allowed for second-generation input embedding models like <c>text-embedding-ada-002</c> is 8191. 1 token is ~4 chars in English, which translates to roughly 32K characters of English input that can fit into a single chunk.|
| **MaxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **Input** | Gets the input to generate embeddings for. |
| **InputType** | Gets the type of the input. |


::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `EmbeddingsInput` annotation enables you to define an embeddings input binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **model** | Gets or sets the ID of the model to use. Changing the default embeddings model is a breaking change, since any changes will be stored in a vector database for lookup. Changing the default model can cause the lookups to start misbehaving if they don't match the data that was previously ingested into the vector database. |
| **maxChunkLength** | _Optional_. Gets or sets the maximum number of characters to chunk the input into. At the time of writing, the maximum input tokens allowed for second-generation input embedding models like <c>text-embedding-ada-002</c> is 8191. 1 token is ~4 chars in English, which translates to roughly 32K characters of English input that can fit into a single chunk.|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **input** | Gets the input to generate embeddings for. |
| **inputType** | Gets the type of the input. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the input binding as a `generic_input_binding` binding of type `embeddings`, which supports these parameters: `embeddings` decorator supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **model** | Gets or sets the ID of the model to use. Changing the default embeddings model is a breaking change, since any changes will be stored in a vector database for lookup. Changing the default model can cause the lookups to start misbehaving if they don't match the data that was previously ingested into the vector database. |
| **max_chunk_length** | _Optional_. Gets or sets the maximum number of characters to chunk the input into. At the time of writing, the maximum input tokens allowed for second-generation input embedding models like <c>text-embedding-ada-002</c> is 8191. 1 token is ~4 chars in English, which translates to roughly 32K characters of English input that can fit into a single chunk.|
| **max_overlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **input** | Gets the input to generate embeddings for. |
| **input_type** | Gets the type of the input. |


::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `EmbeddingsInput`. |
| **direction** | Must be `in`. |
| **name** | The name of the input binding. |
| **model** | Gets or sets the ID of the model to use. Changing the default embeddings model is a breaking change, since any changes will be stored in a vector database for lookup. Changing the default model can cause the lookups to start misbehaving if they don't match the data that was previously ingested into the vector database. |
| **maxChunkLength** | _Optional_. Gets or sets the maximum number of characters to chunk the input into. At the time of writing, the maximum input tokens allowed for second-generation input embedding models like <c>text-embedding-ada-002</c> is 8191. 1 token is ~4 chars in English, which translates to roughly 32K characters of English input that can fit into a single chunk.|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **input** | Gets the input to generate embeddings for. |
| **inputType** | Gets the type of the input. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **model** | Gets or sets the ID of the model to use. Changing the default embeddings model is a breaking change, since any changes will be stored in a vector database for lookup. Changing the default model can cause the lookups to start misbehaving if they don't match the data that was previously ingested into the vector database. |
| **maxChunkLength** | _Optional_. Gets or sets the maximum number of characters to chunk the input into. At the time of writing, the maximum input tokens allowed for second-generation input embedding models like <c>text-embedding-ada-002</c> is 8191. 1 token is ~4 chars in English, which translates to roughly 32K characters of English input that can fit into a single chunk.|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **input** | Gets the input to generate embeddings for. |
| **inputType** | Gets the type of the input. |

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Embeddings samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/embeddings)
+ [Azure OpenAI extensions for Azure Functions](functions-bindings-openai.md)

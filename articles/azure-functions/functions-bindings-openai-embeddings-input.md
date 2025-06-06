---
title: Azure OpenAI embeddings input binding for Azure Functions
description: Learn how to use the Azure OpenAI embeddings input binding to generate embeddings during function execution in Azure Functions.
ms.topic: reference
ms.custom:
  - build-2024
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - devx-track-ts
  - build-2025
ms.collection: 
  - ce-skilling-ai-copilot
ms.date: 05/15/2025
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI embeddings input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI embeddings input binding allows you to generate embeddings for inputs. The binding can generate embeddings from files or raw text inputs.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about embeddings in Azure OpenAI Service, see [Understand embeddings in Azure OpenAI Service](/azure/ai-services/openai/concepts/understand-embeddings).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)]

## Example

::: zone pivot="programming-language-csharp"  
This example shows how to generate embeddings for a raw text string.

:::code language="csharp" source="~/functions-openai-extension/samples/embeddings/csharp-ooproc/Embeddings/EmbeddingsGenerator.cs" range="25-57"::: 

This example shows how to retrieve embeddings stored at a specified file that is accessible to the function.

:::code language="csharp" source="~/functions-openai-extension/samples/embeddings/csharp-ooproc/Embeddings/EmbeddingsGenerator.cs" range="63-78"::: 

::: zone-end  
::: zone pivot="programming-language-java"
This example shows how to generate embeddings for a raw text string.

:::code language="java" source="~/functions-openai-extension/samples/embeddings/java/src/main/java/com/azfs/EmbeddingsGenerator.java" range="26-53":::

This example shows how to retrieve embeddings stored at a specified file that is accessible to the function.

:::code language="java" source="~/functions-openai-extension/samples/embeddings/java/src/main/java/com/azfs/EmbeddingsGenerator.java" range="59-86":::

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
This example shows how to generate embeddings for a raw text string.
::: zone-end  
::: zone pivot="programming-language-javascript"  

:::code language="javascript" source="~/functions-openai-extension/samples/embeddings/javascript/src/app.js" range="3-27":::

::: zone-end  
::: zone pivot="programming-language-typescript"

:::code language="typescript" source="~/functions-openai-extension/samples/embeddings/typescript/src/app.ts" range="3-31":::

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
This example shows how to generate embeddings for a raw text string.
::: zone-end  
::: zone pivot="programming-language-javascript"  

:::code language="javascript" source="~/functions-openai-extension/samples/embeddings/javascript/src/app.js" range="29-54":::

::: zone-end  
::: zone pivot="programming-language-typescript"  

:::code language="typescript" source="~/functions-openai-extension/samples/embeddings/typescript/src/app.ts" range="33-62":::

::: zone-end  
::: zone pivot="programming-language-powershell"  
This example shows how to generate embeddings for a raw text string.

Here's the _function.json_ file for generating the embeddings:

:::code language="json" source="~/functions-openai-extension/samples/embeddings/powershell/GenerateEmbeddings/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

:::code language="powershell" source="~/functions-openai-extension/samples/embeddings/powershell/GenerateEmbeddings/run.ps1" :::
::: zone-end   
::: zone pivot="programming-language-python"  
This example shows how to generate embeddings for a raw text string.

:::code language="python" source="~/functions-openai-extension/samples/embeddings/python/function_app.py" range="8-27":::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `EmbeddingsInput` attribute to define an embeddings input binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Input** | The input string for which to generate embeddings. |
| **AIConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **EmbeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **MaxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **MaxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **InputType** | _Optional_. Gets the type of the input. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `EmbeddingsInput` annotation enables you to define an embeddings input binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **input** | The input string for which to generate embeddings. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **inputType** |  _Optional_. Gets the type of the input. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the input binding as a `generic_input_binding` binding of type `embeddings`, which supports these parameters: `embeddings` decorator supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **input** | The input string for which to generate embeddings. |
| **ai_connection_name** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddings_model** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **max_overlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
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
| **input** | The input string for which to generate embeddings. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **inputType** | _Optional_. Gets the type of the input. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **input** | The input string for which to generate embeddings. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **inputType** | _Optional_. Gets the type of the input. |

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

Changing the default embeddings `model` changes the way that embeddings are stored in the vector database. Changing the default model can cause the lookups to start misbehaving when they don't match the rest of the data that was previously ingested into the vector database. The default model for embeddings is `text-embedding-ada-002`.

When calculating the maximum character length for input chunks, consider that the maximum input tokens allowed for second-generation input embedding models like `text-embedding-ada-002` is `8191`. A single token is approximately four characters in length (in English), which translates to roughly 32,000 (English) characters of input that can fit into a single chunk.

## Related content

+ [Embeddings samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/embeddings)
+ [Azure OpenAI extensions for Azure Functions](functions-bindings-openai.md)

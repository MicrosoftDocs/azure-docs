---
title: Azure OpenAI embeddings store output binding for Azure Functions
description: Learn how to use the Azure OpenAI embeddings store output binding to write searchable content to a semantic document store during function execution in Azure Functions.
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

# Azure OpenAI embeddings store output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI embeddings store output binding allows you to write files to a semantic document store that can be referenced later in a semantic search.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about semantic ranking in Azure AI Search, see [Semantic ranking in Azure AI Search](/azure/search/semantic-search-overview).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)]

## Example

::: zone pivot="programming-language-csharp"  
This example writes an HTTP input stream to a semantic document store at the provided URL. 

:::code language="csharp" source="~/functions-openai-extension/samples/rag-aisearch/csharp-ooproc/FilePrompt.cs" range="17-21,29-66"::: 

::: zone-end  
::: zone pivot="programming-language-java"
This example writes an HTTP input stream to a semantic document store at the provided URL. 

:::code language="java" source="~/functions-openai-extension/samples/rag-aisearch/java/src/main/java/com/azfs/FilePrompt.java" range="29-73":::

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
This example writes an HTTP input stream to a semantic document store at the provided URL. 
::: zone-end  
::: zone pivot="programming-language-javascript"

:::code language="javascript" source="~/functions-openai-extension/samples/rag-aisearch/javascript/src/app.js" range="5-37":::

::: zone-end  
::: zone pivot="programming-language-typescript"

:::code language="typescript" source="~/functions-openai-extension/samples/rag-aisearch/typescript/src/app.ts" range="4-40":::

::: zone-end  
::: zone pivot="programming-language-powershell"  
This example writes an HTTP input stream to a semantic document store at the provided URL. 

Here's the _function.json_ file for ingesting files:

:::code language="json" source="~/functions-openai-extension/samples/rag-aisearch/powershell/IngestFile/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

:::code language="powershell" source="~/functions-openai-extension/samples/rag-aisearch/powershell/IngestFile/run.ps1" :::

::: zone-end   
::: zone pivot="programming-language-python"  
This example writes an HTTP input stream to a semantic document store at the provided URL. 

:::code language="python" source="~/functions-openai-extension/samples/rag-aisearch/python/function_app.py" range="8-35":::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `EmbeddingsStoreOutput` attribute to define an embeddings store output binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Input** | The input string for which to generate embeddings. |
| **AIConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **EmbeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **MaxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **MaxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **InputType** | _Optional_. Gets the type of the input. |
| **StoreConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **Collection** | The name of the collection or table or index to search. This property supports binding expressions.|

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `EmbeddingsStoreOutput` annotation enables you to define an embeddings store output binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the output binding. |
| **input** | The input string for which to generate embeddings. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **inputType** |  _Optional_. Gets the type of the input. |
| **storeConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the output binding as a `generic_output_binding` binding of type `semanticSearch`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **input** | The input string for which to generate embeddings. |
| **ai_connection_name** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddings_model** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **max_overlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **input_type** | Gets the type of the input. |
| **store_connection_name** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|

::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `embeddingsStore`. |
| **direction** | Must be `out`. |
| **name** | The name of the output binding. |
| **input** | The input string for which to generate embeddings. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **embeddingsModel** | _Optional_. The ID of the model to use, which defaults to `text-embedding-ada-002`. You shouldn't change the model for an existing database. For more information, see [Usage](#usage). |
| **maxChunkLength** | _Optional_. The maximum number of characters used for chunking the input. For more information, see [Usage](#usage).|
| **maxOverlap** | _Optional_. Gets or sets the maximum number of characters to overlap between chunks.|
| **inputType** | _Optional_. Gets the type of the input. |
| **storeConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|

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
| **storeConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Semantic search samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch)
+ [Azure OpenAI extensions for Azure Functions](functions-bindings-openai.md)
+ [Azure OpenAI semantic search input binding for Azure Functions](functions-bindings-openai-semanticsearch-input.md)

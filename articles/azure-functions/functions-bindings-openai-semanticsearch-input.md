---
title: Azure OpenAI Semantic Search Input Binding for Azure Functions
description: Learn how to use the Azure OpenAI semantic search input binding to use semantic search on your embeddings during function execution in Azure Functions.
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
# Azure OpenAI Semantic Search Input Binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI semantic search input binding allows you to use semantic search on your embeddings.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about semantic ranking in Azure AI Search, see [Semantic ranking in Azure AI Search](/azure/search/semantic-search-overview).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)]

## Example

::: zone pivot="programming-language-csharp"  
This example shows how to perform a semantic search on a file.

:::code language="csharp" source="~/functions-openai-extension/samples/rag-aisearch/csharp-ooproc/FilePrompt.cs" range="76-82"::: 

::: zone-end  
::: zone pivot="programming-language-java"
This example shows how to perform a semantic search on a file.  

:::code language="java" source="~/functions-openai-extension/samples/rag-aisearch/java/src/main/java/com/azfs/FilePrompt.java" range="75-89,101-109":::

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
This example shows how to perform a semantic search on a file.
::: zone-end  
::: zone pivot="programming-language-javascript"

:::code language="javascript" source="~/functions-openai-extension/samples/rag-aisearch/javascript/src/app.js" range="39-57":::

::: zone-end  
::: zone pivot="programming-language-typescript"

:::code language="typescript" source="~/functions-openai-extension/samples/rag-aisearch/typescript/src/app.ts" range="42-60":::

::: zone-end  
::: zone pivot="programming-language-powershell"  

This example shows how to perform a semantic search on a file.

Here's the _function.json_ file for prompting a file:

:::code language="json" source="~/functions-openai-extension/samples/rag-aisearch/powershell/PromptFile/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.


:::code language="powershell" source="~/functions-openai-extension/samples/rag-aisearch/powershell/PromptFile/run.ps1" :::

::: zone-end   
::: zone pivot="programming-language-python" 

This example shows how to perform a semantic search on a file.
:::code language="python" source="~/functions-openai-extension/samples/rag-aisearch/python/function_app.py" range="38-56":::

::: zone-end  
<!--- End code examples section -->  
<!--- Begin the actual references (Attributes/Annotations/Properties/Decorators) sections 
All of the tables share essentially the same content, which comes from the .NET code definitions and comments.
In an ideal world, these sections would be generated directly from the definitions in the source code. 
-->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `SemanticSearchInput` attribute to define a semantic search input binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **SearchConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **Collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **Query** |  The semantic query text to use for searching. This property supports binding expressions.|
| **EmbeddingsModel** | _Optional_. The ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **ChatModel** | _Optional_. Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **AIConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **SystemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is sent to the OpenAI Chat API. This property supports binding expressions.|
| **MaxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|
| **IsReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|


::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `SemanticSearchInput` annotation enables you to define a semantic search input binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **searchConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  The semantic query text to use for searching. This property supports binding expressions.|
| **embeddingsModel** | _Optional_. The ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chatModel** | _Optional_. Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **systemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is sent to the OpenAI Chat API. This property supports binding expressions.|
| **maxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|
| **isReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|


::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the input binding as a `generic_input_binding` binding of type `semanticSearch`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **search_connection_name** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  The semantic query text to use for searching. This property supports binding expressions.|
| **embeddings_model** |  _Optional_. The ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chat_model** |  _Optional_. Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **ai_connection_name** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **system_prompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is sent to the OpenAI Chat API. This property supports binding expressions.|
| **max_knowledge_count** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|
| **is_reasoning _model** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `semanticSearch`. |
| **direction** | Must be `in`. |
| **name** | The name of the input binding. |
| **searchConnectionName** | Gets or sets the name of an app setting or environment variable that contains a connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  The semantic query text to use for searching. This property supports binding expressions.|
| **embeddingsModel** |  _Optional_. The ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chatModel** |  _Optional_. Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **systemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is sent to the OpenAI Chat API. This property supports binding expressions.|
| **maxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|
| **isReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **searchConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  The semantic query text to use for searching. This property supports binding expressions.|
| **embeddingsModel** |  _Optional_. The ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chatModel** |  _Optional_. Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **systemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is sent to the OpenAI Chat API. This property supports binding expressions.|
| **maxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|
| **isReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Semantic AI Search samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch)
+ [Semantic Cosmos DB No SQL Search samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-cosmosdb-nosql)
+ [Semantic Cosmos DB Mongo VCore Search samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-cosmosdb)
+ [Azure OpenAI extensions for Azure Functions](functions-bindings-openai.md)
+ [Azure OpenAI embeddings store output binding for Azure Functions](functions-bindings-openai-embeddingsstore-output.md)

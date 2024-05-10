---
title: Azure OpenAI embeddings store output binding for Azure Functions
description: Learn how to use the Azure OpenAI embeddings store output binding to write searchable content to a semantic document store during function execution in Azure Functions.
ms.topic: reference
ms.date: 05/08/2024
zone_pivot_groups: programming-languages-set-functions
---
<!--- Question: It seems like this binding uses Azure AI Search and not Azure OpenAI. Do we need to rename the article to:
"Azure AI Search semantic output binding" or something like that?-->
# Azure OpenAI embeddings store output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI embeddings store output binding allows you to write files to a semantic document store that can be referenced later in a semantic search.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about semantic ranking in Azure AI Search, see [Semantic ranking in Azure AI Search](../search/semantic-search-overview.md).
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

This example writes an HTTP input stream to a semantic document store at the provided URL. 

:::code language="csharp" source="~/functions-openai-extension/samples/rag-aisearch/csharp-ooproc/FilePrompt.cs" range="31-64"::: 

### [In-process](#tab/in-process)

[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]

---

::: zone-end  
::: zone pivot="programming-language-java"
[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]
<!---uncomment when code example is available:
{{This comes from the example code comment}} 

:::code language="java" source="~/functions-openai-extension/samples/{{link to the correct sample.java}}" range="{{named is better than range}}":::

{{Add more examples if available}}
-->
::: zone-end  
::: zone pivot="programming-language-javascript"
[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]
<!---uncomment when code example is available:
{{This comes from the example code comment}} 

:::code language="javascript" source="~/functions-openai-extension/samples/{{link to the correct sample.js}}" range="{{named is better than range}}":::

{{Add more examples if available}}
-->
::: zone-end  
::: zone pivot="programming-language-typescript"
[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]
<!---uncomment when code example is available:
{{This comes from the example code comment}} 

:::code language="typescript" source="~/functions-openai-extension/samples/{{link to the correct sample.ts}}" range="{{named is better than range}}":::

{{Add more examples if available}}
-->
::: zone-end  
::: zone pivot="programming-language-powershell"  
[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]
<!---uncomment when code example is available:
{{This comes from the example code comment}} 

Here's the _function.json_ file for {{example}}:

:::code language="json" source="~/functions-openai-extension/samples/{{link to the correct function.json}}" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

{{This comes from the example code comment}} 

:::code language="powershell" source="~/functions-openai-extension/samples/{{link to the correct sample.ps1}}" :::
-->
::: zone-end   
::: zone pivot="programming-language-python"  
[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]
<!---uncomment when code example is available:
{{This comes from the example code comment}} 

:::code language="python" source="~/functions-openai-extension/samples/{{link to the correct sample.py}}" range="{{named is better than range}}":::

{{Add more examples if available}}
-->
::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `EmbeddingsStoreOutput` attribute to define a embeddings store output binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **ConnectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **Collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **Query** |  Gets or sets the semantic query text to use for searching. This property is only used for the semantic search input binding. This property supports binding expressions.|
| **EmbeddingsModel** | Gets or sets the ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **ChatModel** | Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **SystemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is then sent to the OpenAI Chat API. This property supports binding expressions.|
| **MaxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|


::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `EmbeddingsStoreOutput` annotation enables you to define a embeddings store output binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the output binding. |
| **connectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  Gets or sets the semantic query text to use for searching. This property is only used for the semantic search input binding. This property supports binding expressions.|
| **embeddingsModel** | Gets or sets the ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chatModel** | Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **systemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is then sent to the OpenAI Chat API. This property supports binding expressions.|
| **maxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|


::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the output binding as a `generic_output_binding` binding of type `semanticSearch`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **connection_name** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  Gets or sets the semantic query text to use for searching. This property is only used for the semantic search input binding. This property supports binding expressions.|
| **embeddings_model** | Gets or sets the ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chat_model** | Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **system_prompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is then sent to the OpenAI Chat API. This property supports binding expressions.|
| **max_knowledge_count** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|

::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `embeddingsStore`. |
| **direction** | Must be `out`. |
| **name** | The name of the output binding. |
| **connectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  Gets or sets the semantic query text to use for searching. This property is only used for the semantic search input binding. This property supports binding expressions.|
| **embeddingsModel** | Gets or sets the ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chatModel** | Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **systemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is then sent to the OpenAI Chat API. This property supports binding expressions.|
| **maxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **connectionName** | The name of an app setting or environment variable that contains the connection string value. This property supports binding expressions. |
| **collection** | The name of the collection or table or index to search. This property supports binding expressions.|
| **query** |  Gets or sets the semantic query text to use for searching. This property is only used for the semantic search input binding. This property supports binding expressions.|
| **embeddingsModel** | Gets or sets the ID of the model to use for embeddings. The default value is `text-embedding-3-small`. This property supports binding expressions.|
| **chatModel** | Gets or sets the name of the Large Language Model to invoke for chat responses. The default value is `gpt-3.5-turbo`. This property supports binding expressions.|
| **systemPrompt** | _Optional_. Gets or sets the system prompt to use for prompting the large language model. The system prompt is appended with knowledge that is fetched as a result of the `Query`. The combined prompt is then sent to the OpenAI Chat API. This property supports binding expressions.|
| **maxKnowledgeCount** | _Optional_. Gets or sets the number of knowledge items to inject into the `SystemPrompt`.|

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Semantic search samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch)
+ [Azure OpenAI extensions for Azure Functions](functions-bindings-openai.md)
+ [Azure OpenAI semantic search input binding for Azure Functions](functions-bindings-openai-semanticsearch-input.md)


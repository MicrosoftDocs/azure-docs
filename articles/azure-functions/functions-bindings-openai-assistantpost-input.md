---
title: Azure OpenAI assistant post input binding for Azure Functions
description: Learn how to use the Azure OpenAI assistant post input binding to query chat bots during function execution in Azure Functions.
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
ms.update-cycle: 180-days
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant post input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant post input binding lets you send prompts to assistant chat bots.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](/azure/ai-services/openai/concepts/assistants).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)] 

## Example

::: zone pivot="programming-language-csharp"  
This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantApis.cs" range="58-68"::: 

::: zone-end  
::: zone pivot="programming-language-java"

This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="java" source="~/functions-openai-extension/samples/assistant/java/src/main/java/com/azfs/AssistantApis.java" range="99-121":::

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript" 
This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.
::: zone-end  
::: zone pivot="programming-language-javascript"
:::code language="javascript" source="~/functions-openai-extension/samples/assistant/javascript/src/functions/assistantApis.js" range="4-5,36-60":::

::: zone-end  
::: zone pivot="programming-language-typescript"

:::code language="typescript" source="~/functions-openai-extension/samples/assistant/typescript/src/functions/assistantApis.ts" range="4-5,36-60":::

::: zone-end  
::: zone pivot="programming-language-powershell"  

This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

Here's the _function.json_ file for post user query:

:::code language="json" source="~/functions-openai-extension/samples/assistant/powershell/PostUserQuery/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

:::code language="powershell" source="~/functions-openai-extension/samples/assistant/powershell/PostUserQuery/run.ps1" :::

::: zone-end   
::: zone pivot="programming-language-python"  
This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_apis.py" range="34-52":::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `PostUserQuery` attribute to define an assistant post input binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Id** | The ID of the assistant to update. |
| **UserMessage** | Gets or sets the user message for the chat completion model, encoded as a string. |
| **AIConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **ChatModel** |  _Optional_. Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **Temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **TopP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **MaxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |
| **IsReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `PostUserQuery` annotation enables you to define an assistant post input binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | The name of the output binding. |
| **id** | The ID of the assistant to update. |
| **userMessage** | Gets or sets the user message for the chat completion model, encoded as a string. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **chatModel** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **topP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **maxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |
| **isReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the output binding as a `generic_output_binding` binding of type `postUserQuery`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **id** | The ID of the assistant to update. |
| **user_message** | Gets or sets the user message for the chat completion model, encoded as a string. |
| **ai_connection_name** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **chat_model** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **top_p** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **max_tokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |
| **is_reasoning _model** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `PostUserQuery`. |
| **direction** | Must be `out`. |
| **name** | The name of the output binding. |
| **id** | The ID of the assistant to update. |
| **userMessage** | Gets or sets the user message for the chat completion model, encoded as a string. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **chatModel** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **topP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **maxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |
| **isReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **id** | The ID of the assistant to update. |
| **userMessage** | Gets or sets the user message for the chat completion model, encoded as a string. |
| **aiConnectionName** |  _Optional_. Gets or sets the name of the configuration section for AI service connectivity settings. For Azure OpenAI: If specified, looks for "Endpoint" and "Key" values in this configuration section. If not specified or the section doesn't exist, falls back to environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY. For user-assigned managed identity authentication, this property is required. For OpenAI service (non-Azure), set the OPENAI_API_KEY environment variable.|
| **chatModel** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **topP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **maxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |
| **isReasoningModel** | _Optional_. Gets or sets a value indicating whether the chat completion model is a reasoning model. This option is experimental and associated with the reasoning model until all models have parity in the expected properties, with a default value of `false`.|

::: zone-end  

## Usage

See the [Example section](#example) for complete examples. 

## Related content

+ [Assistant samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant)
+ [Azure OpenAI extension](functions-bindings-openai.md)
+ [Azure OpenAI assistant trigger](functions-bindings-openai-assistant-trigger.md)
+ [Azure OpenAI assistant query input binding](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant create output binding](functions-bindings-openai-assistantcreate-output.md)

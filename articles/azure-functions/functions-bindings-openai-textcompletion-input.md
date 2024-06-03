---
title: Azure OpenAI text completion input binding for Azure Functions
description: Learn how to use the Azure OpenAI text completion input binding to access Azure OpenAI text completion APIs during function execution in Azure Functions.
ms.topic: reference
ms.custom:
  - build-2024
ms.date: 05/23/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI text completion input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI text completion input binding allows you to bring the results text completion APIs into your code executions. You can define the binding to use both predefined prompts with parameters or pass through an entire prompt.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI completions, see [Learn how to generate or manipulate text](../ai-services/openai/how-to/completions.md).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)]

## Example

::: zone pivot="programming-language-csharp"  
This example demonstrates the _templating_ pattern, where the HTTP trigger function takes a `name` parameter and embeds it into a text prompt, which is then sent to the Azure OpenAI completions API by the extension. The response to the prompt is returned in the HTTP response. 

:::code language="csharp" source="~/functions-openai-extension/samples/textcompletion/csharp-ooproc/TextCompletions.cs" range="23-31"::: 

This example takes a prompt as input, sends it directly to the completions API, and returns the response as the output.

:::code language="csharp" source="~/functions-openai-extension/samples/textcompletion/csharp-ooproc/TextCompletions.cs" range="37-46"::: 

::: zone-end  
::: zone pivot="programming-language-java"
This example demonstrates the _templating_ pattern, where the HTTP trigger function takes a `name` parameter and embeds it into a text prompt, which is then sent to the Azure OpenAI completions API by the extension. The response to the prompt is returned in the HTTP response. 

:::code language="java" source="~/functions-openai-extension/samples/textcompletion/java/src/main/java/com/azfs/TextCompletions.java" range="31-46":::

This example takes a prompt as input, sends it directly to the completions API, and returns the response as the output.

:::code language="java" source="~/functions-openai-extension/samples/textcompletion/java/src/main/java/com/azfs/TextCompletions.java" range="52-65":::

::: zone-end  
::: zone pivot="programming-language-javascript"

[!INCLUDE [functions-examples-not-available-note](../../includes/functions-examples-not-available-note.md)]

::: zone-end  
::: zone pivot="programming-language-typescript"

This example demonstrates the _templating_ pattern, where the HTTP trigger function takes a `name` parameter and embeds it into a text prompt, which is then sent to the Azure OpenAI completions API by the extension. The response to the prompt is returned in the HTTP response.  

:::code language="typescript" source="~/functions-openai-extension/samples/textcompletion/nodejs/src/functions/whois.ts" :::
 
::: zone-end  
::: zone pivot="programming-language-powershell"  
This example demonstrates the _templating_ pattern, where the HTTP trigger function takes a `name` parameter and embeds it into a text prompt, which is then sent to the Azure OpenAI completions API by the extension. The response to the prompt is returned in the HTTP response. 

Here's the _function.json_ file for `TextCompletionResponse`:

:::code language="json" source="~/functions-openai-extension/samples/textcompletion/powershell/WhoIs/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

The code simply returns the text from the completion API as the response:

:::code language="powershell" source="~/functions-openai-extension/samples/textcompletion/powershell/WhoIs/run.ps1" :::

::: zone-end   
::: zone pivot="programming-language-python"  
This example demonstrates the _templating_ pattern, where the HTTP trigger function takes a `name` parameter and embeds it into a text prompt, which is then sent to the Azure OpenAI completions API by the extension. The response to the prompt is returned in the HTTP response.  

:::code language="java" source="~/functions-openai-extension/samples/textcompletion/python/function_app.py" range="7-11" :::

This example takes a prompt as input, sends it directly to the completions API, and returns the response as the output.

:::code language="csharp" source="~/functions-openai-extension/samples/textcompletion/python/function_app.py" range="14-18" ::: 

::: zone-end  
<!--- End code examples section -->  
<!--- Begin the actual references (Attributes/Annotations/Properties/Decorators) section 
In an ideal world, these sections would be generated directly from the definitions in the source code.-->  
::: zone pivot="programming-language-csharp"  
## Attributes

The specific attribute you apply to define a text completion input binding depends on your C# process mode. 

### [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), apply `TextCompletionInput` to define a text completion input binding.

### [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), apply `TextCompletion` to define a text completion input binding.

---

The attribute supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Prompt** | Gets or sets the prompt to generate completions for, encoded as a string. |
| **Model** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **Temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **TopP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **MaxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `TextCompletion` annotation enables you to define a text completion input binding, which supports these parameters:  

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **prompt** | Gets or sets the prompt to generate completions for, encoded as a string. |
| **model** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **topP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **maxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the input binding as a `generic_input_binding` binding of type  `textCompletion`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **prompt** | Gets or sets the prompt to generate completions for, encoded as a string. |
| **model** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **top_p** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **max_tokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |

::: zone-end  
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `textCompletion`. |
| **direction** | Must be `in`. |
| **name** | The name of the input binding. |
| **prompt** | Gets or sets the prompt to generate completions for, encoded as a string. |
| **model** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **topP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **maxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **prompt** | Gets or sets the prompt to generate completions for, encoded as a string. |
| **model** | Gets or sets the ID of the model to use as a string, with a default value of `gpt-3.5-turbo`. |
| **temperature** | _Optional_. Gets or sets the sampling temperature to use, as a string between `0` and `2`. Higher values (`0.8`) make the output more random, while lower values like (`0.2`) make output more focused and deterministic. You should use either  `Temperature` or `TopP`, but not both. |
| **topP** | _Optional_. Gets or sets an alternative to sampling with temperature, called nucleus sampling, as a string. In this sampling method, the model considers the results of the tokens with `top_p` probability mass. So `0.1` means only the tokens comprising the top 10% probability mass are considered. You should use either  `Temperature` or `TopP`, but not both. |
| **maxTokens** | _Optional_. Gets or sets the maximum number of tokens to generate in the completion, as a string with a default of `100`. The token count of your prompt plus `max_tokens` can't exceed the model's context length. Most models have a context length of 2,048 tokens (except for the newest models, which support 4096). |

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Text completion samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/textcompletion)
+ [Azure OpenAI extensions for Azure Functions](functions-bindings-openai.md)

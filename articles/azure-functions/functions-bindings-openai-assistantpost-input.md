---
title: Azure OpenAI assistant post input binding for Azure Functions
description: Learn how to use the Azure OpenAI assistant post input binding to query chat bots during function execution in Azure Functions.
ms.topic: reference
ms.custom:
  - build-2024
ms.date: 05/20/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant post input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant post input binding lets you send prompts to assistant chat bots.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](../ai-services/openai/

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)] 

## Example

::: zone pivot="programming-language-csharp"  
This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantApis.cs" range="58-78"::: 

::: zone-end  
::: zone pivot="programming-language-java"

This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="java" source="~/functions-openai-extension/samples/assistant/java/src/main/java/com/azfs/AssistantApis.java" range="83-103":::

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

This example demonstrates the creation process, where the HTTP POST function that sends user prompts to the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="typescript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantApis.ts" range="32-50":::

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

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_apis.py" range="25-34":::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `PostUserQuery` attribute to define an assistant post input binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Id** | The ID of the assistant to update. |
| **Model** | The name of the OpenAI chat model to use. For Azure OpenAI, this value is the name of the model deployment. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `PostUserQuery` annotation enables you to define an assistant post input binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | The name of the output binding. |
| **id** | The ID of the assistant to update. |
| **model** | The name of the OpenAI chat model to use. For Azure OpenAI, this value is the name of the model deployment. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the output binding as a `generic_output_binding` binding of type `postUserQuery`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **id** | The ID of the assistant to update. |
| **model** | The name of the OpenAI chat model to use. For Azure OpenAI, this value is the name of the model deployment. |

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
| **model** | The name of the OpenAI chat model to use. For Azure OpenAI, this value is the name of the model deployment. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **id** | The ID of the assistant to update. |
| **model** | The name of the OpenAI chat model to use. For Azure OpenAI, this value is the name of the model deployment. |

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Assistant samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant)
+ [Azure OpenAI extension](functions-bindings-openai.md)
+ [Azure OpenAI assistant trigger](functions-bindings-openai-assistant-trigger.md)
+ [Azure OpenAI assistant query input binding](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant create output binding](functions-bindings-openai-assistantcreate-output.md)

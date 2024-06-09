---
title: Azure OpenAI assistant create output binding for Azure Functions
description: Learn how to use the Azure OpenAI assistant create output binding to create Azure OpenAI assistants from your function code executions.
ms.topic: reference
ms.custom:
  - build-2024
ms.date: 05/20/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant create output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant create output binding allows you to create a new assistant chat bot from your function code execution.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](../ai-services/openai/concepts/assistants.md).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)]

## Example

::: zone pivot="programming-language-csharp"  
This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantApis.cs" range="20-45"::: 

::: zone-end  
::: zone pivot="programming-language-java"
This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

:::code language="java" source="~/functions-openai-extension/samples/assistant/java/src/main/java/com/azfs/AssistantApis.java" range="33-58":::


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

This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

:::code language="javascript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantApis.ts" range="7-29" :::

::: zone-end  
::: zone pivot="programming-language-powershell"  
This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

Here's the _function.json_ file for Create Assistant:

:::code language="json" source="~/functions-openai-extension/samples/assistant/powershell/CreateAssistant/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

{{This comes from the example code comment}} 
:::code language="powershell" source="~/functions-openai-extension/samples/assistant/powershell/CreateAssistant/run.ps1" :::

::: zone-end   
::: zone pivot="programming-language-python"  
This example demonstrates the creation process, where the HTTP PUT function that creates a new assistant chat bot with the specified ID. The response to the prompt is returned in the HTTP response.  

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_apis.py" range="7-22" :::

::: zone-end  
<!--- End code examples section -->    
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `CreateAssistant` attribute to define an assistant create output binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Id** | The identifier of the assistant to create. |
| **Instructions** | _Optional_. The instructions that are provided to assistant to follow. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `CreateAssistant` annotation enables you to define an assistant create output binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the output binding. |
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional_. The instructions that are provided to assistant to follow. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the output binding as a `generic_output_binding` binding of type `createAssistant`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional_. The instructions that are provided to assistant to follow. |

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
| **instructions** | _Optional_. The instructions that are provided to assistant to follow. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **id** | The identifier of the assistant to create. |
| **instructions** | _Optional_. The instructions that are provided to assistant to follow. |
::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Assistant samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant)
+ [Azure OpenAI extension](functions-bindings-openai.md)
+ [Azure OpenAI assistant trigger](functions-bindings-openai-assistant-trigger.md)
+ [Azure OpenAI assistant query input binding](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant post input binding](functions-bindings-openai-assistantpost-input.md)

---
title: Azure OpenAI assistant query input binding for Azure Functions
description: Learn how to use the Azure OpenAI assistant query input binding to access Azure OpenAI Assistants APIs during function execution in Azure Functions.
ms.topic: reference
ms.custom:
  - build-2024
ms.date: 05/20/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant query input binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant query input binding allows you to integrate Assistants API queries into your code executions. 

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](../ai-services/openai/concepts/assistants.md).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)] 

## Example

::: zone pivot="programming-language-csharp"  
This example demonstrates the creation process, where the HTTP GET function that queries the conversation history of the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantApis.cs" range="74-83"::: 

::: zone-end  
::: zone pivot="programming-language-java"

This example demonstrates the creation process, where the HTTP GET function that queries the conversation history of the assistant chat bot. The response to the prompt is returned in the HTTP response.


:::code language="java" source="~/functions-openai-extension/samples/assistant/java/src/main/java/com/azfs/AssistantApis.java" range="63-78":::


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

This example demonstrates the creation process, where the HTTP GET function that queries the conversation history of the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="typescript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantApis.ts" range="57-71":::

 ::: zone-end  
::: zone pivot="programming-language-powershell"  

This example demonstrates the creation process, where the HTTP GET function that queries the conversation history of the assistant chat bot. The response to the prompt is returned in the HTTP response.


Here's the _function.json_ file for Get Chat State:

:::code language="json" source="~/functions-openai-extension/samples/assistant/powershell/GetChatState/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

:::code language="powershell" source="~/functions-openai-extension/samples/assistant/powershell/GetChatState/run.ps1" :::

::: zone-end   
::: zone pivot="programming-language-python"  
This example demonstrates the creation process, where the HTTP GET function that queries the conversation history of the assistant chat bot. The response to the prompt is returned in the HTTP response.

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_apis.py" range="37-41":::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `AssistantQuery` attribute to define an assistant query input binding, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **Id** |  Gets the ID of the assistant to query. |
| **TimeStampUtc** |_Optional_. Gets or sets the timestamp of the earliest message in the chat history to fetch. The timestamp should be in ISO 8601 format - for example, 2023-08-01T00:00:00Z. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `assistantQuery` annotation enables you to define an assistant query input binding, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **id** |  Gets the ID of the assistant to query. |
| **timeStampUtc** |_Optional_. Gets or sets the timestamp of the earliest message in the chat history to fetch. The timestamp should be in ISO 8601 format - for example, 2023-08-01T00:00:00Z. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the input binding as a `generic_input_binding` binding of type `assistantQuery`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **arg_name** | The name of the variable that represents the binding parameter. |
| **id** |  Gets the ID of the assistant to query. |
| **time_stamp_utc** |_Optional_. Gets or sets the timestamp of the earliest message in the chat history to fetch. The timestamp should be in ISO 8601 format - for example, 2023-08-01T00:00:00Z. |

::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `assistantQuery`. |
| **direction** | Must be `in`. |
| **name** | The name of the input binding. |
| **id** |  Gets the ID of the assistant to query. |
| **timeStampUtc** |_Optional_. Gets or sets the timestamp of the earliest message in the chat history to fetch. The timestamp should be in ISO 8601 format - for example, 2023-08-01T00:00:00Z. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **id** |  Gets the ID of the assistant to query. |
| **timeStampUtc** |_Optional_. Gets or sets the timestamp of the earliest message in the chat history to fetch. The timestamp should be in ISO 8601 format - for example, 2023-08-01T00:00:00Z. |

::: zone-end  
## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Assistant samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant)
+ [Azure OpenAI extension](functions-bindings-openai.md)
+ [Azure OpenAI assistant trigger](functions-bindings-openai-assistant-trigger.md)
+ [Azure OpenAI assistant create output binding ](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant post input binding ](functions-bindings-openai-assistantpost-input.md)

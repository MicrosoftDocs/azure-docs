---
title: Azure OpenAI assistant trigger for Azure Functions
description: Learn how to use the Azure OpenAI assistant trigger to {{do soomething}} during function execution in Azure Functions.
ms.topic: reference
ms.date: 04/14/2024
ms.devlang: csharp, java, javascript, powershell, python, typescript
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant trigger for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant binding allows you to trigger custom chat bots and skills into your code executions. You can define the binding to define a skill.

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](../ai-services/openai/concepts/assistants.md).
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

This example demonstrates the initalization of an assistant defined to add a new todo task to a database. Here the trigger function takes a `taskDescription` parameter and embeds it into a skills prompt, which is then utlizes the OpenAI function calling. The response to the prompt is returned in the HTTP response. 

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantSample/AssistantSkills.cs" range="{{31-43}}"::: 

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

:::code language="javascript" source="~/functions-openai-extension/samples/{{link to the correct sample.ts}}" range="{{named is better than range}}":::

{{Add more examples if available}}

::: zone-end  
::: zone pivot="programming-language-typescript"

This example demonstrates the initalization of an assistant defined to add a new todo task to a database. Here the trigger function takes a `taskDescription` parameter and embeds it into a skills prompt, which is then utlizes the OpenAI function calling. The response to the prompt is returned in the HTTP response. 

:::code language="javascript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantSkills.ts" range="{{9-24}}":::

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

This example demonstrates the initalization of an assistant defined to add a new todo task to a database. Here the trigger function takes a `taskDescription` parameter and embeds it into a skills prompt, which is then utlizes the OpenAI function calling. The response to the prompt is returned in the HTTP response. 

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_skills.py" range="13-23":::

{{Add more examples if available}}

::: zone-end  
<!--- End code examples section -->  
<!--- Begin the actual references (Attributes/Annotations/Properties/Decorators) section 
All of the tables share essentially the same content, which comes from the .NET code definitions and comments.
In an ideal world, these sections would be generated directly from the definitions in the source code. 
-->  
::: zone pivot="programming-language-csharp"  
## Attributes

The specific attribute you apply to define an assistant trigger depends on your C# process mode. 

### [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), apply `AssistantSkillTriggerInput` to define an assistant trigger.

### [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), apply `AssistantSkillTrigger` to define an assistant trigger.

---

The attribute supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **FunctionName** | Gets or sets the name of the function to be invoked by the assistant.|
| **FunctionDescription** | Gets the description of the assistant function, which is provided to the LLM|
| **ParameterDescriptionJson** | Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
| **Model** | _Optional._ Gets or sets the OpenAI chat model to use. Default model used is "gpt-3.5-turbo". When using Azure OpenAI the name of the model should be <em>deployment</em>|



::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `AssistantSkillTrigger` annotation enables you to define an assistant trigger, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **FunctionName** | Gets or sets the name of the function to be invoked by the assistant.|
| **FunctionDescription** | Gets the description of the assistant function, which is provided to the LLM|
| **ParameterDescriptionJson** | Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
| **Model** | _Optional._ Gets or sets the OpenAI chat model to use. Default model used is "gpt-3.5-turbo". When using Azure OpenAI the name of the model should be <em>deployment</em>|

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Are we going to have a specific decorator defined for this binding? Right now, examples are using a generic binding decorator.-->
The `AssistantSkillTrigger` decorator supports these parameters:

|Parameter | Description |
|---------|-------------|
| **function_name** | Gets or sets the name of the function to be invoked by the assistant.|
| **function_description** | Gets the description of the assistant function, which is provided to the LLM|
| **parameter_description_json** | Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
| **model** | _Optional._ Gets or sets the OpenAI chat model to use. Default model used is "gpt-3.5-turbo". When using Azure OpenAI the name of the model should be <em>deployment</em>|


::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `AssistantSkillTrigger`. |
| **direction** | Must be `out`. |
| **name** | The name of the trigger. |
| **functionName** | Gets or sets the name of the function to be invoked by the assistant.|
| **functionDescription** | Gets the description of the assistant function, which is provided to the LLM|
| **parameterDescriptionJson** | Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `AssistantSkillTrigger`. |
| **direction** | Must be `out`. |
| **name** | The name of the trigger. |
| **functionName** | Gets or sets the name of the function to be invoked by the assistant.|
| **functionDescription** | Gets the description of the assistant function, which is provided to the LLM|
| **parameterDescriptionJson** | Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

<!---Usage information goes here. This should be brief, language-specific, and related to:
    1. Supported types.
    2. Binding-speficic connection details (if not already covered in the overview article).
-->

## Related content

{{To be added}}

<!--- Add links to:
1. How-to articles.
2. Related references.
3. External references (Azure OpenAI overview, etc.).
-->

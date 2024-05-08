---
title: Azure OpenAI assistant trigger for Azure Functions
description: Learn how to use the Azure OpenAI assistant trigger to execute code based on custom chat bots and skills in Azure Functions.
ms.topic: reference
ms.date: 04/14/2024
ms.devlang: csharp, java, javascript, powershell, python, typescript
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant trigger for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant trigger lets you run your code based on custom chat bot or skill request made to an assistant. 

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

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantSkills.cs" range="31-43" ::: 

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

:::code language="javascript" source="~/functions-openai-extension/samples/{{link to the correct sample.ts}}" range="{{named is better than range}}":::

{{Add more examples if available}}
-->
::: zone-end  
::: zone pivot="programming-language-typescript"

This example demonstrates the initalization of an assistant defined to add a new todo task to a database. Here the trigger function takes a `taskDescription` parameter and embeds it into a skills prompt, which is then utlizes the OpenAI function calling. The response to the prompt is returned in the HTTP response. 

:::code language="javascript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantSkills.ts" range="9-24" :::

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

This example demonstrates the initalization of an assistant defined to add a new todo task to a database. Here the trigger function takes a supplied string value and embeds it into a skills prompt, which is then used in Azure OpenAI function calling. The response to the prompt is returned in the HTTP response. 

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_skills.py" range="13-23" :::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `AssistantSkillTrigger` attribute to define an assistant trigger, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **FunctionDescription** | Gets the description of the assistant function, which is provided to the model. |
| **FunctionName** | _Optional_. Gets or sets the name of the function to be invoked by the assistant.|
| **ParameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
| **Model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a defaut value of `gpt-3.5-turbo`. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `AssistantSkillTrigger` annotation enables you to define an assistant trigger, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **functionDescription** | Gets the description of the assistant function, which is provided to the model. |
| **functionName** | _Optional_. Gets or sets the name of the function to be invoked by the assistant.|
| **parameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a defaut value of `gpt-3.5-turbo`. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Are we going to have a specific decorator defined for this binding? Right now, examples are using a generic binding decorator.-->
The `AssistantSkillTrigger` decorator supports these parameters:

|Parameter | Description |
|---------|-------------|
| **function_description** | Gets the description of the assistant function, which is provided to the model. |
| **function_name** | _Optional_. Gets or sets the name of the function to be invoked by the assistant.|
| **parameter_description_json** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the LLM. If no description is provided, the description will be autogenerated.For more information on the syntax of the parameter description JSON, see the OpenAI API documentation: https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools. |
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a defaut value of `gpt-3.5-turbo`. |

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
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a defaut value of `gpt-3.5-turbo`. |

 
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
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a defaut value of `gpt-3.5-turbo`. |

::: zone-end  

## Usage

See the [Example section](#example) for complete examples.

## Related content

+ [Assistant samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant)
+ [Azure OpenAI extension](functions-bindings-openai.md)
+ [Azure OpenAI assistant query input binding ](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant create output binding ](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant post output binding ](functions-bindings-openai-assistantpost-output.md)



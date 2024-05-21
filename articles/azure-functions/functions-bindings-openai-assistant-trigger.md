---
title: Azure OpenAI assistant trigger for Azure Functions
description: Learn how to use the Azure OpenAI assistant trigger to execute code based on custom chat bots and skills in Azure Functions.
ms.topic: reference
ms.custom:
  - build-2024
ms.date: 05/24/2024
zone_pivot_groups: programming-languages-set-functions
---

# Azure OpenAI assistant trigger for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-openai-support-limitations.md)]

The Azure OpenAI assistant trigger lets you run your code based on custom chat bot or skill request made to an assistant. 

For information on setup and configuration details of the Azure OpenAI extension, see [Azure OpenAI extensions for Azure Functions](./functions-bindings-openai.md). To learn more about Azure OpenAI assistants, see [Azure OpenAI Assistants API](../ai-services/openai/concepts/assistants.md).

[!INCLUDE [functions-support-notes-samples-openai](../../includes/functions-support-notes-samples-openai.md)]

## Example

::: zone pivot="programming-language-csharp"  
This example demonstrates how to create an assistant that adds a new todo task to a database. The trigger has a static description of `Create a new todo task` used by the model. The function itself takes a string, which represents a new task to add. When executed, the function adds the task as a new todo item in a custom item store and returns a response from the store.

:::code language="csharp" source="~/functions-openai-extension/samples/assistant/csharp-ooproc/AssistantSkills.cs" range="31-43" ::: 

::: zone-end  
::: zone pivot="programming-language-java"

This example demonstrates how to create an assistant that adds a new todo task to a database. The trigger has a static description of `Create a new todo task` used by the model. The function itself takes a string, which represents a new task to add. When executed, the function adds the task as a new todo item in a custom item store and returns a response from the store. 


:::code language="java" source="~/functions-openai-extension/samples/assistant/java/src/main/java/com/azfs/AssistantSkills.java" range="27-43":::

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

This example demonstrates how to create an assistant that adds a new todo task to a database. The trigger has a static description of `Create a new todo task` used by the model. The function itself takes a string, which represents a new task to add. When executed, the function adds the task as a new todo item in a custom item store and returns a response from the store. 

:::code language="typescript" source="~/functions-openai-extension/samples/assistant/nodejs/src/functions/assistantSkills.ts" range="9-24" :::

::: zone-end  
::: zone pivot="programming-language-powershell"  

This example demonstrates how to create an assistant that adds a new todo task to a database. The trigger has a static description of `Create a new todo task` used by the model. The function itself takes a string, which represents a new task to add. When executed, the function adds the task as a new todo item in a custom item store and returns a response from the store. 

Here's the _function.json_ file for Add Todo:

:::code language="json" source="~/functions-openai-extension/samples/assistant/powershell/AddTodo/function.json" :::

For more information about *function.json* file properties, see the [Configuration](#configuration) section.


:::code language="powershell" source="~/functions-openai-extension/samples/assistant/powershell/AddTodo/run.ps1" :::


::: zone-end   
::: zone pivot="programming-language-python"  

This example demonstrates how to create an assistant that adds a new todo task to a database. The trigger has a static description of `Create a new todo task` used by the model. The function itself takes a string, which represents a new task to add. When executed, the function adds the task as a new todo item in a custom item store and returns a response from the store.  

:::code language="python" source="~/functions-openai-extension/samples/assistant/python/assistant_skills.py" range="13-23" :::

::: zone-end  
<!--- End code examples section -->  
::: zone pivot="programming-language-csharp"  
## Attributes

Apply the `AssistantSkillTrigger` attribute to define an assistant trigger, which supports these parameters:

| Parameter | Description |
| --------- | ----------- |
| **FunctionDescription** | Gets the description of the assistant function, which is provided to the model. |
| **FunctionName** | _Optional_. Gets or sets the name of the function called by the assistant.|
| **ParameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the model. For more information, see [Usage](#usage).|
| **Model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a default value of `gpt-3.5-turbo`. |

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The `AssistantSkillTrigger` annotation enables you to define an assistant trigger, which supports these parameters: 

| Element | Description |
| ------- | ----------- |
| **name** | Gets or sets the name of the input binding. |
| **functionDescription** | Gets the description of the assistant function, which is provided to the model. |
| **functionName** | _Optional_. Gets or sets the name of the function called by the assistant.|
| **parameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the model. For more information, see [Usage](#usage).|
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a default value of `gpt-3.5-turbo`. |

::: zone-end  
::: zone pivot="programming-language-python"  
## Decorators
<!--- Replace with typed decorator when available.-->
During the preview, define the input binding as a `generic_trigger` binding of type `assistantSkillTrigger`, which supports these parameters:

|Parameter | Description |
|---------|-------------|
| **function_description** | Gets the description of the assistant function, which is provided to the model. |
| **function_name** | _Optional_. Gets or sets the name of a function called by the assistant.|
| **parameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the model. For more information, see [Usage](#usage).|
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a default value of `gpt-3.5-turbo`. |

::: zone-end
::: zone pivot="programming-language-powershell"  
## Configuration  

The binding supports these configuration properties that you set in the function.json file.

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `AssistantSkillTrigger`. |
| **direction** | Must be `in`. |
| **name** | The name of the trigger. |
| **functionName** | Gets or sets the name of the function called by the assistant.|
| **functionDescription** | Gets the description of the assistant function, which is provided to the LLM|
| **parameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the model. For more information, see [Usage](#usage).|
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a default value of `gpt-3.5-turbo`. |

 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The binding supports these properties, which are defined in your code: 

|Property | Description |
|-----------------------|-------------|
| **type** | Must be `AssistantSkillTrigger`. |
| **name** | The name of the trigger. |
| **functionName** | Gets or sets the name of the function called by the assistant.|
| **functionDescription** | Gets the description of the assistant function, which is provided to the LLM|
| **parameterDescriptionJson** | _Optional_. Gets or sets a JSON description of the function parameter, which is provided to the model. For more information, see [Usage](#usage).|
| **model** | _Optional_. Gets or sets the OpenAI chat model deployment to use, with a default value of `gpt-3.5-turbo`. |

::: zone-end  
See the [Example section](#example) for complete examples.

## Usage

When `parameterDescriptionJson` JSON value isn't provided, it's autogenerated. For more information on the syntax of this object, see the [OpenAI API documentation](https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools). 

## Related content

+ [Assistant samples](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant)
+ [Azure OpenAI extension](functions-bindings-openai.md)
+ [Azure OpenAI assistant query input binding](functions-bindings-openai-assistantquery-input.md)
+ [Azure OpenAI assistant create output binding](functions-bindings-openai-assistantcreate-output.md)
+ [Azure OpenAI assistant post input binding](functions-bindings-openai-assistantpost-input.md)

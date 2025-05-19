---
title: MCP tool trigger for Azure Functions
description: Learn how you can use a trigger endpoint to expose functions as a model content protocol (MCP) server tools in Azure Functions.
ms.topic: reference
ms.date: 05/06/2025
ms.custom: 
  - build-2025
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# MCP tool trigger for Azure Functions

Use the MCP tool trigger to define tool endpoints in a [Model Content Protocol (MCP)](https://github.com/modelcontextprotocol) server that are accessed by client language models and agents to do specific tasks, such as storing or accessing code snippets. MCP clients can also subscribe to your function app to receive notifications about changes to the exposed tools. 

[!INCLUDE [functions-mcp-extension-preview-note](../../includes/functions-mcp-extension-preview-note.md)]

For information on setup and configuration details, see the [overview](functions-bindings-mcp.md).

## Example

::: zone pivot="programming-language-csharp"  
>[!NOTE]  
>The Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

This code creates an endpoint to expose a tool named `GetSnippet` that tries to retrieve a code snippet by name from blob storage.
 
:::code language="csharp" source="~/remote-mcp-functions-dotnet/src/SnippetsTool.cs" range="10-20" :::

This code creates an endpoint to expose a tool named `SaveSnippet` that tries to persist a named code snippet to blob storage.

:::code language="csharp" source="~/remote-mcp-functions-dotnet/src/SnippetsTool.cs" range="10, 22-34" :::

For the complete code example, see [SnippetTool.cs](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/blob/main/src/SnippetsTool.cs).  
::: zone-end
::: zone pivot="programming-language-java"  
This code creates an endpoint to expose a tool named `GetSnippets` that tries to retrieve a code snippet by name from blob storage.
 
:::code language="java" source="~/remote-mcp-functions-java/src/main/java/com/function/Snippets.java" range="128-155" :::

This code creates an endpoint to expose a tool named `SaveSnippets` that tries to persist a named code snippet to blob storage.

:::code language="java" source="~/remote-mcp-functions-java/src/main/java/com/function/Snippets.java" range="85-114" :::

For the complete code example, see [Snippets.java](https://github.com/Azure-Samples/remote-mcp-functions-java/blob/main/src/main/java/com/function/Snippets.java).  
::: zone-end  
::: zone pivot="programming-language-javascript"  
Example code for JavaScript isn't currently available. See the TypeScript examples for general guidance using Node.js.
::: zone-end  
::: zone pivot="programming-language-typescript"  
This code creates an endpoint to expose a tool named `getsnippet` that tries to retrieve a code snippet by name from blob storage.
 
:::code language="typescript" source="~/remote-mcp-functions-typescript/src/functions/snippetsMcpTool.ts" range="79-91" :::

This is the code that handles the `getsnippet` trigger:

:::code language="typescript" source="~/remote-mcp-functions-typescript/src/functions/snippetsMcpTool.ts" range="26-48" :::

This code creates an endpoint to expose a tool named `savesnippet` that tries to persist a named code snippet to blob storage.

:::code language="typescript" source="~/remote-mcp-functions-typescript/src/functions/snippetsMcpTool.ts" range="94-111" :::

This is the code that handles the `savesnippet` trigger:

:::code language="typescript" source="~/remote-mcp-functions-typescript/src/functions/snippetsMcpTool.ts" range="51-76" :::

For the complete code example, see [snippetsMcpTool.ts](https://github.com/Azure-Samples/remote-mcp-functions-typescript/blob/main/src/functions/snippetsMcpTool.ts).  
::: zone-end  
::: zone pivot="programming-language-python"  
This code uses the `generic_trigger` decorator to create an endpoint to expose a tool named `get_snippet` that tries to retrieve a code snippet by name from blob storage.
 
:::code language="python" source="~/remote-mcp-functions-python/src/function_app.py" range="61-82" :::

This code uses the `generic_trigger` decorator to create an endpoint to expose a tool named `save_snippet` that tries to persist a named code snippet to blob storage.

:::code language="python" source="~/remote-mcp-functions-python/src/function_app.py" range="85-106" :::

For the complete code example, see [function_app.py](https://github.com/Azure-Samples/remote-mcp-functions-python/blob/main/src/function_app.py).  
::: zone-end  
[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]  
::: zone pivot="programming-language-csharp"  
## Attributes

C# libraries use `McpToolTriggerAttribute` to define the function trigger. 

The attribute's constructor takes the following parameters:

|Parameter | Description|
|---------|----------------------|
|**ToolName**| (Required) name of the tool that's being exposed by the MCP trigger endpoint. |
|**Description**| (Optional) friendly description of the tool endpoint for clients. |

See [Usage](#usage) to learn how to define properties of the endpoint as input parameters.

::: zone-end  
::: zone pivot="programming-language-java"  

## Annotations

The `McpTrigger` annotation creates a function that exposes a tool endpoint in your remote MCP server. 

The annotation supports the following configuration options:

|Parameter | Description|
|---------|----------------------|
| **toolName**| (Required) name of the tool that's being exposed by the MCP trigger endpoint. |
| **description**| (Optional) friendly description of the tool endpoint for clients. |
| **toolProperties** | The JSON string representation of one or more property objects that expose properties of the tool to clients.  |

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

>[!NOTE]  
>At this time, you must use a generic decorator to define an MCP trigger. 

The following MCP trigger properties are supported on `generic_trigger`:

| Property    | Description |
|-------------|-----------------------------|
| **type** | (Required) Must be set to `mcpToolTrigger` in the `generic_trigger` decorator. |
| **arg_name** | The variable name (usually `context`) used in function code to access the execution context. |
| **toolName**  | (Required) The name of the MCP server tool exposed by the function endpoint. |
| **description**  | A description of the MCP server tool exposed by the function endpoint.  |
| **toolProperties** | The JSON string representation of one or more property objects that expose properties of the tool to clients.  |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

The trigger supports these binding options, which are defined in your code: 

| Options | Description |
|-----------------------|-------------|
| **type** | Must be set to `mcpToolTrigger`. Only used with generic definitions. |
| **toolName** | (Required) The name of the MCP server tool exposed by the function endpoint. |
| **description**  | A description of the MCP server tool exposed by the function endpoint.  |
| **toolProperties** | An array of `toolProperty` objects that expose properties of the tool to clients.  |
| **extraOutputs** | When defined, sends function output to another binding.  |
| **handler** | The method that contains the actual function code. | 

::: zone-end   

See the [Example section](#example) for complete examples.

## Usage

::: zone pivot="programming-language-csharp"  

The MCP protocol enables an MCP server to make known to clients other properties of a tool endpoint. In C#, you can define properties of your tools as either input parameters using the `McpToolProperty` attribute to your trigger function code or by using the `FunctionsApplicationBuilder` when the app starts. 

### [`McpToolPropertyAttribute`](#tab/attribute)

You can define one or more tool properties by applying the `McpToolProperty` attribute to input binding-style parameters in your function.  

The `McpToolPropertyAttribute` type supports these properties:

| Property | Description |
| ---- | ----- |
| **PropertyName** | Name of the tool property that gets exposed to clients.  |
| **PropertyType** | The data type of the tool property, such as `string`.  |
| **Description** | (Optional) Description of what the tool property does.  |

You can see these attributes used in the `SaveSnippet` tool in the [Examples](#example).

### [`FunctionsApplicationBuilder`](#tab/builder)

You can define tool properties in your entry point (program.cs) file by using the `McpToolBuilder` returned by the `ConfigureMcpTool` method on `FunctionsApplicationBuilder`. This example calls the `WithProperty` method on the builder for the `GetSnippet` tool to set the properties of the tool:

:::code language="csharp" source="~/remote-mcp-functions-dotnet/src/Program.cs" range="5-15" ::: 

For the complete example, see the [program.cs file](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/blob/main/src/Program.cs).

---

::: zone-end  
::: zone pivot="programming-language-java,programming-language-python"  
Properties of a tool exposed by your remote MCP server are defined using tool properties. These properties are returned by the `toolProperties` field, which is a string representation of an array of `ToolProperty` objects. 

A `ToolProperty` object has this structure:

```json
{
    "propertyName": "Name of the property",
    "propertyType": "Type of the property",
    "description": "Optional property description",
}
``` 
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
Properties of a tool exposed by your remote MCP server are defined using tool properties. These properties are returned by the `toolProperties` field, which is a string representation of an array of `ToolProperty` objects. 

A `ToolProperty` object has this structure:

```json
{
    "propertyName": "Name of the property",
    "propertyValue": "Type of the property",
    "description": "Optional property description",
}
``` 
::: zone-end  

For more information, see [Examples](#example).

## host.json settings

The host.json file contains settings that control MCP trigger behaviors. See the [host.json settings](functions-bindings-mcp.md#hostjson-settings) section for details regarding available settings.

## Related articles

[Azure OpenAI extension for Azure Functions](functions-bindings-openai.md)

---
title: MCP tool trigger for Azure Functions
description: Learn how you can use a trigger endpoint to expose functions as a model content protocol (MCP) server tools in Azure Functions.
ms.topic: reference
ms.date: 08/29/2025
ms.update-cycle: 180-days
ms.custom: 
  - build-2025
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# MCP tool trigger for Azure Functions

Use the MCP tool trigger to define tool endpoints in a [Model Content Protocol (MCP)](https://github.com/modelcontextprotocol) server. Client language models and agents can use tools to perform specific tasks, such as storing or accessing code snippets.

For information on setup and configuration details, see the [overview](functions-bindings-mcp.md).

## Example

::: zone pivot="programming-language-csharp"  
>[!NOTE]  
> For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

This code creates an endpoint to expose a tool named `SaveSnippet` that tries to persist a named code snippet to blob storage.

```csharp
private const string BlobPath = "snippets/{mcptoolargs.snippetname}.json";

[Function(nameof(SaveSnippet))]
[BlobOutput(BlobPath)]
public string SaveSnippet(
    [McpToolTrigger("save_snippet", "Saves a code snippet into your snippet collection.")]
        ToolInvocationContext context,
    [McpToolProperty("snippetname", "The name of the snippet.", isRequired: true)]
        string name,
    [McpToolProperty("snippet", "The code snippet.", isRequired: true)]
        string snippet
)
{
    return snippet;
}
```

This code creates an endpoint to expose a tool named `GetSnippet` that tries to retrieve a code snippet by name from blob storage.
 
```csharp
private const string BlobPath = "snippets/{mcptoolargs.snippetname}.json";

[Function(nameof(GetSnippet))]
public object GetSnippet(
    [McpToolTrigger("get_snippets", "Gets code snippets from your snippet collection.")]
        ToolInvocationContext context,
    [BlobInput(BlobPath)] string snippetContent
)
{
    return snippetContent;
}
```

The tool properties for the `GetSnippet` function are configured in `Program.cs`:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder
    .ConfigureMcpTool("get_snippets")
    .WithProperty("snippetname", "string", "The name of the snippet.", required: true);

builder.Build().Run();
```

> [!TIP]
> The example above used literal strings for things like the name of the "get_snippets" tool in both `Program.cs` and the function. Consider instead using shared constant strings to keep things in sync across your project.

For the complete code example, see [SnippetTool.cs](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/blob/main/src/SnippetsTool.cs).  
::: zone-end
::: zone pivot="programming-language-java"

This code creates an endpoint to expose a tool named `SaveSnippets` that tries to persist a named code snippet to blob storage.

```java
@FunctionName("SaveSnippets")
@StorageAccount("AzureWebJobsStorage")
public String saveSnippet(
        @McpToolTrigger(
                name = "saveSnippets",
                description = "Saves a text snippet to your snippets collection."
        )
        String mcpToolInvocationContext,
        @McpToolProperty(
                name = "snippetName",
                propertyType = "string",
                description = "The name of the snippet.",
                required = true
        )
        String snippetName,
        @McpToolProperty(
                name = "snippet",
                propertyType = "string",
                description = "The content of the snippet.",
                required = true
        )
        String snippet,
        @BlobOutput(name = "outputBlob", path = "snippets/{mcptoolargs.snippetName}.json")
        OutputBinding<String> outputBlob,
        final ExecutionContext context
) {
    // Log the entire incoming JSON for debugging
    context.getLogger().info(mcpToolInvocationContext);

    // Log the snippet name and content
    context.getLogger().info("Saving snippet with name: " + snippetName);
    context.getLogger().info("Snippet content:\n" + snippet);

    // Write the snippet content to the output blob
    outputBlob.setValue(snippet);
    
    return "Successfully saved snippet '" + snippetName + "' with " + snippet.length() + " characters.";
}
```

This code creates an endpoint to expose a tool named `GetSnippets` that tries to retrieve a code snippet by name from blob storage.
 
```java
@FunctionName("GetSnippets")
@StorageAccount("AzureWebJobsStorage")
public String getSnippet(
        @McpToolTrigger(
                name = "getSnippets",
                description = "Gets a text snippet from your snippets collection."
        )
        String mcpToolInvocationContext,
        @McpToolProperty(
                name = "snippetName",
                propertyType = "string",
                description = "The name of the snippet.",
                required = true
        )
        String snippetName,
        @BlobInput(name = "inputBlob", path = "snippets/{mcptoolargs.snippetName}.json")
        String inputBlob,
        final ExecutionContext context
) {
    // Log the entire incoming JSON for debugging
    context.getLogger().info(mcpToolInvocationContext);

    // Log the snippet name and the fetched snippet content from the blob
    context.getLogger().info("Retrieving snippet with name: " + snippetName);
    context.getLogger().info("Snippet content:");
    context.getLogger().info(inputBlob);
    
    // Return the snippet content or a not found message
    if (inputBlob != null && !inputBlob.trim().isEmpty()) {
        return inputBlob;
    } else {
        return "Snippet '" + snippetName + "' not found.";
    }
}
```

For the complete code example, see [Snippets.java](https://github.com/Azure-Samples/remote-mcp-functions-java/blob/main/src/main/java/com/function/Snippets.java).  
::: zone-end  
::: zone pivot="programming-language-javascript"  
Example code for JavaScript isn't currently available. See the TypeScript examples for general guidance using Node.js.
::: zone-end  
::: zone pivot="programming-language-typescript"

This code creates an endpoint to expose a tool named `savesnippet` that tries to persist a named code snippet to blob storage.

```typescript
import { app, InvocationContext, input, output, arg } from "@azure/functions";

app.mcpTool("saveSnippet", {
  toolName: SAVE_SNIPPET_TOOL_NAME,
  description: SAVE_SNIPPET_TOOL_DESCRIPTION,
  toolProperties: {
    [SNIPPET_NAME_PROPERTY_NAME]: arg.string().describe(SNIPPET_NAME_PROPERTY_DESCRIPTION),
    [SNIPPET_PROPERTY_NAME]: arg.string().describe(SNIPPET_PROPERTY_DESCRIPTION)
  },
  extraOutputs: [blobOutputBinding],
  handler: saveSnippet,
});
```

This code handles the `savesnippet` trigger:

```typescript
export async function saveSnippet(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Saving snippet");

  // Get snippet name and content from the tool arguments
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    snippetname?: string;
    snippet?: string;
  };

  const snippetName = mcptoolargs?.snippetname;
  const snippet = mcptoolargs?.snippet;

  if (!snippetName) {
    return "No snippet name provided";
  }

  if (!snippet) {
    return "No snippet content provided";
  }

  // Save the snippet to blob storage using the output binding
  context.extraOutputs.set(blobOutputBinding, snippet);

  console.info(`Saved snippet: ${snippetName}`);
  return snippet;
}
```

This code creates an endpoint to expose a tool named `getsnippet` that tries to retrieve a code snippet by name from blob storage.
 
```typescript
import { app, InvocationContext, input, output, arg } from "@azure/functions";

app.mcpTool("getSnippet", {
  toolName: GET_SNIPPET_TOOL_NAME,
  description: GET_SNIPPET_TOOL_DESCRIPTION,
  toolProperties: {
    [SNIPPET_NAME_PROPERTY_NAME]: arg.string().describe(SNIPPET_NAME_PROPERTY_DESCRIPTION)
  },
  extraInputs: [blobInputBinding],
  handler: getSnippet,
});
```

This code handles the `getsnippet` trigger:

```typescript
export async function getSnippet(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  console.info("Getting snippet");

  // Get snippet name from the tool arguments
  const mcptoolargs = context.triggerMetadata.mcptoolargs as {
    snippetname?: string;
  };
  const snippetName = mcptoolargs?.snippetname;

  console.info(`Snippet name: ${snippetName}`);

  if (!snippetName) {
    return "No snippet name provided";
  }

  // Get the content from blob binding - properly retrieving from extraInputs
  const snippetContent = context.extraInputs.get(blobInputBinding);

  if (!snippetContent) {
    return `Snippet '${snippetName}' not found`;
  }

  console.info(`Retrieved snippet: ${snippetName}`);
  return snippetContent as string;
}
```

For the complete code example, see [snippetsMcpTool.ts](https://github.com/Azure-Samples/remote-mcp-functions-typescript/blob/main/src/functions/snippetsMcpTool.ts).  
::: zone-end  
::: zone pivot="programming-language-python"

This code uses the `mcp_tool_trigger` decorator to create an endpoint to expose a tool named `save_snippet` that tries to persist a named code snippet to blob storage.

```python
@app.mcp_tool_trigger(
    arg_name="context",
    tool_name="save_snippet",
    description="Save a snippet with a name.",
    tool_properties=tool_properties_save_snippets_json,
)
@app.blob_output(arg_name="file", connection="AzureWebJobsStorage", path=_BLOB_PATH)
def save_snippet(file: func.Out[str], context) -> str:
    content = json.loads(context)
    snippet_name_from_args = content["arguments"][_SNIPPET_NAME_PROPERTY_NAME]
    snippet_content_from_args = content["arguments"][_SNIPPET_PROPERTY_NAME]

    if not snippet_name_from_args:
        return "No snippet name provided"

    if not snippet_content_from_args:
        return "No snippet content provided"

    file.set(snippet_content_from_args)
    logging.info(f"Saved snippet: {snippet_content_from_args}")
    return f"Snippet '{snippet_content_from_args}' saved successfully"
```

This code uses the `mcp_tool_trigger` decorator to create an endpoint to expose a tool named `get_snippet` that tries to retrieve a code snippet by name from blob storage.
 
```python
@app.mcp_tool_trigger(
    arg_name="context",
    tool_name="get_snippet",
    description="Retrieve a snippet by name.",
    tool_properties=tool_properties_get_snippets_json,
)
@app.blob_input(arg_name="file", connection="AzureWebJobsStorage", path=_BLOB_PATH)
def get_snippet(file: func.InputStream, context) -> str:
    """
    Retrieves a snippet by name from Azure Blob Storage.

    Args:
        file (func.InputStream): The input binding to read the snippet from Azure Blob Storage.
        context: The trigger context containing the input arguments.

    Returns:
        str: The content of the snippet or an error message.
    """
    snippet_content = file.read().decode("utf-8")
    logging.info(f"Retrieved snippet: {snippet_content}")
    return snippet_content
```

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

The `@McpToolTrigger` annotation creates a function that exposes a tool endpoint in your remote MCP server. 

The annotation supports the following configuration options:

|Parameter | Description|
|---------|----------------------|
| **name**| (Required) name of the tool that's being exposed by the MCP trigger endpoint. |
| **description**| (Optional) friendly description of the tool endpoint for clients. |

The `@McpToolProperty` annotation defines individual properties for your tools. Each property parameter in your function should be annotated with this annotation.

The `@McpToolProperty` annotation supports the following configuration options:

|Parameter | Description|
|---------|----------------------|
| **name**| (Required) name of the tool property that gets exposed to clients. |
| **propertyType**| (Required) type of the tool property. Valid types are: `string`, `number`, `integer`, `boolean`, `object`. |
| **description**| (Optional) description of what the tool property does. |
| **required** | (Optional) if set to `true`, the tool property is required as an argument for tool calls. Defaults to `false`. |

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

The `mcp_tool_trigger` decorator requires version 1.24.0 or later of the [`azure-functions` package](https://pypi.org/project/azure-functions/). The following MCP trigger properties are supported on `mcp_tool_trigger`:

| Property    | Description |
|-------------|-----------------------------|
| **arg_name** | The variable name (usually `context`) used in function code to access the execution context. |
| **tool_name**  | (Required) The name of the MCP server tool exposed by the function endpoint. |
| **description**  | A description of the MCP server tool exposed by the function endpoint.  |
| **tool_properties** | The JSON string representation of one or more property objects that expose properties of the tool to clients.  |

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

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

See the [Example section](#example) for complete examples.

::: zone-end

## Usage

::: zone pivot="programming-language-csharp"  

The MCP tool trigger can bind to the following types:

| Type | Description |
| --- | --- |
| [ToolInvocationContext] | An object representing the tool call, including the tool name and arguments for the call. |
| JSON serializable types | Functions attempts to deserialize the tool arguments into a plain-old CLR object (POCO) type. This type is also used to [define tool properties](#tool-properties).<br/><br/>When binding to a JSON serializable type, you can optionally also include a parameter of type [ToolInvocationContext] to access the tool call information. |

[ToolInvocationContext]: https://github.com/Azure/azure-functions-mcp-extension/blob/main/src/Microsoft.Azure.Functions.Worker.Extensions.Mcp/Abstractions/ToolInvocationContext.cs

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

### Tool properties

MCP clients invoke tools with arguments to provide data and context for the tool's operation. The clients know how to collect and pass these arguments based on properties that the tool advertises as part of the protocol. You therefore need to define properties of the tool in your function code.

When you define a tool property, it's optional by default, and the client can omit it when invoking the tool. You need to explicitly mark properties as required if the tool can't operate without them.

> [!NOTE]
> Earlier versions of the MCP extension preview made all tool properties required by default. This behavior changed as of version `1.0.0-preview.7`, and now you must explicitly mark properties as required.

::: zone-end

::: zone pivot="programming-language-csharp"  

In C#, you can define properties for your tools in several ways. Which approach you use is a matter of code style preference. The options are:

- Your function takes input parameters using the `McpToolProperty` attribute.
- You define a custom type with the properties, and the function binds to that type.
- You use the `FunctionsApplicationBuilder` to define properties in your `Program.cs` file.

#### [`McpToolProperty` attribute](#tab/attribute)

You can define one or more tool properties by applying the `McpToolProperty` attribute to input binding-style parameters in your function.  

The `McpToolPropertyAttribute` type supports these properties:

| Property | Description |
| ---- | ----- |
| **PropertyName** | Name of the tool property that gets exposed to clients.  |
| **Description** | Description of what the tool property does.  |
| **IsRequired** | (Optional) If set to `true`, the tool property is required as an argument for tool calls. Defaults to `false`. |

The property type is inferred from the type of the parameter to which you apply the attribute. For example `[McpToolProperty("snippetname", "The name of the snippet.", true)] string name` defines a required tool property named `snippetname` of type `string` in MCP messages.

You can see these attributes used in the `SaveSnippet` tool in the [Examples](#example).

#### [Bind to custom type](#tab/poco)

You can define one or more tool properties by binding to a plain-old CLR object (POCO) type that you define. Properties of that type are automatically exposed as tool properties. You can use the [Description] attribute to provide a description for each property. You can indicate that a property is required using the `required` keyword. The class property type in the informs type used in MCP messages.

This example uses a custom type to define tool properties for the `SaveSnippet` tool:

```csharp
public class SaveSnippetRequest
{
    [Description("The name of the snippet.")]
    public required string SnippetName { get; set; }

    [Description("The code snippet.")]
    public required string Snippet { get; set; }            
}

private const string BlobPath = "snippets/{mcptoolargs.snippetname}.json";

[Function(nameof(SaveSnippet))]
[BlobOutput(BlobPath)]
public string SaveSnippet(
    [McpToolTrigger("save_snippet", "Saves a code snippet into your snippet collection.")] SaveSnippetRequest request,
        ToolInvocationContext context
)
{
    return request.Snippet;
}
```

#### [`FunctionsApplicationBuilder`](#tab/builder)

You can define one or more tool properties in your entry point (`Program.cs`) file by using an `McpToolBuilder` returned by the `ConfigureMcpTool()` method on `FunctionsApplicationBuilder`. This example calls the `WithProperty` method on the builder for the `GetSnippet` tool to set the properties of the tool:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder
    .ConfigureMcpTool("get_snippets")
    .WithProperty("snippetname", "string", "The name of the snippet.", required: true);

// other configuration

builder.Build().Run();
```

You can call the `WithProperty()` method multiple times to define multiple properties for the tool. Each call to `WithProperty()` includes a string representation of the MCP property type, which may not directly correspond to a CLR type. For example, use `"boolean"` to define a boolean property, even though the corresponding CLR type is `bool`. Valid types are: `"string"`, `"number"`, `"integer"`, `"boolean"`, `"object"`.

For the complete example, see the [`Program.cs` file](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/blob/main/src/Program.cs).

---

::: zone-end
::: zone pivot="programming-language-java"
In Java, you define tool properties by using the `@McpToolProperty` annotation on individual function parameters. Each parameter that represents a tool property should be annotated with this annotation, specifying the property name, type, description, and whether it's required.

You can see these annotations used in the [Examples](#example).
::: zone-end
::: zone pivot="programming-language-python,programming-language-javascript,programming-language-typescript"
You can configure tool properties in the trigger definition's `toolProperties` field, which is a string representation of an array of `ToolProperty` objects. 

A `ToolProperty` object has this structure:

```json
{
    "propertyName": "Name of the property",
    "propertyType": "Type of the property",
    "description": "Optional property description",
    "isRequired": true|false,
    "isArray": true|false
}
``` 

The fields of a `ToolProperty` object are:

| Property | Description |
| ---- | ----- |
| **propertyName** | Name of the tool property that gets exposed to clients. |
| **propertyType** | Type of the tool property. Valid types are: `string`, `number`, `integer`, `boolean`, `object`. See `isArray` for array types. |
| **description** | Description of what the tool property does. |
| **isRequired** | (Optional) If set to `true`, the tool property is required as an argument for tool calls. Defaults to `false`. |
| **isArray** | (Optional) If set to `true`, the tool property is an array of the specified property type. Defaults to `false`. |

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript"

You can provide the `toolProperties` field as an array of `ToolProperty` objects, or you can use the `arg` helpers from `@azure/functions` to define properties in a more type-safe way:

```typescript
  toolProperties: {
    [SNIPPET_NAME_PROPERTY_NAME]: arg.string().describe(SNIPPET_NAME_PROPERTY_DESCRIPTION)
  }
```

::: zone-end

For more information, see [Examples](#example).

## host.json settings

The host.json file contains settings that control MCP trigger behaviors. See the [host.json settings](functions-bindings-mcp.md#hostjson-settings) section for details regarding available settings.

## Related articles

[Azure OpenAI extension for Azure Functions](functions-bindings-openai.md)

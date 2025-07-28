---
title: MCP tool trigger for Azure Functions
description: Learn how you can use a trigger endpoint to expose functions as a model content protocol (MCP) server tools in Azure Functions.
ms.topic: reference
ms.date: 05/06/2025
ms.update-cycle: 180-days
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
> For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 

This code creates an endpoint to expose a tool named `SaveSnippet` that tries to persist a named code snippet to blob storage.

```csharp
private const string BlobPath = "snippets/{mcptoolargs.snippetname}.json";

[Function(nameof(SaveSnippet))]
[BlobOutput(BlobPath)]
public string SaveSnippet(
    [McpToolTrigger("save_snippet", "Saves a code snippet into your snippet collection.")]
        ToolInvocationContext context,
    [McpToolProperty("snippetname", "string", "The name of the snippet.")]
        string name,
    [McpToolProperty("snippet", "string", "The code snippet.")]
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

builder.EnableMcpToolMetadata();

builder
    .ConfigureMcpTool("get_snippets")
    .WithProperty("snippetname", "string", "The name of the snippet.");

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
public void saveSnippet(
        @McpToolTrigger(
                toolName = "saveSnippets",
                description = "Saves a text snippet to your snippets collection.",
                toolProperties = SAVE_SNIPPET_ARGUMENTS
        )
        String toolArguments,
        @BlobOutput(name = "outputBlob", path = BLOB_PATH)
        OutputBinding<String> outputBlob,
        final ExecutionContext context
) {
    // Log the entire incoming JSON for debugging
    context.getLogger().info(toolArguments);

    // Parse the JSON and extract the snippetName/snippet fields
    JsonObject arguments = JsonParser.parseString(toolArguments)
            .getAsJsonObject()
            .getAsJsonObject("arguments");
    String snippetName = arguments.get(SNIPPET_NAME_PROPERTY_NAME).getAsString();
    String snippet = arguments.get(SNIPPET_PROPERTY_NAME).getAsString();

    // Log the snippet name and content
    context.getLogger().info("Saving snippet with name: " + snippetName);
    context.getLogger().info("Snippet content:\n" + snippet);

    // Write the snippet content to the output blob
    outputBlob.setValue(snippet);
}
```

This code creates an endpoint to expose a tool named `GetSnippets` that tries to retrieve a code snippet by name from blob storage.
 
```java
@FunctionName("GetSnippets")
@StorageAccount("AzureWebJobsStorage")
public void getSnippet(
        @McpToolTrigger(
                toolName = "getSnippets",
                description = "Gets a text snippet from your snippets collection.",
                toolProperties = GET_SNIPPET_ARGUMENTS
        )
        String toolArguments,
        @BlobInput(name = "inputBlob", path = BLOB_PATH)
        String inputBlob,
        final ExecutionContext context
) {
    // Log the entire incoming JSON for debugging
    context.getLogger().info(toolArguments);

    // Parse the JSON and get the snippetName field
    String snippetName = JsonParser.parseString(toolArguments)
            .getAsJsonObject()
            .getAsJsonObject("arguments")
            .get(SNIPPET_NAME_PROPERTY_NAME)
            .getAsString();

    // Log the snippet name and the fetched snippet content from the blob
    context.getLogger().info("Retrieving snippet with name: " + snippetName);
    context.getLogger().info("Snippet content:");
    context.getLogger().info(inputBlob);
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
app.mcpTool("saveSnippet", {
  toolName: SAVE_SNIPPET_TOOL_NAME,
  description: SAVE_SNIPPET_TOOL_DESCRIPTION,
  toolProperties: [
    {
      propertyName: SNIPPET_NAME_PROPERTY_NAME,
      propertyType: PROPERTY_TYPE,
      description: SNIPPET_NAME_PROPERTY_DESCRIPTION,
    },
    {
      propertyName: SNIPPET_PROPERTY_NAME,
      propertyType: PROPERTY_TYPE,
      description: SNIPPET_PROPERTY_DESCRIPTION,
    },
  ],
  extraOutputs: [blobOutputBinding],
  handler: saveSnippet,
});
```

This is the code that handles the `savesnippet` trigger:

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
app.mcpTool("getSnippet", {
  toolName: GET_SNIPPET_TOOL_NAME,
  description: GET_SNIPPET_TOOL_DESCRIPTION,
  toolProperties: [
    {
      propertyName: SNIPPET_NAME_PROPERTY_NAME,
      propertyType: PROPERTY_TYPE,
      description: SNIPPET_NAME_PROPERTY_DESCRIPTION,
    },
  ],
  extraInputs: [blobInputBinding],
  handler: getSnippet,
});
```

This is the code that handles the `getsnippet` trigger:

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

This code uses the `generic_trigger` decorator to create an endpoint to expose a tool named `save_snippet` that tries to persist a named code snippet to blob storage.

```python
@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="save_snippet",
    description="Save a snippet with a name.",
    toolProperties=tool_properties_save_snippets_json,
)
@app.generic_output_binding(arg_name="file", type="blob", connection="AzureWebJobsStorage", path=_BLOB_PATH)
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

This code uses the `generic_trigger` decorator to create an endpoint to expose a tool named `get_snippet` that tries to retrieve a code snippet by name from blob storage.
 
```python
@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="get_snippet",
    description="Retrieve a snippet by name.",
    toolProperties=tool_properties_get_snippets_json,
)
@app.generic_input_binding(arg_name="file", type="blob", connection="AzureWebJobsStorage", path=_BLOB_PATH)
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

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

See the [Example section](#example) for complete examples.

::: zone-end

## Usage

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"

MCP clients invoke tools with arguments to provide data and context for the tool's operation. The clients know how to collect and pass these arguments based on properties that the tool advertises as part of the protocol. You therefore need to define properties of the tool in your function code.

::: zone-end

::: zone pivot="programming-language-csharp"  

In C#, you can define properties of your tools as either input parameters using the `McpToolProperty` attribute to your trigger function code or by using the `FunctionsApplicationBuilder` when the app starts.

In both cases, you must include a call to `builder.EnableMcpToolMetadata()` in your `Program.cs`:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.EnableMcpToolMetadata();

// other configuration

builder.Build().Run();
```

### [`McpToolProperty` attribute](#tab/attribute)

You can define one or more tool properties by applying the `McpToolProperty` attribute to input binding-style parameters in your function.  

The `McpToolPropertyAttribute` type supports these properties:

| Property | Description |
| ---- | ----- |
| **PropertyName** | Name of the tool property that gets exposed to clients.  |
| **PropertyType** | The data type of the tool property, such as `string`.  |
| **Description** | (Optional) Description of what the tool property does.  |

You can see these attributes used in the `SaveSnippet` tool in the [Examples](#example).

### [`FunctionsApplicationBuilder`](#tab/builder)

You can define one or more tool properties in your entry point (`Program.cs`) file by using an `McpToolBuilder` returned by the `ConfigureMcpTool()` method on `FunctionsApplicationBuilder`. This example calls the `WithProperty` method on the builder for the `GetSnippet` tool to set the properties of the tool:

```csharp
var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.EnableMcpToolMetadata();

builder
    .ConfigureMcpTool("get_snippets")
    .WithProperty("snippetname", "string", "The name of the snippet.");

// other configuration

builder.Build().Run();
```

You can call the `WithProperty()` method multiple times to define multiple properties for the tool.

For the complete example, see the [`Program.cs` file](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/blob/main/src/Program.cs).

---

::: zone-end
::: zone pivot="programming-language-java,programming-language-python,programming-language-javascript,programming-language-typescript"  
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

For more information, see [Examples](#example).

## host.json settings

The host.json file contains settings that control MCP trigger behaviors. See the [host.json settings](functions-bindings-mcp.md#hostjson-settings) section for details regarding available settings.

## Related articles

[Azure OpenAI extension for Azure Functions](functions-bindings-openai.md)

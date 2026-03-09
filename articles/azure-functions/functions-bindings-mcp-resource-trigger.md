---
title: MCP resource trigger for Azure Functions
description: Learn how you can use a trigger endpoint to expose functions as model context protocol (MCP) server resources in Azure Functions.
ms.topic: reference
ms.date: 02/18/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection: 
  - ce-skilling-ai-copilot
zone_pivot_groups: programming-languages-set-functions
---

# MCP resource trigger for Azure Functions

Use the MCP resource trigger to define resource endpoints in a [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server. Clients can use resources to access information for context, such as file contents, database schemas, or API documentation.

For information on setup and configuration details, see the [overview](functions-bindings-mcp.md).

## Example
::: zone pivot="programming-language-csharp"
>[!NOTE]  
> For C#, the Azure Functions MCP extension supports only the [isolated worker model](dotnet-isolated-process-guide.md). 
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript,programming-language-javascript"

This first example shows how to use resource to implement the UI element of MCP Apps. 
::: zone-end
::: zone pivot="programming-language-csharp"  

The following code creates an endpoint to expose a resource named `Weather Widget` that serves an interactive weather display as bundled HTML content. The resource uses the `ui://` scheme to indicate it's an MCP App UI resource.

```csharp
// Optional resource metadata
private const string ResourceMetadata = """
    {
        "ui": {
            "prefersBorder": true
        }
    }
    """;

[Function(nameof(GetWeatherWidget))]
public string GetWeatherWidget(
    [McpResourceTrigger(
        "ui://weather/index.html",
        "Weather Widget",
        MimeType = "text/html;profile=mcp-app",
        Description = "Interactive weather display for MCP Apps")]
    [McpMetadata(ResourceMetadata)]
        ResourceInvocationContext context)
{
    var file = Path.Combine(AppContext.BaseDirectory, "app", "dist", "index.html");
    return File.ReadAllText(file);
}
```

A tool can reference this resource by declaring a `resourceUri` in its metadata, pointing to `ui://weather/index.html`. When the tool is invoked, the MCP host fetches the resource and renders it: 

```csharp
private const string ToolMetadata = """
    {
        "ui": {
            "resourceUri": "ui://weather/index.html"
        }
    }
    """;

[Function(nameof(GetWeather))]
public async Task<object> GetWeather(
    [McpToolTrigger(nameof(GetWeather), "Returns current weather for a location via Open-Meteo.")]
    [McpMetadata(ToolMetadata)]
        ToolInvocationContext context,
    [McpToolProperty("location", "City name to check weather for (e.g., Seattle, New York, Miami)")]
        string location)
{
    var result = await _weatherService.GetCurrentWeatherAsync(location);
    return result;
}
```

For the complete code example, see [WeatherFunction.cs](https://github.com/Azure-Samples/remote-mcp-functions-dotnet/blob/main/src/McpWeatherApp/WeatherFunction.cs).  

This code example creates an endpoint to expose a resource named `readme` that reads a markdown file and returns its contents as plain text. Clients can access this resource using the `file://readme.md` URI.

```csharp
    private const string ReadmeMetadata = """
        {
            "author": "John Doe",
            "file": {
                "version": 1.0,
                "releaseDate": "2024-01-01"
            },
            "test": {
                "example": ["list", "of", "values"]
            }
        }
        """;

    [Function(nameof(GetTextResource))]
    public string GetTextResource(
        [McpResourceTrigger(
            "file://readme.md",
            "readme",
            Description = "Application readme file",
            MimeType = "text/plain")]
        [McpMetadata(ReadmeMetadata)]
        ResourceInvocationContext context)
    {
        _logger.LogInformation("Reading text resource from local file storage");
        var file = Path.Combine(AppContext.BaseDirectory, "assets", "readme.md");
        return File.ReadAllText(file);
    }
```

In this example, a folder called `assets` containing the `readme` is bundled with the function app at build time because the following directive is present in the `.csproj` file:

```xml
<ItemGroup>
  <None Update="assets\**\*">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </None>
</ItemGroup>
```

For the complete code example, see the [Azure Functions MCP Extension repo](https://github.com/Azure/azure-functions-mcp-extension/tree/main/test/TestAppIsolated). 

::: zone-end

::: zone pivot="programming-language-java"

> [!IMPORTANT]
> The MCP extension in Java doesn't_ support resource today.

::: zone-end

::: zone pivot="programming-language-javascript"  
Example code for JavaScript isn't currently available. See the TypeScript example for general guidance.
::: zone-end  

::: zone pivot="programming-language-typescript"

The code below registers a resource named `Weather Widget` that serves an interactive weather display as bundled HTML content. The resource uses the `ui://` scheme to indicate it's an MCP App UI resource.

```typescript
// Constants for the Weather Widget resource
const WEATHER_WIDGET_URI = "ui://weather/index.html";
const WEATHER_WIDGET_NAME = "Weather Widget";
const WEATHER_WIDGET_DESCRIPTION = "Interactive weather display for MCP Apps";
const WEATHER_WIDGET_MIME_TYPE = "text/html;profile=mcp-app";

// Metadata for the resource 
const RESOURCE_METADATA = JSON.stringify({
  ui: {
    prefersBorder: true
  }
});

app.mcpResource("getWeatherWidget", {
  uri: WEATHER_WIDGET_URI,
  resourceName: WEATHER_WIDGET_NAME,
  description: WEATHER_WIDGET_DESCRIPTION,
  mimeType: WEATHER_WIDGET_MIME_TYPE,
  metadata: RESOURCE_METADATA,
  handler: getWeatherWidget,
});
```

The following code is the `getWeatherWidget` handler:

```typescript
export async function getWeatherWidget(
  resourceContext: unknown,
  context: InvocationContext
): Promise<string> {
  context.log("Getting weather widget");

  try {
    const filePath = path.join(__dirname, "..", "..", "..", "src", "app", "dist", "index.html");
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    context.log(`Error reading weather widget file: ${error}`);
    return `<!DOCTYPE html>
      <html>
      <head><title>Weather Widget</title></head>
      <body>
      <h1>Weather Widget</h1>
      <p>Widget content not found. Please ensure the app/dist/index.html file exists.</p>
      </body>
      </html>`;
  }
}
```

A tool can reference this resource by declaring a `resourceUri` in its metadata. When the tool is invoked, the MCP host fetches the resource and renders it:

```typescript
// Metadata for the tool (as valid JSON string)
const TOOL_METADATA = JSON.stringify({
  ui: {
    resourceUri: "ui://weather/index.html"
  }
});

app.mcpTool("getWeather", {
  toolName: "GetWeather",
  description: "Returns current weather for a location via Open-Meteo.",
  toolProperties: {
    location: arg.string().describe("City name to check weather for (e.g., Seattle, New York, Miami)")
  },
  metadata: TOOL_METADATA,
  handler: getWeather,
});
```

For the complete code example, see [weatherMcpApp.ts](https://github.com/Azure-Samples/remote-mcp-functions-typescript/blob/McpAppDemo/src/functions/weatherMcpApp.ts).

> [!IMPORTANT]
> The MCP resource trigger for TypeScript currently requires version `4.12.0-preview.2` or later of the [`@azure/functions`](https://www.npmjs.com/package/@azure/functions/v/4.12.0-preview.2) package.
> It also requires version `[4.32.0, 5.0.0)` of the preview exetnsion bundle. Make sure to update your `host.json` to use this preview bundle and version:
>
> ```json
> "extensionBundle": {
>   "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
>   "version": "[4.32.0, 5.0.0)"
> }
> ```

::: zone-end  

::: zone pivot="programming-language-python"

The following code registers a resource named `Weather Widget` that serves an interactive weather display as bundled HTML content. The resource uses the `ui://` scheme to indicate it's an MCP App UI resource.

```python
# Constants for the Weather Widget resource
WEATHER_WIDGET_URI = "ui://weather/index.html"
WEATHER_WIDGET_NAME = "Weather Widget"
WEATHER_WIDGET_DESCRIPTION = "Interactive weather display for MCP Apps"
WEATHER_WIDGET_MIME_TYPE = "text/html;profile=mcp-app"

# Metadata for the resource 
RESOURCE_METADATA = '{"ui": {"prefersBorder": true}}'

@app.mcp_resource_trigger(
    arg_name="context",
    uri=WEATHER_WIDGET_URI,
    resource_name=WEATHER_WIDGET_NAME,
    description=WEATHER_WIDGET_DESCRIPTION,
    mime_type=WEATHER_WIDGET_MIME_TYPE,
    metadata=RESOURCE_METADATA
)
def get_weather_widget(context) -> str:
    """Get the weather widget HTML content."""
    logging.info("Getting weather widget")

    current_dir = Path(__file__).parent
    file_path = current_dir / "app" / "dist" / "index.html"

    if file_path.exists():
        return file_path.read_text(encoding="utf-8")
    else:
        logging.warning(f"Weather widget file not found at: {file_path}")
        return """<!DOCTYPE html>
        <html>
        <head><title>Weather Widget</title></head>
        <body>
        <h1>Weather Widget</h1>
        <p>Widget content not found. Please ensure the app/index.html file exists.</p>
        </body>
        </html>"""
```

A tool can reference this resource by declaring a `resourceUri` in its metadata, pointing to `ui://weather/index.html`. When the tool is invoked, the MCP host fetches the resource and renders it:

```python
# Metadata for the tool
TOOL_METADATA = '{"ui": {"resourceUri": "ui://weather/index.html"}}'

@app.mcp_tool(metadata=TOOL_METADATA)
@app.mcp_tool_property(arg_name="location", description="City name to check weather for (e.g., Seattle, New York, Miami)")
def get_weather(location: str) -> Dict[str, Any]:
    """Returns current weather for a location via Open-Meteo."""
    logging.info(f"Getting weather for location: {location}")

    result = weather_service.get_current_weather(location)
    return json.dumps(result)
```

For the complete code example, see [function_app.py](https://github.com/Azure-Samples/remote-mcp-functions-python/blob/main/src).

> [!NOTE]
> The MCP resource trigger for Python requires version `1.25.0b3` or later of the [`azure-functions`](https://pypi.org/project/azure-functions/1.25.0b3/) package. 
> It also requires version `[4.32.0, 5.0.0)` of the preview exetnsion bundle. Make sure to update your `host.json` to use this preview bundle and version:
>
> ```json
> "extensionBundle": {
>   "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview"
>   "version": "[4.32.0, 5.0.0)"
> }
> ```
>
> If the app is using Python 3.9-3.12, add the `PYTHON_ISOLATE_WORKER_DEPENDENCIES: 1` app setting to `local.settings.json` and to app settings when running in Azure.

::: zone-end

[!INCLUDE [functions-mcp-extension-powershell-note](../../includes/functions-mcp-extension-powershell-note.md)]  

::: zone pivot="programming-language-csharp"  

## Attributes

C# libraries use `McpResourceTriggerAttribute` to define the function trigger. 

The attribute's constructor takes the following parameters:

| Parameter | Description |
|---------|----------------------|
| **Uri** | (Required) The URI of the resource, which defines the resource's address. For example, `ui://weather/index.html` defines a static resource URI. |
| **ResourceName** | (Required) The name of the resource that the MCP resource trigger endpoint exposes. |

The attribute also supports the following named properties:

| Property | Description |
|---------|----------------------|
| **Description** | (Optional) A friendly description of the resource endpoint for clients. |
| **Title** | (Optional) A human-readable title for display purposes in MCP client interfaces. |
| **MimeType** | (Optional) The MIME type of the content returned by the resource. For example, `text/html;profile=mcp-app` for MCP App UI resources, `text/plain` for plain text, or `application/json` for JSON data. |
| **Size** | (Optional) The size of the resource content in bytes. |
| **Metadata** | (Optional) A JSON-serialized string of metadata for the resource. You can also use the `McpMetadata` attribute as an alternative way to provide metadata. |

You can use the `[McpMetadata]` attribute to provide more metadata for resources. This metadata is included in the meta field of each resource when clients call `resources/list`, and can influence how the resource content is displayed or processed.

See [Usage](#usage) to learn how the resource trigger provides data to your function.

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

The following MCP resource trigger properties are supported on `mcp_resource_trigger`:

| Property    | Description |
|-------------|-----------------------------|  
| **arg_name** | The variable name (usually `context`) used in function code to access the trigger payload. |
| **uri**  | (Required) Unique URI identifier for the resource. Must be an absolute URI. |
| **resource_name**  | (Required) Human-readable name of the resource. |
| **title** | An optional title for display purposes in MCP client interfaces. |
| **description**  | A description of the MCP resource exposed by the function endpoint. |
| **mime_type** | The MIME type of the content returned by the resource. For example, `text/html;profile=mcp-app` for MCP App UI resources, `text/plain` for plain text. |
| **size** | The expected size of the resource content in bytes, if known. |
| **metadata** | A JSON-serialized string of extra metadata for the resource. |

> [!NOTE]
> Decorators are only available in the Python v2 programming model.

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  
## Configuration

Define the trigger's binding options in your code. The trigger supports the following options: 

| Option | Description |
|-----------------------|-------------|
| **type** | Set to `mcpResourceTrigger`. Use only with generic definitions. |
| **uri** | (Required) The URI of the MCP resource that the function endpoint exposes. Must be an absolute URI. |
| **resourceName** | (Required) The human-readable name of the MCP resource that the function endpoint exposes. |
| **title** | An optional title for display purposes in MCP client interfaces. |
| **description**  | A description of the MCP resource that the function endpoint exposes.  |
| **mimeType** | The MIME type of the content returned by the resource. For example, `text/html;profile=mcp-app`. |
| **size** | The expected size of the resource content in bytes, if known. |
| **metadata** | A JSON-serialized string of extra metadata for the resource. |
| **handler** | The method that contains the actual function code. |

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"

See the [Example section](#example) for complete examples.

## Usage

::: zone-end

::: zone pivot="programming-language-csharp"  

The MCP resource trigger can bind to the following types:

| Type | Description |
| --- | --- |
| [ResourceInvocationContext] | An object representing the resource request, including the resource URI, session ID, and transport information. |

[ResourceInvocationContext]: https://github.com/Azure/azure-functions-mcp-extension/blob/main/src/Microsoft.Azure.Functions.Worker.Extensions.Mcp/Abstractions/ResourceInvocationContext.cs

The `ResourceInvocationContext` type provides the following properties:

| Property | Type | Description |
| --- | --- | --- |
| **Uri** | `string` | The URI of the resource being requested. |
| **SessionId** | `string?` | The session ID associated with the current resource invocation. |
| **Transport** | `Transport?` | Transport information for the current invocation. |

::: zone-end

::: zone pivot="programming-language-python"

The `mcp_resource_trigger` decorator binds to a context parameter that represents the resource request from the MCP client. The trigger can bind to the following types: `str`, `dict`, or `bytes`.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

The resource handler function has two parameters: 

| Parameter | Type | Description |
| --- | --- | --- |
| **messages** | `T` (defaults to `unknown`) | The trigger payload passed by the MCP extension. (The preceding example names this parameter `resourceContext`.) |
| **context** | `InvocationContext` | The Azure Functions invocation context, which provides logging and other runtime information. |

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-javascript,programming-language-typescript"

### Resource URIs

MCP resources use URIs to define the address of the resource. The URI uniquely identifies the resource and is what clients use to request it. You can use any URI scheme appropriate for your resource, such as `ui://` for UI resources or `file://` for file-based resources.

### Resource metadata

::: zone-end

::: zone pivot="programming-language-csharp"

Use the `McpMetadata` attribute to provide extra metadata for resources. MCP clients receive this metadata, and it can affect how the resource content is displayed or processed.

::: zone-end

::: zone pivot="programming-language-python"

To provide extra metadata for resources, use the `metadata` parameter on the `mcp_resource_trigger` decorator. This metadata is a JSON-serialized string included in the `meta` field of each resource when clients call `resources/list`. It can affect how the resource content is displayed or processed.

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

Use the `metadata` option to provide extra metadata for resources. This metadata is a JSON-serialized string included in the `meta` field of each resource when clients call `resources/list`. It can affect how the resource content is displayed or processed.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-javascript,programming-language-typescript"

### Return types

::: zone-end

::: zone pivot="programming-language-csharp"

The MCP resource trigger supports the following return types:

| Type | Description |
| --- | --- |
| `string` | Returned as text content in the MCP `ReadResourceResult`. |
| `byte[]` | Returned as base64-encoded blob content in the MCP `ReadResourceResult`. |

::: zone-end

::: zone pivot="programming-language-python"

The MCP resource trigger supports the following return types:

| Type | Description |
| --- | --- |
| `str` | Returned as text content in the MCP `ReadResourceResult`. |
| `bytes` | Returned as binary content in the MCP `ReadResourceResult`. |

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

The function should return a `string` containing the resource content (for example, HTML, JSON, or plain text).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-javascript,programming-language-typescript"

### Resource discovery

When a function app starts, it registers all resource trigger functions with the MCP server. Clients discover available resources by calling the MCP `resources/list` method. This method returns each resource's URI, name, description, MIME type, size, and metadata (through the `meta` field). Clients read a resource by calling `resources/read` with the resource URI.

::: zone-end

::: zone pivot="programming-language-csharp"

### Sessions

The `SessionId` property on `ResourceInvocationContext` identifies the MCP session making the request. Use this property to maintain per-session state or apply session-specific logic when serving resources.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript"

For more information, see [Examples](#example).

## host.json settings

The host.json file contains settings that control MCP trigger behaviors. See the [host.json settings](functions-bindings-mcp.md#hostjson-settings) section for details regarding available settings.

::: zone-end

## Related articles

[MCP tool trigger for Azure Functions](functions-bindings-mcp-tool-trigger.md)



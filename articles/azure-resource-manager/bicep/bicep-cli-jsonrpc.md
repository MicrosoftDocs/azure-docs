---
title: Programmatic Bicep usage with JSON-RPC
description: Learn how to use the Bicep CLI jsonrpc command to interact programmatically with Bicep files using a JSON-RPC interface.
ms.topic: reference
ms.date: 03/26/2026
ms.custom: devx-track-bicep
---

# Programmatic Bicep usage with JSON-RPC

> [!NOTE]
> The `jsonrpc` command was first introduced in Bicep version 0.29.45. The params and result format is stable and backwards-compatible. New fields may be added to results in future versions, but existing fields will not be removed or renamed. Clients should ignore unknown fields to remain compatible with newer versions of the Bicep CLI.

The `jsonrpc` command runs the Bicep CLI with a JSON-RPC interface. By using this interface, you can interact programmatically with structured output. You also avoid cold-start delays when compiling multiple files. This setup supports building libraries to interact with Bicep programmatically.

## Wire format

The wire format adheres to the [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification). Each message is header-delimited, using the following structure, where `\r` and `\n` represent carriage return and line feed characters:

```
Content-Length: <length>\r\n\r\n<message>\r\n\r\n
```

* `<length>` is the length of the `<message>` string, including the trailing `\r\n\r\n`.
* `<message>` is the raw JSON message.

For example, to call the `bicep/version` method:
```
Content-Length: 72\r\n\r\n{"jsonrpc": "2.0", "id": 0, "method": "bicep/version", "params": {}}\r\n\r\n
```

The corresponding result looks like:
```
Content-Length: 64\r\n\r\n{"jsonrpc": "2.0", "id": 0, "result": {"version": "0.38.5"}}\r\n\r\n
```

> [!NOTE]
> The JSON-RPC server is thread-safe, but because requests are multiplexed over a single channel, it is the responsibility of the client to ensure requests are serialized. This means each request must be sent in full before sending a second request, and a unique `id` must be sent for each request. The client doesn't need to wait for a response before sending a new request.

## Methods

The following methods are available through the JSON-RPC interface.

### bicep/version

Returns the version of the Bicep CLI.

#### Params

This method takes no params.

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `version` | string | The semantic version string of the Bicep CLI (e.g., `"0.38.5"`). |

#### Example

Params:
```json
{}
```

Result:
```json
{
  "version": "0.24.211"
}
```

### bicep/compile

Compiles a specified `.bicep` file and returns the compiled ARM template JSON.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicep` file to compile. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `success` | boolean | Whether the compilation completed without errors. |
| `diagnostics` | [DiagnosticDefinition](#diagnosticdefinition)[] | Diagnostics produced during compilation. |
| `contents` | string \| null | The compiled ARM template JSON, or `null` if compilation failed. |

#### Example

Params:
```json
{
  "path": "/path/to/main.bicep"
}
```

Result:
```json
{
  "success": true,
  "diagnostics": [],
  "contents": "{\"$schema\": \"https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#\", ...}"
}
```

### bicep/compileParams

Compiles a specified `.bicepparam` file. Returns the compiled parameters JSON and the associated template.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicepparam` file to compile. |
| `parameterOverrides` | object | A dictionary of parameter names to JSON values that override the defaults specified in the parameters file. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `success` | boolean | Whether the compilation completed without errors. |
| `diagnostics` | [DiagnosticDefinition](#diagnosticdefinition)[] | Diagnostics produced during compilation. |
| `parameters` | string \| null | The compiled ARM parameters JSON, or `null` if compilation failed. |
| `template` | string \| null | The compiled ARM template JSON referenced by the parameters file, or `null` if not resolvable. |
| `templateSpecId` | string \| null | The Azure resource ID of the template spec if the parameters file references one; otherwise `null`. |

#### Example

Params:
```json
{
  "path": "/path/to/main.bicepparam",
  "parameterOverrides": {}
}
```

Result:
```json
{
  "success": true,
  "diagnostics": [],
  "parameters": "{\"$schema\": \"https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#\", ...}",
  "template": "{\"$schema\": \"https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#\", ...}",
  "templateSpecId": null
}
```

### bicep/getMetadata

Returns metadata about a specified `.bicep` file, including parameters, outputs, exports, and metadata decorators.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicep` file to analyze. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `metadata` | [MetadataDefinition](#metadatadefinition)[] | File-level metadata entries declared with the `metadata` keyword. |
| `parameters` | [SymbolDefinition](#symboldefinition)[] | Parameter definitions declared in the Bicep file. |
| `outputs` | [SymbolDefinition](#symboldefinition)[] | Output definitions declared in the Bicep file. |
| `exports` | [ExportDefinition](#exportdefinition)[] | Exported symbols declared with the `@export()` decorator. |

#### Example

Params:
```json
{
  "path": "/path/to/main.bicep"
}
```

Result:
```json
{
  "metadata": [
    { "name": "description", "value": "My deployment" }
  ],
  "parameters": [
    {
      "range": { "start": { "line": 0, "char": 0 }, "end": { "line": 0, "char": 20 } },
      "name": "location",
      "type": { "range": null, "name": "string" },
      "description": "The Azure region for deployment"
    }
  ],
  "outputs": [
    {
      "range": { "start": { "line": 5, "char": 0 }, "end": { "line": 5, "char": 30 } },
      "name": "endpoint",
      "type": { "range": null, "name": "string" },
      "description": null
    }
  ],
  "exports": []
}
```

### bicep/getDeploymentGraph

Returns the deployment graph for a specified `.bicep` file, describing the resources and their dependencies.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicep` file to analyze. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `nodes` | [Node](#node)[] | The resource nodes in the deployment graph. |
| `edges` | [Edge](#edge)[] | The dependency edges between resource nodes. |

#### Example

Params:
```json
{
  "path": "/path/to/main.bicep"
}
```

Result:
```json
{
  "nodes": [
    {
      "range": { "start": { "line": 2, "char": 0 }, "end": { "line": 8, "char": 1 } },
      "name": "storageAccount",
      "type": "Microsoft.Storage/storageAccounts",
      "isExisting": false,
      "relativePath": null
    }
  ],
  "edges": [
    { "source": "roleAssignment", "target": "storageAccount" }
  ]
}
```

### bicep/getFileReferences

Gets the full list of file paths that are referenced by a compilation. Useful to determine a set of files to watch for changes.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicep` file to analyze. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `filePaths` | string[] | Absolute paths of all files referenced during compilation, including the input file itself, any modules, and configuration files. |

#### Example

Params:
```json
{
  "path": "/path/to/main.bicep"
}
```

Result:
```json
{
  "filePaths": [
    "/path/to/main.bicep",
    "/path/to/modules/storage.bicep",
    "/path/to/bicepconfig.json"
  ]
}
```

### bicep/getSnapshot

> [!NOTE]
> This method requires Bicep CLI version 0.36.1 or higher.

Creates a deployment snapshot for a given `.bicepparam` file. The snapshot bundles all information needed for deployment into a single self-contained JSON document.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicepparam` file. |
| `metadata` | [SnapshotMetadata](#snapshotmetadata) | Deployment metadata providing Azure context. All fields are optional. |
| `externalInputs` | [ExternalInputValue](#externalinputvalue)[] \| null | External input values to inject into the snapshot. Pass `null` if not needed. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `snapshot` | string | The self-contained deployment snapshot as a JSON string. |

#### Example

Params:
```json
{
  "path": "/path/to/main.bicepparam",
  "metadata": {
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "subscriptionId": "00000000-0000-0000-0000-000000000000",
    "resourceGroup": "myResourceGroup",
    "location": "eastus",
    "deploymentName": "myDeployment"
  },
  "externalInputs": []
}
```

Result:
```json
{
  "snapshot": "{...}"
}
```

### bicep/format

> [!NOTE]
> This method requires Bicep CLI version 0.37.1 or higher.

Formats a specified `.bicep` file.

#### Params

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The file path to the `.bicep` file to format. |

#### Result

| Property | Type | Description |
|----------|------|-------------|
| `contents` | string | The formatted Bicep source code. |

#### Example

Params:
```json
{
  "path": "/path/to/file.bicep"
}
```

Result:
```json
{
  "contents": "..."
}
```

## Types

The following types are used in method inputs and outputs.

### Position

Represents a zero-based position within a Bicep source file.

| Property | Type | Description |
|----------|------|-------------|
| `line` | integer | Zero-based line number. |
| `char` | integer | Zero-based character offset within the line. |

### Range

Represents a range within a Bicep source file.

| Property | Type | Description |
|----------|------|-------------|
| `start` | [Position](#position) | Start position of the range (inclusive). |
| `end` | [Position](#position) | End position of the range (exclusive). |

### DiagnosticDefinition

Represents a diagnostic message produced during compilation or analysis.

| Property | Type | Description |
|----------|------|-------------|
| `source` | string | Source of the diagnostic (e.g., `"bicep"` for compiler diagnostics, or a linter rule name). |
| `range` | [Range](#range) | Source location range where the diagnostic applies. |
| `level` | string | Severity level: `"Error"`, `"Warning"`, or `"Info"`. |
| `code` | string | Diagnostic code that identifies the diagnostic type (e.g., `"BCP001"`). |
| `message` | string | Human-readable diagnostic message. |

### MetadataDefinition

Represents a file-level metadata entry declared with the `metadata` keyword.

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | The metadata key name (e.g., `"description"`). |
| `value` | string | The metadata value. |

### SymbolDefinition

Represents a parameter or output symbol in a Bicep file.

| Property | Type | Description |
|----------|------|-------------|
| `range` | [Range](#range) | Source location of the symbol declaration. |
| `name` | string | Name of the parameter or output. |
| `type` | [TypeDefinition](#typedefinition) \| null | Type of the symbol, or `null` if unresolvable. |
| `description` | string \| null | Description from the `@description()` decorator, or `null` if not specified. |

### TypeDefinition

Represents a type reference for a parameter or output.

| Property | Type | Description |
|----------|------|-------------|
| `range` | [Range](#range) \| null | Source location of the type reference, or `null` for built-in types. |
| `name` | string | The type name (e.g., `"string"`, `"int"`, `"object"`, or a user-defined type name). |

### ExportDefinition

Represents an exported symbol declared with the `@export()` decorator.

| Property | Type | Description |
|----------|------|-------------|
| `range` | [Range](#range) | Source location of the export declaration. |
| `name` | string | Name of the exported symbol. |
| `kind` | string | Kind of export: `"Type"`, `"Variable"`, or `"Function"`. |
| `description` | string \| null | Description from the `@description()` decorator, or `null` if not specified. |

### Node

Represents a resource node in a deployment graph.

| Property | Type | Description |
|----------|------|-------------|
| `range` | [Range](#range) | Source location of the resource declaration. |
| `name` | string | Symbolic name of the resource in the Bicep file. |
| `type` | string | Fully qualified Azure resource type (e.g., `"Microsoft.Storage/storageAccounts"`). |
| `isExisting` | boolean | Whether the resource is an `existing` reference rather than a new deployment. |
| `relativePath` | string \| null | Relative path if the resource is defined in a module; otherwise `null`. |

### Edge

Represents a directed dependency edge between two resource nodes in a deployment graph.

| Property | Type | Description |
|----------|------|-------------|
| `source` | string | Symbolic name of the dependent resource. |
| `target` | string | Symbolic name of the resource being depended upon. |

### SnapshotMetadata

Provides Azure deployment context for snapshot generation. All fields are optional.

| Property | Type | Description |
|----------|------|-------------|
| `tenantId` | string \| null | The Azure Active Directory tenant ID. |
| `subscriptionId` | string \| null | The Azure subscription ID. |
| `resourceGroup` | string \| null | The target resource group name. |
| `location` | string \| null | The Azure region for the deployment. |
| `deploymentName` | string \| null | The name of the deployment. |

### ExternalInputValue

Represents an external input value to inject into a snapshot.

| Property | Type | Description |
|----------|------|-------------|
| `kind` | string | The kind of external input (e.g., the input provider type). |
| `config` | any \| null | Optional JSON configuration for the external input, or `null` if not needed. |
| `value` | any | The JSON value for the external input. |

## Usage

### With named pipe transport

Use the `--pipe` argument to pass in a named pipe for the Bicep CLI to connect to. Note that the calling process must already have initiated the pipe as a server, and Bicep CLI will connect as a client.

```bicep cli
bicep jsonrpc --pipe <named_pipe>
```

`<named_pipe>` is an existing named pipe to connect the JSON-RPC client to.

#### Example
To connect to a named pipe on macOS or Linux:

```bicep cli
bicep jsonrpc --pipe /tmp/bicep-81375a8084b474fa2eaedda1702a7aa40e2eaa24b3.sock
```

To connect to a named pipe on Windows:

```bicep cli
bicep jsonrpc --pipe \\.\pipe\\bicep-81375a8084b474fa2eaedda1702a7aa40e2eaa24b3.sock
```

### With TCP socket transport

Use the `--socket` argument to pass in a TCP port for the Bicep CLI to connect to. Note that the calling process must already be listening for connections on the port.

```bicep cli
bicep jsonrpc --socket <tcp_socket>
```

`<tcp_socket>` is the socket number to which the JSON-RPC client connects.

#### Example
To connect to a TCP socket:

```bicep cli
bicep jsonrpc --socket 12345
```

### With stdin/stdout transport

Use the following syntax to start the JSON-RPC server with request data received via stdin, and response data sent via stdout.

```bicep cli
bicep jsonrpc --stdio
```

## .NET client library

The [Azure.Bicep.RpcClient](https://www.nuget.org/packages/Azure.Bicep.RpcClient) NuGet package provides a .NET client library for the Bicep JSON-RPC interface. It can automatically download the specified version of the Bicep CLI and manage its lifecycle, so you don't need to install it separately.

### Example

The following example downloads Bicep CLI version `0.39.26`, compiles a Bicep file, and prints the resulting ARM template:

```csharp
using Bicep.RpcClient;

var factory = new BicepClientFactory();
using var bicep = await factory.Initialize(new() {
    BicepVersion = "0.39.26"
});

var version = await bicep.GetVersion();
Console.WriteLine($"Bicep version: {version}");

var tempFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.bicep");
File.WriteAllText(tempFile, """
    param foo string
    output foo string = foo
    """);

var result = await bicep.Compile(new(tempFile));
Console.Write(result.Contents);
```
---
title: Generate documentation for Bicep modules
description: Learn how to use the experimental bicep docs generate command to create Markdown documentation for Bicep modules from their parameters, types, outputs, and usage examples.
ms.topic: how-to
ms.date: 09/13/2026
ms.custom: devx-track-bicep
#customer intent: As a Bicep module author, I want to generate documentation from my module source so that the README stays accurate without manual editing.
---

# Generate documentation for Bicep modules

The `bicep docs generate` command renders documentation for a Bicep module directly from its source. Bicep compiles the module, builds a model of its resource types, parameters, exported types, exported variables, exported functions, outputs, and referenced modules, and then renders that model through a [Scriban](https://github.com/scriban/scriban) template. The built-in template produces a Markdown _README.md_ file. You can also supply your own template to match the conventions of your repository.

In this article, you learn how to:

* Generate a _README.md_ file for a single module or for every module in a repository.
* Include usage examples from your `examples` and `tests` folders.
* Configure output, template, and example settings in _bicepconfig.json_.
* Customize the rendered output with a custom Scriban template.
* Generate documentation programmatically through the JSON-RPC interface.

The `docs` command group is experimental and is available in Bicep CLI version 0.47.16 or later. It isn't gated behind a feature flag in _bicepconfig.json_. The command isn't available through the Azure CLI, so run `bicep docs` directly rather than `az bicep docs`. Command options, configuration properties, the template model, and the built-in Markdown template can change in a future release without a breaking-change notice.

[!INCLUDE [Bicep-experimental-features-not-supported](../../../includes/resource-manager-experimental-features.md)]

## Prerequisites

* [Bicep CLI](./install.md) version 0.47.16 or later. To check your version, run `bicep --version`.
* A Bicep module that compiles without errors. The command compiles the module before it renders anything, so a module that fails to build doesn't produce documentation.

## Generate documentation for a module

Create a module in a folder named _storage_. The following example, _main.bicep_, declares parameters, an exported type, resources, and outputs. Descriptions and metadata flow into the generated documentation, so add a `@description()` decorator to each parameter and output, and add `metadata name` and `metadata description` to the module.

```bicep
metadata name = 'Storage Account'
metadata description = 'Deploys a storage account with optional blob containers.'

@description('The name of the storage account.')
@minLength(3)
@maxLength(24)
param storageAccountName string

@description('The Azure region for the storage account.')
param location string = resourceGroup().location

@description('The storage account SKU.')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
])
param skuName string = 'Standard_LRS'

@description('Blob containers to create in the storage account.')
param containers containerType[] = []

@description('A blob container definition.')
@export()
type containerType = {
  @description('The container name.')
  name: string
  @description('The public access level.')
  publicAccess: 'None' | 'Blob' | 'Container'?
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: skuName
  }
  kind: 'StorageV2'
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource blobContainers 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = [for container in containers: {
  parent: blobService
  name: container.name
  properties: {
    publicAccess: container.?publicAccess ?? 'None'
  }
}]

@description('The resource ID of the storage account.')
output storageAccountId string = storageAccount.id

@description('The primary blob endpoint.')
output blobEndpoint string = storageAccount.properties.primaryEndpoints.blob
```

Add a usage example in _storage/examples/minimal.bicep_. The command discovers example files automatically, as described in [Include usage examples](#include-usage-examples).

```bicep
metadata name = 'Minimal deployment'
metadata description = 'Deploys a storage account with default settings.'

module storage '../main.bicep' = {
  name: 'storage-minimal'
  params: {
    storageAccountName: 'stcontosominimal'
  }
}
```

Run the command from the parent folder:

```bicepcli
bicep docs generate ./storage/main.bicep
```

The command writes the experimental-feature warning to `stderr` and creates _storage/README.md_. The following excerpt shows part of the generated file:

```markdown
# Storage Account

Deploys a storage account with optional blob containers.

## Navigation

- [Resource Types](#resource-types)
- [Usage Examples](#usage-examples)
- [Parameters](#parameters)
- [Exported Types](#exported-types)
- [Outputs](#outputs)

## Resource Types

| Resource Type                                                          | Existing |
|:-----------------------------------------------------------------------|:---------|
| `Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01` | No       |
| `Microsoft.Storage/storageAccounts/blobServices@2023-05-01`            | No       |
| `Microsoft.Storage/storageAccounts@2023-05-01`                         | No       |

## Usage Examples

### Example 1: _Minimal deployment_

Deploys a storage account with default settings.

...

## Parameters

| Name                 | Type     | Required | Description                                       |
|:---------------------|:---------|:---------|:--------------------------------------------------|
| `containers`         | `array`  | No       | Blob containers to create in the storage account. |
| `location`           | `string` | No       | The Azure region for the storage account.         |
| `skuName`            | `string` | No       | The storage account SKU.                          |
| `storageAccountName` | `string` | Yes      | The name of the storage account.                  |

### `containers`

- Default value: `[]`

- Properties:
  - `name` (`string`), required: The container name.
  - `publicAccess` (`string`): The public access level.
    - Allowed values: `Blob`, `Container`, `None`

...

## Outputs

| Name               | Type     | Description                             |
|:-------------------|:---------|:----------------------------------------|
| `blobEndpoint`     | `string` | The primary blob endpoint.              |
| `storageAccountId` | `string` | The resource ID of the storage account. |
```

Collections in the generated output are sorted by name, so the order of parameters and outputs in the documentation doesn't depend on their order in the source file. Usage examples are sorted by their path relative to the module folder.

To preview the output without writing a file, use `--stdout`:

```bicepcli
bicep docs generate ./storage/main.bicep --stdout
```

## Choose the output location

By default, the command writes a file named _README.md_ next to the input module. Use the following options to change where the output goes:

| Option             | Result                                                                                                                                  |
|:-------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| None               | Writes the configured output file name, _README.md_ by default, next to the input module.                                               |
| `--outfile <path>` | Writes the document to exactly that path. Only valid with a single input file.                                                          |
| `--outdir <dir>`   | Writes the configured output file name inside `<dir>`. With `--pattern`, recreates each matched module's relative folder under `<dir>`. |
| `--stdout`         | Prints the document to `stdout` and creates no file. Only valid with a single input file.                                               |

The following example writes the document to a _docs_ folder instead of next to the module:

```bicepcli
bicep docs generate ./storage/main.bicep --outfile ./docs/storage.md
```

The command validates output paths before it writes anything:

* The output can't overwrite the input Bicep file.
* The output can't use a `.bicep` or `.bicepparam` extension.
* When you generate documentation for multiple modules, no two modules can resolve to the same output path.

Compilation and rendering finish before the command writes the output for a module. If either step fails, an existing output file is left unchanged.

Some option combinations are mutually exclusive. The command returns an error if you combine a positional input file with `--pattern`, or if you combine `--stdout` with `--pattern`, `--outdir`, or `--outfile`. You also can't combine `--outdir` with `--outfile`, or `--outfile` with `--pattern`.

## Generate documentation for many modules

Use `--pattern` with a glob to document every module that matches. The longest literal folder prefix before the first wildcard becomes the pattern root. When you also pass `--outdir`, the command recreates each module's folder structure, relative to that root, under the output folder.

```bicepcli
bicep docs generate --pattern './modules/**/main.bicep' --outdir ./docs
```

For a repository that contains _modules/storage/main.bicep_ and _modules/network/main.bicep_, the preceding command creates _docs/storage/README.md_ and _docs/network/README.md_.

Without `--outdir`, each matched module gets its output file next to it.

If a module fails to compile, the command reports the diagnostics and continues with the remaining modules so that valid modules still produce documentation. The command returns exit code `1` if any module fails. A setup, rendering, or write failure stops the command.

## Include usage examples

The command scans folders next to the module for usage examples and includes the contents of each example file in the generated documentation. By default, it looks in two places:

| Folder     | Included files                | Excluded files           |
|:-----------|:------------------------------|:-------------------------|
| `examples` | `*.bicep` and `**/main.bicep` | `**/dependencies*.bicep` |
| `tests`    | `**/*.test.bicep`             | `**/dependencies*.bicep` |

Example discovery follows these rules:

* Sources are processed in order. A file is included only once, and the first source that matches it wins.
* Folders are traversed recursively, up to 100 levels deep. Symbolic links and other reparse points are skipped.
* Include and exclude globs are matched case-insensitively against the path relative to the source folder.
* Examples are sorted by their path relative to the module folder.

The name of each example comes from the first of these values that exists: a literal `metadata name` declaration in the example file, the name of the containing folder when the example is nested, or the file name without the `.bicep` extension. The description comes from a literal `metadata description` declaration, or from the block of `//` comments at the top of the file. An example without either has no description.

To change which folders and files are scanned, configure `documentation.examples.sources` in _bicepconfig.json_, as described in the next section.

## Configure documentation settings

Documentation settings live under the `documentation` property in [_bicepconfig.json_](./bicep-config.md). The Bicep extension for Visual Studio Code provides IntelliSense for these properties. The following example changes the output file name, points to a custom template, and narrows example discovery to a single folder:

```json
{
  "documentation": {
    "output": {
      "file": "MODULE.md"
    },
    "template": {
      "file": "docs/templates/readme.scriban",
      "includeRoot": "docs/templates"
    },
    "examples": {
      "sources": [
        {
          "path": "examples",
          "include": ["*.bicep", "**/main.bicep"],
          "exclude": ["**/dependencies*.bicep"]
        }
      ],
      "reassignments": []
    }
  }
}
```

The following table describes the available properties:

| Property                                | Type             | Default                  | Description                                                                                                                                             |
|:----------------------------------------|:-----------------|:-------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `output.file`                           | string           | `README.md`              | The output file name. It must be a file name without folder separators.                                                                                 |
| `template.file`                         | string           | Built-in template        | Path to a custom Scriban template.                                                                                                                      |
| `template.includeRoot`                  | string           | Module folder            | Root folder for `include` statements in the template. The folder must exist.                                                                            |
| `examples.sources`                      | array            | See the previous section | Ordered list of example sources. A configured list replaces the defaults. An empty array turns off example discovery.                                   |
| `examples.sources[].path`               | string           | Required                 | Folder relative to each module's folder. Use `.` for the module folder itself.                                                                          |
| `examples.sources[].include`            | array of strings | `[]`                     | Case-insensitive include globs relative to the source folder.                                                                                           |
| `examples.sources[].exclude`            | array of strings | `[]`                     | Case-insensitive exclude globs relative to the source folder.                                                                                           |
| `examples.reassignments`                | array            | `[]`                     | Ordered rules that move examples from a parent module to a child module. See [Reassign examples to child modules](#reassign-examples-to-child-modules). |
| `examples.reassignments[].from.include` | array of strings | Required                 | Globs that select examples from the parent module.                                                                                                      |
| `examples.reassignments[].from.exclude` | array of strings | `[]`                     | Globs that exclude parent examples from the rule.                                                                                                       |
| `examples.reassignments[].to`           | string           | Required                 | The name of one direct child folder.                                                                                                                    |

Relative paths in these settings are anchored differently depending on the property:

* `template.file` and `template.includeRoot` resolve relative to the folder that contains the _bicepconfig.json_ file nearest to the module. A rooted path is used as-is.
* `examples.sources[].path` resolves relative to each module's own folder.
* `examples.reassignments[].to` resolves relative to the parent module's folder.

Settings passed on the command line override the configuration file. The `--outfile` and `--outdir` options replace the configured output file name for that run. The `--template-file` and `--template-root` options replace the configured template and include root. Custom template values are available only on the command line and can't be configured in _bicepconfig.json_.

### Understand which configuration file applies

Each module resolves its own _bicepconfig.json_ by starting in the module's folder and walking up toward the root of the file system. The first file found is merged with the built-in defaults and used for that module. For more information, see [Understand the file resolution process](./bicep-config.md#understand-the-file-resolution-process).

Because the nearest file wins, a module folder that contains its own _bicepconfig.json_ doesn't pick up `documentation` settings from a _bicepconfig.json_ higher in the repository. To share settings across a repository, either keep a single _bicepconfig.json_ at the repository root, or use the [`extends` property](./bicep-config-inheritance.md) in each nested file to inherit from the shared one. A relative `template.file` path inherited through `extends` still resolves against the folder of the module's nearest _bicepconfig.json_, so either use a rooted path or keep the template at the same relative location in each folder.

### Reassign examples to child modules

Some repositories, including those that follow the [Azure Verified Modules](https://aka.ms/avm) layout, keep scope-specific examples next to a parent module but document them on a child module. A reassignment rule moves the matching examples when either module is documented:

* When the parent module is documented, examples that match the rule are removed, but only if the named child folder exists.
* When the child module is documented, the matching parent examples are added, with their paths shown relative to the child folder.
* If the child folder doesn't exist, the rule has no effect.

The following configuration moves examples whose path contains a scope-specific folder to the corresponding child module:

```json
{
  "documentation": {
    "examples": {
      "sources": [
        {
          "path": "tests",
          "include": ["**/*.test.bicep"],
          "exclude": ["**/dependencies*.bicep"]
        }
      ],
      "reassignments": [
        {
          "from": {
            "include": ["**/rg-scope.*/**"]
          },
          "to": "rg-scope"
        },
        {
          "from": {
            "include": ["**/sub-scope.*/**"]
          },
          "to": "sub-scope"
        }
      ]
    }
  }
}
```

## Customize the output with a template

The built-in template produces Markdown. To change the layout, wording, or format, write a [Scriban](https://github.com/scriban/scriban) template and point the command to it. The template receives a `module` object that describes the compiled module, and a `custom` object that holds values you pass on the command line.

The following template, _templates/readme.scriban_, lists parameters and outputs as bullet points and adds an owner line:

```scriban
# {{ module.name }}

{{ module.description }}

Owner: {{ custom.owner }}

## Parameters
{{ for parameter in module.parameters }}
- `{{ parameter.name }}` ({{ parameter.type }}{{ if parameter.required }}, required{{ end }}): {{ parameter.description }}
{{ end }}
## Outputs
{{ for output in module.outputs }}
- `{{ output.name }}` ({{ output.type }}): {{ output.description }}
{{ end }}
```

Pass the template with `--template-file`, and supply the custom value with `--custom-template-value`:

```bicepcli
bicep docs generate ./storage/main.bicep --stdout --template-file ./templates/readme.scriban --custom-template-value owner="Platform Team"
```

The output for the module from earlier in this article looks like the following text:

```markdown
# Storage Account

Deploys a storage account with optional blob containers.

Owner: Platform Team

## Parameters

- `containers` (array): Blob containers to create in the storage account.

- `location` (string): The Azure region for the storage account.

- `skuName` (string): The storage account SKU.

- `storageAccountName` (string, required): The name of the storage account.

## Outputs

- `blobEndpoint` (string): The primary blob endpoint.

- `storageAccountId` (string): The resource ID of the storage account.
```

To use the same template for every run, set `documentation.template.file` in _bicepconfig.json_ instead of passing `--template-file`.

Rendered output uses `\n` line endings and ends with exactly one trailing newline. Template loops are limited to 100,000 iterations.

### Reuse fragments with includes

A template can pull in other files with the Scriban `include` statement:

```scriban
{{ include "_footer.md" }}
```

Included files resolve from the module's folder by default. To keep shared fragments next to the template instead, set the include root with `--template-root` on the command line or with `documentation.template.includeRoot` in _bicepconfig.json_:

```bicepcli
bicep docs generate ./storage/main.bicep --template-file ./templates/readme.scriban --template-root ./templates
```

If an include can't be found, the command reports a render failure and doesn't write the output file.

### Supply custom values

Custom values are strings that a template reads as `custom.<key>` or `module.custom.<key>`. Supply them inline, one per option, or load them from a JSON file whose values are all strings:

```bicepcli
bicep docs generate ./storage/main.bicep --custom-template-value owner="Platform Team" --custom-template-value-file-path ./docs/values.json
```

The value file has the following shape:

```json
{
  "owner": "Platform Team",
  "supportUrl": "https://contoso.example/support"
}
```

Both options can be repeated. Values are applied in command-line order, and the last value for a key wins. A relative value file path resolves against the current working directory.

### Template model

The root object that the template receives contains `module` and `custom`. The `module` object has the following fields:

| Field               | Type           | Description                                                                                                                                                                                                                 |
|:--------------------|:---------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`              | string         | The literal `metadata name` value, or the module folder or file name when no name is declared.                                                                                                                              |
| `description`       | string or null | The module description.                                                                                                                                                                                                     |
| `path`              | string         | The path to the module file.                                                                                                                                                                                                |
| `targetScope`       | string         | The module's target scope.                                                                                                                                                                                                  |
| `custom`            | object         | The effective custom values.                                                                                                                                                                                                |
| `resourceTypes`     | array          | Declared resource types. Each entry has `type` and `existing`.                                                                                                                                                              |
| `parameters`        | array          | Parameters, including nested type information.                                                                                                                                                                              |
| `exportedTypes`     | array          | Exported types, including nested type information.                                                                                                                                                                          |
| `exportedVariables` | array          | Exported variables and their inferred type information.                                                                                                                                                                     |
| `exportedFunctions` | array          | Exported functions. Each entry has `name`, `parameters`, `returnType`, and `description`. Each function parameter has `name`, `type`, and `description`.                                                                    |
| `outputs`           | array          | Outputs. Each entry has `name`, `type`, `secure`, and `description`.                                                                                                                                                        |
| `references`        | array          | Referenced local modules. Each entry has `symbolicName`, `path`, and `description`.                                                                                                                                         |
| `usageExamples`     | array          | Discovered usage examples. Each entry has `name`, `path`, `description`, `contents`, and `fence`. The fence is a run of backticks longer than any run in the contents, so you can wrap the contents safely in a code block. |

Each parameter, and each nested property within a parameter, has the following fields. Exported types and variables use the same shape, without `required`, `defaultValue`, and `defaultValueFence`.

| Field                    | Type            | Description                                                                         |
|:-------------------------|:----------------|:------------------------------------------------------------------------------------|
| `name`                   | string          | The parameter or property name.                                                     |
| `type`                   | string          | The normalized Bicep type.                                                          |
| `required`               | bool            | Whether the parameter has no default value.                                         |
| `secure`                 | bool            | Whether the type is secure.                                                         |
| `description`            | string or null  | The description.                                                                    |
| `defaultValue`           | string or null  | The Bicep source of the default value.                                              |
| `defaultValueFence`      | string or null  | A code fence that's safe to wrap around the default value.                          |
| `allowedValues`          | array           | Literal allowed values.                                                             |
| `minValue`, `maxValue`   | integer or null | Numeric bounds.                                                                     |
| `minLength`, `maxLength` | integer or null | Length bounds.                                                                      |
| `pattern`                | string or null  | The validation pattern for strings.                                                 |
| `truncated`              | bool            | Whether nested details were omitted because the type exceeded the expansion limits. |
| `properties`             | array           | Nested properties, using the same shape.                                            |
| `discriminator`          | object or null  | The discriminator property and its cases for a tagged union type.                   |

Type expansion is limited to 20 levels deep and 10,000 nodes, and recursive types are detected rather than expanded indefinitely. All collections except usage examples are sorted by name.

## Use the command in a pipeline

The command fits into a build or pull-request check that verifies generated documentation is up to date. Keep the following behavior in mind:

* Any failure returns exit code `1`.
* The module is restored and compiled before rendering. Use `--no-restore` to skip restoring external modules from a registry when the local cache is already populated. See [restore](./bicep-cli.md#restore).
* Compilation diagnostics use the standard Bicep format. To emit them as SARIF instead, use `--diagnostics-format sarif`. In SARIF mode, the plain-text experimental warning is suppressed so that it doesn't interleave with the SARIF output on `stderr`.
* With `--stdout`, nothing is written to `stdout` when the command fails.

The `experimentalFeaturesWarning` setting in _bicepconfig.json_ controls warnings about experimental language features used in a Bicep file. It doesn't suppress the warning that the `docs` command group writes.

## Generate documentation programmatically

Long-running tools, such as editor extensions or documentation servers, can call the `bicep/generateDocs` method over the [JSON-RPC interface](./bicep-cli-jsonrpc.md#bicepgeneratedocs) instead of starting a new process for each module. The method returns the rendered content and never writes a file. Template and example settings are read from the module's _bicepconfig.json_, and custom values are passed in the request.

The [Azure.Bicep.RpcClient](https://www.nuget.org/packages/Azure.Bicep.RpcClient) NuGet package wraps the method for .NET callers:

```csharp
using var client = await factory.Initialize(new BicepClientConfiguration(), cancellationToken);

var rendered = await client.GenerateDocs(
    new GenerateDocsRequest(
        "./modules/storage/main.bicep",
        new() { ["owner"] = "Platform Team" }),
    cancellationToken);

if (rendered.Contents is not null)
{
    await File.WriteAllTextAsync("./modules/storage/README.md", rendered.Contents, cancellationToken);
}
```

`Contents` is `null` when the module fails to compile. The `Diagnostics` property contains the compilation diagnostics in either case.

## Related content

* [Bicep CLI commands](./bicep-cli.md#docs)
* [Programmatic Bicep usage with JSON-RPC](./bicep-cli-jsonrpc.md)
* [Configure your Bicep environment](./bicep-config.md)
* [Bicep modules](./modules.md)

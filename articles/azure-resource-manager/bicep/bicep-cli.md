---
title: Bicep CLI commands 
description: Learn about the commands that you can use in the Bicep CLI. These commands include building JSON Azure Resource Manager templates from Bicep.
ms.topic: reference
ms.date: 05/14/2026
ms.custom: devx-track-azurecli, devx-track-bicep, devx-track-arm-template
---

# Bicep CLI commands

This article describes the commands you can use in the Bicep CLI. You can execute these commands by using the Azure CLI or by directly invoking Bicep CLI commands. Each method requires a distinct installation process. For more information about installations, see [Azure CLI](./install.md#azure-cli) and [Azure PowerShell](./install.md#azure-powershell).

This guidance shows how to run the commands in the Azure CLI. When running commands in the Azure CLI, start them with `az`. If you're not using the Azure CLI, run the commands without `az` at the start of each. For example, `az bicep build` becomes `bicep build`, and `az bicep version` becomes `bicep --version`.

## build

The `build` command converts a Bicep file to a JSON Azure Resource Manager template (ARM template). Typically, you don't need to run this command because it runs automatically when you deploy a Bicep file. Run it manually when you want to see the JSON ARM template that's created from your Bicep file.

Using any of the following Bicep features automatically enables language version 2.0 code generation:

* [user-defined types](../bicep/user-defined-data-types.md)
* [user-defined functions](../bicep/user-defined-functions.md)
* [compile-time imports](../bicep/bicep-import.md)
* [experimental features](../bicep/bicep-config.md#enable-experimental-features)

The following example converts a Bicep file named *main.bicep* to an ARM template named *main.json*. The new file is created in the same directory as the Bicep file:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep build main.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --file main.bicep
```

---

The next example saves *main.json* to a different directory:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep build main.bicep --outdir c:\jsontemplates
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --file main.bicep --outdir c:\jsontemplates
```

---

The following example specifies the name and location of the file to create:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep build main.bicep --outfile c:\jsontemplates\azuredeploy.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --file main.bicep --outfile c:\jsontemplates\azuredeploy.json
```

---

To print the file to `stdout`, use:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep build main.bicep --stdout
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --file main.bicep --stdout
```

---

If your Bicep file includes a module that references an external registry, the `build` command automatically calls [`restore`](#restore). The `restore` command gets the file from the registry and stores it in the local cache.

> [!NOTE]
> The `restore` command doesn't refresh the cache. For more information, see [restore](#restore).

To prevent automatic restore, use the `--no-restore` switch:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep build --no-restore <bicep-file>
```

To use the `--no-restore` switch, you must have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.4.X or later.

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --no-restore <bicep-file>
```

---

The build process with the `--no-restore` switch fails if one of the external modules isn't already cached:

```error
The module with reference "br:exampleregistry.azurecr.io/bicep/modules/storage:v1" hasn't been restored.
```

When you get this error, either run the `build` command without the `--no-restore` switch, or run `bicep restore` first.

## build-params

The `build-params` command builds a `.bicepparam` file into a JSON parameters file:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep build-params params.bicepparam
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build-params --file params.bicepparam
```

---

This command converts a _params.bicepparam_ parameters file into a _params.json_ JSON parameters file.

## console

The `console` command is available in Bicep CLI v0.42.1 or later. It provides an interactive Read-Eval-Print Loop (REPL) environment for Bicep expressions. It allows you to experiment with Bicep functions and expressions in an interactive console session, especially useful when authoring or testing Bicep logic such as expressions, functions, and user-defined functions.. It supports the following features:

* **Interactive Expression Evaluation**: Enter Bicep expressions and see their evaluated results immediately
* **Variable Declarations**: Define variables using `var name = expression syntax and reuse them in subsequent expressions
* **Multi-line Input**: Support for complex multi-line expressions with automatic structural completion detection
* **Syntax Highlighting**: Real-time syntax highlighting for input and output

The `console` command has these limitations:

* No support for expressions requiring Azure context, e.g. `resourceGroup()`
* No persistent state between console sessions
* No completions support

Use the following command to start a Bicep console session:

# [Bicep CLI](#tab/bicep-cli)

```powershell
bicep console
```

# [Azure CLI](#tab/azure-cli)

N/A

---

To exit the console, press `ESC` or use the `exit` command.

### Examples

#### Simple Expressions

```bicep
> 1 + 2
3

> 'Hello, ${'World!'}'
'Hello, World!'

> length(['a', 'b', 'c'])
3
```

#### Variable Declarations

```bicep
> var myName = 'John'
> var greeting = 'Hello, ${myName}!'
> greeting
'Hello, John!'
```

#### Multi-line Expressions

The console automatically detects when expressions are structurally complete:

```bicep
> var config = {
  name: 'myApp'
  version: '1.0.0'
  settings: {
    debug: true
    timeout: 30
  }
}
> config.settings.debug
true
```

#### Complex Expressions

##### Lambdas

```bicep
> var users = [
  { name: 'Alice', age: 30 }
  { name: 'Bob', age: 25 }
]
> map(users, user => user.name)
['Alice', 'Bob']

> filter(users, user => user.age > 26)
[
  {
    age: 30
    name: 'Alice'
  }
]
```

##### User-defined types and functions

```bicep
> type PersonType = {
  name: string
  age: int
}
> func sayHi(person PersonType) string => 'Hello ${person.name}, you are ${person.age} years old!'
> var alice = {
  name: 'Alice'
  age: 30
}
> [ sayHi(alice), sayHi({ name: 'Bob', age: 25 })]
[
  'Hello Alice, you are 30 years old!'
  'Hello Bob, you are 25 years old!'
]
```

#### Loading content from files

Bicep console also supports the [`load*()` functions](./bicep-functions-files.md#file-functions-for-bicep). The directory from which the `bicep console` command is run is used as the _current directory_ when evaluating the `load*()` functions

The following example shows how to use [`loadDirectoryFileInfo()`](./bicep-functions-files.md#loaddirectoryfileinfo) to load information about all Bicep files in a directory:

```bicep
> loadDirectoryFileInfo('./modules/', '*.bicep')
[
  {
    relativePath: 'C:/Bicep/modules/appService.bicep'
    baseName: 'appService.bicep'
    extension: '.bicep'
  }
]
```

#### Piping and standard input/output redirection

The console command supports evaluating expressions provided through piping or redirected standard input, enabling scenarios like:

* Passing expression text via echo
* Composing scripts that feed expressions into the console
* Rapid testing of generated or transformed Bicep snippets

**Powershell**:

```powershell
# piped input
"parseCidr('10.144.0.0/20')" | bicep console
```

**Bash**:

```bash
# piped input
echo "parseCidr('10.144.0.0/20')" | bicep console
# stdin redirection from file content
bicep console < test.txt
```

Multi-line input is also supported:

```powershell
"{
> foo: 'bar'
> }.foo" | bicep console
```

The output is `'bar'`.

Output redirection is also supported:

```bash
"toObject([{name:'Evie', age:4},{name:'Casper', age:3}], x => x.name)" | bicep console > output.json
more output.json
```

The output is :

```json
{
  Evie: {
    name: 'Evie'
    age: 4
  }
  Casper: {
    name: 'Casper'
    age: 3
  }
}
```

## decompile

The `decompile` command converts a JSON ARM template to a Bicep file:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep decompile main.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep decompile --file main.json
```

---

This command creates a file named _main.bicep_ in the same directory as _main.json_. If _main.bicep_ exists in the same directory, use the `--force` switch to overwrite the existing Bicep file.

For more information about using this command, see [Decompile JSON ARM template to Bicep](decompile.md).

## decompile-params

The `decompile-params` command decompiles a JSON parameters file to a `.bicepparam` parameters file.

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep decompile-params azuredeploy.parameters.json --bicep-file ./dir/main.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep decompile-params --file azuredeploy.parameters.json --bicep-file ./dir/main.bicep
```

---

This command decompiles an _azuredeploy.parameters.json_ parameters file into an _azuredeploy.parameters.bicepparam_ file. Use `--bicep-file` to specify the path to the Bicep file (relative to the `.bicepparam` file) that's referenced in the `using` declaration.

## format

The `format` command formats a Bicep file so that it follows the recommended style conventions. Think of it as a code formatter or "prettier" for your Bicep files. It has the same function as the `SHIFT+ALT+F` shortcut in Visual Studio Code.

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep format main.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep format --file main.bicep
```

---

## generate-params

The `generate-params` command builds a parameters file from the given Bicep file and updates it if there's an existing parameters file.

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep generate-params main.bicep --output-format bicepparam --include-params all
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep generate-params --file main.bicep --output-format bicepparam --include-params all
```

---

This command creates a Bicep parameters file named _main.bicepparam_. The parameters file contains all parameters in the Bicep file, whether configured with default values or not.

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep generate-params main.bicep --outfile main.parameters.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep generate-params --file main.bicep --outfile main.parameters.json
```

---

This command creates a parameters file named _main.parameters.json_. The parameters file only contains the parameters without default values configured in the Bicep file.

## install

The `install` command adds the Bicep CLI to your local environment, and it's only available through the Azure CLI. For more information, see [Install Bicep tools](install.md).

To install the latest version, use:

# [Bicep CLI](#tab/bicep-cli)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep install
```

---

To install a specific version, use the following command:

# [Bicep CLI](#tab/bicep-cli)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep install --version v0.37.4
```

---

## jsonrpc

The `jsonrpc` command launches the Bicep CLI with a JSON-RPC interface, enabling fast programmatic interaction with Bicep files. For detailed usage, wire format, available methods, and connection options, see [Bicep CLI jsonrpc command](bicep-cli-jsonrpc.md).

## lint

The `lint` command returns the errors and [linter rule](./linter.md) violations of a Bicep file.

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep lint main.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep lint --file main.bicep
```

---

If your Bicep file includes a module that references an external registry, the `lint` command automatically calls [`restore`](#restore). The `restore` command gets the file from the registry and stores it in the local cache.

> [!NOTE]
> The `restore` command doesn't refresh the cache. For more information, see [restore](#restore).

To prevent automatic restore, use the `--no-restore` switch:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep lint --no-restore <bicep-file>
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep lint --no-restore <bicep-file>
```

---

The lint process with the `--no-restore` switch fails if one of the external modules isn't already cached:

```error
The module with reference "br:exampleregistry.azurecr.io/bicep/modules/storage:v1" has not been restored.
```

When you get this error, either run the `lint` command without the `--no-restore` switch or run `bicep restore` first.

## list-versions

The `list-versions` command returns all available versions of the Bicep CLI. Use this command to see if you want to [upgrade](#upgrade) or [install](#install) a new version. This command is only available through the Azure CLI.

# [Bicep CLI](#tab/bicep-cli)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep list-versions
```

The command returns an array of available versions:

```console
[
  "v0.37.4",
  "v0.36.177",
  "v0.36.1",
  "v0.35.1",
  "v0.34.44",
  "v0.34.1",
  "v0.33.93",
  "v0.33.13",
  "v0.32.4",
  "v0.31.92",
  "v0.31.34",
  "v0.30.23",
  "v0.30.3",
  "v0.29.47",
  "v0.29.45",
  "v0.28.1",
  "v0.27.1",
  "v0.26.170",
  "v0.26.54",
  "v0.25.53",
  "v0.25.3",
  "v0.24.24",
  "v0.23.1",
  "v0.22.6",
  "v0.21.1",
  "v0.20.4",
  "v0.19.5",
  "v0.18.4",
  "v0.17.1",
  "v0.16.2"
]
```

---

## publish

The `publish` command adds a module to a registry. The Azure container registry must exist, and the account publishing to the registry must have the correct permissions. For more information about setting up a module registry, see [Use private registry for Bicep modules](private-module-registry.md). To publish a module, the account must have the correct profile and permissions to access the registry. You can configure the profile and credential precedence for authenticating to the registry in the [Bicep config file](./bicep-config-modules.md#configure-profiles-and-credentials).

After publishing the file to the registry, you can [reference it in a module](modules.md#file-in-registry).

You must have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.14.X or later to use the `publish` command and the `--documentationUri`/`-d` parameter.

To publish a module to a registry, use:

# [Bicep CLI](#tab/bicep-cli)


```bicepcli
bicep publish <bicep-file> --target br:<registry-name>.azurecr.io/<module-path>:<tag> --documentationUri <documentation-uri>
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep publish --file <bicep-file> --target br:<registry-name>.azurecr.io/<module-path>:<tag> --documentationUri <documentation-uri>
```

---

For example:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep publish storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 --documentationUri https://www.contoso.com/exampleregistry.html
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep publish --file storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 --documentationUri https://www.contoso.com/exampleregistry.html
```

---

The `publish` command doesn't recognize aliases specified in a [_bicepconfig.json_ file](bicep-config-modules.md). Provide the full module path.

> [!WARNING]
> Publishing to the same target overwrites the old module. Increment the version when updating.

## restore

When your Bicep file uses modules that you publish to a registry, the `restore` command gets copies of all the required modules from the registry. It stores those copies in a local cache. A Bicep file can only be built when the external files are available in the local cache. Normally, running restore isn't necessary as it's automatically triggered by the build process.

To restore external modules to the local cache, the account must have the correct profile and permissions to access the registry. You can configure the [profile and credential precedence](./bicep-config-modules.md#configure-profiles-and-credentials) for authenticating to the registry in the Bicep config file.

To use the `restore` command, you must have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.14.X or later.

To manually restore the external modules for a file, use:

### [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep restore <bicep-file>
```

### [Azure CLI](#tab/azure-cli)

```azurecli
az bicep restore --file <bicep-file> [--force]
```

---

The Bicep file you provide is the file you want to deploy. It must contain a module that links to a registry. For example, you can restore the following file:

```bicep
module stgModule 'br:exampleregistry.azurecr.io/bicep/modules/storage:v1' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

You find the local cache in:

* On Windows

    ```path
    %USERPROFILE%\.bicep\br\<registry-name>.azurecr.io\<module-path\<tag>
    ```

* On Linux

    ```path
    /home/<username>/.bicep
    ```

* On Mac

    ```path
    ~/.bicep
    ```

The `restore` command doesn't refresh the cache if a module is already cached. To refresh the cache, you can either delete the module path from the cache or use the `--force` switch with the `restore` command.

## snapshot

By using Bicep CLI v0.41.2 or newer, you can use the `snapshot` command to create a normalized, deterministic representation of a Bicep deployment from a `.bicepparam` file. You can compare this snapshot with later snapshots to understand what changes a refactor would cause, without deploying anything to Azure. This command is particularly useful for:

* **Visual Diffs**: Seeing exactly how a refactor (like moving code into a module) changes the underlying resource definitions.
* **Complex Expressions**: Understanding what a complex string or variable actually evaluates to before deployment.
* **CI/CD Validation**: Automatically catching unintended changes in infrastructure logic during pull requests.

### Create a snapshot

This command generates a `.snapshot.json` file. This file is "normalized," meaning it removes noise like module boundaries so you can focus on the resources themselves.

#### [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep snapshot --mode overwrite <bicep-param-file>
```

#### [Azure CLI](#tab/azure-cli)

`az bicep snapshot` doesn't exist. You must run `bicep snapshot` directly.

---

The following JSON file shows a snapshot example:

```json
{
  "predictedResources": [
    {
      "id": "[format('/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.Storage/storageAccounts/stmyappstorage001', subscription().subscriptionId, resourceGroup().name)]",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "stmyappstorage001",
      "apiVersion": "2025-01-01",
      "location": "eastus",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    }
  ],
  "diagnostics": []
}
```

### Validate changes

After creating a snapshot, run the command in validate mode. It compares your current Bicep code against the saved snapshot and shows a visual diff, much like the [what-if](./deploy-what-if.md) command but entirely local.

#### [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep snapshot --mode validate <bicep-param-file>
```

#### [Azure CLI](#tab/azure-cli)

`az bicep snapshot` doesn't exist. You must run `bicep snapshot` directly.

---

A sample output looks like:

```
PS C:\bicep> bicep snapshot --mode validate main.bicepparam
Snapshot validation failed. Expected no changes, but found the following:

Scope: <unknown>

  ~ [format('/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.Storage/storageAccounts/stmyappstorage001', subscription().subscriptionId, resourceGroup().name)]
    ~ apiVersion: "2025-01-01" => "2025-06-01"
    ~ sku.name:   "Standard_LRS" => "Standard_GRS"
```

"Snapshot validation failed" indicates differences between the two snapshots.

Bicep CLI snapshot and What-if have these differences:

| Feature | `bicep snapshot` | `az deployment group what-if` |
| :--- | :--- | :--- |
| **Execution** | **Local only** (Offline) | **Cloud-based** (Online) |
| **Comparison** | Compares code vs. a saved file | Compares code vs. live Azure state |
| **Speed** | Extremely fast | Slower (requires API calls) |
| **Use Case** | Refactoring and logic testing | Final pre-deployment check |

### Provide context

When running Bicep snapshot, the CLI performs a local evaluation of your code. Since it doesn't talk to Azure, it cannot "ask" the cloud for your Subscription ID or the current Resource Group name.

If your code uses environment functions (like `subscription().id`), the snapshot will fail or return placeholders unless you provide specific context via CLI arguments.

To simulate a real deployment environment, you can pass the following flags:

| Argument | Purpose | Example Value |
| :--- | :--- | :--- |
| `--subscription-id` | Replaces the value returned by `subscription().subscriptionId` | `00000000-1111-2222-3333-444444444444` |
| `--resource-group` | Replaces the value returned by `resourceGroup().name` | `my-production-rg` |
| `--location` | Sets the default location for `deployment().location` | `westeurope` |
| `--tenant-id` | Replaces the value returned by `tenant().tenantId` | `72f988bf-86f1-41af-91ab-2d7cd011db47` |
| `--management-group` | Replaces the value returned by `managementGroup().name` | `my-corp-mg` |

#### [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep snapshot main.bicepparam \
  --subscription-id 00000000-0000-0000-0000-000000000000 \
  --resource-group my-temp-rg \
  --location eastus \
  --mode overwrite
```

#### [Azure CLI](#tab/azure-cli)

`az bicep snapshot` doesn't exist. You must run `bicep snapshot` directly.

---

## upgrade

The `upgrade` command updates your installed version with the latest version. This command is only available through the Azure CLI.

# [Bicep CLI](#tab/bicep-cli)

N/A

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep upgrade
```

---

## version

The `version` command returns your installed version:

# [Bicep CLI](#tab/bicep-cli)

```bicepcli
bicep --version
```

If you didn't install the Bicep CLI, you see an error message stating that the Bicep CLI wasn't found.

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep version
```

---

The command shows the version number:

```console
Bicep CLI version 0.29.45 (57a44c0230)
```

## Next steps

To learn more about deploying a Bicep file, see:

* [Deploy - Azure CLI](deploy-cli.md)
* [Deploy - Azure PowerShell](deploy-powershell.md)
* [Deploy - Cloud Shell](deploy-cloud-shell.md)

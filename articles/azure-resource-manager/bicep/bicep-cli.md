---
title: Bicep CLI commands 
description: Learn about the commands that you can use in the Bicep CLI. These commands include building JSON Azure Resource Manager templates from Bicep.
ms.topic: reference
ms.date: 01/10/2025
ms.custom: devx-track-azurecli, devx-track-bicep, devx-track-arm-template
---

# Bicep CLI commands

This article describes the commands you can use in the Bicep CLI. You can execute these commands by using the Azure CLI or by directly invoking Bicep CLI commands. Each method requires a distinct installation process. For more information about installations, see [Azure CLI](./install.md#azure-cli) and [Azure PowerShell](./install.md#azure-powershell).

This guidance shows how to run the commands in the Azure CLI. When running commands in the Azure CLI, start them with `az`. If you're not using the Azure CLI, run the commands without `az` at the start of each. For example, `az bicep build` becomes `bicep build`, and `az bicep version` becomes `bicep --version`.

## build

The `build` command converts a Bicep file to a JSON Azure Resource Manager template (ARM template). Typically, you don't need to run this command because it runs automatically when you deploy a Bicep file. Run it manually when you want to see the JSON ARM template that's created from your Bicep file.

Using any of following Bicep features automatically enables language version 2.0 code generation:

* [user-defined types](../bicep/user-defined-data-types.md)
* [user-defined functions](../bicep/user-defined-functions.md)
* [compile-time imports](../bicep/bicep-import.md)
* [experimental features](../bicep/bicep-config.md#enable-experimental-features)

The following example converts a Bicep file named _main.bicep_ to an ARM template named _main.json_. The new file is created in the same directory as the Bicep file:

```azurecli
az bicep build --file main.bicep
```

The next example saves _main.json_ to a different directory:

```azurecli
az bicep build --file main.bicep --outdir c:\jsontemplates
```

The next example specifies the name and location of the file to be created:

```azurecli
az bicep build --file main.bicep --outfile c:\jsontemplates\azuredeploy.json
```

To print the file to `stdout`, use:

```azurecli
az bicep build --file main.bicep --stdout
```

If your Bicep file includes a module that references an external registry, the `build` command automatically calls [`restore`](#restore). The `restore` command gets the file from the registry and stores it in the local cache.

> [!NOTE]
> The `restore` command doesn't refresh the cache. For more information, see [restore](#restore).

To not call restore automatically, use the `--no-restore` switch:

```azurecli
az bicep build --no-restore <bicep-file>
```

The build process with the `--no-restore` switch fails if one of the external modules isn't already cached:

```error
The module with reference "br:exampleregistry.azurecr.io/bicep/modules/storage:v1" hasn't been restored.
```

When you get this error, either run the `build` command without the `--no-restore` switch, or run `bicep restore` first.

To use the `--no-restore` switch, you must have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.4.X or later.

## build-params

The `build-params` command builds a `.bicepparam` file into a JSON parameters file:

```azurecli
az bicep build-params --file params.bicepparam
```

This command converts a _params.bicepparam_ parameters file into a _params.json_ JSON parameters file.

## decompile

The `decompile` command converts a JSON ARM template to a Bicep file:

```azurecli
az bicep decompile --file main.json
```

This command creates a file named _main.bicep_ in the same directory as _main.json_. If _main.bicep_ exists in the same directory, use the **--force** switch to overwrite the existing Bicep file.

For more information about using this command, see [Decompile JSON ARM template to Bicep](decompile.md).

## decompile-params

The `decompile-params` command decompiles a JSON parameters file to a `.bicepparam` parameters file.

```azurecli
az bicep decompile-params --file azuredeploy.parameters.json --bicep-file ./dir/main.bicep
```

This command decompiles an _azuredeploy.parameters.json_ parameters file into an _azuredeploy.parameters.bicepparam_ file. `--bicep-file` specifies the path to the Bicep file (relative to the `.bicepparam` file) that's referenced in the `using` declaration.

## format

The `format` command formats a Bicep file. It has the same function as the `SHIFT+ALT+F` shortcut in Visual Studio Code.

```azurecli
az bicep format --file main.bicep
```

## generate-params

The `generate-params` command builds a parameters file from the given Bicep file, updates if there's an existing parameters file.

```azurecli
az bicep generate-params --file main.bicep --output-format bicepparam --include-params all
```

This command creates a Bicep parameters file named _main.bicepparam_. The parameters file contains all parameters in the Bicep file, whether configured with default values or not.

```azurecli
az bicep generate-params --file main.bicep --outfile main.parameters.json
```

This command creates a parameters file named _main.parameters.json_. The parameters file only contains the parameters without default values configured in the Bicep file.

## install

The `install` command adds the Bicep CLI to your local environment, and it's only available through the Azure CLI. For more information, see [Install Bicep tools](install.md).

To install the latest version, use:

```azurecli
az bicep install
```

To install a specific version:

```azurecli
az bicep install --version v0.3.255
```

## jsonrpc

The `jsonrpc` command enables running the Bicep CLI with a JSON-RPC interface, allowing for programmatic interaction with structured output and avoiding cold-start delays when compiling multiple files. This setup also supports building libraries to interact with Bicep files programmatically in non-.NET languages.

The wire format for sending and receiving input/output is header-delimited, using the following structure, where `\r` and `\n` represent carriage return and line feed characters:

```
Content-Length: <length>\r\n\r\n<message>\r\n\r\n
```

* `<length>` is the length of the `<message>` string, including the trailing `\r\n\r\n`.
* `<message>` is the raw JSON message.

For example:

```
Content-Length: 72\r\n\r\n{"jsonrpc": "2.0", "id": 0, "method": "bicep/version", "params": {}}\r\n\r\n
```

The following message shows an example for Bicep version.

* The input:

  ```json
  {
    "jsonrpc": "2.0",
    "id": 0,
    "method": "bicep/version",
    "params": {}
  }
  ```
  
* The output:

  ```json
  {
    "jsonrpc": "2.0",
    "id": 0,
    "result": {
      "version": "0.24.211"
    }
  }
  ```

For the available methods & request/response bodies, see [`ICliJsonRpcProtocol.cs`](https://github.com/Azure/bicep/blob/main/src/Bicep.Cli/Rpc/ICliJsonRpcProtocol.cs).
For an example establishing a JSONRPC connection and interacting with Bicep files programmatically using Node, see [`jsonrpc.test.ts`](https://github.com/Azure/bicep/blob/main/src/Bicep.Cli.E2eTests/src/local/jsonrpc.test.ts).

### Usage for named pipe

Use the following syntax to connect to an existing named pipe as a JSONRPC client:

```bicep cli
bicep jsonrpc --pipe <named_pipe>`
```

`<named_pipe>` is an existing named pipe to connect the JSONRPC client to.

To connect to a named pipe on OSX/Linux :

```bicep cli
bicep jsonrpc --pipe /tmp/bicep-81375a8084b474fa2eaedda1702a7aa40e2eaa24b3.sock
```

To connect to a named pipe on Windows :

```bicep cli
bicep jsonrpc --pipe \\.\pipe\\bicep-81375a8084b474fa2eaedda1702a7aa40e2eaa24b3.sock`
```

For more examples, see [C#](https://github.com/Azure/bicep/blob/096c32f9d5c42bfb85dff550f72f3fe16f8142c7/src/Bicep.Cli.IntegrationTests/JsonRpcCommandTests.cs#L24-L50) and [node.js](https://github.com/anthony-c-martin/bicep-node/blob/4769e402f2d2c1da8d27df86cb3d62677e7a7456/src/utils/jsonrpc.ts#L117-L151).

### Usage for TCP socket

Use the following syntax to connect to an existing TCP socket as a JSONRPC client:

```bicep cli
bicep jsonrpc --socket <tcp_socket>
```

`<tcp_socket>` is the socket number to which the JSONRPC client connects.

To connect to a TCP socket:

`bicep jsonrpc --socket 12345`

### Usage for stdin and stdout

Use the following syntax and `stdin` and `stdout` for messages to run the JSONRPC interface:

```bicep cli
bicep jsonrpc --stdio
```

## lint

The `lint` command returns the errors and [linter rule](./linter.md) violations of a Bicep file.

```azurecli
az bicep lint --file main.bicep
```

If your Bicep file includes a module that references an external registry, the `lint` command automatically calls [`restore`](#restore). The `restore` command gets the file from the registry and stores it in the local cache.

> [!NOTE]
> The `restore` command doesn't refresh the cache. For more information, see [restore](#restore).

To not call restore automatically, use the `--no-restore` switch:

```azurecli
az bicep lint --no-restore <bicep-file>
```

The lint process with the `--no-restore` switch fails if one of the external modules isn't already cached:

```error
The module with reference "br:exampleregistry.azurecr.io/bicep/modules/storage:v1" has not been restored.
```

When you get this error, either run the `lint` command without the `--no-restore` switch or run `bicep restore` first.

## list-versions

The `list-versions` command returns all available versions of the Bicep CLI. Use this command to see if you want to [upgrade](#upgrade) or [install](#install) a new version. This command is only available through the Azure CLI.

```azurecli
az bicep list-versions
```

The command returns an array of available versions:

```azurecli
[
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
  "v0.16.2",
  "v0.16.1",
  "v0.15.31",
  "v0.14.85",
  "v0.14.46",
  "v0.14.6",
  "v0.13.1",
  "v0.12.40",
  "v0.12.1",
  "v0.11.1",
  "v0.10.61",
  "v0.10.13",
  "v0.9.1",
  "v0.8.9",
  "v0.8.2",
  "v0.7.4"
]
```

## publish

The `publish` command adds a module to a registry. The Azure container registry must exist and the account publishing to the registry must have the correct permissions. For more information about setting up a module registry, see [Use private registry for Bicep modules](private-module-registry.md). To publish a module, the account must have the correct profile and permissions to access the registry. You can configure the profile and credential precedence for authenticating to the registry in the [Bicep config file](./bicep-config-modules.md#configure-profiles-and-credentials).

After publishing the file to the registry, you can [reference it in a module](modules.md#file-in-registry).

You must have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.14.X or later to use the `publish` command and the `--documentationUri`/`-d` parameter.

To publish a module to a registry, use:

```azurecli
az bicep publish --file <bicep-file> --target br:<registry-name>.azurecr.io/<module-path>:<tag> --documentationUri <documentation-uri>
```

For example:

```azurecli
az bicep publish --file storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 --documentationUri https://www.contoso.com/exampleregistry.html
```

The `publish` command doesn't recognize aliases specified in a [_bicepconfig.json_ file](bicep-config-modules.md). Provide the full module path.

> [!WARNING]
> Publishing to the same target overwrites the old module. We recommend that you increment the version when updating.

## restore

When your Bicep file uses modules that are published to a registry, the `restore` command gets copies of all the required modules from the registry. It stores those copies in a local cache. A Bicep file can only be built when the external files are available in the local cache. Normally, running restore isn't necessary as it's automatically triggered by the build process.

To restore external modules to the local cache, the account must have the correct profile and permissions to access the registry. You can configure the [profile and credential precedence](./bicep-config-modules.md#configure-profiles-and-credentials) for authenticating to the registry in the Bicep config file.

To use the `restore` command, you must have [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.14.X or later. At this time, this command is only available when calling the Bicep CLI directly. It isn't currently available through the Azure CLI.

To manually restore the external modules for a file, use:

```azurecli
az bicep restore --file <bicep-file> [--force]
```

The Bicep file you provide is the file you wish to deploy. It must contain a module that links to a registry. For example, you can restore the following file:

```bicep
module stgModule 'br:exampleregistry.azurecr.io/bicep/modules/storage:v1' = {
  name: 'storageDeploy'
  params: {
    storagePrefix: 'examplestg1'
  }
}
```

The local cache is found in:

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

## upgrade

The `upgrade` command updates your installed version with the latest version. This command is only available through the Azure CLI.

```azurecli
az bicep upgrade
```

## version

The `version` command returns your installed version:

```azurecli
az bicep version
```

The command shows the version number:

```azurecli
Bicep CLI version 0.22.6 (d62b94db31)
```

To call this command directly through the Bicep CLI, use:

```Bicep CLI
bicep --version
```

If the Bicep CLI hasn't been installed, you'll see an error message stating that the Bicep CLI wasn't found.

## Next steps

To learn more about deploying a Bicep file, see:

* [Deploy - Azure CLI](deploy-cli.md)
* [Deploy - Azure PowerShell](deploy-powershell.md)
* [Deploy - Cloud Shell](deploy-cloud-shell.md)

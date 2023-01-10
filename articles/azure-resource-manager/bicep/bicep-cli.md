---
title: Bicep CLI commands and overview
description: Describes the commands that you can use in the Bicep CLI. These commands include building Azure Resource Manager templates from Bicep.
ms.topic: conceptual
ms.date: 09/14/2022
---

# Bicep CLI commands

This article describes the commands you can use in the Bicep CLI. You must have the [Bicep CLI installed](./install.md) to run the commands.

You can either run the Bicep CLI commands through Azure CLI or by calling Bicep directly. This article shows how to run the commands in Azure CLI. When running through Azure CLI, you start the commands with `az`. If you're not using Azure CLI, run the commands without `az` at the start of the command. For example, `az bicep build` becomes `bicep build`.

## build

The `build` command converts a Bicep file to an Azure Resource Manager template (ARM template). Typically, you don't need to run this command because it runs automatically when you deploy a Bicep file. Run it manually when you want to see the ARM template JSON that is created from your Bicep file.

The following example converts a Bicep file named _main.bicep_ to an ARM template named _main.json_. The new file is created in the same directory as the Bicep file.

```azurecli
az bicep build --file main.bicep
```

The next example saves _main.json_ to a different directory.

```azurecli
az bicep build --file main.bicep --outdir c:\jsontemplates
```

The next example specifies the name and location of the file to create.

```azurecli
az bicep build --file main.bicep --outfile c:\jsontemplates\azuredeploy.json
```

To print the file to `stdout`, use:

```azurecli
az bicep build --file main.bicep --stdout
```

If your Bicep file includes a module that references an external registry, the build command automatically calls [restore](#restore). The restore command gets the file from the registry and stores it in the local cache.

> [!NOTE]
> The restore command doesn't refresh the cache. For more information, see [restore](#restore).

To not call restore automatically, use the `--no-restore` switch:

```azurecli
az bicep build --no-restore <bicep-file>
```

The build process with the `--no-restore` switch fails if one of the external modules isn't already cached:

```error
The module with reference "br:exampleregistry.azurecr.io/bicep/modules/storage:v1" has not been restored.
```

When you get this error, either run the `build` command without the `--no-restore` switch or run `bicep restore` first.

To use the `--no-restore` switch, you must have Bicep CLI version **0.4.1008 or later**.

## decompile

The `decompile` command converts ARM template JSON to a Bicep file.

```azurecli
az bicep decompile --file main.json
```

The command creates a file named _main.bicep_ in the same directory as _main.json_. If _main.bicep_ exists in the same directory, use the **--force** switch to overwrite the existing Bicep file.

For more information about using this command, see [Decompiling ARM template JSON to Bicep](decompile.md).

## generate-params

The `generate-params` command builds *.parameters.json* file from the given bicep file, updates if there is an existing parameters.json file.

```azurecli
az bicep generate-params --file main.bicep
```

The command creates a parameter file named _main.parameters.json_. The parameter file only contains the parameters without default values configured in the Bicep file.

## install

The `install` command adds the Bicep CLI to your local environment. For more information, see [Install Bicep tools](install.md). This command is only available through Azure CLI.

To install the latest version, use:

```azurecli
az bicep install
```

To install a specific version:

```azurecli
az bicep install --version v0.3.255
```

## list-versions

The `list-versions` command returns all available versions of the Bicep CLI. Use this command to see if you want to [upgrade](#upgrade) or [install](#install) a new version. This command is only available through Azure CLI.

```azurecli
az bicep list-versions
```

The command returns an array of available versions.

```azurecli
[
  "v0.4.1",
  "v0.3.539",
  "v0.3.255",
  "v0.3.126",
  "v0.3.1",
  "v0.2.328",
  "v0.2.317",
  "v0.2.212",
  "v0.2.59",
  "v0.2.14",
  "v0.2.3",
  "v0.1.226-alpha",
  "v0.1.223-alpha",
  "v0.1.37-alpha",
  "v0.1.1-alpha"
]
```

## publish

The `publish` command adds a module to a registry. The Azure container registry must exist and the account publishing to the registry must have the correct permissions. For more information about setting up a module registry, see [Use private registry for Bicep modules](private-module-registry.md).

After publishing the file to the registry, you can [reference it in a module](modules.md#file-in-registry).

To use the publish command, you must have Bicep CLI version **0.4.1008 or later**.

To publish a module to a registry, use:

```azurecli
az bicep publish --file <bicep-file> --target br:<registry-name>.azurecr.io/<module-path>:<tag>
```

For example:

```azurecli
az bicep publish --file storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1
```

The `publish` command doesn't recognize aliases that you've defined in a [bicepconfig.json](bicep-config-modules.md) file. Provide the full module path.

> [!WARNING]
> Publishing to the same target overwrites the old module. We recommend that you increment the version when updating.

## restore

When your Bicep file uses modules that are published to a registry, the `restore` command gets copies of all the required modules from the registry. It stores those copies in a local cache. A Bicep file can only be built when the external files are available in the local cache. Typically, you don't need to run `restore` because it's called automatically by `build`.

To restore external modules to the local cache, the account must have the correct permissions to access the registry. You can configure the credential precedence for authenticating to the registry in the [Bicep config file](./bicep-config-modules.md#credentials-for-publishingrestoring-modules).

To use the restore command, you must have Bicep CLI version **0.4.1008 or later**. This command is currently only available when calling the Bicep CLI directly. It's not currently available through the Azure CLI command.

To manually restore the external modules for a file, use:

```powershell
bicep restore <bicep-file> [--force]
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

- On Windows

    ```path
    %USERPROFILE%\.bicep\br\<registry-name>.azurecr.io\<module-path\<tag>
    ```

- On Linux

    ```path
    /home/<username>/.bicep
    ```

The `restore` command doesn't refresh the cache if a module is already cached. To fresh the cache, you can either delete the module path from the cache or use the `--force` switch with the `restore` command.

## upgrade

The `upgrade` command updates your installed version with the latest version. This command is only available through Azure CLI.

```azurecli
az bicep upgrade
```

## version

The `version` command returns your installed version.

```azurecli
az bicep version
```

The command shows the version number.

```azurecli
Bicep CLI version 0.4.1008 (223b8d227a)
```

To call this command directly through the Bicep CLI, use:

```powershell
bicep --version
```

If you haven't installed Bicep CLI, you see an error indicating Bicep CLI wasn't found.

## Next steps

To learn about deploying a Bicep file, see:

- [Azure CLI](deploy-cli.md)
- [Cloud Shell](deploy-cloud-shell.md)
- [PowerShell](deploy-powershell.md)

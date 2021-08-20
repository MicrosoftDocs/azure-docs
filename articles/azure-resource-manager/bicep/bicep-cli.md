---
title: Bicep CLI commands and overview
description: Describes the commands that you can use in the Bicep CLI. These commands include building Azure Resource Manager templates from Bicep.
ms.topic: conceptual
ms.date: 06/01/2021
---
# Bicep CLI commands

This article describes the commands you can use in the Bicep CLI. You must have the [Bicep CLI installed](./install.md) to run the commands.

This article shows how to run the commands in Azure CLI. If you're not using Azure CLI, run the commands without `az` at the start of the command. For example, `az bicep version` becomes ``bicep version``.

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

## decompile

The `decompile` command converts ARM template JSON to a Bicep file.

```azurecli
az bicep decompile --file main.json
```

For more information about using this command, see [Decompiling ARM template JSON to Bicep](decompile.md).

## install

The `install` command adds the Bicep CLI to your local environment. For more information, see [Install Bicep tools](install.md).

To install the latest version, use:

```azurecli
az bicep install
```

To install a specific version:

```azurecli
az bicep install --version v0.3.255
```

## list-versions

The `list-versions` command returns all available versions of the Bicep CLI. Use this command to see if you want to [upgrade](#upgrade) or [install](#install) a new version.

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

## upgrade

The `upgrade` command updates your installed version with the latest version.

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
Bicep CLI version 0.4.1 (e2387595c9)
```

If you haven't installed Bicep CLI, you see an error indicating Bicep CLI wasn't found.

## Next steps

To learn about deploying a Bicep file, see:

* [Azure CLI](deploy-cli.md)
* [Cloud Shell](deploy-cloud-shell.md)
* [PowerShell](deploy-powershell.md)

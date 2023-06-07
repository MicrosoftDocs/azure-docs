---
# Mandatory fields.
title: Azure Digital Twins CLI command set
titleSuffix: Azure Digital Twins
description: Learn about the Azure Digital Twins CLI command set.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/31/2022
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins CLI command set

Apart from managing your Azure Digital Twins instance in the Azure portal, Azure Digital Twins also has a command set for the [Azure CLI](/cli/azure/what-is-azure-cli) that you can use to do most major actions with the service. This article covers the Azure CLI command set for Azure Digital twins including its uses, how to get it, and the requirements for using it.

Some of the actions you can do using the command set include:
* Managing an Azure Digital Twins instance
* Managing models
* Managing digital twins
* Managing twin relationships
* Configuring endpoints
* Managing [routes](concepts-route-events.md)
* Configuring [security](concepts-security.md) via Azure role-based access control (Azure RBAC)

The command set is called `az dt`, and is part of the [Azure IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension). You can view the full list of commands and their usage as part of the reference documentation for the `az iot` command set: [az dt command reference](/cli/azure/dt).

## Uses (deploy and validate)

Apart from generally managing your instance, the CLI is also a useful tool for deployment and validation.
* The control plane commands can be used to make the deployment of a new instance repeatable or automated.
* The data plane commands can be used to quickly check values in your instance, and verify that operations completed as expected.

## Get the command set

The Azure Digital Twins commands are part of the [Azure IoT extension for Azure CLI (azure-iot)](https://github.com/Azure/azure-iot-cli-extension), so follow these steps to make sure you have the latest `azure-iot` extension with the `az dt` commands.

### CLI version requirements

If you're using the Azure CLI with PowerShell, your Azure CLI version should be 2.3.1 or above as a requirement of the extension package.

You can check the version of your Azure CLI with this CLI command:
```azurecli
az --version
```

For instructions on how to install or update the Azure CLI to a newer version, see [Install the Azure CLI](/cli/azure/install-azure-cli).

### Get the extension

The Azure CLI will automatically prompt you to install the extension on the first use of a command that requires it.

Otherwise, you can use the following command to install the extension yourself at any time (or update it if it turns out that you already have an older version). The command can be run in either the [Azure Cloud Shell](../cloud-shell/overview.md) or a [local Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az extension add --upgrade --name azure-iot
```

## Use special characters in different shells

Some `az dt` commands use special characters that may have to be escaped for proper parsing in certain shell environments. Use the tips in this section to help you know when to do this in your shell of choice.

### Bash

Use these special character tips for Bash environments.

#### Queries

In many twin queries, the `$` character is used to reference the `$dtId` property of a twin. When using the [az dt twin query](/cli/azure/dt/twin#az-dt-twin-query) command to query in the Cloud Shell Bash environment, escape the `$` character with a backslash (`\`).

Here is an example of querying for a twin with a CLI command in the Cloud Shell Bash environment:

```azurecli
az dt twin query --dt-name <instance-hostname-or-name> --query-command "SELECT * FROM DigitalTwins T Where T.\$dtId = 'room0'"
```

### PowerShell

Use these special character tips for PowerShell environments.

#### Inline JSON

Some commands, like [az dt twin create](/cli/azure/dt/twin#az-dt-twin-create), allow you to enter twin information in the form of inline JSON. When entering inline JSON in the PowerShell environment, escape double quote characters (`"`) inside the JSON with a backslash (`\`). 

Here is an example of creating a twin with a CLI command in PowerShell:

```azurecli
az dt twin create --dt-name <instance-hostname-or-name> --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties '{\"Temperature\": 0.0}'
```

>[!TIP]
>Many of the commands that support inline JSON also support input as a file path, which can help you avoid shell-specific text requirements.

#### Queries

In many twin queries, the `$` character is used to reference the `$dtId` property of a twin. When using the [az dt twin query](/cli/azure/dt/twin#az-dt-twin-query) command to query in a PowerShell environment, escape the `$` character with a backtick character.

Here is an example of querying for a twin with a CLI command in PowerShell:
```azurecli
az dt twin query --dt-name <instance-hostname-or-name> --query-command "SELECT * FROM DigitalTwins T Where T.`$dtId = 'room0'"
```

### Windows CMD

Use these special character tips for the local Windows CMD.

#### Inline JSON

Some commands, like [az dt twin create](/cli/azure/dt/twin#az-dt-twin-create), allow you to enter twin information in the form of inline JSON. When entering inline JSON in a local Windows CMD window, enclose the parameter value with double quotes (`"`) instead of single quotes (`'`), and escape double quote characters inside the JSON with a backslash (`\`). 

Here is an example of creating a twin with a CLI command in the local Windows CMD:

```azurecli
az dt twin create --dt-name <instance-hostname-or-name> --dtmi "dtmi:contosocom:DigitalTwins:Thermostat;1" --twin-id thermostat67 --properties "{\"Temperature\": 0.0}"
```

>[!TIP]
>Many of the commands that support inline JSON also support input as a file path, which can help you avoid shell-specific text requirements.

## Next steps

Explore the CLI and its full set of commands through the reference docs:
* [az dt command reference](/cli/azure/dt)
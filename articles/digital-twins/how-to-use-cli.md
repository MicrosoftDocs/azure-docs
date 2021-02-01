---
# Mandatory fields.
title: Use the Azure Digital Twins CLI
titleSuffix: Azure Digital Twins
description: See how to get started with and use the Azure Digital Twins CLI.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 05/25/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use the Azure Digital Twins CLI

In addition to managing your Azure Digital Twins instance in the Azure portal, Azure Digital Twins has a **command set for the [Azure CLI](/cli/azure/what-is-azure-cli)** that you can use to perform most major actions with the service, including:
* Managing an Azure Digital Twins instance
* Managing models
* Managing digital twins
* Managing twin relationships
* Configuring endpoints
* Managing [routes](concepts-route-events.md)
* Configuring [security](concepts-security.md) via Azure role-based access control (Azure RBAC)

The command set is called **az dt**, and is part of the [Azure IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension). You can view the full list of commands and their usage as part of the reference documentation for the `az iot` command set: [*az dt* command reference](/cli/azure/ext/azure-iot/dt?preserve-view=true&view=azure-cli-latest).

## Uses (deploy and validate)

In addition to generally managing your instance, the CLI is also a useful tool for deployment and validation.
* The control plane commands can be used to make the deployment of a new instance repeatable or automated.
* The data plane commands can be used to quickly check values in your instance, and verify that operations completed as expected.

## Get the command set

The Azure Digital Twins commands are part of the [Azure IoT extension for Azure CLI (azure-iot)](https://github.com/Azure/azure-iot-cli-extension), so follow these steps to make sure you have the latest `azure-iot` extension with the **az dt** commands.

### CLI version requirements

If you're using the Azure CLI with PowerShell, the extension package requires that your Azure CLI version be **2.3.1** or above.

You can check the version of your Azure CLI with this CLI command:
```azurecli
az --version
```

For instructions on how to install or update the Azure CLI to a newer version, see [*Install the Azure CLI*](/cli/azure/install-azure-cli).

### Get the extension

You can make sure you have the latest version of the `azure-iot` extension with these steps. You can run these commands in the [Azure Cloud Shell](../cloud-shell/overview.md) or a [local Azure CLI](/cli/azure/install-azure-cli?preserve-view=true&view=azure-cli-latest).

[!INCLUDE [digital-twins-cloud-shell-extensions.md](../../includes/digital-twins-cloud-shell-extensions.md)]

## Next steps

Explore the CLI and its full set of commands through the reference docs:
* [*az dt* command reference](/cli/azure/ext/azure-iot/dt?preserve-view=true&view=azure-cli-latest)
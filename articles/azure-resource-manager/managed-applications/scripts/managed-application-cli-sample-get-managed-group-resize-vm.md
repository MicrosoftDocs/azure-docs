---
title:  Get managed resource group & resize VMs - Azure CLI
description: Provides Azure CLI sample script that gets a managed resource group in an Azure Managed Application. The script resizes VMs.
author: tfitzmac

ms.devlang: azurecli
ms.topic: sample
ms.date: 10/25/2017
ms.author: tomfitz
---

# Get resources in a managed resource group and resize VMs with Azure CLI

This script retrieves resources from a managed resource group, and resizes the VMs in that resource group.


[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../../cli_scripts/managed-applications/get-application/get-application.sh "Get application")]


## Script explanation

This script uses the following commands to deploy the managed application. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az managedapp list](https://docs.microsoft.com/cli/azure/managedapp#az-managedapp-list) | List managed applications. Provide query values to focus the results. |
| [az resource list](https://docs.microsoft.com/cli/azure/resource#az-resource-list) | List resources. Provide a resource group and query values to focus the result. |
| [az vm resize](https://docs.microsoft.com/cli/azure/vm#az-vm-resize) | Update a virtual machine's size. |


## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

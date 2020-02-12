---
title: CLI example - create a managed instance in Azure SQL Database 
description: Azure CLI example script to create a managed instance in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 03/25/2019
---
# Use CLI to create an Azure SQL Database managed instance

This Azure CLI script example creates an Azure SQL Database managed instance in a dedicated subnet within a new virtual network. It also configures a route table and a network security group for the virtual network. Once the script has been successfully run, the managed instance can be accessed from within the virtual network or from an on-premises environment. See [Configure Azure VM to connect to an Azure SQL Database Managed Instance](../sql-database-managed-instance-configure-vm.md) and [Configure a point-to-site connection to an Azure SQL Database Managed Instance from on-premises](../sql-database-managed-instance-configure-p2s.md).

> [!IMPORTANT]
> For limitations, see [supported regions](../sql-database-managed-instance-resource-limits.md#supported-regions) and [supported subscription types](../sql-database-managed-instance-resource-limits.md#supported-subscription-types).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/managed-instance/create-managed-instance.sh "Create managed instance")]

## Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) | Creates a virtual network. |
| [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) | Adds a subnet configuration to a virtual network. |
| [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) | Gets a virtual network in a resource group. |
| [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) | Sets the goal state for a virtual network. |
| [az network vnet subnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show) | Gets a subnet in a virtual network |
| [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) | Configures the goal state for a subnet configuration in a virtual network. |
| [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create) | Creates a route table. |
| [az network route-table show](/cli/azure/network/route-table#az-network-route-table-show) | Gets route tables. |
| [az network route-table update](/cli/azure/network/route-table#az-network-route-table-update) | Sets the goal state for a route table. |
| [az sql mi create](/cli/azure/sql/mi#az-sql-mi-create) | Creates an Azure SQL Database managed instance. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).

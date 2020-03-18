---
title: CLI example- Failover group - Azure SQL Database managed instance 
description: Azure CLI example script to create an Azure SQL Database managed instance, add it to a failover group, and test failover. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: MashaMSFT
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 07/16/2019
---
# Use CLI to add an Azure SQL Database managed instance to a failover group

This PowerShell script example creates two managed instances, adds them to a failover group, and then tests failover from the primary managed instance to the secondary managed instance.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample scripts

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/failover-groups/add-managed-instance-to-failover-group-az-cli.sh "Add managed instance to a failover group")]

## Clean up deployment

Use the following command to remove the resource group and all resources associated with it. You will need to remove the resource group twice. Removing the resource group the first time will remove the managed instance and virtual clusters but will then fail with the error message `az group delete : Long running operation failed with status 'Conflict'.`. Run the az group delete command a second time to remove any residual resources as well as the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) | Creates a virtual network.  |
| [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) | Adds a subnet configuration to a virtual network. |
| [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) | Gets a virtual network in a resource group. |
| [az network vnet subnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show) | Gets a subnet in a virtual network. |
| [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) | Creates a network security group. |
| [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create) | Creates a route table. |
| [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) | Updates a subnet configuration for a virtual network. |
| [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) | Updates a virtual network. |
| [az network nsg show](/cli/azure/network/nsg#az-network-nsg-show) | Gets a network security group. |
| [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create)| Adds a network security rule configuration to a network security group. |
| [az network nsg rule update](/cli/azure/network/nsg#az-network-nsg-update) | Updates a network security group. |
| [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create) | Adds a route to a route table. |
| [az network route-table update](/cli/azure/network/route-table#az-network-route-table-update) | Updates a route table. |
| [az sql mi create](/cli/azure/sql/mi#az-sql-mi-create) | Creates an Azure SQL Database managed instance. |
| [az sql mi show](/cli/azure/sql/mi#az-sql-mi-show)| Returns information about Azure SQL Managed Database Instance. |
| [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) | Creates a public IP address. |
| [az network vnet-gateway create](/cli/azure/network/vnet-gateway#az-network-vnet-gateway-create) | Creates a Virtual Network Gateway |
| [az sql instance-failover-group create](/cli/azure/sql/instance-failover-group#az-sql-instance-failover-group-create) | Creates a new Azure SQL Database managed instance failover group. |
| [az sql instance-failover-group show](/cli/azure/sql/instance-failover-group#az-sql-instance-failover-group-show) | Gets or lists managed instance failover groups.|
| [az sql instance-failover-group set-primary](/cli/azure/sql/instance-failover-group#az-sql-instance-failover-group-set-primary) | Executes a failover of a managed instance failover group. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).

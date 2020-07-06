---
title: "Azure CLI: Add managed instance to failover group"  
description: Azure CLI example script to create an Azure SQL Managed Instance, add it to a failover group, and test failover.  
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
# Use CLI to add an Azure SQL Managed Instance to a failover group

This Azure CLI example creates two managed instances, adds them to a failover group, and then tests failover from the primary managed instance to the secondary managed instance.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample scripts

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/failover-groups/add-managed-instance-to-failover-group-az-cli.sh "Add managed instance to a failover group")]

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it. You will need to remove the resource group twice. Removing the resource group the first time will remove the managed instance and virtual clusters but will then fail with the error message `az group delete : Long running operation failed with status 'Conflict'.`. Run the az group delete command a second time to remove any residual resources as well as the resource group.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az network vnet](/cli/azure/network/vnet) | Virtual network commands.  |
| [az network vnet subnet](/cli/azure/network/vnet/subnet) | Virtual network subnet commands. |
| [az network nsg](/cli/azure/network/nsg) | Network security group commands. |
| [az network nsg rule](/cli/azure/network/nsg/rule)| Network security rule commands. |
| [az network route-table](/cli/azure/network/route-table) | Route table commands. |
| [az sql mi](/cli/azure/sql/mi) | SQL Managed Instance commands. |
| [az network public-ip](/cli/azure/network/public-ip) | Network public IP address commands. |
| [az network vnet-gateway](/cli/azure/network/vnet-gateway) | Virtual Network Gateway commands |
| [az sql instance-failover-group](/cli/azure/sql/instance-failover-group) | SQL Managed Instance failover group commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../azure-sql/database/az-cli-script-samples-content-guide.md).

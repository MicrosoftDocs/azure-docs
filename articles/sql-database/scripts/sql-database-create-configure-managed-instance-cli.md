---
title: "Azure CLI: Create a managed instance" 
description: Azure CLI example script to create a managed instance in Azure SQL Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 03/25/2019
---
# Use CLI to create an Azure SQL Managed Instance

This Azure CLI script example creates an Azure SQL Managed Instance in a dedicated subnet within a new virtual network. It also configures a route table and a network security group for the virtual network. Once the script has been successfully run, the managed instance can be accessed from within the virtual network or from an on-premises environment. See [Configure Azure VM to connect to an Azure SQL Managed Instance]../../azure-sql/managed-instance/connect-vm-instance-configure.md) and [Configure a point-to-site connection to an Azure SQL Managed Instance from on-premises](../../azure-sql/managed-instance/point-to-site-p2s-configure.md).

> [!IMPORTANT]
> For limitations, see [supported regions](../../azure-sql/managed-instance/resource-limits.md#supported-regions) and [supported subscription types](../../azure-sql/managed-instance/resource-limits.md#supported-subscription-types).

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/managed-instance/create-managed-instance.sh "Create managed instance")]

### Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az network vnet](/cli/azure/network/vnet) | Virtual network commands. |
| [az network vnet subnet](/cli/azure/network/vnet/subnet) | Virtual network subnet commands. |
| [az network route-table](/cli/azure/network/route-table) | Network route table commands. |
| [az sql mi](/cli/azure/sql/mi) | SQL Managed Instance commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../azure-sql/database/az-cli-script-samples-content-guide.md).

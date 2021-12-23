---
title: "Azure CLI example: Create a managed instance" 
description: Use this Azure CLI example script to create a managed instance in Azure SQL Managed Instance
services: sql-managed-instance
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.custom: devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: urosmil 
ms.author: urmilano
ms.reviewer:  mathoma
ms.date: 12/07/2021
---
# Use CLI to create an Azure SQL Managed Instance

This Azure CLI script example creates an Azure SQL Managed Instance in a dedicated subnet within a new virtual network. It also configures a route table and a network security group for the virtual network. Once the script has been successfully run, the managed instance can be accessed from within the virtual network or from an on-premises environment. See [Configure Azure VM to connect to an Azure SQL Managed Instance]../../azure-sql/managed-instance/connect-vm-instance-configure.md) and [Configure a point-to-site connection to an Azure SQL Managed Instance from on-premises](../../../azure-sql/managed-instance/point-to-site-p2s-configure.md).

> [!IMPORTANT]
> For limitations, see [supported regions](../../../azure-sql/managed-instance/resource-limits.md#supported-regions) and [supported subscription types](../../../azure-sql/managed-instance/resource-limits.md#supported-subscription-types).

If you choose to install and use Azure CLI locally, this article requires that you are running Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

> [!IMPORTANT]
> When running Bash on Windows, run this script from within a Docker container.

## Sample script

### Sign in to Azure

For this script, use Azure CLI locally as it takes too long to run in Cloud Shell. Use the following script to sign in using a specific subscription. [!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
subscription="<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

For more information, see [set active subscription](/cli/azure/account#az_account_set) or [log in interactively](/cli/azure/reference-index#az_login)

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/managed-instance/create-managed-instance.sh" range="4-51":::

### Clean up resources

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az_vm_extension_set) command- unless you have additional needs for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az network vnet](/cli/azure/network/vnet) | Virtual network commands. |
| [az network vnet subnet](/cli/azure/network/vnet/subnet) | Virtual network subnet commands. |
| [az network route-table](/cli/azure/network/route-table) | Network route table commands. |
| [az sql mi](/cli/azure/sql/mi) | SQL Managed Instance commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../../azure-sql/database/az-cli-script-samples-content-guide.md).

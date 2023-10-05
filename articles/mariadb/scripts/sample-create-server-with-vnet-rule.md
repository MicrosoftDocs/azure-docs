---
title: CLI script - Create server with vNet rule - Azure Database for MariaDB
description: This sample CLI script creates an Azure Database for MariaDB server with a service endpoint on a virtual network and configures a vNet rule.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 01/26/2022 
---

# Create a MariaDB server and configure a vNet rule using the Azure CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](../includes/azure-database-for-mariadb-deprecation.md)]

This sample CLI script creates an Azure Database for MariaDB server and configures a vNet rule.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mariadb/create-mariadb-server-vnet/create-mariadb-server.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az mariadb server create](/cli/azure/mariadb/server#az-mariadb-server-create) | Creates a MariaDB server that hosts the databases. |
| [az network vnet list-endpoint-services](/cli/azure/network/vnet#az-network-vnet-list-endpoint-services) | List which services support VNET service tunneling in a given region. |
| [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) | Creates a virtual network. |
| [az network vnet subnet create](/cli/azure/network/vnet#az-network-vnet-subnet-create) | Create a subnet and associate an existing NSG and route table. |
| [az network vnet subnet show](/cli/azure/network/vnet#az-network-vnet-subnet-show) | Shows details of a subnet. |
| [az mariadb server vnet-rule create](/cli/azure/mariadb/server/vnet-rule#az-mariadb-server-vnet-rule-create) | Create a virtual network rule to allows access to a MariaDB server. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try additional scripts: [Azure CLI samples for Azure Database for MariaDB](../sample-scripts-azure-cli.md).

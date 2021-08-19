---
title: CLI script - Scale server - Azure Database for MariaDB 
description: This sample CLI script scales Azure Database for MariaDB server to a different performance level after querying the metrics.
author: savjani
ms.author: pariks
ms.service: mariadb
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 12/02/2019
---

# Monitor and scale an Azure Database for MariaDB server using Azure CLI
This sample CLI script scales compute and storage for a single Azure Database for MariaDB server after querying the metrics. Compute can scale up or down. Storage can only scale up.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script
Update the script with your subscription ID.
[!code-azurecli-interactive[main](../../../cli_scripts/mariadb/scale-mariadb-server/scale-mariadb-server.sh "Create and scale Azure Database for MariaDB.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/mariadb/scale-mariadb-server/delete-mariadb.sh  "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az mariadb server create](/cli/azure/mariadb/server#az_mariadb_server_create) | Creates a MariaDB server that hosts the databases. |
| [az mariadb server update](/cli/azure/mariadb/server#az_mariadb_server_update) | Updates properties of the MariaDB server. |
| [az monitor metrics list](/cli/azure/monitor/metrics#az_monitor_metrics_list) | List the metric value for the resources. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps
- Learn more about [Azure Database for MariaDB compute and storage](../concepts-pricing-tiers.md)
- Try additional scripts: [Azure CLI samples for Azure Database for MariaDB](../sample-scripts-azure-cli.md)
- Learn more about the [Azure CLI](/cli/azure)

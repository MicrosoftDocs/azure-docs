---
title: CLI script - Scale server - Azure Database for MySQL
description: This sample CLI script scales Azure Database for MySQL server to a different performance level after querying the metrics.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc
ms.date: 12/02/2019
---

# Monitor and scale an Azure Database for MySQL server using Azure CLI
This sample CLI script scales compute and storage for a single Azure Database for MySQL server after querying the metrics. Compute can scale up or down. Storage can only scale up.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you choose to run the CLI locally, this article requires Azure CLI version 2.0 or later. Check the version by running `az --version`. See [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade your version of Azure CLI. 

## Sample script
Update the script with your subscription ID.
[!code-azurecli-interactive[main](../../../cli_scripts/mysql/scale-mysql-server/scale-mysql-server.sh "Create and scale Azure Database for MySQL.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/mysql/scale-mysql-server/delete-mysql.sh  "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az mysql server create](/cli/azure/mysql/server#az-mysql-server-create) | Creates a MySQL server that hosts the databases. |
| [az mysql server update](/cli/azure/mysql/server#az-mysql-server-update) | Updates properties of the MySQL server. |
| [az monitor metrics list](/cli/azure/monitor/metrics#az-monitor-metrics-list) | List the metric value for the resources. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps
- Learn more about [Azure Database for MySQL compute and storage](../concepts-pricing-tiers.md)
- Try additional scripts: [Azure CLI samples for Azure Database for MySQL](../sample-scripts-azure-cli.md)
- Learn more about the [Azure CLI](/cli/azure)
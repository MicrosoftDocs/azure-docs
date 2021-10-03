---
title: Azure CLI script - Scale and monitor Azure Database for PostgreSQL
description: Azure CLI Script Sample - Scale Azure Database for PostgreSQL server to a different performance level after querying the metrics.
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.devlang: azurecli
ms.custom: mvc, devx-track-azurecli
ms.topic: sample
ms.date: 08/07/2019
---
# Monitor and scale a single PostgreSQL server using Azure CLI
This sample CLI script scales compute and storage for a single Azure Database for PostgreSQL server after querying the metrics. Compute can scale up or down. Storage can only scale up. 

> [!IMPORTANT] 
> Storage can only be scaled up, not down.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script
Update the script with your subscription ID.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/scale-postgresql-server/scale-postgresql-server.sh "Create and scale Azure Database for PostgreSQL.")]

## Clean up deployment
Use the following command to remove the resource group and all resources associated with it after the script has been run. 
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/scale-postgresql-server/delete-postgresql.sh "Delete the resource group.")]

## Script explanation
This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az postgres server create](/cli/azure/postgres/server#az_postgres_server_create) | Creates a PostgreSQL server that hosts the databases. |
| [az postgres server update](/cli/azure/postgres/server#az_postgres_server_update) | Updates properties of the PostgreSQL server. |
| [az monitor metrics list](/cli/azure/monitor/metrics) | List the metric value for the resources. |
| [az group delete](/cli/azure/group) | Deletes a resource group including all nested resources. |

## Next steps
- Learn more about [Azure Database for PostgreSQL compute and storage](../concepts-pricing-tiers.md)
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL](../sample-scripts-azure-cli.md)
- Learn more about the [Azure CLI](/cli/azure)

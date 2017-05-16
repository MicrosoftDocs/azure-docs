---
title: "Azure CLI Script-Scale Azure Database for PostgreSQL | Microsoft Docs"
description: "Azure CLI Script Sample - Scale Azure Database for PostgreSQL server to a different performance level after querying the metrics."
services: postgresql
author: salonisonpal
ms.author: salonis
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.devlang: azurecli
ms.topic: article
ms.date: 05/15/2017
---
# Monitor and scale a single PostgreSQL server using Azure CLI
This sample CLI script scales a single Azure Database for PostgreSQL server to a different performance level after querying the metrics. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script
In this sample script, edit the highlighted lines to customize the admin username and password.
[!code-azurecli-interactive[main](../../../cli_scripts/postgresql/scale-postgresql-server/scale-postgresql-server.sh?highlight=15-16 "Create and scale Azure Database for PostgreSQL.")]

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myresourcegroup
```
## Script explanation
This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az postgres server create](/cli/azure/postgres/server#create) | Creates a PostgreSQL server that hosts the databases. |
| [az monitor metrics list](/cli/azure/monitor/metrics#list) | List the metric value for the resources. |
| [az group delete](/cli/azure/group#delete) | Deletes a resource group including all nested resources. |

## Next steps
- For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
- Additional Azure Database for PostgreSQL CLI script samples can be found in the [Azure Database for PostgreSQL documentation](../sample-scripts-azure-cli.md).
- For more information on scaling, see [Service Tiers](../concepts-service-tiers.md) and [Compute Units and Storage Units](../concepts-compute-unit-and-storage.md).
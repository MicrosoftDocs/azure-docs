---
title: CLI example-create an Azure SQL database 
description: Use this Azure CLI example script to create a SQL database.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 06/25/2019
---
# Use CLI to create a single Azure SQL database and configure a firewall rule

This Azure CLI script example creates an Azure SQL database and configure a server-level firewall rule. Once the script has been successfully run, the SQL Database can be accessed from all Azure services and the configured IP address.

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

### Run the script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh "Create SQL Database")]

### Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $resource
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az sql server](/cli/azure/sql/server#az-sql-server-create) | Server commands |
| [az sql server firewall](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-create) | Server firewall commands. |
| [az sql db](/cli/azure/sql/db#az-sql-db-create) | Database commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).

---
title: "Azure CLI example: Create a single database"
description: Use this Azure CLI example script to create a single database.
services: sql-database
ms.service: sql-database
ms.subservice: deployment-configuration
ms.custom: sqldbrb=1, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: WilliamDAssafMSFT 
ms.author: wiassaf
ms.reviewer: kendralittle, mathoma
ms.date: 01/17/2022
---

# Use Azure CLI to create a single database and configure a firewall rule

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example creates a single database in Azure SQL Database and configures a server-level firewall rule. After the script has been successfully run, the database can be accessed from all Azure services and the allowed IP address range.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="4-33":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Description |
|---|---|
| [az sql server](/cli/azure/sql/server#az_sql_server_create) | Server commands |
| [az sql server firewall](/cli/azure/sql/server/firewall-rule#az_sql_server_firewall_rule_create) | Server firewall commands. |
| [az sql db](/cli/azure/sql/db#az_sql_db_create) | Database commands. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).

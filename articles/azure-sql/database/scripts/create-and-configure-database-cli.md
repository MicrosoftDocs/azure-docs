---
title: "The Azure CLI: Create a single database"
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
ms.date: 12/06/2021
---

# Use the Azure CLI to create a single database and configure a firewall rule

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example creates a single database in Azure SQL Database and configures a server-level firewall rule. After the script has been successfully run, the database can be accessed from all Azure services and the configured IP address.

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

## Sample script

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

```azurecli-interactive
subscription="<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

### Run the script

```azurecli-interactive

:::code language="code-azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="4-33":::

```

### Run the script 1

```azurecli-interactive

:::code language="code-azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="3-150":::

```

### Run the script 2

```azurecli-interactive

:::code language="code-azurecli" source="~/cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="3-6" highlight="8,12":::

```

### test

```azurecli-interactive

:::code language="code-azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="15-20":::

```

### test

```azurecli-interactive

:::code language="code-azurecli" source="~/azure_cli/sql-database/create-and-configure-database/create-and-configure-database.sh" range="15-20":::

```

### Run the script-orig

[!code-azurecli-interactive[main](../../../../cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh "Create SQL Database")]

### block only

:::code language="code-azurecli" source="~/azure_cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh" range="15-20":::

### Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```azurecli-interactive
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

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).

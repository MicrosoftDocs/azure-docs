---
title: "Azure CLI example: Import BACPAC file to database in Azure SQL Database" 
description: Use this Azure CLI example script to import a BACPAC file into a database in Azure SQL Database 
services: sql-database
ms.service: sql-database
ms.subservice: backup-restore
ms.custom: load & move data, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: SQLSourabh
ms.author: sourabha
ms.reviewer: mathoma
ms.date: 12/07/2021

---
# Use CLI to import a BACPAC file into a database in SQL Database

This Azure CLI script example imports a database from a *.bacpac* file into a database in SQL Database.  

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

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/import-from-bacpac/import-from-bacpac.sh" range="4-48":::

### Clean up resources

Use the following command to remove the resource group and all resources associated with it using the [az group delete](/cli/azure/vm/extension#az_vm_extension_set) command- unless you have additional needs for these resources. Some of these resources may take a while to create, as well as to delete.

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql server](/cli/azure/sql/server) | Server commands. |
| [az sql db import](/cli/azure/sql/db#az_sql_db_import) | Database import command. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).

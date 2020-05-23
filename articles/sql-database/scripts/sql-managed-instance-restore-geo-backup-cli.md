---
title: CLI example Restore Geo-backup - Azure SQL Database 
description: Azure CLI example script to restore an Azure SQL Managed Instance Database from a geo-redundant backup.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: azurecli
ms.topic: sample
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
ms.date: 07/03/2019
---
# Use CLI to restore a Managed Instance database to another geo-region

This Azure CLI script example restores an Azure SQL Managed Instance database from a remote geo-region (geo-restore).  

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

### Prerequisites

An existing pair of managed instances, see [Use Azure CLI to create an Azure SQL Managed Instance](sql-database-create-configure-managed-instance-cli.md).

### Sign in to Azure

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

### Run the script

```azurepowershell-interactive
#!/bin/bash
$instance = "<instanceId>" # add instance here
$targetInstance = "<targetInstanceId>" # add target instance here
$resource = "<resourceId>" # add resource here

$randomIdentifier = $(Get-Random)
$managedDatabase = "managedDatabase-$randomIdentifier"

echo "Creating $($managedDatabase) on $($instance)..."
az sql midb create -g $resource --mi $instance -n $managedDatabase

echo "Restoring $($managedDatabase) to $($targetInstance)..."
az sql midb restore -g $resource --mi $instance -n $managedDatabase --dest-name $targetInstance --time "2018-05-20T05:34:22"
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| | |
|---|---|
| [az sql midb](/cli/azure/sql/midb) | Managed Instance Database commands. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../../azure-sql/database/az-cli-script-samples-content-guide.md).

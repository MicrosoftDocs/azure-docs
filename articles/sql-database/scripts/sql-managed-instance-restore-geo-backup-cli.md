---
title: CLI example Restore Geo-backup - Azure SQL Database 
description: Azure CLI example script to restore an Azure SQL Managed Instance Database from a geo-redundant backup.
services: sql-database
ms.service: sql-database
ms.subservice: backup-restore
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

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

```azurepowershell-interactive
# Connect-AzAccount

$subscriptionId = '<subscriptionId>'
$sourceResourceGroupName = "myResourceGroup-$(Get-Random)"
$sourceInstanceName = "myManagedInstance-$(Get-Random)"
$sourceDatabaseName = "myInstanceDatabase-$(Get-Random)"
$targetResourceGroupName = "myTargetResourceGroup-$(Get-Random)"
$targetInstanceName = "myTargetManagedInstance-$(Get-Random)"
$targetDatabaseName = "myTargetInstanceDatabase-$(Get-Random)"

Connect-AzAccount
Set-AzContext -SubscriptionId $subscriptionId

$backup = Get-AzSqlInstanceDatabaseGeoBackup `
-ResourceGroupName  `
-InstanceName $SourceInstanceName `
-Name 

az sql db export --admin-password
                 --admin-user
                 --storage-key
                 --storage-key-type {SharedAccessKey, StorageAccessKey}
                 --storage-uri
                 [--auth-type {ADPassword, SQL}]
                 [--ids]
                 [--name $sourceDatabaseName
                 [--resource-group $sourceResourceGroupName
                 [--server]
                 [--subscription]

$backup | Restore-AzSqlInstanceDatabase -FromGeoBackup `
-TargetInstanceDatabaseName  `
-TargetInstanceName $TargetInstanceName `
-TargetResourceGroupName 
az sql db restore --dest-name
                  [--auto-pause-delay]
                  [--capacity]
                  [--compute-model {Provisioned, Serverless}]
                  [--deleted-time]
                  [--edition]
                  [--elastic-pool]
                  [--family]
                  [--ids]
                  [--license-type {BasePrice, LicenseIncluded}]
                  [--min-capacity]
                  [--name $TargetDatabaseName
                  [--no-wait]
                  [--resource-group $TargetResourceGroupName
                  [--server]
                  [--service-objective]
                  [--subscription]
                  [--tags]
                  [--time]
                  [--zone-redundant {false, true}]
```

## Clean up deployment

Use the following command to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name $TargetResourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az sql midb create](/cli/azure/sql/midb#az-sql-midb-create) | Creates a Geo-redundant backup of Managed Instance Database. |
| [az sql midb restore](/cli/azure/sql/midb#az-sql-midb-restore) | Creates a database on a Managed Instance from geo-backup. |
| [az group delete](/cli/azure/vm/extension#az-vm-extension-set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).

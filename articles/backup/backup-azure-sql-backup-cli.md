---
title: Back up SQL server databases in Azure VMs using Azure Backup via CLI
description: Learn how to use CLI to back up SQL server databases in Azure VMs in the Recovery Services vault.
ms.topic: how-to
ms.date: 08/11/2022
ms.service: backup
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up SQL databases in Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This article describes how to back up an SQL database in Azure VM and trigger on-demand backups using Azure CLI. You can also perform these actions using the [Azure portal](backup-sql-server-database-azure-vms.md).

This article assumes that you already have an SQL database installed on an Azure VM. (You can also [create a VM using Azure CLI](../virtual-machines/linux/quick-create-cli.md)). 

In this article, you'll learn how to:
> [!div class="checklist"]
>
> * Create a Recovery Services vault
> * Register SQL server and discover database(s) on it
> * Enable backup on an SQL database
> * Trigger an on-demand backup

See the [currently supported scenarios](sql-support-matrix.md) for SQL in Azure VM.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a Recovery Services vault

A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as Azure VMs or workloads running on Azure VMs - for example, SQL or HANA databases. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

Create a Recovery Services vault with the [az backup vault create](/cli/azure/backup/vault#az-backup-vault-create) command. Use the resource group and location as that of the VM you want to protect. Learn how to create a VM using Azure CLI with [this VM quickstart](../virtual-machines/linux/quick-create-cli.md).

For this article, we'll use:

* A resource group named *SQLResourceGroup*
* A VM named *testSQLVM*
* Resources in the *westus2* location.

Run the following command to create a vault named *SQLVault*.

```azurecli-interactive
az backup vault create --resource-group SQLResourceGroup \
    --name SQLVault \
    --location westus2
```

By default, the Recovery Services vault is set for Geo-Redundant storage. Geo-Redundant storage ensures your backup data is replicated to a secondary Azure region even if that's hundreds of miles away from the primary region. If the storage redundancy setting needs to be modified, use the [az backup vault backup-properties set](/cli/azure/backup/vault/backup-properties#az-backup-vault-backup-properties-set) command.

```azurecli
az backup vault backup-properties set \
    --name SQLVault  \
    --resource-group SQLResourceGroup \
    --backup-storage-redundancy "LocallyRedundant/GeoRedundant"
```

To verify if the vault is successfully created, use the [az backup vault list](/cli/azure/backup/vault#az-backup-vault-list) command. The response appears as:

```output
Location   Name             ResourceGroup
---------  ---------------  -------------  
westus2    SQLVault     	SQLResourceGroup
```

## Register and protect the SQL Server

To register the SQL Server with the Recovery Services vault, use the [az backup container register](/cli/azure/backup/container#az-backup-container-register) command. *VMResourceId* is the resource ID of the VM that you created to install SQL.

```azurecli-interactive
az backup container register --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --workload-type SQLDataBase \
    --backup-management-type AzureWorkload \
    --resource-id VMResourceId
```

>[!NOTE]
>If the VM isn't present in the same resource group as the vault, *SQLResourceGroup* uses the resource group where the vault was created.

Registering the SQL server automatically discovers all its current databases. However, to discover any new databases that may be added in the future, see the [Discovering new databases added to the registered SQL server](backup-azure-sql-manage-cli.md#protect-the-new-databases-added-to-a-sql-instance) section.

Use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command to verify if the SQL instance is successfully registered with your vault. The response appears as:

```output
Name                                                    Friendly Name    Resource Group        Type           Registration Status
------------------------------------------------------  --------------   --------------------  ---------      ----------------------
VMAppContainer;Compute;SQLResourceGroup;testSQLVM   	testSQLVM        SQLResourceGroup  		AzureWorkload  Registered
```

>[!NOTE]
>The column *name* in the above output refers to the container name. This container name is used in the next sections to enable backups and trigger them. For example, *VMAppContainer;Compute;SQLResourceGroup;testSQLVM*.

## Enable backup on the SQL database

The [az backup protectable-item list](/cli/azure/backup/protectable-item#az-backup-protectable-item-list) command lists all the databases discovered on the SQL instance that you registered in the previous step.

```azurecli-interactive
az backup protectable-item list --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --workload-type SQLDataBase \
	--backup-management-type AzureWorkload \
	--protectable-item-type SQLDataBase
    --output table
```

You should find the database in this list that you want to back up, which appears as:

```output
Name                           		Protectable Item Type    ParentName    ServerName    	IsProtected
-----------------------------  		----------------------   ------------  -----------   	------------
sqldatabase;mssqlserver;master      SQLDataBase              MSSQLServer   testSQLVM        NotProtected  
sqldatabase;mssqlserver;model       SQLDataBase              MSSQLServer   testSQLVM        NotProtected  
sqldatabase;mssqlserver;msdb        SQLDataBase              MSSQLServer   testSQLVM        NotProtected  
```

Now, configure backup for the *sqldatabase;mssqlserver;master* database.

To configure and protect backups on a database, one at a time, use the [az backup protection enable-for-azurewl](/cli/azure/backup/protection#az-backup-protection-enable-for-azurewl) command. Provide the name of the policy that you want to use. To create a policy using CLI, use the [az backup policy create](/cli/azure/backup/policy#az-backup-policy-create) command. For this article, we've used the *testSQLPolicy* policy.

```azurecli-interactive
az backup protection enable-for-azurewl --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --policy-name SQLPolicy \
    --protectable-item-name "sqldatabase;mssqlserver;master"  \
    --protectable-item-type SQLDataBase \
    --server-name testSQLVM \
    --workload-type SQLDataBase \
    --output table
```

You can use the same command, if you have an *SQL Always On Availability Group* and want to identify the protectable datasource within the availability group. Here, the protectable item type is *SQLAG*.

To verify if the above backup configuration is complete, use the [az backup job list](/cli/azure/backup/job#az-backup-job-list) command. The output appears as:

```output
Name                                  Operation         Status     Item Name   Start Time UTC
------------------------------------  ---------------   ---------  ----------  -------------------  
e0f15dae-7cac-4475-a833-f52c50e5b6c3  ConfigureBackup   Completed  master         2019-12-03T03:09:210831+00:00  
```

The [az backup job list](/cli/azure/backup/job#az-backup-job-list) command lists all backup jobs (scheduled or on-demand) that have run or are currently running on the protected database, in addition to other operations, such as register, configure backup, and delete backup data.

>[!NOTE]
>Azure Backup doesn't automatically adjust for daylight saving time changes when backing up an SQL database running in an Azure VM.
>
>Modify the policy manually as needed.

## Enable auto-protection

For seamless backup configuration, all databases added in the future can be automatically protected with a certain policy. To enable auto-protection, use the [az backup protection auto-enable-for-azurewl](/cli/azure/backup/protection#az-backup-protection-auto-enable-for-azurewl) command.

As the instruction is to back up all future databases, the operation is done at a *SQLInstance* level.

```azurecli-interactive
az backup protection auto-enable-for-azurewl --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --policy-name SQLPolicy \
    --protectable-item-name "sqlinstance;mssqlserver"  \
    --protectable-item-type SQLInstance \
    --server-name testSQLVM \
    --workload-type MSSQL\
    --output table
```

## Trigger an on-demand backup

To trigger an on-demand backup, use the [az backup protection backup-now](/cli/azure/backup/protection#az-backup-protection-backup-now) command.

>[!NOTE]
>The retention period of this backup is determined by the type of on-demand backup you have run.
>
>- *On-demand full* retains backups for a minimum of *45 days* and a maximum of *99 years*.
>- *On-demand copy only full* accepts any value for retention.
>- *On-demand differential* retains backup as per the retention of scheduled differentials set in policy.
>- *On-demand log* retains backups as per the retention of scheduled logs set in policy.

```azurecli-interactive
az backup protection backup-now --resource-group SQLResourceGroup \
    --item-name sqldatabase;mssqlserver;master \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --backup-type Full
    --retain-until 01-01-2040
    --output table
```

The output appears as:

```output
Name                                  ResourceGroup
------------------------------------  -------------
e0f15dae-7cac-4475-a833-f52c50e5b6c3  sqlResourceGroup
```

The response provides you the job name. You can use this job name to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Next steps

* Learn how to [restore an SQL database in Azure VM using CLI](backup-azure-sql-restore-cli.md).
* Learn how to [back up an SQL database running in Azure VM using Azure portal](backup-sql-server-database-azure-vms.md).

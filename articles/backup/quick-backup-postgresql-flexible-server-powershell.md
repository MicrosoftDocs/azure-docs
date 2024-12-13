---
title: "Quickstart: Configure Backup for an Azure PostgreSQL - Flexible server using PowerShell"
description: Learn how to back up your Azure PostgreSQL - Flexible server with PowerShell.
ms.devlang: terraform
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 10/07/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

#  Back up an Azure PostgreSQL - Flexible servers with PowerShell (preview)

[Azure Backup](backup-azure-database-postgresql-flex-overview.md) allows you to back up your Azure PostgreSQL - Flexible servers using multiple options - such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on. This article describes how to back up an Azure PostgreSQL - Flexible servers with PowerShell.

For info on PostgreSQL databases supported scenarios and limitations, see the [support matrix](backup-azure-database-postgresql-flex-support-matrix.md).

## Create a Backup vault

In this article, we create a Backup vault _TestBkpVault_, in the region _westus_, under the resource group _testBkpVaultRG_. 

```azurepowershell

$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant/GeoRedundant -DataStoreType VaultStore

New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
```

## Create a Backup policy

We'll generate a default policy template for a PostgreSQL - Flexible server. Then, we'll use this policy template to create a new policy.

```azurecli
$policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureDatabaseForPGFlexServer
```

The default policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete/copy/move the backup). In Azure PostgreSQL - flexible server backup, the default value for trigger is a scheduled Weekly trigger (one backup every seven days) and to retain each backup for three months.

With the below command, we'll create a policy using the Default template.

```azurecli
$polOss = New-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Name "TestOSSPolicy" -Policy $policyDefn
```

## Configure backup

Once the vault and policy are created, there are three critical points that you need to consider to protect an Azure PostgreSQL database.

1. Backup vault has to connect to the PostgreSQL - flexible server, therefore, it requires access to this server. Access is granted to the Managed System Identity (MSI) of the Backup Vault.

See the [permissions](.\backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) you should grant to the Managed System Identity (MSI) of the Backup Vault on the PostgreSQL - flexible server.

2. Once all the required permissions are set, we'll prepare the relevant request to configure backup for the PostgreSQL - Flexible server.
 
```azurecli
$instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDatabaseForPostgreSQLFlexibleServer -DatasourceLocation $TestBkpvault.Location -PolicyId $polOss[0].Id -DatasourceId $ossId ConvertTo-Json -InputObject $instance -Depth 4 
```

3. Then submit the request to protect the server with Azure Backup.

```azurecli
New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance
```

## Next steps

- [Restore Azure Database for PostgreSQL - flexible server using Azure PowerShell](backup-azure-database-postgresql-flex-restore-powershell.md)
- [About Azure PostgreSQL - Flexible server backup](backup-azure-database-postgresql-flex-overview.md)

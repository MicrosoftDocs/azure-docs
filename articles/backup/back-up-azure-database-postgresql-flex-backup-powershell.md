---
title: Back up Azure Database for PostgreSQL - Flexible Server using Azure PowerShell
description: Learn how to back up Azure Database for PostgreSQL - Flexible Server using Azure PowerShell.
ms.topic: how-to
ms.date: 02/28/2025
ms.custom: devx-track-azurepowershell, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As a database administrator, I want to back up Azure Database for PostgreSQL - Flexible Server using PowerShell, so that I can ensure data protection and recovery in case of data loss or corruption.
---

# Back up Azure Database for PostgreSQL - Flexible Server using Azure PowerShell

This article describes how to back up Azure Database for PostgreSQL - Flexible Server using Azure PowerShell.

Learn more about the [supported scenarios and limitations for Azure Database for PostgreSQL - flexible server backup](backup-azure-database-postgresql-flex-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure. This stores the backup data for new workloads that Azure Backup supports. For example, Azure Database for PostgreSQL – Flexible servers, blobs in a storage account, and Azure Disks. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.

In this article, let's create a Backup vault `TestBkpVault`, in the region `westus`, under the resource group `testBkpVaultRG`. Use the [`New-AzDataProtectionBackupVault`](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault?view=azps-12.3.0&preserve-view=true) cmdlet to create a Backup vault. Learn more about [creating a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

```azurepowershell
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant/GeoRedundant -DataStoreType VaultStore
New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
$TestBKPVault | fl
ETag                :
Id                  : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault
Identity            : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.DppIdentityDetails
IdentityPrincipalId :
IdentityTenantId    :
IdentityType        :
Location            : westus
Name                : TestBkpVault
ProvisioningState   : Succeeded
StorageSetting      : {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.StorageSetting}
SystemData          : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.SystemData
Tag                 : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.DppTrackedResourceTags
Type                : Microsoft.DataProtection/backupVaults

```

## Configure backup

Before you configure protection for the database, ensure that you [create a Backup policy](quick-backup-postgresql-flexible-server-powershell.md#create-a-backup-policy). Once the vault and policy are created, protect the Azure Database for PostgreSQL - Flexible Server by following these steps:

- Fetch the ARM ID of the PostgreSQL - Flexible Server to be protected
- Grant access to the Backup vault
- Prepare the backup configuration request

### Fetch the ARM ID of the PostgreSQL - Flexible Server to be protected

Fetch the Azure Resource Manager ID (ARM ID) of PostgreSQL – Flexible Server to be protected. This ID serves as the identifier of the database. Let's use an example of a database named `empdb11` under a PostgreSQL - Flexible Server `testposgresql`, which is present in the resource group `ossrg` under a different subscription.

```azurepowershell
$ossId = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/archive-postgresql-ccy/databases/empdb11"
```

### Grant access to the Backup vault

Backup vault has to connect to the PostgreSQL – Flexible Server, and then access the database via the keys present in the key vault. So, it requires access to the PostgreSQL – Flexible Server and the key vault. Grant the required access to the Backup vault's **Managed Service Identity (MSI)**.

Check the [permissions](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) required for the Backup vault's **Managed Service Identity (MSI)** on the PostgreSQL – Flexible Server and Azure Key vault that stores keys to the database.

### Prepare the backup configuration request

Once all the relevant permissions are set, configure the backup by running following cmdlets:

1. Prepare the relevant request by using the relevant vault, policy, PostgreSQL - flexible Server using the [`Initialize-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) cmdlet.

    ```azurepowershell-interactive
    $instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDatabaseForPGFlexServer -DatasourceLocation $TestBkpvault.Location -PolicyId $polOss[0].Id -DatasourceId $ossId -SecretStoreURI $keyURI -SecretStoreType AzureKeyVault
    ConvertTo-Json -InputObject $instance -Depth 4 
    ```

1. Submit the request to protect the database server using the [`New-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) cmdlet.

    ```azurepowershell
    New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance

    Name                        Type                                         BackupInstanceName
    ----                        ----                                          ------------------
    ossrg-empdb11       Microsoft.DataProtection/backupVaults/backupInstances ossrg-empdb11

    ```

## Run an on-demand backup

Fetch the relevant backup instance on which you need to trigger a backup using the [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) cmdlet.

```azurepowershell
$instance = Get-AzDataProtectionBackupInstance -SubscriptionId "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e" -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "BackupInstanceName"

```

Specify a retention rule while triggering backup. To view the retention rules in policy, go to the policy object for retention rules. In the following example, the rule with name *default* appears. Let's use that rule for the on-demand backup.

```azurepowershell
$ossPol.PolicyRule | fl

BackupParameter           : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.AzureBackupParams
BackupParameterObjectType : AzureBackupParams
DataStoreObjectType       : DataStoreInfoBase
DataStoreType             : OperationalStore
Name                      : BackupHourly
ObjectType                : AzureBackupRule
Trigger                   : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.ScheduleBasedTriggerContext
TriggerObjectType         : ScheduleBasedTriggerContext

IsDefault  : True
Lifecycle  : {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.SourceLifeCycle}
Name       : Default
ObjectType : AzureRetentionRule

```

To trigger an on-demand backup, use the [`Backup-AzDataProtectionBackupInstanceAdhoc`](/powershell/module/az.dataprotection/backup-azdataprotectionbackupinstanceadhoc) cmdlet.

```azurepowershell
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"

```

## Track jobs

Track all jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) cmdlet. You can list all jobs and fetch a particular job detail.

You can also use the `Az.ResourceGraph` cmdlet to track all jobs across all Backup vaults. Use the  [`Search-AzDataProtectionJobInAzGraph`](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) cmdlet to fetch the relevant jobs that are across Backup vaults.

```azurepowershell
  $job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -Operation OnDemandBackup

```

## Next steps

- [Restore Azure Database for PostgreSQL - Flexible Server using Azure PowerShell](backup-azure-database-postgresql-flex-restore-powershell.md).

---
title: Back up Azure blobs within a storage account using Azure PowerShell
description: Learn how to back up all Azure blobs within a storage account using Azure PowerShell.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
ms.date: 08/06/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up all Azure blobs in a storage account using Azure PowerShell

This article describes how to back up all [Azure blobs](./blob-backup-overview.md) within a storage account using Azure PowerShell.

In this article, you'll learn how to:

- Before you start

- Create a Backup vault

- Create a backup policy

- Configure a backup of all Azure blobs within storage accounts

For information on the Azure blob region availability, supported scenarios and limitations, see the [support matrix](blob-backup-support-matrix.md).

> [!IMPORTANT]
> Support for Azure blobs is available from Az 5.9.0 version.

## Before you start

See the [prerequisites](./blob-backup-configure-manage.md#before-you-start) and [support matrix](./blob-backup-support-matrix.md) before you get started.

## Create a Backup vault

A Backup vault is a storage entity in Azure that holds backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers, Azure blobs and Azure blobs. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before creating a backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the backup vault with that storage redundancy and the location. In this article, we will create a backup vault _TestBkpVault_ in region _westus_, under the resource group _testBkpVaultRG_. Use the [New-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault) command to create a backup vault.Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

```azurepowershell-interactive
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant/GeoRedundant -DataStoreType VaultStore

New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
$TestBKPVault | fl
ETag                :
Id                  : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault
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

After creation of vault, let's create a backup policy to protect Azure blobs.

> [!IMPORTANT]
> Though you'll see the Backup storage redundancy of the vault, the redundancy doesn't apply to the operational backup of blobs as the backup is local in nature and no data is stored in the Backup vault. Here, the backup vault is the management entity to help you manage the protection of block blobs in your storage accounts.

## Create a Backup policy

> [!IMPORTANT]
> Read [this section](blob-backup-configure-manage.md#before-you-start) before proceeding to create the policy and configuring backups for Azure blobs.

To understand the inner components of a backup policy for Azure blob backup, retrieve the policy template using the [Get-AzDataProtectionPolicyTemplate](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurepowershell-interactive
$policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureBlob
$policyDefn | fl


DatasourceType : {Microsoft.Storage/storageAccounts/blobServices}
ObjectType     : BackupPolicy
PolicyRule     : {Default}

$policyDefn.PolicyRule | fl

IsDefault  : True
Lifecycle  : {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api202101.SourceLifeCycle}
Name       : Default
ObjectType : AzureRetentionRule
```

The policy template consists of a lifecycle only (which decides when to delete/copy/move the backup). As operational backup for blobs is continuous in nature, you don't need a schedule to perform backups.

```azurepowershell-interactive
$policyDefn.PolicyRule.Lifecycle | fl


DeleteAfterDuration        : P30D
DeleteAfterObjectType      : AbsoluteDeleteOption
SourceDataStoreObjectType  : DataStoreInfoBase
SourceDataStoreType        : OperationalStore
TargetDataStoreCopySetting :
```

> [!NOTE]
> Restoring over long durations may lead to restore operations taking longer to complete. Also, the time that it takes to restore a set of data is based on the number of write and delete operations made during the restore period. For example, an account with one million objects with 3,000 objects added per day and 1,000 objects deleted per day will require approximately two hours to restore to a point 30 days in the past.<br><br>We do not recommend a retention period and restoration more than 90 days in the past for an account with this rate of change.

Once the policy object has all the desired values, proceed to create a new policy from the policy object using the [New-AzDataProtectionBackupPolicy](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) command.

```azurepowershell-interactive
New-AzDataProtectionBackupPolicy -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name blobBkpPolicy -Policy $policyDefn

Name                   Type
----                   ----
blobBkpPolicy       Microsoft.DataProtection/backupVaults/backupPolicies

$blobBkpPol = Get-AzDataProtectionBackupPolicy -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "blobBkpPolicy"
```

## Configure backup

Once the vault and policy are created, there are two critical points that the user needs to consider to protect all Azure blobs within a storage account.

### Key entities involved

#### Storage account which contains the blobs to be protected

Fetch the Azure Resource Manager ID of the storage account which contains the blobs to be protected. This will serve as the identifier of the storage account. We will use an example of a storage account named _PSTestSA_, under the resource group _blobrg_, in a different subscription.

```azurepowershell-interactive
$SAId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/PSTestSA"
```

#### Backup vault

The Backup vault requires permissions on the storage account to enable backups on blobs present within the storage account. The system-assigned managed identity of the vault is used for assigning such permissions.

### Assign permissions

You need to assign a few permissions via RBAC to vault (represented by vault MSI) and the relevant storage account. These can be performed via Portal or PowerShell. Learn more about all [related permissions](blob-backup-configure-manage.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

### Prepare the request

Once all the relevant permissions are set, the configuration of backup is performed in 2 steps. First, we prepare the relevant request by using the relevant vault, policy, storage account using the [Initialize-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) command. Then, we submit the request to protect the blobs within the storage account using the [New-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) command.

```azurepowershell-interactive
$instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureBlob -DatasourceLocation $TestBkpvault.Location -PolicyId $blobBkpPol[0].Id -DatasourceId $SAId 
New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance

Name                                                       Type                                                  BackupInstanceName
----                                                       ----                                                  ------------------
blobrg-PSTestSA-3df6ac08-9496-4839-8fb5-8b78e594f166 Microsoft.DataProtection/backupVaults/backupInstances blobrg-PSTestSA-3df6ac08-9496-4839-8fb5-8b78e594f166
```

> [!IMPORTANT]
> Once a storage account is configured for blobs backup, a few capabilities are affected, such as change feed and delete lock. [Learn more](blob-backup-configure-manage.md#effects-on-backed-up-storage-accounts).

## Next steps

[Restore Azure blobs using Azure PowerShell](restore-blobs-storage-account-ps.md)

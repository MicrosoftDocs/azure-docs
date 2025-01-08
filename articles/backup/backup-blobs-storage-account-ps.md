---
title: Back up Azure blobs within a storage account using Azure PowerShell
description: Learn how to back up all Azure blobs within a storage account using Azure PowerShell.
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.date: 12/27/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up all Azure blobs in a storage account using Azure PowerShell

This article describes how to back up all [Azure blobs](./blob-backup-overview.md) within a storage account using Azure PowerShell. You can now perform [operational](blob-backup-overview.md?tabs=operational-backup) and [vaulted](blob-backup-overview.md?tabs=vaulted-backup) backups to protect block blobs in your storage accounts using Azure Backup.

For information on the Azure blob region availability, supported scenarios and limitations, see the [support matrix](blob-backup-support-matrix.md).

> [!IMPORTANT]
> Support for Azure blobs is available from version **Az 5.9.0**.

## Before you start

See the [prerequisites](./blob-backup-configure-manage.md#before-you-start) and [support matrix](./blob-backup-support-matrix.md) before you get started.

## Create a Backup vault

A Backup vault is a storage entity in Azure that holds backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers and Azure blobs. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before creating a backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the backup vault with that storage redundancy and the location. In this article, we will create a backup vault _TestBkpVault_ in region _westus_, under the resource group _testBkpVaultRG_. Use the [New-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault) command to create a backup vault. Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

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

**Choose a backup tier**:

# [Operational Backup](#tab/operational-backup)

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
# [Vaulted Backup](#tab/vaulted-backup)

[!INCLUDE [blob-vaulted-backup-create-policy-ps.md](../../includes/blob-vaulted-backup-create-policy-ps.md)]

---

## Configure backup

[!INCLUDE [blob-vaulted-backup-configure-policy-ps.md](../../includes/blob-vaulted-backup-configure-policy-ps.md)]

### Prepare the request to configure blob backup

**Choose a backup tier**:

# [Operational Backup](#tab/operational-backup)

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

# [Vaulted Backup](#tab/vaulted-backup)

[!INCLUDE [blob-vaulted-backup-prepare-request-ps.md](../../includes/blob-vaulted-backup-prepare-request-ps.md)]

---

## Update a backup instance

After you have configured the backup, you can change the associated policy with a backup instance. For vaulted backups, you can also change the containers selected for backup. 

To update the backup instance, run the following cmdlets:

1. Validate if the backup instance is ready for configuring backup using the [Test-AzDataProtectionBackupInstanceReadiness](/powershell/module/az.dataprotection/test-azdataprotectionbackupinstancereadiness?view=azps-13.0.0&preserve-view=true) command. The command fails if the   backup instance is not ready.

   You can also use this command to check if the backup vault has all the necessary permissions to configure backup.

1. Change the policy used for backing up the Azure Blobs by using the [Update-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/update-azdataprotectionbackupinstance?view=azps-13.0.0&preserve-view=true). Specify the relevant backup item and the new backup policy.

1. Update the policy or the new containers to existing backup items.

   1. Create the storage account context by using the `New-AzStorageContext` cmdlet. Provide the `-UseConnectedAccount` parameter so that data operations are performed using your Microsoft Entra credentials. Learn more [about the storage account commands](/azure/storage/blobs/blob-containers-powershell#list-containers). 

      ```azurepowershell
      Create a context object using Azure AD credentials
      $ctx = New-AzStorageContext -StorageAccountName xxx -UseConnectedAccount 

      ```

   1. Retrieve the storage containers using the `Get-AzStorageContainer` cmdlet. To retrieve a single container, provide the `-Name` parameter. To return a list of containers that begins with a given character string, specify a value for the `-Prefix` parameter.

   The following example retrieves both an individual container and a list of container resources:

      ```azurepowershell


      # Create variables
      $containerName  = "individual-container"
      $prefixName     = "loop-"

      # Approach 1: Retrieve an individual container
      Get-AzStorageContainer -Name $containerName -Context $ctx
      Write-Host

      # Approach 2: Retrieve a list of containers
      $targetContainers = Get-AzStorageContainer -Context $ctx | Where-Object { $_.Name -match "cont" } 
      ```

      The result provides the URI of the blob endpoint and lists the containers retrieved by name and prefix:

      ```
      Storage Account Name: demostorageaccount
      
      Name                 PublicAccess         LastModified                   IsDeleted  VersionId        
      ----                 ------------         ------------                   ---------  ---------        
      individual-container                      11/2/2021 5:52:08 PM +00:00                                
      
      loop-container1                           11/2/2021 12:22:00 AM +00:00                               
      loop-container2                           11/2/2021 12:22:00 AM +00:00                               

      loop-container1                           11/2/2021 12:22:00 AM +00:00                               
      loop-container2                           11/2/2021 12:22:00 AM +00:00
      loop-container3                           11/2/2021 12:22:00 AM +00:00   True       01D7E7129FDBD7D4
      loop-container4                           11/2/2021 12:22:00 AM +00:00   True       01D7E8A5EF01C787 
      ```

   1. Fetch the backup instance that needs to be updated.

         ```azurepowershell
         C:\Users\testuser> $instance = Search-AzDataProtectionBackupInstanceInAzGraph -Subscription "Demosub" -ResourceGroup Demo-BCDR-RG -Vault BCDR-BV-EastUS -DatasourceType AzureBlob
         PS C:\Users\testuser> $instance
                        Output
         Name                                                                     BackupInstanceName
         ----                                                                     ------------------
         blobsa-blobsa-c7325e08-980d-43b2-863f-68feee4fd03c               blobsa-blobsa-c7325e08-980d-43b2-863f-68feee4fd03c
         blobsavaulted-blobsavaulted-40c36519-f422-45aa-bbeb-3f0eedb440c7 blobsavaulted-blobsavaulted-40c36519-f422-45aa-bbeb-3f0eedb440c7
         testdpp-testdpp-ff4254dd-7a70-437b-9a10-8c0d2223d037                     testdpp-testdpp-ff4254dd-7a70-437b-9a10-8c0d2223d037

         ```

   1. Fetch the backup policy with the name of vaulted-policy that you want to update in Backup Instance. You can also fetch the new policy that needs to be updated in Backup Instance.

         ```azurepowershell
         $updatePolicy = Get-AzDataProtectionBackupPolicy -SubscriptionId "Demosub" -VaultName BCDR-BV-EastUS -ResourceGroupName Demo-BCDR-RG -name continer-1
         ```

   1. Update the backup instance with new list of container (the existing backed up containers & new containers).       

         ```azurepowershell
         PS C:\Users\testuser> $updateBI = Update-AzDataProtectionBackupInstance -ResourceGroupName Daya-BCDR-RG -VaultName DPBCDR-BV-EastUS -BackupInstanceName $instance[0].Name -SubscriptionId "ef4ab5a7-c2c0-4304-af80-af49f48af3d1"  -PolicyId $updatePolicy.id -VaultedBackupContainer $targetContainers.name
         
         
         PS C:\Users\testuser> $updateBI.Property.PolicyInfo.PolicyId
         /subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/Daya-BCDR-RG/providers/Microsoft.DataProtection/backupVaults/DPBCDR-BV-EastUS/backupPolicies/continerdeltest-1
         PS C:\Users\testuser> $updateBI.Property.PolicyInfo.PolicyParameter.BackupDatasourceParametersList[0].ContainersList
         cont-01
         cont-02
         cont-03
         cont-04
         cont-05
         cont-06
         cont-07
         cont-08
         cont-09
         cont-10
         cont-11
         ```


##  Next steps

[Restore Azure blobs using Azure PowerShell](restore-blobs-storage-account-ps.md)

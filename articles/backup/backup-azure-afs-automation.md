---
title: Deploy and manage backups for Azure file shares by using PowerShell
description: Use PowerShell to deploy and manage backups in Azure for Azure file shares
services: backup
author: pvrk
manager: shivamg
keywords: PowerShell; Azure Files backup; Azure Files restore;
ms.service: backup
ms.topic: conceptual
ms.date: 11/12/2018
ms.author: pullabhk
ms.assetid: 80da8ece-2cce-40dd-8dce-79960b6ae073
---

# Use PowerShell to back up and restore Azure file shares

This article shows how to use Azure PowerShell cmdlets to back up and recover an Azure file share from a Recovery Services vault. A Recovery Services vault is an Azure Resource Manager resource that's used to protect data and assets in Azure Backup and Azure Site Recovery.

## Concepts

If you're not familiar with Azure Backup, for an overview of the service, see [What is Azure Backup?](backup-introduction-to-azure-backup.md). Before you start, see the preview capabilities that are used to back up Azure file shares in [Back up Azure file shares](backup-azure-files.md).

To use PowerShell effectively, it's necessary to understand the hierarchy of objects and where to start from.

![Recovery Services object hierarchy](./media/backup-azure-vms-arm-automation/recovery-services-object-hierarchy.png)

To view the **AzureRm.RecoveryServices.Backup** PowerShell cmdlet reference, see [Azure Backup - Recovery Services cmdlets](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup) in the Azure library.

## Setup and registration

> [!NOTE]
> As noted in [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/azurerm/install-azurerm-ps?view=azurermps-6.13.0), support for new features in the AzureRM module ends in November 2018. Support is provided for backup of Azure file shares with the new Az PowerShell module that's now generally available.

Follow these steps to begin.

1. [Download the latest version of Az PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azurermps-6.13.0). The minimum version required is 1.0.0.

2. Find the **Azure Backup PowerShell** cmdlets available by entering the following command.

    ```powershell
    Get-Command *azrecoveryservices*
    ```
    The aliases and cmdlets for Azure Backup, Azure Site Recovery, and the Recovery Services vault appear. The following image is an example of what you see. It's not the complete list of cmdlets.

    ![List of Recovery Services cmdlets](./media/backup-azure-afs-automation/list-of-recoveryservices-ps-az.png)

3. Sign in to your Azure account by using **Connect-AzAccount**. This cmdlet brings up a web page that prompts you for your account credentials:

    * Alternately, you can include your account credentials as a parameter in the **Connect-AzAccount** cmdlet by using the **-Credential** parameter.
    * If you're a CSP partner working on behalf of a tenant, specify the customer as a tenant by using their tenantID or tenant primary domain name. An example is **Connect-AzAccount -Tenant** fabrikam.com.

4. Associate the subscription you want to use with the account because an account can have several subscriptions.

    ```powershell
    Select-AzureRmSubscription -SubscriptionName $SubscriptionName
    ```

5. If you're using Azure Backup for the first time, use the **Register-AzResourceProvider** cmdlet to register the Azure Recovery Services provider with your subscription.

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```

6. Verify that the providers registered successfully by using the following command.
    ```powershell
    Get-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```
    In the command output, **RegistrationState** changes to **Registered**. If you don't see this change, run the **Register-AzResourceProvider** cmdlet again.

The following tasks can be automated with PowerShell:

* Create a Recovery Services vault.
* Configure backup for Azure file shares.
* Trigger a backup job.
* Monitor a backup job.
* Restore an Azure file share.
* Restore an individual Azure file from an Azure file share.

## Create a Recovery Services vault

Follow these steps to create a Recovery Services vault.

1. The Recovery Services vault is a Resource Manager resource, so you must place it within a resource group. You can use an existing resource group, or you can create a resource group with the **New-AzResourceGroup** cmdlet. When you create a resource group, specify the name and location for the resource group.  

    ```powershell
    New-AzResourceGroup -Name "test-rg" -Location "West US"
    ```
2. Use the **New-AzRecoveryServicesVault** cmdlet to create the Recovery Services vault. Specify the same location for the vault as was used for the resource group.

    ```powershell
    New-AzRecoveryServicesVault -Name "testvault" -ResourceGroupName "test-rg" -Location "West US"
    ```
3. Specify the type of storage redundancy to use. You can use [locally redundant storage](../storage/common/storage-redundancy-lrs.md) or [geo-redundant storage](../storage/common/storage-redundancy-grs.md). The following example shows the **-BackupStorageRedundancy** option for **testvault** set to **GeoRedundant**.

    ```powershell
    $vault1 = Get-AzRecoveryServicesVault -Name "testvault"
    Set-AzRecoveryServicesBackupProperties  -Vault $vault1 -BackupStorageRedundancy GeoRedundant
    ```

## View the vaults in a subscription

To view all vaults in the subscription, use **Get-AzRecoveryServicesVault**.

```powershell
Get-AzRecoveryServicesVault
```

The output is similar to the following example. Notice that the associated **ResourceGroupName** and **Location** are provided.

```powershell
Name              : Contoso-vault
ID                : /subscriptions/1234
Type              : Microsoft.RecoveryServices/vaults
Location          : WestUS
ResourceGroupName : Contoso-docs-rg
SubscriptionId    : 1234-567f-8910-abc
Properties        : Microsoft.Azure.Commands.RecoveryServices.ARSVaultProperties
```

Many Azure Backup cmdlets require the Recovery Services vault object as an input.

Use **Set-AzRecoveryServicesVaultContext** to set the vault context. After the vault context is set, it applies to all subsequent cmdlets. The following example sets the vault context for **testvault**.

```powershell
Get-AzRecoveryServicesVault -Name "testvault" | Set-AzRecoveryServicesVaultContext
```

> [!NOTE]
> We plan to deprecate the vault context setting according to Azure PowerShell guidelines. Instead, we recommend that users pass the vault ID as mentioned in the following instructions.

Alternatively, store or fetch the ID of the vault to which you want to perform a PowerShell operation and pass it to the relevant command.

```powershell
$vaultID = Get-AzRecoveryServicesVault -ResourceGroupName "Contoso-docs-rg" -Name "testvault" | select -ExpandProperty ID
```

## Configure backup for an Azure file share

### Create a protection policy

A backup protection policy is associated with at least one retention policy. A retention policy defines how long a recovery point is kept before it's deleted. Use **Get-AzRecoveryServicesBackupRetentionPolicyObject** to view the default retention policy. 

Similarly, you can use **Get-AzRecoveryServicesBackupSchedulePolicyObject** to obtain the default schedule policy. The **New-AzRecoveryServicesBackupProtectionPolicy** cmdlet creates a PowerShell object that holds backup policy information. The schedule and retention policy objects are used as inputs to the **New-AzRecoveryServicesBackupProtectionPolicy** cmdlet. 

The following example stores the schedule policy and the retention policy in variables. The example uses those variables to define the parameters when the **NewPolicy** protection policy is created.

```powershell
$schPol = Get-AzRecoveryServicesBackupSchedulePolicyObject -WorkloadType "AzureFiles"
$retPol = Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType "AzureFiles"
New-AzRecoveryServicesBackupProtectionPolicy -Name "NewAFSPolicy" -WorkloadType "AzureFiles" -RetentionPolicy $retPol -SchedulePolicy $schPol
```

The output is similar to the following example.

```powershell
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
NewAFSPolicy           AzureFiles            AzureStorage              10/24/2017 1:30:00 AM
```

**NewAFSPolicy** takes a daily backup and retains it for 30 days.

### Enable protection

After you define the protection policy, you can enable the protection for the Azure file share with this policy.

First, fetch the relevant policy object with the **Get-AzRecoveryServicesBackupProtectionPolicy** cmdlet. Use this cmdlet to get a specific policy or to view the policies associated with a workload type.

The following example gets policies for the workload type **AzureFiles**.

```powershell
Get-AzRecoveryServicesBackupProtectionPolicy -WorkloadType "AzureFiles"
```

The output is similar to the following example.

```powershell
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
dailyafs             AzureFiles         AzureStorage         1/10/2018 12:30:00 AM
```

> [!NOTE]
> The time zone of the **BackupTime** field in PowerShell is Universal Coordinated Time (UTC). When the backup time is shown in the Azure portal, the time is adjusted to your local time zone.
>
>

The following policy retrieves the backup policy named **dailyafs**.

```powershell
$afsPol =  Get-AzRecoveryServicesBackupProtectionPolicy -Name "dailyafs"
```

Use **Enable-AzRecoveryServicesBackupProtection** to enable protection of the item with the given policy. After the policy is associated with the vault, the backup workflow is triggered at the time defined in the policy schedule.

The following example enables protection for the Azure file share **testAzureFileShare** under the storage account **testStorageAcct** with the policy **dailyafs**.

```powershell
Enable-AzRecoveryServicesBackupProtection -StorageAccountName "testStorageAcct" -Name "testAzureFS" -Policy $afsPol
```

The command waits until the configure protection job is finished and gives a similar output, as shown.

```cmd
WorkloadName       Operation            Status                 StartTime                                                                                                         EndTime                   JobID
------------             ---------            ------               ---------                                  -------                   -----
testAzureFS       ConfigureBackup      Completed            11/12/2018 2:15:26 PM     11/12/2018 2:16:11 PM     ec7d4f1d-40bd-46a4-9edb-3193c41f6bf6
```

### Trigger an on-demand backup

Use **Backup-AzRecoveryServicesBackupItem** to trigger a backup job for a protected Azure file share. Retrieve the storage account and file share within it by using the following commands and trigger an on-demand backup.

```powershell
$afsContainer = Get-AzRecoveryServicesBackupContainer -FriendlyName "testStorageAcct" -ContainerType AzureStorage
$afsBkpItem = Get-AzRecoveryServicesBackupItem -Container $afsContainer -WorkloadType "AzureFiles" -Name "testAzureFS"
$job =  Backup-AzRecoveryServicesBackupItem -Item $afsBkpItem
```

The command returns a job with an ID to be tracked, as shown in the following example.

```powershell
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   -----
testAzureFS       Backup               Completed            11/12/2018 2:42:07 PM     11/12/2018 2:42:11 PM     8bdfe3ab-9bf7-4be6-83d6-37ff1ca13ab6
```

Azure file share snapshots are used while the backups are taken, so usually the job completes by the time the command returns this output.

### Modify the protection policy

To change the policy with which the Azure file share is protected, use **Enable-AzRecoveryServicesBackupProtection** with the relevant backup item and the new protection policy.

The following example changes the **testAzureFS** protection policy from **dailyafs** to **monthlyafs**.

```powershell
$monthlyafsPol =  Get-AzRecoveryServicesBackupProtectionPolicy -Name "monthlyafs"
$afsContainer = Get-AzRecoveryServicesBackupContainer -FriendlyName "testStorageAcct" -ContainerType AzureStorage
$afsBkpItem = Get-AzRecoveryServicesBackupItem -Container $afsContainer -WorkloadType AzureFiles -Name "testAzureFS"
Enable-AzRecoveryServicesBackupProtection -Item $afsBkpItem -Policy $monthlyafsPol
```

## Restore Azure file shares and Azure files

You can restore an entire file share to its original location or an alternate location. Similarly, individual files from the file share can be restored, too.

### Fetch recovery points

Use the **Get-AzRecoveryServicesBackupRecoveryPoint** cmdlet to list all recovery points for the backup item. In the following script, the variable **$rp** is an array of recovery points for the selected backup item from the past seven days. The array is sorted in reverse order of time with the latest recovery point at index **0**. Use standard PowerShell array indexing to pick the recovery point. In the example, **$rp[0]** selects the latest recovery point.

```powershell
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -Item $afsBkpItem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()

$rp[0] | fl
```

The output is similar to the following example.

```powershell
FileShareSnapshotUri : https://testStorageAcct.file.core.windows.net/testAzureFS?sharesnapshot=2018-11-20T00:31:04.00000
                       00Z
RecoveryPointType    : FileSystemConsistent
RecoveryPointTime    : 11/20/2018 12:31:05 AM
RecoveryPointId      : 86593702401459
ItemName             : testAzureFS
Id                   : /Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Micros                      oft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/StorageContainer;storage;teststorageRG;testStorageAcct/protectedItems/AzureFileShare;testAzureFS/recoveryPoints/86593702401462
WorkloadType         : AzureFiles
ContainerName        : storage;teststorageRG;testStorageAcct
ContainerType        : AzureStorage
BackupManagementType : AzureStorage
```

After the relevant recovery point is selected, restore the file share or file to an alternate location or the original location as explained here.

### Restore Azure file shares to an alternate location

#### Restore an Azure file share

Identify the alternate location by providing the following information:

* **TargetStorageAccountName**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **TargetFileShareName**: The file shares within the target storage account to which the backed-up content is restored.
* **TargetFolder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
* **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

Provide these parameters to the restore command to restore a backed-up file share to an alternate location.

````powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -TargetStorageAccountName "TargetStorageAcct" -TargetFileShareName "DestAFS" -TargetFolder "testAzureFS_restored" -ResolveConflict Overwrite
````

The command returns a job with an ID to be tracked, as shown in the following example.

````powershell
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   -----
testAzureFS        Restore              InProgress           12/10/2018 9:56:38 AM                               9fd34525-6c46-496e-980a-3740ccb2ad75
````

#### Restore an Azure file

To restore an individual file instead of an entire file share, uniquely identify the individual file by providing the following parameters:

* **TargetStorageAccountName**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **TargetFileShareName**: The file shares within the target storage account to which the backed-up content is restored.
* **TargetFolder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
* **SourceFilePath**: The absolute path of the file, to be restored within the file share, as a string. This path is the same path used in the **Get-AzStorageFile** PowerShell cmdlet.
* **SourceFileType**: Whether a directory or a file is selected. Accepts **Directory** or **File**.
* **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

The additional parameters are related only to the individual file that's to be restored.

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -TargetStorageAccountName "TargetStorageAcct" -TargetFileShareName "DestAFS" -TargetFolder "testAzureFS_restored" -SourceFileType File -SourceFilePath "TestDir/TestDoc.docx" -ResolveConflict Overwrite
```

This command also returns a job with an ID to be tracked, as previously shown.

### Restore Azure file shares to the original location

When you restore to an original location, all destination- and target-related parameters don't need to be specified. Only **ResolveConflict** must be provided.

#### Overwrite an Azure file share

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -ResolveConflict Overwrite
```

#### Overwrite an Azure file

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -SourceFileType File -SourceFilePath "TestDir/TestDoc.docx" -ResolveConflict Overwrite
```

## Track backup and restore jobs

On-demand backup and restore operations return a job along with an ID, as shown in the previous section ["Trigger an on-demand backup."](#trigger-an-on-demand-backup) Use the **Get-AzRecoveryServicesBackupJobDetails** cmdlet to track the progress of the job and fetch more details.

```powershell
$job = Get-AzRecoveryServicesBackupJob -JobId 00000000-6c46-496e-980a-3740ccb2ad75 -VaultId $vaultID

 $job | fl


IsCancellable        : False
IsRetriable          : False
ErrorDetails         : {Microsoft.Azure.Commands.RecoveryServices.Backup.Cmdlets.Models.AzureFileShareJobErrorInfo}
ActivityId           : 00000000-5b71-4d73-9465-8a4a91f13a36
JobId                : 00000000-6c46-496e-980a-3740ccb2ad75
Operation            : Restore
Status               : Failed
WorkloadName         : testAFS
StartTime            : 12/10/2018 9:56:38 AM
EndTime              : 12/10/2018 11:03:03 AM
Duration             : 01:06:24.4660027
BackupManagementType : AzureStorage

$job.ErrorDetails

 ErrorCode ErrorMessage                                          Recommendations
 --------- ------------                                          ---------------
1073871825 Microsoft Azure Backup encountered an internal error. Wait for a few minutes and then try the operation again. If the issue persists, please contact Microsoft support.
```

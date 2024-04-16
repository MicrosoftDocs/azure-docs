---
title: Restore Azure Files with PowerShell
description: In this article, learn how to restore Azure Files using the Azure Backup service and PowerShell. 
ms.topic: conceptual
ms.date: 1/27/2020 
ms.custom: devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Files with PowerShell

This article explains how to restore an entire file share, or specific files, from a restore point created by the [Azure Backup](backup-overview.md) service using Azure PowerShell.

You can restore an entire file share or specific files on the share. You can restore to the original location, or to an alternate location.

> [!WARNING]
> Make sure the PowerShell version is upgraded to the minimum version for 'Az.RecoveryServices 2.6.0' for AFS backups. For more information, see [the section](backup-azure-afs-automation.md#important-notice-backup-item-identification) outlining the requirement for this change.

>[!NOTE]
>Azure Backup now supports restoring multiple files or folders to the original or alternate Location using PowerShell. Refer to [this section](#restore-multiple-files-or-folders-to-original-or-alternate-location) of the document to learn how.

## Fetch recovery points

Use [Get-AzRecoveryServicesBackupRecoveryPoint](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackuprecoverypoint) to list all recovery points for the backed-up item.

In the following script:

* The variable **$rp** is an array of recovery points for the selected backup item from the past seven days.
* The array is sorted in reverse order of time with the latest recovery point at index **0**.
* Use standard PowerShell array indexing to pick the recovery point.
* In the example, **$rp[0]** selects the latest recovery point.

```powershell
$vault = Get-AzRecoveryServicesVault -ResourceGroupName "azurefiles" -Name "azurefilesvault"
$Container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureStorage -Status Registered -FriendlyName "afsaccount" -VaultId $vault.ID
$BackupItem = Get-AzRecoveryServicesBackupItem -Container $Container -WorkloadType AzureFiles -VaultId $vault.ID -FriendlyName "azurefiles"
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -Item $BackupItem -VaultId $vault.ID -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
$rp[0] | fl
```

The output is similar to the following.

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

After the relevant recovery point is selected, you restore the file share or file to the original location, or to an alternate location.

## Restore an Azure file share to an alternate location

Use the [Restore-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/restore-azrecoveryservicesbackupitem) to restore to the selected recovery point. Specify these parameters to identify the alternate location:

* **TargetStorageAccountName**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **TargetFileShareName**: The file shares within the target storage account to which the backed-up content is restored.
* **TargetFolder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
* **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

Run the cmdlet with the parameters as follows:

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -TargetStorageAccountName "TargetStorageAcct" -TargetFileShareName "DestAFS" -TargetFolder "testAzureFS_restored" -ResolveConflict Overwrite
```

The command returns a job with an ID to be tracked, as shown in the following example.

```powershell
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   -----
testAzureFS        Restore              InProgress           12/10/2018 9:56:38 AM                               9fd34525-6c46-496e-980a-3740ccb2ad75
```

## Restore an Azure file to an alternate location

Use the [Restore-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/restore-azrecoveryservicesbackupitem) to restore to the selected recovery point. Specify these parameters to identify the alternate location, and to uniquely identify the file you want to restore.

* **TargetStorageAccountName**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **TargetFileShareName**: The file shares within the target storage account to which the backed-up content is restored.
* **TargetFolder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
* **SourceFilePath**: The absolute path of the file, to be restored within the file share, as a string. This path is the same path used in the **Get-AzStorageFile** PowerShell cmdlet.
* **SourceFileType**: Whether a directory or a file is selected. Accepts **Directory** or **File**.
* **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

The additional parameters (SourceFilePath and SourceFileType) are related only to the individual file you want to restore.

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -TargetStorageAccountName "TargetStorageAcct" -TargetFileShareName "DestAFS" -TargetFolder "testAzureFS_restored" -SourceFileType File -SourceFilePath "TestDir/TestDoc.docx" -ResolveConflict Overwrite
```

This command returns a job with an ID to be tracked, as shown in the previous section.

## Restore Azure file shares and files to the original location

When you restore to an original location, you don't need to specify destination- and target-related parameters. Only **ResolveConflict** must be provided.

### Overwrite an Azure file share

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -ResolveConflict Overwrite
```

### Overwrite an Azure file

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -SourceFileType File -SourceFilePath "TestDir/TestDoc.docx" -ResolveConflict Overwrite
```

## Restore multiple files or folders to original or alternate location

Use the [Restore-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/restore-azrecoveryservicesbackupitem) command by passing the path of all files or folders you want to restore as a value for the **MultipleSourceFilePath** parameter.

### Restore multiple files

In the following script, we're trying to restore the *FileSharePage.png* and *MyTestFile.txt* files.

```powershell
$vault = Get-AzRecoveryServicesVault -ResourceGroupName "azurefiles" -Name "azurefilesvault"

$Container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureStorage -Status Registered -FriendlyName "afsaccount" -VaultId $vault.ID

$BackupItem = Get-AzRecoveryServicesBackupItem -Container $Container -WorkloadType AzureFiles -VaultId $vault.ID -FriendlyName "azurefiles"

$RP = Get-AzRecoveryServicesBackupRecoveryPoint -Item $BackupItem -VaultId $vault.ID

$files = ("FileSharePage.png", "MyTestFile.txt")

Restore-AzRecoveryServicesBackupItem -RecoveryPoint $RP[0] -MultipleSourceFilePath $files -SourceFileType File -ResolveConflict Overwrite -VaultId $vault.ID -VaultLocation $vault.Location
```

### Restore multiple directories

In the following script, we're trying to restore the *zrs1_restore* and *Restore* directories.

```powershell
$vault = Get-AzRecoveryServicesVault -ResourceGroupName "azurefiles" -Name "azurefilesvault"

$Container = Get-AzRecoveryServicesBackupContainer -ContainerType AzureStorage -Status Registered -FriendlyName "afsaccount" -VaultId $vault.ID

$BackupItem = Get-AzRecoveryServicesBackupItem -Container $Container -WorkloadType AzureFiles -VaultId $vault.ID -FriendlyName "azurefiles"

$RP = Get-AzRecoveryServicesBackupRecoveryPoint -Item $BackupItem -VaultId $vault.ID

$files = ("Restore","zrs1_restore")

Restore-AzRecoveryServicesBackupItem -RecoveryPoint $RP[0] -MultipleSourceFilePath $files -SourceFileType Directory -ResolveConflict Overwrite -VaultId $vault.ID -VaultLocation $vault.Location
```

The output will be similar to the following:

```output
WorkloadName         Operation         Status          StartTime                EndTime       JobID
------------         ---------         ------          ---------                -------       -----
azurefiles           Restore           InProgress      4/5/2020 8:01:24 AM                    cd36abc3-0242-44b1-9964-0a9102b74d57
```

If you want to restore multiple files or folders to alternate location, use the scripts above by specifying the target location-related parameter values, as explained above in [Restore an Azure file to an alternate location](#restore-an-azure-file-to-an-alternate-location).

## Next steps

[Learn about](restore-afs.md) restoring Azure Files in the Azure portal.

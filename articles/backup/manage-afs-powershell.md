---
title: Manage Azure Files backups with PowerShell
description: Learn how to use PowerShell to manage and monitor Azure Files backed up by the Azure Backup service.
ms.topic: how-to
ms.date: 03/05/2025
ms.custom: devx-track-azurepowershell
author: jyothisuri
ms.author: jsuri
# Customer intent: As an IT administrator managing Azure Files, I want to utilize PowerShell to modify backup configurations and monitor job statuses, so that I can ensure efficient data protection and recovery processes for my organization's cloud storage.
---

# Manage Azure Files backups with PowerShell

This article describes how to manage and monitor the backed-up Azure Files ([snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups) using Azure Backup via Azure PowerShell. You can also manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).

> [!WARNING]
> Make sure the PowerShell version is upgraded to the minimum version for `Az.RecoveryServices 2.6.0` for Azure Files backups. [Learn more about the requirements for the change](backup-azure-afs-automation.md#important-notice-backup-item-identification).

## Modify the protection policy

**Choose a backup tier**:

# [Snapshot tier](#tab/snapshot)

To change the policy used for backing up the Azure Files, use [Enable-AzRecoveryServicesBackupProtection](/powershell/module/az.recoveryservices/enable-azrecoveryservicesbackupprotection). Specify the relevant backup item and the new backup policy.

The following example changes the **testAzureFS** protection policy from **dailyafs** to **monthlyafs**.

```powershell
$monthlyafsPol =  Get-AzRecoveryServicesBackupProtectionPolicy -Name "monthlyafs"
$afsContainer = Get-AzRecoveryServicesBackupContainer -FriendlyName "testStorageAcct" -ContainerType AzureStorage
$afsBkpItem = Get-AzRecoveryServicesBackupItem -Container $afsContainer -WorkloadType AzureFiles -Name "testAzureFS"
Enable-AzRecoveryServicesBackupProtection -Item $afsBkpItem -Policy $monthlyafsPol
```

# [Vault-Standard tier](#tab/vault-standard)

To modify an existing backup policy, run the following cmdlets:

1. Fetch the backup policy details.

    ```azurepowershell-interactive
    $retentionPolicy = Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType AzureFiles -BackupTier VaultStandard 
    $retentionpolicy
    ```

   Example output:

    ```Output 
    PS C:\Users\testuser> $retentionPolicy

    SnapshotRetentionInDays  : 5
    IsDailyScheduleEnabled   : True
    IsWeeklyScheduleEnabled  : False
    IsMonthlyScheduleEnabled : False
    IsYearlyScheduleEnabled  : False
    DailySchedule            : DurationCountInDays: 30, RetentionTimes: {12/18/2024 7:30:00 AM}
    WeeklySchedule           : DurationCountInWeeks: 12, DaysOfTheWeek: {Sunday}, RetentionTimes: {12/18/2024 7:30:00 AM}
    MonthlySchedule          : DurationCountInMonths:60, RetentionScheduleType:Weekly, RetentionTimes: {12/18/2024 7:30:00 AM},
                            RetentionScheduleDaily:DaysOfTheMonth:{Date:1, IsLast:False},RetentionScheduleWeekly:DaysOfTheWeek:{Sunday},
                            WeeksOfTheMonth:{First}, RetentionTimes: {12/18/2024 7:30:00 AM}
    YearlySchedule           : DurationCountInYears:10, RetentionScheduleType:Weekly, RetentionTimes: {12/18/2024 7:30:00 AM},
                            RetentionScheduleDaily:DaysOfTheMonth:{Date:1, IsLast:False},RetentionScheduleWeekly:DaysOfTheWeek:{Sunday},
                            WeeksOfTheMonth:{First}, MonthsOfYear: {January}, RetentionTimes: {12/18/2024 7:30:00 AM}
    BackupManagementType     : AzureStorage
    ```

2. Create new retention base object required for modifying a policy.

    ```azurepowershell-interactive
    Set-AzRecoveryServicesBackupProtectionPolicy ` 
        -VaultId $vault.ID ` 
        -RetentionPolicy $retentionPolicy ` 
        -SchedulePolicy $schedulePolicy ` 
        -Policy $policy -debug 
    ```
 
---

## Modify protection for an existing backup instance
To modify protection for  an existing backup instance, run the following cmdlets:

1. Get the containers available in the storage account. 

    ```azurepowershell-interactive
    $saName = "MyStorage" 
    $container = Get-AzRecoveryServicesBackupContainer ` 
    -VaultId $vault.ID ` 
    -ContainerType AzureStorage ` 
    -FriendlyName $saName 
    $container
    ```

   Example output:

    ```Output
    PS C:\Users\testuser> $container

    FriendlyName                             ResourceGroupName                        Status               ContainerType
    ------------                             -----------------                        ------               -------------
    dayaafssa                                Daya-BCDR-RG                             Registered           AzureStorage
    ```

2. Get the backup item to modify. 

    ```azurepowershell-interactive
    $item = Get-AzRecoveryServicesBackupItem ` 
    -VaultId $vault.ID ` 
    -Container $container ` 
    -WorkloadType AzureFiles 
    ```

   Example output:

    ```Output
    PS C:\Users\testuser> $item

    Name                                     FriendlyName         ContainerType        ContainerUniqueName                      WorkloadType         Protec
                                                                                                                                                    tionSt
                                                                                                                                                    atus
    ----                                     ------------         -------------        -------------------                      ------------         ------
    AzureFileShare;C3706F26E2AED1C4082559C3… dpafs-2              AzureStorage         StorageContainer;Storage;Daya-BCDR-RG;d… AzureFiles           Healt…
    AzureFileShare;216165261F88994EC0E80277… dpafs-1              AzureStorage         StorageContainer;Storage;Daya-BCDR-RG;d… AzureFiles           Healt…
    ```

3. Modify the protection.

    ```azurepowershell-interactive
    $enableJob =  Enable-AzRecoveryServicesBackupProtection ` 
    -VaultId $vault.ID ` 
    -Policy $policy ` 
    -Item $item[01] 
    ```


## Track backup and restore jobs

On-demand backup and restore operations return a job along with an ID, as shown when you [run an on-demand backup](backup-azure-afs-automation.md#trigger-an-on-demand-backup). Use the [Get-AzRecoveryServicesBackupJobDetails](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupjob) cmdlet to track the job progress and details.

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

## Stop protection on a File Share

You can stop protection for Azure Files by using one of the following ways:

* Stop all future backup jobs and *delete* all recovery points
* Stop all future backup jobs but *leave* the recovery points

There might be a cost associated with leaving the recovery points in storage, as the underlying snapshots created by Azure Backup is retained. However, the benefit of leaving the recovery points is you can restore the File Share later, if desired. For information about the cost of leaving the recovery points, see the [pricing details](https://azure.microsoft.com/pricing/details/storage/files/). If you choose to delete all recovery points, you can't restore the File Share.

## Stop protection and retain recovery points

To stop protection while retaining data, use the [Disable-AzRecoveryServicesBackupProtection](/powershell/module/az.recoveryservices/disable-azrecoveryservicesbackupprotection) cmdlet.

The following example stops protection for the *afsfileshare* File Share but retains all recovery points:

```powershell
$vaultID = Get-AzRecoveryServicesVault -ResourceGroupName "afstesting" -Name "afstest" | select -ExpandProperty ID
$bkpItem = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureStorage -WorkloadType AzureFiles -Name "afsfileshare" -VaultId $vaultID
Disable-AzRecoveryServicesBackupProtection -Item $bkpItem -VaultId $vaultID
```

```output
WorkloadName     Operation         Status         StartTime                 EndTime                   JobID
------------     ---------         ------         ---------                 -------                   -----
afsfileshare     DisableBackup     Completed      1/26/2020 2:43:59 PM      1/26/2020 2:44:21 PM      98d9f8a1-54f2-4d85-8433-c32eafbd793f
```

The Job ID attribute in the output corresponds to the Job ID of the job that's created by the backup service for your **stop protection** operation. To track the status of the job, use the [Get-AzRecoveryServicesBackupJob](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupjob) cmdlet.

## Stop protection without retaining recovery points

To stop protection without retaining recovery points, use the [Disable-AzRecoveryServicesBackupProtection](/powershell/module/az.recoveryservices/disable-azrecoveryservicesbackupprotection) cmdlet and add the **-RemoveRecoveryPoints** parameter.

The following example stops protection for the *afsfileshare* File Share without retaining recovery points:

```powershell
$vaultID = Get-AzRecoveryServicesVault -ResourceGroupName "afstesting" -Name "afstest" | select -ExpandProperty ID
$bkpItem = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureStorage -WorkloadType AzureFiles -Name "afsfileshare" -VaultId $vaultID
Disable-AzRecoveryServicesBackupProtection -Item $bkpItem -VaultId $vaultID -RemoveRecoveryPoints
```

```output
WorkloadName     Operation            Status         StartTime                 EndTime                   JobID
------------     ---------            ------         ---------                 -------                   -----
afsfileshare     DeleteBackupData     Completed      1/26/2020 2:50:57 PM      1/26/2020 2:51:39 PM      b1a61c0b-548a-4687-9d15-9db1cc5bcc85
```

## Next steps

[Learn about](manage-afs-backup.md) managing Azure Files backups in the Azure portal.

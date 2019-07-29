---
title: Back up and restore Azure Files using Azure Backup and PowerShell
description: Back up and restore Azure Files using Azure Backup and PowerShell. 
author: pvrk
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 03/05/2018
ms.author: pullabhk
---

# Back up and restore Azure Files with PowerShell

This article describes how to use Azure PowerShell to back up and recover an Azure Files file share using an [Azure Backup](backup-overview.md) Recovery Services vault. 

This tutorial explains how to:

> [!div class="checklist"]
> * Set up PowerShell and register the Azure Recovery Services Provider.
> * Create a Recovery Services vault.
> * Configure backup for an Azure file share.
> * Run a backup job.
> * Restore a backed up Azure file share, or an individual file from a share.
> * Monitor backup and restore jobs.


## Before you start

- [Learn more](backup-azure-recovery-services-vault-overview.md) about Recovery Services vaults.
- Read about the preview capabilities for [backing up Azure file shares](backup-azure-files.md).
- Review the PowerShell object hierarchy for Recovery Services.


## Recovery Services object hierarchy

The object hierarchy is summarized in the following diagram.

![Recovery Services object hierarchy](./media/backup-azure-vms-arm-automation/recovery-services-object-hierarchy.png)

Review the **Az.RecoveryServices** [cmdlet reference](/powershell/module/az.recoveryservices) reference in the Azure library.


## Set up and install

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Set up PowerShell as follows:

1. [Download the latest version of Az PowerShell](/powershell/azure/install-az-ps). The minimum version required is 1.0.0.

2. Find the Azure Backup PowerShell cmdlets with this command:

    ```powershell
    Get-Command *azrecoveryservices*
    ```
3. Review the aliases and cmdlets for Azure Backup, Azure Site Recovery, and the Recovery Services vault appear. Here's an example of what you might see. It's not a complete list of cmdlets.

    ![List of Recovery Services cmdlets](./media/backup-azure-afs-automation/list-of-recoveryservices-ps-az.png)

3. Sign in to your Azure account with **Connect-AzAccount**.
4. On the web page that appears, you're prompted to input your account credentials.

    - Alternately, you can include your account credentials as a parameter in the **Connect-AzAccount** cmdlet with **-Credential**.
    - If you're a CSP partner working on behalf of a tenant, specify the customer as a tenant, using their tenantID or tenant primary domain name. An example is **Connect-AzAccount -Tenant** fabrikam.com.

4. Associate the subscription you want to use with the account, because an account can have several subscriptions.

    ```powershell
    Select-AzSubscription -SubscriptionName $SubscriptionName
    ```

5. If you're using Azure Backup for the first time, use the **Register-AzResourceProvider** cmdlet to register the Azure Recovery Services provider with your subscription.

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```

6. Verify that the providers registered successfully:

    ```powershell
    Get-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```
7. In the command output, verify that **RegistrationState** changes to **Registered**. If it doesn't, run the **Register-AzResourceProvider** cmdlet again.



## Create a Recovery Services vault

Follow these steps to create a Recovery Services vault.

- The Recovery Services vault is a Resource Manager resource, so you must place it within a resource group. You can use an existing resource group, or you can create a resource group with the **New-AzResourceGroup** cmdlet. When you create a resource group, specify the name and location for the resource group. 

1. A vault is placed in a resource group. If you don't have an existing resource group, create a new one with the [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup?view=azps-1.4.0). In this example, we create a new resource group in the West US region.

   ```powershell
   New-AzResourceGroup -Name "test-rg" -Location "West US"
   ```
2. Use the [New-AzRecoveryServicesVault](https://docs.microsoft.com/powershell/module/az.recoveryservices/New-AzRecoveryServicesVault?view=azps-1.4.0) cmdlet to create the vault. Specify the same location for the vault as was used for the resource group.

    ```powershell
    New-AzRecoveryServicesVault -Name "testvault" -ResourceGroupName "test-rg" -Location "West US"
    ```
3. Specify the type of redundancy to use for the vault storage.

   - You can use [locally redundant storage](../storage/common/storage-redundancy-lrs.md) or [geo-redundant storage](../storage/common/storage-redundancy-grs.md).
   - The following example sets the **-BackupStorageRedundancy** option for the[Set-AzRecoveryServicesBackupProperties](https://docs.microsoft.com/powershell/module/az.recoveryservices/set-azrecoveryservicesbackupproperty) cmd for **testvault** set to **GeoRedundant**.

     ```powershell
     $vault1 = Get-AzRecoveryServicesVault -Name "testvault"
     Set-AzRecoveryServicesBackupProperties  -Vault $vault1 -BackupStorageRedundancy GeoRedundant
     ```

### View the vaults in a subscription

To view all vaults in the subscription, use [Get-AzRecoveryServicesVault](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesvault?view=azps-1.4.0).

```powershell
Get-AzRecoveryServicesVault
```

The output is similar to the following. Note that the associated resource group and location are provided.

```powershell
Name              : Contoso-vault
ID                : /subscriptions/1234
Type              : Microsoft.RecoveryServices/vaults
Location          : WestUS
ResourceGroupName : Contoso-docs-rg
SubscriptionId    : 1234-567f-8910-abc
Properties        : Microsoft.Azure.Commands.RecoveryServices.ARSVaultProperties
```

### Set the vault context

Store the vault object in a variable, and set the vault context.

- Many Azure Backup cmdlets require the Recovery Services vault object as an input, so it's convenient to store the vault object in a variable.
- The vault context is the type of data protected in the vault. Set it with [Set-AzRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/az.recoveryservices/set-azrecoveryservicesvaultcontext?view=azps-1.4.0). After the context is set, it applies to all subsequent cmdlets.


The following example sets the vault context for **testvault**.

```powershell
Get-AzRecoveryServicesVault -Name "testvault" | Set-AzRecoveryServicesVaultContext
```

### Fetch the vault ID

We plan on deprecating the vault context setting in accordance with Azure PowerShell guidelines. Instead, you can store or fetch the vault ID, and pass it to relevant commands, as follows:

```powershell
$vaultID = Get-AzRecoveryServicesVault -ResourceGroupName "Contoso-docs-rg" -Name "testvault" | select -ExpandProperty ID
```

## Configure a backup policy

A backup policy specifies the schedule for backups, and how long backup recovery points should be kept:

- A backup policy is associated with at least one retention policy. A retention policy defines how long a recovery point is kept before it's deleted.
- View the default backup policy retention using [Get-AzRecoveryServicesBackupRetentionPolicyObject](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupretentionpolicyobject?view=azps-1.4.0).
- View the default backup policy schedule using [Get-AzRecoveryServicesBackupSchedulePolicyObject](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupschedulepolicyobject?view=azps-1.4.0).
-  You use the [New-AzRecoveryServicesBackupProtectionPolicy](https://docs.microsoft.com/powershell/module/az.recoveryservices/set-azrecoveryservicesbackupprotectionpolicy?view=azps-1.4.0) cmdlet to create a new backup policy. You input the schedule and retention policy objects.

The following example stores the schedule policy and the retention policy in variables. It then uses those variable as parameters for a new policy (**NewAFSPolicy**). **NewAFSPolicy** takes a daily backup and retains it for 30 days.

```powershell
$schPol = Get-AzRecoveryServicesBackupSchedulePolicyObject -WorkloadType "AzureFiles"
$retPol = Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType "AzureFiles"
New-AzRecoveryServicesBackupProtectionPolicy -Name "NewAFSPolicy" -WorkloadType "AzureFiles" -RetentionPolicy $retPol -SchedulePolicy $schPol
```

The output is similar to the following.

```powershell
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
NewAFSPolicy           AzureFiles            AzureStorage              10/24/2017 1:30:00 AM
```



## Enable backup

After you define the backup policy, you can enable the protection for the Azure file share using the policy.

### Retrieve a backup policy

You fetch the relevant policy object with [Get-AzRecoveryServicesBackupProtectionPolicy](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupprotectionpolicy?view=azps-1.4.0). Use this cmdlet to get a specific policy, or to view the policies associated with a workload type.

#### Retrieve a policy for a workload type

The following example retrieves policies for the workload type **AzureFiles**.

```powershell
Get-AzRecoveryServicesBackupProtectionPolicy -WorkloadType "AzureFiles"
```

The output is similar to the following.

```powershell
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
dailyafs             AzureFiles         AzureStorage         1/10/2018 12:30:00 AM
```
> [!NOTE]
> The time zone of the **BackupTime** field in PowerShell is Universal Coordinated Time (UTC). When the backup time is shown in the Azure portal, the time is adjusted to your local time zone.

### Retrieve a specific policy

The following policy retrieves the backup policy named **dailyafs**.

```powershell
$afsPol =  Get-AzRecoveryServicesBackupProtectionPolicy -Name "dailyafs"
```

### Enable backup and apply policy

Enable protection with [Enable-AzRecoveryServicesBackupProtection](https://docs.microsoft.com/powershell/module/az.recoveryservices/enable-azrecoveryservicesbackupprotection?view=azps-1.4.0). After the policy is associated with the vault, backups are triggered in accordance with the policy schedule.

The following example enables protection for the Azure file share **testAzureFileShare** in storage account **testStorageAcct**, with the policy **dailyafs**.

```powershell
Enable-AzRecoveryServicesBackupProtection -StorageAccountName "testStorageAcct" -Name "testAzureFS" -Policy $afsPol
```

The command waits until the configure protection job is finished and gives a similar output, as shown.

```cmd
WorkloadName       Operation            Status                 StartTime                                                                                                         EndTime                   JobID
------------             ---------            ------               ---------                                  -------                   -----
testAzureFS       ConfigureBackup      Completed            11/12/2018 2:15:26 PM     11/12/2018 2:16:11 PM     ec7d4f1d-40bd-46a4-9edb-3193c41f6bf6
```

## Trigger an on-demand backup

Use [Backup-AzRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/az.recoveryservices/backup-azrecoveryservicesbackupitem?view=azps-1.4.0) to run an on-demand backup for a protected Azure file share.

1. Retrieve the storage account and file share from the container in the vault that holds your backup data with [Get-AzRecoveryServicesBackupContainer](/powershell/module/az.recoveryservices/get-Azrecoveryservicesbackupcontainer).
2. To start a backup job, you obtain information about the VM with [Get-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/Get-AzRecoveryServicesBackupItem).
3. Run an on-demand backup with[Backup-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/backup-Azrecoveryservicesbackupitem).

Run the on-demand backup as follows:
    
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

To change the policy used for backing up the Azure file share, use [Enable-AzRecoveryServicesBackupProtection](https://docs.microsoft.com/powershell/module/az.recoveryservices/enable-azrecoveryservicesbackupprotection?view=azps-1.4.0). Specify the relevant backup item and the new backup policy.

The following example changes the **testAzureFS** protection policy from **dailyafs** to **monthlyafs**.

```powershell
$monthlyafsPol =  Get-AzRecoveryServicesBackupProtectionPolicy -Name "monthlyafs"
$afsContainer = Get-AzRecoveryServicesBackupContainer -FriendlyName "testStorageAcct" -ContainerType AzureStorage
$afsBkpItem = Get-AzRecoveryServicesBackupItem -Container $afsContainer -WorkloadType AzureFiles -Name "testAzureFS"
Enable-AzRecoveryServicesBackupProtection -Item $afsBkpItem -Policy $monthlyafsPol
```

## Restore Azure file shares and files

You can restore an entire file share or specific files on the share. You can restore to the original location, or to an alternate location. 

### Fetch recovery points

Use [Get-AzRecoveryServicesBackupRecoveryPoint](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesbackuprecoverypoint?view=azps-1.4.0) to list all recovery points for the backed up item.

In the following script:

- The variable **$rp** is an array of recovery points for the selected backup item from the past seven days.
- The array is sorted in reverse order of time with the latest recovery point at index **0**.
- Use standard PowerShell array indexing to pick the recovery point.
- In the example, **$rp[0]** selects the latest recovery point.

```powershell
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -Item $afsBkpItem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()

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

### Restore an Azure file share to an alternate location

Use the [Restore-AzRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/az.recoveryservices/restore-azrecoveryservicesbackupitem?view=azps-1.4.0) to restore to the selected recovery point. Specify these parameters to identify the alternate location: 

- **TargetStorageAccountName**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
- **TargetFileShareName**: The file shares within the target storage account to which the backed-up content is restored.
- **TargetFolder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
- **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

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

### Restore an Azure file to an alternate location

Use the [Restore-AzRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/az.recoveryservices/restore-azrecoveryservicesbackupitem?view=azps-1.4.0) to restore to the selected recovery point. Specify these parameters to identify the alternate location, and to uniquely identify the file you want to restore.

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

### Restore Azure file shares and files to the original location

When you restore to an original location, you don't need to specify destination- and target-related parameters. Only **ResolveConflict** must be provided.

#### Overwrite an Azure file share

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -ResolveConflict Overwrite
```

#### Overwrite an Azure file

```powershell
Restore-AzRecoveryServicesBackupItem -RecoveryPoint $rp[0] -SourceFileType File -SourceFilePath "TestDir/TestDoc.docx" -ResolveConflict Overwrite
```

## Track backup and restore jobs

On-demand backup and restore operations return a job along with an ID, as shown when you [ran an on-demand backup](#trigger-an-on-demand-backup). Use the [Get-AzRecoveryServicesBackupJobDetails](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupjob?view=azps-1.4.0) cmdlet to track the job progress and details.

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
## Next steps
[Learn about](backup-azure-files.md) backing up Azure Files in the Azure portal.

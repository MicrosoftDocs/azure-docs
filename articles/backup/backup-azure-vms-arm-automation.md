<properties
   pageTitle="Deploy and manage backup for Azure VMs using PowerShell | Microsoft Azure"
   description="Learn how to deploy and manage Azure Backup using PowerShell"
   services="backup"
   documentationCenter=""
   authors="markgalioto"
   manager="jwhit"
   editor=""/>

<tags
   ms.service="backup"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="storage-backup-recovery"
   ms.date="05/09/2016"
   ms.author="markgal; trinadhk"/>

# Deploy and manage backup for ARM VMs using PowerShell

This article shows you how to use Azure PowerShell to back up and recover an Azure virtual machine (VM) from a Recovery Services vault. A Recovery Services vault is an Azure Resource Manager (ARM) resource and is used to protect data and assets in both Azure Backup and Azure Site Recovery services. Use a Recovery Services vault when working in an ARM deployment. If you are using an Azure Service Manager (ASM) deployment, then you must use a Backup vault.

>[AZURE.NOTE] Azure has two deployment models for creating and working with resources: [Resource Manager and Classic](../resource-manager-deployment-model.md). This article is for use with VMs created using the Resource Manager model.

This article walks you through using PowerShell to protect a VM, and restore data from a recovery point.

## Concepts

If you are not familiar with the Azure Backup service, for an overview of the service, check out [What is Azure Backup?](backup-introduction-to-azure-backup.md) Before you start, ensure that you cover the essentials about the prerequisites needed to work with Azure Backup, and the limitations of the current VM backup solution.

In order to use PowerShell effectively, it is necessary to understand the hierarchy of objects and from where to start.

Object hierarchy


## Setup and Registration

To begin:

1. [Download the latest version of PowerShell](https://github.com/Azure/azure-powershell/releases) (the minimum version required is : 1.0.0)

2. Find the Azure Backup PowerShell cmdlets available by typing the following command:

```
S C:\WINDOWS\system32> Get-Command \*azurermrecoveryservices\*

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Backup-AzureRmRecoveryServicesBackupItem           1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Disable-AzureRmRecoveryServicesBackupProtection    1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Enable-AzureRmRecoveryServicesBackupProtection     1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupContainer         1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupItem              1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupJob               1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupJobDetails        1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupManagementServer  1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupProperties        1.0.7      AzureRM.RecoveryServices
Cmdlet          Get-AzureRmRecoveryServicesBackupProtectionPolicy  1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRMRecoveryServicesBackupRecoveryPoint     1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupRetentionPolic... 1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesBackupSchedulePolicy... 1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Get-AzureRmRecoveryServicesVault                   1.0.7      AzureRM.RecoveryServices
Cmdlet          Get-AzureRmRecoveryServicesVaultSettingsFile       1.0.7      AzureRM.RecoveryServices
Cmdlet          New-AzureRmRecoveryServicesBackupProtectionPolicy  1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          New-AzureRmRecoveryServicesVault                   1.0.7      AzureRM.RecoveryServices
Cmdlet          Remove-AzureRmRecoveryServicesProtectionPolicy     1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Remove-AzureRmRecoveryServicesVault                1.0.7      AzureRM.RecoveryServices
Cmdlet          Restore-AzureRMRecoveryServicesBackupItem          1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Set-AzureRmRecoveryServicesBackupProperties        1.0.7      AzureRM.RecoveryServices
Cmdlet          Set-AzureRmRecoveryServicesBackupProtectionPolicy  1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Set-AzureRmRecoveryServicesVaultContext            1.0.7      AzureRM.RecoveryServices
Cmdlet          Stop-AzureRmRecoveryServicesBackupJob              1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Unregister-AzureRmRecoveryServicesBackupContainer  1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Unregister-AzureRmRecoveryServicesBackupManagem... 1.0.0      AzureRM.RecoveryServices.Backup
Cmdlet          Wait-AzureRmRecoveryServicesBackupJob              1.0.0      AzureRM.RecoveryServices.Backup
```


The following setup and registration tasks can be automated with PowerShell:

- Create a Recovery Services vault
- Register the VMs with the Azure Backup service

## Create a Recovery Services vault

> [AZURE.NOTE] For customers using Azure Backup for the first time, you must register the Azure Recovery Service provider to be used with your subscription. This can be done by running the following command: Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"

You can create a new Recovery Services vault using the **New-AzureRmRecoveryServicesVault** cmdlet. The Recovery Services vault is an ARM resource, so you need to place it within a Resource Group. In an elevated Azure PowerShell console, run the following commands:

```
PS C:\> New-AzureRmResourceGroup –Name "test-rg" –Location "West US"
PS C:\> $backupvault = New-AzureRmBackupVault –ResourceGroupName "test-rg" –Name "test-vault" –Region "West US" –Storage GeoRedundant
PS C:\> New-AzureRmRecoveryServicesVault -Name "testvault" -ResourceGroupName " test-rg" -Location "West US"
```

To view a list of all Recovery Services vaults in a subscription use the **Get-AzureRmRecoveryServicesVault** cmdlet.

### Set storage redundancy
When creating a Recovery Services vault, specify the type of storage redundancy to use - Locally Redundant Storage (LRS) or Geo Redundant Storage (GRS). The following example shows the BackupStorageRedundancy option for testVault is set to GeoRedundant.

```
PS C:\> $vault1 = Get-AzureRmRecoveryServicesVault –Name "testVault"
PS C:\> Set-AzureRmRecoveryServicesBackupProperties  -vault $vault1 -BackupStorageRedundancy GeoRedundant
```


> [AZURE.TIP] Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it is convenient to store the backup Recovery Services vault object in a variable.

## Registering Windows Server or DPM to a Recovery Services Vault

After you created the Recovery Services vault, download the latest agent and the vault credentials and store it in a convenient location like C:\Downloads.

```
PS C:\> $credspath = "C:\downloads"
PS C:\> $credsfilename = Get-AzureRmRecoveryServicesVaultSettingsFile -Backup -Vault $vault1 -Path  $credspath
PS C:\> $credsfilename
C:\downloads\testvault\_Sun Apr 10 2016.VaultCredentials
```

On the Windows Server or DPM server, run the [Start-OBRegistration](https://technet.microsoft.com/library/hh770398%28v=wps.630%29.aspx) cmdlet to register the machine with the vault.

```
PS C:\> $cred = $credspath + $credsfilename
PS C:\> Start-OBRegistration-VaultCredentials $cred -Confirm:$false
CertThumbprint      :7a2ef2caa2e74b6ed1222a5e89288ddad438df2
SubscriptionID      : ef4ab577-c2c0-43e4-af80-af49f485f3d1
ServiceResourceName: testvault
Region              :West US
Machine registration succeeded.
```

## Backup Azure VMs

Before enabling protection on a VM, you must set the vault context. The context is applied to all subsequent cmdlets.

```
PS C:\> Get-AzureRmRecoveryServicesVault -Name testvault | Set-AzureRmRecoveryServicesVaultContext
```

### Create a protection policy

When you create a new vault, it comes with a default policy. This  policy triggers a backup job each day at 9:30PM. The backup snapshot is retained for 30 days. You can use the default policy to quickly protect your VM and edit the policy later with different details.

To view the available list of the policies in the vault use the Get-AzureRmRecoveryServicesBackupProtectionPolicy cmdlet:

```
PS C:\WINDOWS\system32> get-AzureRMRecoveryServicesBackupProtectionPolicy
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
DefaultPolicy        AzureVM            AzureVM              4/14/2016 5:00:00 PM
```

> [AZURE.NOTE] The timezone of the BackupTime field in PowerShell is UTC. However, when the backup time is shown in the Azure portal, the time is adjusted to your local timezone.

A backup protection policy is associated with at least one retention policy.  Retention policy defines how long a recovery point is kept with Azure Backup. Use Get-AzureRmRecoveryServicesBackupRetentionPolicyObject to view the default retention policy. The New-AzureRmBackupRetentionPolicy cmdlet creates PowerShell objects that hold retention policy information. Similarly you can obtain the default schedule policy using Get-AzureRmRecoveryServicesBackupSchedulePolicyObject. The schedule and retention policy objects are used as inputs to the New-AzureRmRecoveryServicesBackupProtectionPolicy cmdlet, New-AzureRmBackupProtectionPolicy cmdlet, or directly with the Enable-AzureRmBackupProtection cmdlet.

A backup protection policy defines when and how often the backup of an item is done. The New-AzureRmRecoveryServicesBackupProtectionPolicy cmdlet or New-AzureRmBackupProtectionPolicy cmdlet creates a PowerShell object that holds backup policy information. The backup policy is used as an input to the Enable-AzureRmRecoveryServicesBackupProtection cmdlet or Enable-AzureRmBackupProtection cmdlet.

```
PS C:\> $schPol = Get-AzureRmRecoveryServicesBackupSchedulePolicyObject -WorkloadType "AzureVM"
PS C:\>  $retPol = Get-AzureRmRecoveryServicesBackupRetentionPolicyObject -WorkloadType "AzureVM"
PS C:\>  New-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy" -WorkloadTypeAzureVM -RetentionPolicy $retPol -SchedulePolicy $schPol
Name                 WorkloadType       BackupManagementType BackupTime                DaysOfWeek
----                 ------------       -------------------- ----------                ----------
NewPolicy           AzureVM            AzureVM              4/24/2016 1:30:00 AM
PS C:\> $Daily = New-AzureRmBackupRetentionPolicyObject -DailyRetention -Retention 30
PS C:\> $newpolicy = New-AzureRmBackupProtectionPolicy -Name DailyBackup01 -Type AzureVM -Daily -BackupTime ([datetime]"3:30 PM") -RetentionPolicy $Daily -Vault $backupvault
Name                      Type               ScheduleType       BackupTime
----                      ----               ------------       ----------
DailyBackup01             AzureVM            Daily              01-Sep-15 3:30:00 PM
```

### Enable protection

Enabling protection involves two objects - the item and the policy. Both objects are required to enable protection on the vault. Once the policy has been associated with the item, the backup workflow is triggered at the time defined in the policy schedule.

```
PS C:\> $pol=Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
PS C:\> Enable-AzureRmRecoveryServicesBackupProtection -Policy $pol -Name "V2VM" -ResourceGroupName "RGName1"
PS C:\> Get-AzureRmBackupContainer -Type AzureVM -Status Registered -Vault $backupvault | Get-AzureRmBackupItem | Enable-AzureRmBackupProtection -Policy $newpolicy
```

For ASM based VMs

```
PS C:\>  $pol=Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
PS C:\>  Enable-AzureRmRecoveryServicesBackupProtection -Policy $pol -Name "V1VM" -ServiceName "ServiceName1"
```

### Modify a protection policy

In order to modify the policy, modify the BackupSchedulePolicyObject or BackupRetentionPolicy object and modify the policy using Set-AzureRmRecoveryServicesBackupProtectionPolicy

The following example changes the retention count to 365.

```
PS C:\> $retPol = Get-AzureRmRecoveryServicesBackupRetentionPolicyObject -WorkloadType "AzureVM"
PS C:\> $retPol.DailySchedule.DurationCountInDays = 365
PS C:\> $pol= Get-AzureRMRecoveryServicesBackupProtectionPolicy -Name NewPolicy
PS C:\> Set-AzureRmRecoveryServicesBackupProtectionPolicy -Policy $pol  -RetentionPolicy  $RetPol
```

## Run an initial backup

The backup schedule triggers a full back up on the initial back up for the item. On subsequent back ups, the back up is an incremental copy. If you want to force the initial backup to happen at a certain time or even immediately then use the Backup-AzureRmBackupItem cmdlet:

```
PS C:\> $namedContainer = Get-AzureRmRecoveryServicesContainer -ContainerType "AzureVM" -Status "Registered" -Name "V2VM";
PS C:\> $item = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer -WorkloadType "AzureVM";
PS C:\> $job = **Backup-**** AzureRmRecoveryServicesItem** -Item $item;
WorkloadName     Operation            Status               StartTime                 EndTime                   InstanceID
------------     ---------            ------               ---------                 -------                   ----------
V2VM        Backup               InProgress            4/23/2016 5:00:30 PM            cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
PS C:\> $container = Get-AzureRmBackupContainer -Vault $backupvault -Type AzureVM -Name "testvm"
PS C:\> $backupjob = Get-AzureRmBackupItem -Container $container | Backup-AzureRmBackupItem
PS C:\> $backupjob
WorkloadName    Operation       Status          StartTime              EndTime
------------    ---------       ------          ---------              -------
testvm          Backup          InProgress      01-Sep-15 12:24:01 PM  01-Jan-01 12:00:00 AM
```

> [AZURE.NOTE: The timezone of the StartTime and EndTime fields in PowerShell is UTC. However, when the time is shown in the Azure portal, the time is adjusted to your local timezone.

## Monitoring a backup job

Most long-running operations in Azure Backup are modelled as a job. This makes it easy to track progress without having to keep the Azure portal open at all times.

To get the latest status of an in-progress job, use the Get-AzureRMRecoveryservicesBackupJob Get-AzureRmBackupJob cmdlet.

```
PS C:\ > $joblist = Get-AzureRMRecoveryservicesBackupJob –Status InProgress
PS C:\ > $joblist[0]
WorkloadName     Operation            Status               StartTime                 EndTime                   InstanceID
------------     ---------            ------               ---------                 -------                   ----------
V2VM        Backup               InProgress            4/23/2016 5:00:30 PM           cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
PS C:\> $joblist = Get-AzureRmBackupJob -Vault $backupvault -Status InProgress
PS C:\> $joblist[0]
WorkloadName    Operation       Status          StartTime              EndTime
------------    ---------       ------          ---------              -------
testvm          Backup          InProgress      01-Sep-15 12:24:01 PM  01-Jan-01 12:00:00 AM
```

Instead of polling these jobs for completion - which is unnecessary, additional code - it is simpler to use the Wait-AzureRmBackupJob Wait-AzureRmRecoveryServicesBackupJob cmdlet. When used in a script, the cmdlet will pause the execution until either the job completes or the specified timeout value is reached.

```
PS C:\> Wait-AzureRmRecoveryServicesBackupJob Wait-AzureRmBackupJob -Job $joblist[0] -Timeout 43200
```

## Restore an Azure VM

In order to restore backup data, you need to identify the backed-up item and the recovery point that holds the point-in-time data. This information is supplied to the Restore-AzureRmBackupItem Restore-AzureRMRecoveryServicesBackupItem cmdlet to initiate a restore of data from the vault to the customer's account.

### Select the VM

To get the PowerShell object that identifies the right backup item, start from the container in the vault, and work your way down the object hierarchy. To select the container that represents the VM, use the Get-AzureRmRecoveryServicesBackupContainer Get-AzureRmBackupContainer cmdlet and pipe that to the Get-AzureRmRecoveryServicesBackupItem Get-AzureRmBackupItem cmdlet.

```
PS C:\> $backupitem = Get-AzureRmBackupContainer -Vault $backupvault -Type AzureVM -name "testvm" | Get-AzureRmBackupItem
PS C:\> $Container = Get-AzureRmRecoveryServicesBackupContainer  -ContainerType AzureVM –Status Registered
PS C:\> $backupitem=Get-AzureRmRecoveryServicesBackupItem –ContainerType AzureVM –WorkloadType AzureVM –Name 'V2VM'
```

### Choose a recovery point

You can now list all the recovery points for the backup item using the Get-AzureRMRecoveryServicesBackupRecoveryPoint Get-AzureRmBackupRecoveryPoint cmdlet, and choose the recovery point to restore. Typically users pick the most recent AppConsistent point in the list.

```
PS C:\> $startDate = (Get-Date).AddDays(-7)
PS C:\> $endDate = Get-Date
PS C:\> $rp = Get-AzureRMRecoveryServicesBackupRecoveryPoint -Item $backupitem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
PS C:\> $rp[0]
RecoveryPointAdditionalInfo :
SourceVMStorageType         : NormalStorage
Name                        : 15260861925810
ItemName                    : VM;iaasvmcontainer;RGName1;V2VM
RecoveryPointId             : /subscriptions/XX/resourceGroups/ RGName1/providers/Microsoft.RecoveryServices/vaults/testvault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainer;RGName1;V2VM/protectedItems/VM;iaasvmcontainer; RGName1;V2VM
                              /recoveryPoints/15260861925810
RecoveryPointType           : AppConsistent
RecoveryPointTime           : 4/23/2016 5:02:04 PM
WorkloadType                : AzureVM
ContainerName               : IaasVMContainer;iaasvmcontainer; RGName1;V2VM
ContainerType               : AzureVM
BackupManagementType        : AzureVM
PS C:\> $rp =  Get-AzureRmBackupRecoveryPoint -Item $backupitem
PS C:\> $rp
RecoveryPointId    RecoveryPointType  RecoveryPointTime      ContainerName
---------------    -----------------  -----------------      -------------
15273496567119     AppConsistent      01-Sep-15 12:27:38 PM  iaasvmcontainer;testvm;testv...
```

The variable $rp is an array of recovery points for the selected backup item, sorted in reverse order of time - the latest recovery point is at index 0. Use standard PowerShell array indexing to pick the recovery point. For example: $rp[0] will select the latest recovery point.

### Restoring disks

There is a key difference between the restore operations done through the Azure portal and through Azure PowerShell. With PowerShell, the restore operation stops at restoring the disks and configuration information from the recovery point. It does not create a virtual machine.

> [AZURE.WARNING] The Restore-AzureRmBackupItem does not create a VM, it only restores the disks to the specified storage account. This is different than what occurs in the Azure portal.

```
PS C:\> $restorejob = Restore-AzureRMRecoveryServicesBackupItem -RecoveryPoint $rp[0] -StorageAccountNameDestAccount
StorageAccountResourceGroupNameDestRG
PS C:\> $restorejob
WorkloadName     Operation            Status               StartTime                 EndTime                   InstanceID
------------     ---------            ------               ---------                 -------                   ----------
V2VM        Restore               InProgress            4/23/2016 5:00:30 PM           cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
PS C:\> $restorejob = Restore-AzureRmBackupItem -StorageAccountName "DestAccount" -RecoveryPoint $rp[0]
PS C:\> $restorejob
WorkloadName    Operation       Status          StartTime              EndTime
------------    ---------       ------          ---------              -------
testvm          Restore         InProgress      01-Sep-15 1:14:01 PM   01-Jan-01 12:00:00 AM
```

You can get the details of the restore operation using the Get-AzureRmRecoveryServicesBackupJobDetails Get-AzureRmBackupJobDetails cmdlet once the Restore job has completed. The ErrorDetails property will have the information needed to rebuild the VM.

```
PS C:\> $restorejob = Get-AzureRmRecoveryServicesBackupJob -Job $restorejob
PS C:\> $details = Get-AzureRmRecoveryServicesBackupJobDetails
PS C:\> $restorejob = Get-AzureRmBackupJob -Job $restorejob
PS C:\> $details = Get-AzureRmBackupJobDetails
```

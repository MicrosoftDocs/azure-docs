<properties
	pageTitle="Deploy and manage backup for Azure VMs using PowerShell | Microsoft Azure"
	description="Learn how to deploy and manage Azure Backup using PowerShell"
	services="backup"
	documentationCenter=""
	authors="aashishr"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/21/2015"
	ms.author="trinadhk";"aashishr" />


# Deploy and manage backup for Azure VMs using PowerShell
This article shows you how to use Azure PowerShell for backup and recovery of Azure IaaS VMs.

## Concepts
Get [introduced to Azure IaaS VM backup](backup-azure-vms-introduction.md) in the Azure Backup documentation. It covers the essentials about why you should backup your VM, prerequisites, and limitations.

In order to use PowerShell effectively, it is necessary to understand the hierarchy of objects and from where to start.

![Object hierarchy](./media/backup-azure-vms-automation/object-hierarchy.png)

The 2 most important flows are enabling protection for a VM, and restoring data from a recovery point. The focus of this article is to help you become adept at working with the PowerShell commandlets to enable these two scenarios.


## Setup and Registration
To begin:

1. [Download latest PowerShell](https://github.com/Azure/azure-powershell/releases) (minimum version required is : 0.9.8)

2. Enable the Azure Backup commandlets by switching to *AzureResourceManager* mode by using the **Switch-AzureMode** commandlet:

```
PS C:\> Switch-AzureMode AzureResourceManager
```

The following setup and registration tasks can be automated with PowerShell:

- Create a backup vault
- Registering the VMs with the Azure Backup service

### Create a backup vault

> [AZURE.WARNING] For customers using Azure Backup for the first time, you need to register the Azure Backup provider to be used with your subscription. This can be done by running the following command: Register-AzureProvider -ProviderNamespace "Microsoft.Backup"

You can create a new backup vault using the **New-AzureRMBackupVault** commandlet. The backup vault is an ARM resource, so you need to place it within a Resource Group. In an elevated Azure PowerShell console, run the following commands:

```
PS C:\> New-AzureResourceGroup –Name “test-rg” –Region “West US”
PS C:\> $backupvault = New-AzureRMBackupVault –ResourceGroupName “test-rg” –Name “test-vault” –Region “West US” –Storage GeoRedundant
```

You can get a list of all the backup vaults in a given subscription using the **Get-AzureRMBackupVault** commandlet.

> [AZURE.NOTE] It is convenient to store the backup vault object into a variable. The vault object is needed as an input for many Azure Backup commandlets.


### Registering the VMs
The first step towards configuring backup with Azure Backup is to register your machine or VM with an Azure Backup vault. The **Register-AzureRMBackupContainer** commandlet takes the input information of an Azure IaaS virtual machine and registers it with the specified vault. The register operation associates the Azure virtual machine with the backup vault and tracks the VM through the backup lifecycle.

Registering your VM with the Azure Backup service creates a top-level container object. A container typically contains multiple items that can be backed up, but in the case of VMs there will be only one backup item for the container.

```
PS C:\> $registerjob = Register-AzureRMBackupContainer -Vault $backupvault -Name "testvm" -ServiceName "testvm"
```

## Backup Azure VMs

### Create a protection policy
It is not mandatory to create a new protection policy to start backup of your VMs. The vault comes with a 'Default Policy' that can be used to quickly enable protection, and then edited later with the right details. You can get a list of the policies available in the vault by using the **Get-AzureRMBackupProtectionPolicy** commandlet:

```
PS C:\> Get-AzureRMBackupProtectionPolicy -Vault $backupvault

Name                      Type               ScheduleType       BackupTime
----                      ----               ------------       ----------
DefaultPolicy             AzureVM            Daily              26-Aug-15 12:30:00 AM
```

A backup policy is associated with at least one retention policy. The retention policy defines how long a recovery point is kept with Azure Backup. The **New-AzureRMBackupRetentionPolicy** commandlet creates PowerShell objects that hold retention policy information. These retention policy objects are used as inputs to the *New-AzureRMBackupProtectionPolicy* commandlet, or directly with the *Enable-AzureRMBackupProtection* commandlet.

A backup policy defines when and how often the backup of an item is done. The **New-AzureRMBackupProtectionPolicy** commandlet creates a PowerShell object that holds backup policy information. The backup policy is used as an input to the *Enable-AzureRMBackupProtection* commandlet.

```
PS C:\> $Daily = New-AzureRMBackupRetentionPolicyObject -DailyRetention -Retention 30
PS C:\> $newpolicy = New-AzureRMBackupProtectionPolicy -Name DailyBackup01 -Type AzureVM -Daily -BackupTime ([datetime]"3:30 PM") -RetentionPolicy ($Daily) -Vault $backupvault

Name                      Type               ScheduleType       BackupTime
----                      ----               ------------       ----------
DailyBackup01             AzureVM            Daily              01-Sep-15 3:30:00 PM
```

### Enable protection
Enabling protection involves two objects - the Item and the Policy, and both need to belong to the same vault. Once the policy has been associated with the item, the backup workflow will kick in at the defined schedule.

```
PS C:\> Get-AzureRMBackupContainer -Type AzureVM -Status Registered -Vault $backupvault | Get-AzureRMBackupItem | Enable-AzureRMBackupProtection -Policy $newpolicy
```

### Initial backup
The backup schedule will take care of doing the full initial copy for the item and the incremental copy for the subsequent backups. However, if you want to force the initial backup to happen at a certain time or even immediately then use the **Backup-AzureRMBackupItem** commandlet:

```
PS C:\> $container = Get-AzureRMBackupContainer -Vault $backupvault -type AzureVM -name "testvm"
PS C:\> $backupjob = Get-AzureRMBackupItem -Container $container | Backup-AzureRMBackupItem
PS C:\> $backupjob

WorkloadName    Operation       Status          StartTime              EndTime
------------    ---------       ------          ---------              -------
testvm          Backup          InProgress      01-Sep-15 12:24:01 PM  01-Jan-01 12:00:00 AM
```

### Monitoring a backup job
Most long running operations in Azure Backup are modelled as a job. This makes it easy to track progress without having to keep the Azure portal open at all times.

To get the latest status of an in-progress job, use the **Get-AzureRMBackupJob** commandlet.

```
PS C:\> $joblist = Get-AzureRMBackupJob -Vault $backupvault -Status InProgress
PS C:\> $joblist[0]

WorkloadName    Operation       Status          StartTime              EndTime
------------    ---------       ------          ---------              -------
testvm          Backup          InProgress      01-Sep-15 12:24:01 PM  01-Jan-01 12:00:00 AM
```

Instead of polling these jobs for completion - which is unnecessary, additional code - it is simpler to use the **Wait-AzureRMBackupJob** commandlet. When used in a script, the commandlet will pause the execution until either the job completes or the specified timeout value is reached.

```
PS C:\> Wait-AzureRMBackupJob -Job $joblist[0] -Timeout 43200
```


## Restore an Azure VM

In order to restore backup data, you need to identify the backed-up Item and the Recovery Point that holds the point-in-time data. This information is supplied to the Restore-AzureRMBackupItem commandlet to initiate a restore of data from the vault to the customer's account.

### Select the VM

To get the PowerShell object that identifies the right backup Item, you need to start from the Container in the vault, and work your way down object hierarchy. To select the container that represents the VM, use the **Get-AzureRMBackupContainer** commandlet and pipe that to the **Get-AzureRMBackupItem** commandlet.

```
PS C:\> $backupitem = Get-AzureRMBackupContainer -Vault $backupvault -Type AzureVM -name "testvm" | Get-AzureRMBackupItem
```

### Choose a recovery point

You can now list all the recovery points for the backup item using the **Get-AzureRMBackupRecoveryPoint** commandlet, and choose the recovery point to restore. Typically users pick the most recent *AppConsistent* point in the list.

```
PS C:\> $rp =  Get-AzureRMBackupRecoveryPoint -Item $backupitem
PS C:\> $rp

RecoveryPointId    RecoveryPointType  RecoveryPointTime      ContainerName
---------------    -----------------  -----------------      -------------
15273496567119     AppConsistent      01-Sep-15 12:27:38 PM  iaasvmcontainer;testvm;testv...
```

### Restoring disks

There is a key difference between the restore operations done through the Azure portal and through Azure PowerShell. With PowerShell, the restore operation stops at restoring the disks and config information from the recovery point. It does not create a virtual machine.

> [AZURE.WARNING] The Restore-AzureRMBackupItem does not create a VM. It only restores the disks to the specified storage account. This is not the same behaviour you will experience in the Azure portal.

```
PS C:\> $restorejob = Restore-AzureRMBackupItem -StorageAccountName "DestAccount" -RecoveryPoint $rp
PS C:\> $restorejob

WorkloadName    Operation       Status          StartTime              EndTime
------------    ---------       ------          ---------              -------
testvm          Restore         InProgress      01-Sep-15 1:14:01 PM   01-Jan-01 12:00:00 AM
```

You can get the details of the restore operation using the **Get-AzureRMBackupJobDetails** commandlet once the Restore job has completed. The *ErrorDetails* property will have the information needed to rebuild the VM.

```
PS C:\> $restorejob = Get-AzureRMBackupJob -Job $restorejob
PS C:\> $details = Get-AzureRMBackupJobDetails -Job $restorejob
```

### Build the VM

Building the VM out of the restored disks can be done using the older Azure ServiceManager PowerShell commandlets, the new Azure ResourceManager templates, or even using the Azure portal. In a quick example, we will show how to get there using the Azure ServiceManager commandlets.

```
 $properties  = $details.Properties

 $storageAccountName = $properties["TargetStorageAccountName"]
 $containerName = $properties["TargetContainerName"]
 $blobName = $properties["TargetBlobName"]

 Switch-AzureMode AzureServiceManagement

 $keys = Get-AzureStorageKey -StorageAccountName $storageAccountName
 $storageAccountKey = $keys.Primary
 $storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey


 $destination_path = "C:\Users\admin\Desktop\vmconfig.xml"
 Get-AzureStorageBlobContent -Container $containerName -Blob $blobName -Destination $destination_path -Context $storageContext


 $obj = [xml](Get-Content $destination_path)
 $pvr = $obj.PersistentVMRole
 $os = $pvr.OSVirtualHardDisk
 $dds = $pvr.DataVirtualHardDisks
 $osDisk = Add-AzureDisk -MediaLocation $os.MediaLink -OS $os.OS -DiskName "panbhaosdisk"
 $vm = New-AzureVMConfig -Name $pvr.RoleName -InstanceSize $pvr.RoleSize -DiskName $osDisk.DiskName

 if (!($dds -eq $null))
 {
	 foreach($d in $dds.DataVirtualHardDisk)
 	 {
		 $lun = 0;
		 if(!($d.Lun -eq $null))
		 {
	 		 $lun = $d.Lun
		 }
		 $name = "panbhadataDisk" + $lun
     Add-AzureDisk -DiskName $name -MediaLocation $d.MediaLink
     $vm | Add-AzureDataDisk -Import -DiskName $name -LUN $lun
	}
}

New-AzureVM -ServiceName "panbhasample" -Location "SouthEast Asia" -VM $vm
```

For more information on how to build a VM from the restored disks, read about the following commandlets:

- [Add-AzureDisk](https://msdn.microsoft.com/library/azure/dn495252.aspx)
- [New-AzureVMConfig](https://msdn.microsoft.com/library/azure/dn495159.aspx)
- [New-AzureVM](https://msdn.microsoft.com/library/azure/dn495254.aspx)

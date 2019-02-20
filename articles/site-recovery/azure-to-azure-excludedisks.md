---
title: Azure Site Recovery - exclude disk during replication of Azure virtual machines using Azure PowerShell  | Microsoft Docs
description: Learn how to exclude disk for Azure virtual machines with Azure Site Recovery using Azure PowerShell.
services: site-recovery
author: asgang
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 02/18/2019
ms.author: asgang
---
# Exclude disks from replication of Azure VMs to Azure using Azure PowerShell

This article describes how to exclude disks when replicating Azure VMs. This exclusion can optimize the consumed replication bandwidth or optimize the target-side resources that such disks utilize. Currently this capability is exposed only through Azure PowerShell.

## Prerequisites

Before you start:

- Make sure that you understand the [scenario architecture and components](azure-to-azure-architecture.md).
- Review the [support requirements](azure-to-azure-support-matrix.md) for all components.
- You have version 5.7.0 or greater of the AzureRm PowerShell module. If you need to install or upgrade Azure PowerShell, follow this [Guide to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).
- You have already created Recovery services vault and have done protection of virtual machines atleast once. If not then do it using the documentation mentioned [here](azure-to-azure-powershell.md) 

## Why exclude disks from replication?
Excluding disks from replication is often necessary because:

- Your virtual machine has reached [Azure Site Recovery limits to replicate data change rates](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-support-matrix#azure-site-recovery-limits-to-replicate-data-change-rates)

- The data that's churned on the excluded disk is not important or doesn’t need to be replicated.

- You want to save storage and network resources by not replicating this churn.


## How to exclude disks from replication?

In the example in this article, a virtual machine which has 1 OS and 3 data disks in the East US region will be replicated to West US 2 region. The name of the virtual machine used in the example is AzureDemoVM. and we will exclude Disk 1 and will keep disk 2 and 3

## Get details of the virtual machine(s) to be replicated

```azurepowershell
# Get details of the virtual machine
$VM = Get-AzureRmVM -ResourceGroupName "A2AdemoRG" -Name "AzureDemoVM"

Write-Output $VM     
```

```
ResourceGroupName  : A2AdemoRG
Id                 : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/A2AdemoRG/providers/Microsoft.Compute/virtualMachines/AzureDemoVM
VmId               : 1b864902-c7ea-499a-ad0f-65da2930b81b
Name               : AzureDemoVM
Type               : Microsoft.Compute/virtualMachines
Location           : eastus
Tags               : {}
DiagnosticsProfile : {BootDiagnostics}
HardwareProfile    : {VmSize}
NetworkProfile     : {NetworkInterfaces}
OSProfile          : {ComputerName, AdminUsername, WindowsConfiguration, Secrets}
ProvisioningState  : Succeeded
StorageProfile     : {ImageReference, OsDisk, DataDisks}
```


Get disk details for the disks of the virtual machine. Disk details will be used later when starting replication for the virtual machine.

```azurepowershell
$OSDiskVhdURI = $VM.StorageProfile.OsDisk.Vhd
$DataDisk1VhdURI = $VM.StorageProfile.DataDisks[0].Vhd
```

## Replicate Azure virtual machine

In the below example we have assumed that you already have a cache storage account, replication policy and mappings. If not then do it using the documentation mentioned [here](azure-to-azure-powershell.md) 


Replicate the Azure virtual machine with **managed disks**.

```azurepowershell

#Get the resource group that the virtual machine must be created in when failed over.
$RecoveryRG = Get-AzureRmResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2"

#Specify replication properties for each disk of the VM that is to be replicated (create disk replication configuration)

#OsDisk
$OSdiskId =  $vm.StorageProfile.OsDisk.ManagedDisk.Id
$RecoveryOSDiskAccountType = $vm.StorageProfile.OsDisk.ManagedDisk.StorageAccountType
$RecoveryReplicaDiskAccountType =  $vm.StorageProfile.OsDisk.ManagedDisk.StorageAccountType

$OSDiskReplicationConfig = New-AzureRmRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id `
         -DiskId $OSdiskId -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryOSDiskAccountType

# Data Disk 1 i.e StorageProfile.DataDisks[0] is excluded so we will provide it during the time of replication 

# Data disk 2
$datadiskId2  = $vm.StorageProfile.DataDisks[1].ManagedDisk.id
$RecoveryReplicaDiskAccountType =  $vm.StorageProfile.DataDisks[1]. StorageAccountType
$RecoveryTargetDiskAccountType = $vm.StorageProfile.DataDisks[1]. StorageAccountType

$DataDisk2ReplicationConfig  = New-AzureRmRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $CacheStorageAccount.Id `
         -DiskId $datadiskId2 -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType

# Data Disk 3

$datadiskId3  = $vm.StorageProfile.DataDisks[2].ManagedDisk.id
$RecoveryReplicaDiskAccountType =  $vm.StorageProfile.DataDisks[2]. StorageAccountType
$RecoveryTargetDiskAccountType = $vm.StorageProfile.DataDisks[2]. StorageAccountType

$DataDisk3ReplicationConfig  = New-AzureRmRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $CacheStorageAccount.Id `
         -DiskId $datadiskId3 -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType

#Create a list of disk replication configuration objects for the disks of the virtual machine that are to be replicated.
$diskconfigs = @()
$diskconfigs += $OSDiskReplicationConfig, $DataDisk2ReplicationConfig, $DataDisk3ReplicationConfig


#Start replication by creating replication protected item. Using a GUID for the name of the replication protected item to ensure uniqueness of name.
$TempASRJob = New-ASRReplicationProtectedItem -AzureToAzure -AzureVmId $VM.Id -Name (New-Guid).Guid -ProtectionContainerMapping $EusToWusPCMapping -AzureToAzureDiskReplicationConfiguration $diskconfigs -RecoveryResourceGroupId $RecoveryRG.ResourceId
```

Once the start replication operation succeeds, virtual machine data is replicated to the recovery region.

You can go to the Azure portal and under replicated items you can see the virtual machines getting replicated.
The replication process starts by initially seeding a copy of the replicating disks of the virtual machine in the recovery region. This phase is called the initial replication phase.

Once initial replication completes, replication moves to the differential synchronization phase. At this point, the virtual machine is protected. Click on the protected virtual machine> disks to see that if the disk is excluded or not.

## Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
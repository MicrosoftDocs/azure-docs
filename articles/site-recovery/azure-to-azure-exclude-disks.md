---
title: Exclude Azure VM disks from replication with Azure Site Recovery and Azure PowerShell
description: Learn how to exclude disks of Azure virtual machines during Azure Site Recovery by using Azure PowerShell.
author: sideeksh
manager: rochakm
ms.topic: how-to
ms.date: 02/18/2019
---

# Exclude disks from PowerShell replication of Azure VMs

This article describes how to exclude disks when you replicate Azure VMs. You might exclude disks to optimize the consumed replication bandwidth or the target-side resources that those disks use. Currently, this capability is available only through Azure PowerShell.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before you start:

- Make sure that you understand the [disaster-recovery architecture and components](azure-to-azure-architecture.md).
- Review the [support requirements](azure-to-azure-support-matrix.md) for all components.
- Make sure that you have AzureRm PowerShell "Az" module. To install or update PowerShell, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).
- Make sure that you have created a recovery services vault and protected virtual machines at least once. If you haven't done these things, follow the process at [Set up disaster recovery for Azure virtual machines using Azure PowerShell](azure-to-azure-powershell.md).
- If you're looking for information on adding disks to an Azure VM enabled for replication, [review this article](azure-to-azure-enable-replication-added-disk.md).

## Why exclude disks from replication
You might need to exclude disks from replication because:

- Your virtual machine has reached [Azure Site Recovery limits to replicate data change rates](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-support-matrix).

- The data that's churned on the excluded disk isn't important or doesn’t need to be replicated.

- You want to save storage and network resources by not replicating the data.

## How to exclude disks from replication

In our example, we replicate a virtual machine that has one OS and three data disks that's in the East US region to the West US 2 region. The name of the virtual machine is *AzureDemoVM*. We exclude disk 1 and keep disks 2 and 3.

## Get details of the virtual machines to replicate

```azurepowershell
# Get details of the virtual machine
$VM = Get-AzVM -ResourceGroupName "A2AdemoRG" -Name "AzureDemoVM"

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

Get details about the virtual machine's disks. This information will be used later when you start replication of the VM.

```azurepowershell
$OSDiskVhdURI = $VM.StorageProfile.OsDisk.Vhd
$DataDisk1VhdURI = $VM.StorageProfile.DataDisks[0].Vhd
```

## Replicate an Azure virtual machine

For the following example, we assume that you already have a cache storage account, replication policy, and mappings. If you don't have these things, follow the process at [Set up disaster recovery for Azure virtual machines using Azure PowerShell](azure-to-azure-powershell.md).

Replicate an Azure virtual machine with *managed disks*.

```azurepowershell

#Get the resource group that the virtual machine must be created in when failed over.
$RecoveryRG = Get-AzResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2"

#Specify replication properties for each disk of the VM that is to be replicated (create disk replication configuration).

#OsDisk
$OSdiskId =  $vm.StorageProfile.OsDisk.ManagedDisk.Id
$RecoveryOSDiskAccountType = $vm.StorageProfile.OsDisk.ManagedDisk.StorageAccountType
$RecoveryReplicaDiskAccountType =  $vm.StorageProfile.OsDisk.ManagedDisk.StorageAccountType

$OSDiskReplicationConfig = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id `
         -DiskId $OSdiskId -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryOSDiskAccountType

# Data Disk 1 i.e StorageProfile.DataDisks[0] is excluded, so we will provide it during the time of replication. 

# Data disk 2
$datadiskId2  = $vm.StorageProfile.DataDisks[1].ManagedDisk.id
$RecoveryReplicaDiskAccountType =  $vm.StorageProfile.DataDisks[1]. StorageAccountType
$RecoveryTargetDiskAccountType = $vm.StorageProfile.DataDisks[1]. StorageAccountType

$DataDisk2ReplicationConfig  = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $CacheStorageAccount.Id `
         -DiskId $datadiskId2 -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType

# Data Disk 3

$datadiskId3  = $vm.StorageProfile.DataDisks[2].ManagedDisk.id
$RecoveryReplicaDiskAccountType =  $vm.StorageProfile.DataDisks[2]. StorageAccountType
$RecoveryTargetDiskAccountType = $vm.StorageProfile.DataDisks[2]. StorageAccountType

$DataDisk3ReplicationConfig  = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $CacheStorageAccount.Id `
         -DiskId $datadiskId3 -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType

#Create a list of disk replication configuration objects for the disks of the virtual machine that are to be replicated.
$diskconfigs = @()
$diskconfigs += $OSDiskReplicationConfig, $DataDisk2ReplicationConfig, $DataDisk3ReplicationConfig


#Start replication by creating a replication protected item. Using a GUID for the name of the replication protected item to ensure uniqueness of name.
$TempASRJob = New-ASRReplicationProtectedItem -AzureToAzure -AzureVmId $VM.Id -Name (New-Guid).Guid -ProtectionContainerMapping $EusToWusPCMapping -AzureToAzureDiskReplicationConfiguration $diskconfigs -RecoveryResourceGroupId $RecoveryRG.ResourceId
```

When the start-replication operation succeeds, the VM data is replicated to the recovery region.

You can go to the Azure portal and see the replicated VMs under "replicated items."

The replication process starts by seeding a copy of the replicating disks of the virtual machine in the recovery region. This phase is called the initial-replication phase.

After initial replication finishes, replication moves on to the differential-synchronization phase. At this point, the virtual machine is protected. Select the protected virtual machine to see if any disks are excluded.

## Next steps

Learn about [running a test failover](site-recovery-test-failover-to-azure.md).

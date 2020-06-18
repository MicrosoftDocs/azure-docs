---
title: Replicate Azure VMs running in Proximity Placement Groups
description: Learn how to replicate Azure VMs running in Proximity Placement Groups using Azure Site Recovery.
author: Sharmistha-Rai
manager: gaggupta
ms.topic: how-to
ms.date: 05/25/2020

---

# Replicate Azure virtual machines running in Proximity Placement Groups to another region

This article describes how to replicate, failover and failback virtual machines running in a Proximity Placement Group to a secondary region.

[Proximity Placement Groups](https://docs.microsoft.com/azure/virtual-machines/windows/proximity-placement-groups-portal) is an Azure Virtual Machine logical grouping capability that you can use to decrease the inter-VM network latency associated with your applications. When the VMs are deployed within the same proximity placement group, they are physically located as close as possible to each other. Proximity placement groups are particularly useful to address the requirements of latency-sensitive workloads.

## Disaster recovery with Proximity Placement Groups

In a typical scenario, you may have your virtual machines running in a proximity placement group to avoid the network latency between the various tiers of your application. While this can provide your application optimal network latency, you would like to protect these applications using Site Recovery for any region level failure. Site Recovery replicates the data from one region to another Azure region and brings up the machines in disaster recovery region in an event of failover.

## Considerations

- The best effort will be to failover/failback the virtual machines into a proximity placement group. However, if VM is unable to be brought up inside Proximity Placement during failover/failback, then failover/failback will still happen, and virtual machines will be created outside of a proximity placement group.
-  If an Availability Set is pinned to a Proximity Placement Group and during failover/failback VMs in the availability set have an allocation constraint, then the virtual machines will be created outside of both the availability set and proximity placement group.
-  Site Recovery for Proximity Placement Groups is not supported for unmanaged disks.

> [!Note]
> Azure Site Recovery does not support failback from managed disks for Hyper-V to Azure scenarios. Hence, failback from Proximity Placement Group in Azure to Hyper-V is not supported.

## Prerequisites

1. Make sure that you have the Azure PowerShell Az module. If you need to install or upgrade Azure PowerShell, follow this [Guide to install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps).

## Set up Site Recovery for Virtual Machines in Proximity Placement Group

### Azure to Azure

1. [Sign in](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#sign-in-to-your-microsoft-azure-subscription) to your account and set your subscription.
2. Get the details of the virtual machine you’re planning to replicate as mentioned [here](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#get-details-of-the-virtual-machine-to-be-replicated).
3. [Create](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-a-recovery-services-vault) your recovery services vault and [set](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#set-the-vault-context) the vault context.
4. Prepare the vault to start replication virtual machine. This involves creating a [service fabric object](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-a-site-recovery-fabric-object-to-represent-the-primary-source-region) for both primary and recovery regions.
5. [Create](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-a-site-recovery-protection-container-in-the-primary-fabric) a Site Recovery protection container, for both the primary and recovery fabrics.
6. [Create](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-a-replication-policy) a replication policy.
7. Create a protection container mapping between primary and recovery protection container using [these](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-a-protection-container-mapping-between-the-primary-and-recovery-protection-container) steps and a protection container mapping for failback as mentioned [here](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-a-protection-container-mapping-for-failback-reverse-replication-after-a-failover).
8. Create cache storage account by following [these](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-cache-storage-account-and-target-storage-account) steps.
9. Create the required network mappings as mentioned [here](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#create-network-mappings).
10. To replicate Azure virtual machine with managed disks, use the below PowerShell cmdlet – 

```azurepowershell
#Get the resource group that the virtual machine must be created in when failed over.
$RecoveryRG = Get-AzResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2"

#Specify replication properties for each disk of the VM that is to be replicated (create disk replication configuration)

#OsDisk
$OSdiskId = $vm.StorageProfile.OsDisk.ManagedDisk.Id
$RecoveryOSDiskAccountType = $vm.StorageProfile.OsDisk.ManagedDisk.StorageAccountType
$RecoveryReplicaDiskAccountType = $vm.StorageProfile.OsDisk.ManagedDisk.StorageAccountType

$OSDiskReplicationConfig = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id ` -DiskId $OSdiskId -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType ` -RecoveryTargetDiskAccountType $RecoveryOSDiskAccountType

# Data disk
$datadiskId1 = $vm.StorageProfile.DataDisks[0].ManagedDisk.Id
$RecoveryReplicaDiskAccountType = $vm.StorageProfile.DataDisks[0].ManagedDisk.StorageAccountType
$RecoveryTargetDiskAccountType = $vm.StorageProfile.DataDisks[0].ManagedDisk.StorageAccountType

$DataDisk1ReplicationConfig  = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $CacheStorageAccount.Id ` -DiskId $datadiskId1 -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType $RecoveryReplicaDiskAccountType ` -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType

#Create a list of disk replication configuration objects for the disks of the virtual machine that are to be replicated.

$diskconfigs = @()
$diskconfigs += $OSDiskReplicationConfig, $DataDisk1ReplicationConfig

#Start replication by creating replication protected item. Using a GUID for the name of the replication protected item to ensure uniqueness of name.

$TempASRJob = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -AzureVmId $VM.Id -Name (New-Guid).Guid -ProtectionContainerMapping $EusToWusPCMapping -AzureToAzureDiskReplicationConfiguration $diskconfigs -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryProximityPlacementGroupId $recPpg.Id
```
Once the start replication operation succeeds, virtual machine data is replicated to the recovery region.

The replication process starts by initially seeding a copy of the replicating disks of the virtual machine in the recovery region. This phase is called the initial replication phase.

After initial replication completes, replication moves to the differential synchronization phase. At this point, the virtual machine is protected, and a test failover operation can be performed on it. The replication state of the replicated item representing the virtual machine goes to the Protected state after initial replication completes.

Monitor the replication state and replication health for the virtual machine by getting details of the replication protected item corresponding to it. 

```azurepowershell
Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $PrimaryProtContainer | Select FriendlyName, ProtectionState, ReplicationHealth
```

11. To do a test failover, validate and cleanup test failover, follow [these](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#do-a-test-failover-validate-and-cleanup-test-failover) steps.
12. To failover, follow the steps as mentioned [here](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#fail-over-to-azure).
13. To reprotect and failback to the source region, use the below PowerShell cmdlet –

```azurepowershell
#Create Cache storage account for replication logs in the primary region
$WestUSCacheStorageAccount = New-AzStorageAccount -Name "a2acachestoragewestus" -ResourceGroupName "A2AdemoRG" -Location 'West US' -SkuName Standard_LRS -Kind Storage


#Use the recovery protection container, new cache storage account in West US and the source region VM resource group 
Update-AzRecoveryServicesAsrProtectionDirection -ReplicationProtectedItem $ReplicationProtectedItem -AzureToAzure -ProtectionContainerMapping $WusToEusPCMapping -LogStorageAccountId $WestUSCacheStorageAccount.Id -RecoveryResourceGroupID $sourceVMResourcegroup.ResourceId -RecoveryProximityPlacementGroupId $vm.ProximityPlacementGroup.Id
```
14. To disable replication, follow the steps [here](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#disable-replication).

### VMware to Azure

1. Make sure that you [prepare your on-premises VMware servers](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial-prepare-on-premises) for disaster recovery to Azure.
2. Sign in to your account and set your subscription as specified [here](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#log-into-azure).
3. [Set up](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#set-up-a-recovery-services-vault) a Recovery Services Vault and [set vault context](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#set-the-vault-context).
4. [Validate](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#validate-vault-registration) your vault registration.
5. [Create](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#create-a-replication-policy) a replication policy.
6. [Add](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#add-a-vcenter-server-and-discover-vms) a vCenter server and discover virtual machines and [create](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#create-storage-accounts-for-replication) storage accounts for replication.
7. To replicate VMware Virtual Machines, check the details here and follow the below PowerShell cmdlet –

```azurepowershell
#Get the target resource group to be used
$ResourceGroup = Get-AzResourceGroup -Name "VMwareToAzureDrPs"

#Get the target virtual network to be used
$RecoveryVnet = Get-AzVirtualNetwork -Name "ASR-vnet" -ResourceGroupName "asrrg" 

#Get the protection container mapping for replication policy named ReplicationPolicy
$PolicyMap = Get-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainer $ProtectionContainer | where PolicyFriendlyName -eq "ReplicationPolicy"

#Get the protectable item corresponding to the virtual machine CentOSVM1
$VM1 = Get-AzRecoveryServicesAsrProtectableItem -ProtectionContainer $ProtectionContainer -FriendlyName "CentOSVM1"

# Enable replication for virtual machine CentOSVM1 using the Az.RecoveryServices module 2.0.0 onwards to replicate to managed disks
# The name specified for the replicated item needs to be unique within the protection container. Using a random GUID to ensure uniqueness
$Job_EnableReplication1 = New-AzRecoveryServicesAsrReplicationProtectedItem -VMwareToAzure -ProtectableItem $VM1 -Name (New-Guid).Guid -ProtectionContainerMapping $PolicyMap -ProcessServer $ProcessServers[1] -Account $AccountHandles[2] -RecoveryResourceGroupId $ResourceGroup.ResourceId -logStorageAccountId $LogStorageAccount.Id -RecoveryAzureNetworkId $RecoveryVnet.Id -RecoveryAzureSubnetName "Subnet-1" -RecoveryProximityPlacementGroupId $recPpg.Id
```
8. You can check the replication state and replication health of the virtual machine with the Get-ASRReplicationProtectedItem cmdlet.

```azurepowershell
Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $ProtectionContainer | Select FriendlyName, ProtectionState, ReplicationHealth
```
9. Configure the failover settings by following the steps [here](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#configure-failover-settings).
10. [Run](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#run-a-test-failover) a test failover. 
11. Failover to Azure using [these](https://docs.microsoft.com/azure/site-recovery/vmware-azure-disaster-recovery-powershell#fail-over-to-azure) steps.

### Hyper-V to Azure

1. Make sure that you [prepare your on-premises Hyper-V servers](https://docs.microsoft.com/azure/site-recovery/hyper-v-prepare-on-premises-tutorial) for disaster recovery to Azure.
2. [Sign in](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-1-sign-in-to-your-azure-account) to Azure.
3. [Set up](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-2-set-up-the-vault) your vault and [set](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-3-set-the-recovery-services-vault-context) the Recovery Services Vault context.
4. [Create](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-4-create-a-hyper-v-site) a Hyper-V Site.
5. [Install](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-5-install-the-provider-and-agent) the provider and agent.
6. [Create](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-6-create-a-replication-policy) a replication policy.
7. Enable replication by using the below steps – 
	
	a. Retrieve the protectable item that corresponds to the VM you want to protect, as follows:

	```azurepowershell
	$VMFriendlyName = "Fabrikam-app"          #Name of the VM
	$ProtectableItem = Get-AzRecoveryServicesAsrProtectableItem -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName
	```
	b. Protect the VM. If the VM you're protecting has more than one disk attached to it, specify the operating system disk by using the OSDiskName parameter.
	
	```azurepowershell
	$OSType = "Windows"          # "Windows" or "Linux"
	$DRjob = New-AzRecoveryServicesAsrReplicationProtectedItem -ProtectableItem $VM -Name $VM.Name -ProtectionContainerMapping $ProtectionContainerMapping -RecoveryAzureStorageAccountId 	$StorageAccountID -OSDiskName $OSDiskNameList[$i] -OS $OSType -RecoveryResourceGroupId $ResourceGroupID -RecoveryProximityPlacementGroupId $recPpg.Id
	```
	c. Wait for the VMs to reach a protected state after the initial replication. This can take a while, depending on factors such as the amount of data to be replicated, and the available upstream bandwidth to Azure. When a protected state is in place, the job State and StateDescription are updated as follows: 
	
	```azurepowershell
	$DRjob = Get-AzRecoveryServicesAsrJob -Job $DRjob
	$DRjob | Select-Object -ExpandProperty State

	$DRjob | Select-Object -ExpandProperty StateDescription
	```
	d. Update recovery properties (such as the VM role size) and the Azure network to which to attach the VM NIC after failover.

	```azurepowershell
	$nw1 = Get-AzVirtualNetwork -Name "FailoverNw" -ResourceGroupName "MyRG"

	$VMFriendlyName = "Fabrikam-App"

	$rpi = Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName

	$UpdateJob = Set-AzRecoveryServicesAsrReplicationProtectedItem -InputObject $rpi -PrimaryNic $VM.NicDetailsList[0].NicId -RecoveryNetworkId $nw1.Id -RecoveryNicSubnetName $nw1.Subnets[0].Name

	$UpdateJob = Get-AzRecoveryServicesAsrJob -Job $UpdateJob

	$UpdateJob | Select-Object -ExpandProperty state

	Get-AzRecoveryServicesAsrJob -Job $job | Select-Object -ExpandProperty state
	```
8. Run a test [failover](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-powershell-resource-manager#step-8-run-a-test-failover).


## Next steps

To perform reprotect and failback for VMware to Azure, follow the steps outlined [here](https://docs.microsoft.com/azure/site-recovery/vmware-azure-prepare-failback).

To perform failover for Hyper-V to Azure follow the steps outlined [here](https://docs.microsoft.com/azure/site-recovery/site-recovery-failover) and to perform failback, follow the steps outlined [here](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-failback).

For more information, see [Failover in Site Recovery](site-recovery-failover.md).

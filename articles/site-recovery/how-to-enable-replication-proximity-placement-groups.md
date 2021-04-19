---
title: Replicate Azure VMs running in Proximity Placement Groups
description: Learn how to replicate Azure VMs running in Proximity Placement Groups using Azure Site Recovery.
author: Sharmistha-Rai
manager: gaggupta
ms.topic: how-to
ms.date: 02/11/2021

---

# Replicate Azure virtual machines running in Proximity Placement Groups to another region

This article describes how to replicate, failover and failback virtual machines running in a Proximity Placement Group to a secondary region.

[Proximity Placement Groups](../virtual-machines/windows/proximity-placement-groups-portal.md) is an Azure Virtual Machine logical grouping capability that you can use to decrease the inter-VM network latency associated with your applications. When the VMs are deployed within the same proximity placement group, they are physically located as close as possible to each other. Proximity placement groups are particularly useful to address the requirements of latency-sensitive workloads.

## Disaster recovery with Proximity Placement Groups

In a typical scenario, you may have your virtual machines running in a proximity placement group to avoid the network latency between the various tiers of your application. While this can provide your application optimal network latency, you would like to protect these applications using Site Recovery for any region level failure. Site Recovery replicates the data from one region to another Azure region and brings up the machines in disaster recovery region in an event of failover.

## Considerations

- The best effort will be to failover/failback the virtual machines into a proximity placement group. However, if VM is unable to be brought up inside Proximity Placement during failover/failback, then failover/failback will still happen, and virtual machines will be created outside of a proximity placement group.
- If an Availability Set is pinned to a Proximity Placement Group and during failover/failback VMs in the availability set have an allocation constraint, then the virtual machines will be created outside of both the availability set and proximity placement group.
- Site Recovery for Proximity Placement Groups is not supported for unmanaged disks.

> [!NOTE]
> Azure Site Recovery does not support failback from managed disks for Hyper-V to Azure scenarios. Hence, failback from Proximity Placement Group in Azure to Hyper-V is not supported.

## Set up Disaster Recovery for VMs in Proximity Placement Groups via Portal

### Azure to Azure via Portal

You can choose to enable replication for a virtual machine through the VM disaster recovery page or by going to a pre-created vault and navigating to the Site Recovery section and then enabling replication. Let’s look at how Site Recovery can be set up for VMs inside a PPG through both approaches:

- How to select PPG in the DR region while enabling replication through the IaaS VM DR blade:
  1. Go to the virtual machine. On the left hand side blade, under ‘Operations’, select ‘Disaster Recovery’
  2. In the ‘Basics’ tab, choose the DR region that you would like to replicate the VM to. Go to ‘Advanced Settings’
  3. Here, you can see the Proximity Placement Group of your VM and the option to select a PPG in the DR region. Site Recovery also gives you the option of using a new Proximity Placement Group that it creates for you if you choose to use this default option. You are free to choose the Proximity Placement Group you want and then go to ‘Review + Start replication’ and then finally enable replication.

   :::image type="content" source="media/how-to-enable-replication-proximity-placement-groups/proximity-placement-group-a2a-1.png" alt-text="Enable replication.":::

- How to select PPG in the DR region while enabling replication through the vault blade:
  1. Go to your Recovery Services Vault and go to the Site Recovery tab
  2. Click on ‘+ Enable Site Recovery’ and then select ‘1: Enable Replication’ under Azure virtual machines (as you are looking to replicate an Azure VM)
  3. Fill in the required fields in the ‘Source’ tab and click ‘Next’
  4. Select the list of VMs you want to enable replication for in the ‘Virtual machines’ tab and click ‘Next’
  5. Here, you can see the option to select a PPG in the DR region. Site Recovery also gives you the option of using a new PPG that it creates for you if you choose to use this default option. You are free to choose the PPG you want and then proceed to enabling replication.

   :::image type="content" source="media/how-to-enable-replication-proximity-placement-groups/proximity-placement-group-a2a-2.png" alt-text="Enable replication via vault.":::

Note that you can easily update the PPG selection in the DR region after replication has been enabled for the VM.

1. Go to the virtual machine and on the left side blade, under ‘Operations’, select ‘Disaster Recovery’
2. Go to the ‘Compute and Network’ blade and click on ‘Edit’ at the top of the page
3. You can see the options to edit multiple target settings, including target PPG. Choose the PPG you would like the VM to failover into and click ‘Save’.

### VMware to Azure via Portal

Proximity placement group for the target VM can be set up after enabling replication for the VM. Please ensure you separately create the PPG in the target region according to your requirement. Subsequently, you can easily update the PPG selection in the DR region after replication has been enabled for the VM.

1. Select the virtual machine from the vault and on the left side blade, under ‘Operations’, select ‘Disaster Recovery’
2. Go to the ‘Compute and Network’ blade and click on ‘Edit’ at the top of the page
3. You can see the options to edit multiple target settings, including target PPG. Choose the PPG you would like the VM to failover into and click ‘Save’.

   :::image type="content" source="media/how-to-enable-replication-proximity-placement-groups/proximity-placement-groups-update-v2a.png" alt-text="Update PPG V2A":::

### Hyper-V to Azure via Portal

Proximity placement group for the target VM can be set up after enabling replication for the VM. Please ensure you separately create the PPG in the target region according to your requirement. Subsequently, you can easily update the PPG selection in the DR region after replication has been enabled for the VM.

1. Select the virtual machine from the vault and on the left side blade, under ‘Operations’, select ‘Disaster Recovery’
2. Go to the ‘Compute and Network’ blade and click on ‘Edit’ at the top of the page
3. You can see the options to edit multiple target settings, including target PPG. Choose the PPG you would like the VM to failover into and click ‘Save’.

   :::image type="content" source="media/how-to-enable-replication-proximity-placement-groups/proximity-placement-groups-update-h2a.png" alt-text="Update PPG H2A":::

## Set up Disaster Recovery for VMs in Proximity Placement Groups via PowerShell

### Prerequisites 

1. Make sure that you have the Azure PowerShell Az module. If you need to install or upgrade Azure PowerShell, follow this [Guide to install and configure Azure PowerShell](/powershell/azure/install-az-ps).
2. The minimum Azure PowerShell Az version should be 4.1.0. To check the current version, use the below command -

    ```
	Get-InstalledModule -Name Az
	```

### Set up Site Recovery for Virtual Machines in Proximity Placement Group

> [!NOTE]
> Make sure that you have the unique ID of target Proximity Placement Group handy. If you're creating a new Proximity Placement Group, then check the command [here](../virtual-machines/windows/proximity-placement-groups.md#create-a-proximity-placement-group) and if you're using an existing Proximity Placement Group, then use the command [here](../virtual-machines/windows/proximity-placement-groups.md#list-proximity-placement-groups).

### Azure to Azure

1. [Sign in](./azure-to-azure-powershell.md#sign-in-to-your-microsoft-azure-subscription) to your account and set your subscription.
2. Get the details of the virtual machine you’re planning to replicate as mentioned [here](./azure-to-azure-powershell.md#get-details-of-the-virtual-machine-to-be-replicated).
3. [Create](./azure-to-azure-powershell.md#create-a-recovery-services-vault) your recovery services vault and [set](./azure-to-azure-powershell.md#set-the-vault-context) the vault context.
4. Prepare the vault to start replication virtual machine. This involves creating a [service fabric object](./azure-to-azure-powershell.md#create-a-site-recovery-fabric-object-to-represent-the-primary-source-region) for both primary and recovery regions.
5. [Create](./azure-to-azure-powershell.md#create-a-site-recovery-protection-container-in-the-primary-fabric) a Site Recovery protection container, for both the primary and recovery fabrics.
6. [Create](./azure-to-azure-powershell.md#create-a-replication-policy) a replication policy.
7. Create a protection container mapping between primary and recovery protection container using [these](./azure-to-azure-powershell.md#create-a-protection-container-mapping-between-the-primary-and-recovery-protection-container) steps and a protection container mapping for failback as mentioned [here](./azure-to-azure-powershell.md#create-a-protection-container-mapping-for-failback-reverse-replication-after-a-failover).
8. Create cache storage account by following [these](./azure-to-azure-powershell.md#create-cache-storage-account-and-target-storage-account) steps.
9. Create the required network mappings as mentioned [here](./azure-to-azure-powershell.md#create-network-mappings).
10. To replicate Azure virtual machine with managed disks, use the below PowerShell cmdlet -

```azurepowershell
#Get the resource group that the virtual machine must be created in when failed over.
$RecoveryRG = Get-AzResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2"

#Specify replication properties for each disk of the VM that is to be replicated (create disk replication configuration)
#Make sure to replace the variables $OSdiskName with OS disk name.

#OS Disk
$OSdisk = Get-AzDisk -DiskName $OSdiskName -ResourceGroupName "A2AdemoRG"
$OSdiskId = $OSdisk.Id
$RecoveryOSDiskAccountType = $OSdisk.Sku.Name
$RecoveryReplicaDiskAccountType = $OSdisk.Sku.Name

$OSDiskReplicationConfig = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id -DiskId $OSdiskId -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType $RecoveryReplicaDiskAccountType -RecoveryTargetDiskAccountType $RecoveryOSDiskAccountType

#Make sure to replace the variables $datadiskName with data disk name.

#Data disk
$datadisk = Get-AzDisk -DiskName $datadiskName -ResourceGroupName "A2AdemoRG"
$datadiskId1 = $datadisk[0].Id
$RecoveryReplicaDiskAccountType = $datadisk[0].Sku.Name
$RecoveryTargetDiskAccountType = $datadisk[0].Sku.Name

$DataDisk1ReplicationConfig  = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id -DiskId $datadiskId1 -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType $RecoveryReplicaDiskAccountType -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType

#Create a list of disk replication configuration objects for the disks of the virtual machine that are to be replicated.

$diskconfigs = @()
$diskconfigs += $OSDiskReplicationConfig, $DataDisk1ReplicationConfig

#Start replication by creating replication protected item. Using a GUID for the name of the replication protected item to ensure uniqueness of name.

$TempASRJob = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -AzureVmId $VM.Id -Name (New-Guid).Guid -ProtectionContainerMapping $EusToWusPCMapping -AzureToAzureDiskReplicationConfiguration $diskconfigs -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryProximityPlacementGroupId $targetPpg.Id
```

When enabling replication for multiple data disks, use the below PowerShell cmdlet -

```azurepowershell
#Get the resource group that the virtual machine must be created in when failed over.
$RecoveryRG = Get-AzResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2"

#Specify replication properties for each disk of the VM that is to be replicated (create disk replication configuration)
#Make sure to replace the variables $OSdiskName with OS disk name.

#OS Disk
$OSdisk = Get-AzDisk -DiskName $OSdiskName -ResourceGroupName "A2AdemoRG"
$OSdiskId = $OSdisk.Id
$RecoveryOSDiskAccountType = $OSdisk.Sku.Name
$RecoveryReplicaDiskAccountType = $OSdisk.Sku.Name

$OSDiskReplicationConfig = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id -DiskId $OSdiskId -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType $RecoveryReplicaDiskAccountType -RecoveryTargetDiskAccountType $RecoveryOSDiskAccountType

$diskconfigs = @()
$diskconfigs += $OSDiskReplicationConfig

#Data disk

# Add data disks
Foreach( $disk in $VM.StorageProfile.DataDisks)
{
	$datadisk = Get-AzDisk -DiskName $datadiskName -ResourceGroupName "A2AdemoRG"
    $dataDiskId1 = $datadisk[0].Id
    $RecoveryReplicaDiskAccountType = $datadisk[0].Sku.Name
    $RecoveryTargetDiskAccountType = $datadisk[0].Sku.Name
    $DataDisk1ReplicationConfig  = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id `
         -DiskId $dataDiskId1 -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType $RecoveryReplicaDiskAccountType `
         -RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType
    $diskconfigs += $DataDisk1ReplicationConfig
}

#Start replication by creating replication protected item. Using a GUID for the name of the replication protected item to ensure uniqueness of name.

$TempASRJob = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -AzureVmId $VM.Id -Name (New-Guid).Guid -ProtectionContainerMapping $EusToWusPCMapping -AzureToAzureDiskReplicationConfiguration $diskconfigs -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryProximityPlacementGroupId $targetPpg.Id
```

When enabling zone to zone replication with PPG, the command to start replication will be exchanged with the PowerShell cmdlet -

```azurepowershell
$TempASRJob = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -AzureVmId $VM.Id -Name (New-Guid).Guid -ProtectionContainerMapping $EusToWusPCMapping -AzureToAzureDiskReplicationConfiguration $diskconfigs -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryProximityPlacementGroupId $targetPpg.Id -RecoveryAvailabilityZone "2"
```

Once the start replication operation succeeds, virtual machine data is replicated to the recovery region.

The replication process starts by initially seeding a copy of the replicating disks of the virtual machine in the recovery region. This phase is called the initial replication phase.

After initial replication completes, replication moves to the differential synchronization phase. At this point, the virtual machine is protected, and a test failover operation can be performed on it. The replication state of the replicated item representing the virtual machine goes to the Protected state after initial replication completes.

Monitor the replication state and replication health for the virtual machine by getting details of the replication protected item corresponding to it.

```azurepowershell
Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $PrimaryProtContainer | Select FriendlyName, ProtectionState, ReplicationHealth
```

11. To do a test failover, validate and cleanup test failover, follow [these](./azure-to-azure-powershell.md#do-a-test-failover-validate-and-cleanup-test-failover) steps.
12. To failover, follow the steps as mentioned [here](./azure-to-azure-powershell.md#fail-over-to-azure).
13. To reprotect and failback to the source region, use the below PowerShell cmdlet –

```azurepowershell
#Create Cache storage account for replication logs in the primary region
$WestUSCacheStorageAccount = New-AzStorageAccount -Name "a2acachestoragewestus" -ResourceGroupName "A2AdemoRG" -Location 'West US' -SkuName Standard_LRS -Kind Storage


#Use the recovery protection container, new cache storage account in West US and the source region VM resource group 
Update-AzRecoveryServicesAsrProtectionDirection -ReplicationProtectedItem $ReplicationProtectedItem -AzureToAzure -ProtectionContainerMapping $WusToEusPCMapping -LogStorageAccountId $WestUSCacheStorageAccount.Id -RecoveryResourceGroupID $sourceVMResourcegroup.ResourceId -RecoveryProximityPlacementGroupId $vm.ProximityPlacementGroup.Id
```

14. To disable replication, follow the steps [here](./azure-to-azure-powershell.md#disable-replication).

### VMware to Azure via PowerShell

1. Make sure that you [prepare your on-premises VMware servers](./vmware-azure-tutorial-prepare-on-premises.md) for disaster recovery to Azure.
2. Sign in to your account and set your subscription as specified [here](./vmware-azure-disaster-recovery-powershell.md#log-into-azure).
3. [Set up](./vmware-azure-disaster-recovery-powershell.md#set-up-a-recovery-services-vault) a Recovery Services Vault and [set vault context](./vmware-azure-disaster-recovery-powershell.md#set-the-vault-context).
4. [Validate](./vmware-azure-disaster-recovery-powershell.md#validate-vault-registration) your vault registration.
5. [Create](./vmware-azure-disaster-recovery-powershell.md#create-a-replication-policy) a replication policy.
6. [Add](./vmware-azure-disaster-recovery-powershell.md#add-a-vcenter-server-and-discover-vms) a vCenter server and discover virtual machines and [create](./vmware-azure-disaster-recovery-powershell.md#create-storage-accounts-for-replication) storage accounts for replication.
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
$Job_EnableReplication1 = New-AzRecoveryServicesAsrReplicationProtectedItem -VMwareToAzure -ProtectableItem $VM1 -Name (New-Guid).Guid -ProtectionContainerMapping $PolicyMap -ProcessServer $ProcessServers[1] -Account $AccountHandles[2] -RecoveryResourceGroupId $ResourceGroup.ResourceId -logStorageAccountId $LogStorageAccount.Id -RecoveryAzureNetworkId $RecoveryVnet.Id -RecoveryAzureSubnetName "Subnet-1" -RecoveryProximityPlacementGroupId $targetPpg.Id
```

8. You can check the replication state and replication health of the virtual machine with the Get-ASRReplicationProtectedItem cmdlet.

```azurepowershell
Get-AzRecoveryServicesAsrReplicationProtectedItem -ProtectionContainer $ProtectionContainer | Select FriendlyName, ProtectionState, ReplicationHealth
```

9. Configure the failover settings by following the steps [here](./vmware-azure-disaster-recovery-powershell.md#configure-failover-settings).
10. [Run](./vmware-azure-disaster-recovery-powershell.md#run-a-test-failover) a test failover.
11. Failover to Azure using [these](./vmware-azure-disaster-recovery-powershell.md#fail-over-to-azure) steps.

### Hyper-V to Azure via PowerShell

1. Make sure that you [prepare your on-premises Hyper-V servers](./hyper-v-prepare-on-premises-tutorial.md) for disaster recovery to Azure.
2. [Sign in](./hyper-v-azure-powershell-resource-manager.md#step-1-sign-in-to-your-azure-account) to Azure.
3. [Set up](./hyper-v-azure-powershell-resource-manager.md#step-2-set-up-the-vault) your vault and [set](./hyper-v-azure-powershell-resource-manager.md#step-3-set-the-recovery-services-vault-context) the Recovery Services Vault context.
4. [Create](./hyper-v-azure-powershell-resource-manager.md#step-4-create-a-hyper-v-site) a Hyper-V Site.
5. [Install](./hyper-v-azure-powershell-resource-manager.md#step-5-install-the-provider-and-agent) the provider and agent.
6. [Create](./hyper-v-azure-powershell-resource-manager.md#step-6-create-a-replication-policy) a replication policy.
7. Enable replication by using the below steps – 
	
	a. Retrieve the protectable item that corresponds to the VM you want to protect, as follows:

	```azurepowershell
	$VMFriendlyName = "Fabrikam-app"          #Name of the VM
	$ProtectableItem = Get-AzRecoveryServicesAsrProtectableItem -ProtectionContainer $protectionContainer -FriendlyName $VMFriendlyName
	```
	b. Protect the VM. If the VM you're protecting has more than one disk attached to it, specify the operating system disk by using the OSDiskName parameter.
	
	```azurepowershell
	$OSType = "Windows"          # "Windows" or "Linux"
	$DRjob = New-AzRecoveryServicesAsrReplicationProtectedItem -ProtectableItem $VM -Name $VM.Name -ProtectionContainerMapping $ProtectionContainerMapping -RecoveryAzureStorageAccountId 	$StorageAccountID -OSDiskName $OSDiskNameList[$i] -OS $OSType -RecoveryResourceGroupId $ResourceGroupID -RecoveryProximityPlacementGroupId $targetPpg.Id
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
8. Run a test [failover](./hyper-v-azure-powershell-resource-manager.md#step-8-run-a-test-failover).


## Next steps

To perform reprotect and failback for VMware to Azure, follow the steps outlined [here](./vmware-azure-prepare-failback.md).

To perform failover for Hyper-V to Azure follow the steps outlined [here](./site-recovery-failover.md) and to perform failback, follow the steps outlined [here](./hyper-v-azure-failback.md).

For more information, see [Failover in Site Recovery](site-recovery-failover.md).

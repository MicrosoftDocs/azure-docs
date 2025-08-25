---
title: Shared disks in Azure Site Recovery using PowerShell
description: This article describes how set up disaster recovery for shared disks using PowerShell.
ms.topic: how-to
ms.service: azure-site-recovery
ms.date: 04/02/2025
ms.author: jsuri
author: jyothisuri
# Customer intent: "As a cloud administrator, I want to configure disaster recovery for shared disks using PowerShell, so that I can ensure high availability and quick recovery of virtual machines in case of an outage."
---

# Set up disaster recovery for shared disks using PowerShell

This article describes how to set up disaster recovery for Azure to Azure shared disks VM using PowerShell. For more information about shared disks, see [Shared disks in Azure Site Recovery](./shared-disk-support-matrix.md).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Prerequisites

Before you start:
- Ensure that you understand the [scenario architecture and components](azure-to-azure-architecture.md).
- Review the [support requirements](azure-to-azure-support-matrix.md) for all components.
- Ensure you have the Azure PowerShell `Az` module. If you need to install or upgrade Azure PowerShell, follow this [guide to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).  
- Ensure to [set up the environment](./azure-to-azure-powershell.md#sign-in-to-your-microsoft-azure-subscription) for recovery.


## About resource group and VM

After you set up the environment, [get the resource group and VM details](./azure-to-azure-powershell.md#get-details-of-the-virtual-machine-to-be-replicated). The resource group is where the virtual machine is located. The VM is the virtual machine that you want to protect.


## Create a Recovery Services vault

Create a resource group in which to create the Recovery Services vault. 

> [!IMPORTANT]
> * The Recovery services vault and the virtual machines being protected must be in different Azure locations.
> * The resource group of the Recovery services vault, and the virtual machines being protected must be in different Azure locations.
> * The Recovery services vault, and the resource group to which it belongs, can be in the same Azure location.

In the example in this article, the virtual machine being protected is in the East US region. The recovery region selected for disaster recovery is the West US 2 region. The recovery services vault, and the resource group of the vault, are both in the recovery region, West US 2.

```powershell
#Create a resource group for the recovery services vault in the recovery Azure region
New-AzResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2"
```

```Output
ResourceGroupName : a2ademorecoveryrg
Location          : westus2
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/a2ademorecoveryrg
```

Create a Recovery services vault. In this example, a Recovery Services vault named `a2aDemoRecoveryVault` is created in the West US 2 region.

```powershell
#Create a new Recovery services vault in the recovery region
$vault = New-AzRecoveryServicesVault -Name "a2aDemoRecoveryVault" -ResourceGroupName "a2ademorecoveryrg" -Location "West US 2"

Write-Output $vault
```

```Output
Name              : a2aDemoRecoveryVault
ID                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/a2ademorecoveryrg/providers/Microsoft.RecoveryServices/vaults/a2aDemoRecoveryVault
Type              : Microsoft.RecoveryServices/vaults
Location          : westus2
ResourceGroupName : a2ademorecoveryrg
SubscriptionId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Properties        : Microsoft.Azure.Commands.RecoveryServices.ARSVaultProperties
```

## Prepare vault to replicate Azure virtual machines

To prepare the vault for replication, follow these steps:

1. [Create a Site Recovery fabric object to represent the primary (source) region](./azure-to-azure-powershell.md#create-a-site-recovery-fabric-object-to-represent-the-primary-source-region).
1. [Create a Site Recovery fabric object to represent the recovery region](./azure-to-azure-powershell.md#create-a-site-recovery-fabric-object-to-represent-the-recovery-region).
1. [Create a Site Recovery protection container in the primary region](./azure-to-azure-powershell.md#create-a-site-recovery-protection-container-in-the-primary-fabric).
1. [Create a Site Recovery protection container in the recovery fabric](./azure-to-azure-powershell.md#create-a-site-recovery-protection-container-in-the-recovery-fabric). Learn more about [fabric and container creation when enabling zone to zone replication](./azure-to-azure-powershell.md#fabric-and-container-creation-when-enabling-zone-to-zone-replication).
1. [Create a replication policy](./azure-to-azure-powershell.md#create-a-replication-policy).
1. [Create a protection container mapping between the primary and recovery protection containers](./azure-to-azure-powershell.md#create-a-protection-container-mapping-between-the-primary-and-recovery-protection-container). Learn more about [protection container mapping creation when enabling zone to zone replication](./azure-to-azure-powershell.md#protection-container-mapping-creation-when-enabling-zone-to-zone-replication).
1. [Create a protection container mapping for failback (reverse replication after a failover)](./azure-to-azure-powershell.md#create-a-protection-container-mapping-for-failback-reverse-replication-after-a-failover).


## Create cache storage account and target storage account

A cache storage account is a standard storage account in the same Azure region as the virtual machine being replicated. The cache storage account is used to hold replication changes temporarily, before the changes are moved to the recovery Azure region. High churn support is also available in Azure Site Recovery to get higher churn limits. To use this feature, create a *Premium Block Blob* type of storage accounts and then use it as the cache storage account.  

You can choose to, but it's not necessary to specify different cache storage accounts for the different disks of a virtual machine. If you use different cache storage accounts, ensure that they are of the same type (Standard or Premium Block Blobs). For more information, see [Azure VM Disaster Recovery - High Churn Support](./concepts-azure-to-azure-high-churn-support.md).

```powershell
#Create Cache storage account for replication logs in the primary region
$EastUSCacheStorageAccount = New-AzStorageAccount -Name "a2acachestorage" -ResourceGroupName "A2AdemoRG" -Location 'East US' -SkuName Standard_LRS -Kind Storage
```

For virtual machines **not using managed disks**, the target storage account is the storage account in the recovery region to which disks of the virtual machine are replicated. The target storage account can be either a standard storage account or a premium storage account. Select the kind of storage account required based on the data change rate (IO write rate) for the disks and the Azure Site Recovery supported churn limits for the storage type.

```powershell
#Create Target storage account in the recovery region. In this case a Standard Storage account
$WestUSTargetStorageAccount = New-AzStorageAccount -Name "a2atargetstorage" -ResourceGroupName "a2ademorecoveryrg" -Location 'West US 2' -SkuName Standard_LRS -Kind Storage
```

## Create network mappings

A network mapping maps virtual networks in the primary region to virtual networks in the recovery region. The network mapping specifies the Azure virtual network in the recovery region that a virtual machine in the primary virtual network should fail over to. One Azure virtual network can be mapped to only a single Azure virtual network in a recovery region.

To create a network mapping, do the following:

1. Create an Azure virtual network in the recovery region to fail over to:

   ```powershell
    #Create a Recovery Network in the recovery region
    $WestUSRecoveryVnet = New-AzVirtualNetwork -Name "a2arecoveryvnet" -ResourceGroupName "a2ademorecoveryrg" -Location 'West US 2' -AddressPrefix "10.0.0.0/16"
    Add-AzVirtualNetworkSubnetConfig -Name "default" -VirtualNetwork $WestUSRecoveryVnet -AddressPrefix "10.0.0.0/20" | Set-AzVirtualNetwork
    $WestUSRecoveryNetwork = $WestUSRecoveryVnet.Id
   ```

1. Retrieve the primary virtual network that the virtual machine is connected as follows:

   ```powershell
    #Retrieve the virtual network that the virtual machine is connected to

    #Get first network interface card(nic) of the virtual machine
    $SplitNicArmId = $VM.NetworkProfile.NetworkInterfaces[0].Id.split("/")

    #Extract resource group name from the ResourceId of the nic
    $NICRG = $SplitNicArmId[4]

    #Extract resource name from the ResourceId of the nic
    $NICname = $SplitNicArmId[-1]

    #Get network interface details using the extracted resource group name and resource name
    $NIC = Get-AzNetworkInterface -ResourceGroupName $NICRG -Name $NICname

    #Get the subnet ID of the subnet that the nic is connected to
    $PrimarySubnet = $NIC.IpConfigurations[0].Subnet

    # Extract the resource ID of the Azure virtual network the nic is connected to from the subnet ID
    $EastUSPrimaryNetwork = (Split-Path(Split-Path($PrimarySubnet.Id))).Replace("\","/")
   ```

1. Create a network mapping between the primary virtual network and the recovery virtual network:

   ```powershell
    #Create an ASR network mapping between the primary Azure virtual network and the recovery Azure virtual network
    $TempASRJob = New-AzRecoveryServicesAsrNetworkMapping -AzureToAzure -Name "A2AEusToWusNWMapping" -PrimaryFabric $PrimaryFabric -PrimaryAzureNetworkId $EastUSPrimaryNetwork -RecoveryFabric $RecoveryFabric -RecoveryAzureNetworkId $WestUSRecoveryNetwork

    #Track Job status to check for completion
    while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
            sleep 10;
            $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
    }

    #Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
    Write-Output $TempASRJob.State
   ```

1. Create a network mapping for the reverse direction (fail back):

    ```powershell
    #Create an ASR network mapping for fail back between the recovery Azure virtual network and the primary Azure virtual network
    $TempASRJob = New-AzRecoveryServicesAsrNetworkMapping -AzureToAzure -Name "A2AWusToEusNWMapping" -PrimaryFabric $RecoveryFabric -PrimaryAzureNetworkId $WestUSRecoveryNetwork -RecoveryFabric $PrimaryFabric -RecoveryAzureNetworkId $EastUSPrimaryNetwork

    #Track Job status to check for completion
    while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
            sleep 10;
            $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
    }

    #Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
    Write-Output $TempASRJob.State
    ```

## Create a Site Recovery protection cluster 

The protection cluster is a container used to group replicated items that are part of a shared disk cluster. To create a protection cluster, do the following:

```powershell
$clusterjob = New-AzRecoveryServicesAsrReplicationProtectionCluster -AzureToAzure -Name $clusterName -ProtectionContainerMapping $forwardpcm 
# Get by name 
$clusters = Get-AzRecoveryServicesAsrReplicationProtectionCluster -ProtectionContainer $pc -Name "3nodecluster" 
# List protection clusters in vault
Get-AzRecoveryServicesAsrReplicationProtectionCluster 
# List protection clusters in protection container 
Get-AzRecoveryServicesAsrReplicationProtectionCluster -Name $clusterName -ProtectionContainer $pc
```

## Enable protection on your cluster

Replicate the Azure virtual machines with managed shared disks when disk details are unavailable.  To enable replication, do the following:

```powershell
$EnableJob1 = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -Name $rpiName1 -ReplicationProtectionCluster $cluster ` 
-AzureVmId $vmId1 -ProtectionContainerMapping $forwardpcm -RecoveryResourceGroupId $rgId -RecoveryAvailabilitySetId $avset ` 
-RecoveryProximityPlacementGroupId $ppg -RecoveryAzureNetworkId $networkId -LogStorageAccountId $storageId
```

Replicate the Azure virtual machines with managed shared disks when disk details are available, as follows:

```powershell
$disk1 = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $storageId ` 
-DiskId $vhdId1 -RecoveryResourceGroupId  $rgId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType ` 
-RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType 
$disk2 = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $storageId ` 
-DiskId $vhdId2 -RecoveryResourceGroupId  $rgId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType ` 
-RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType 
$disks = @() 
$disks += $disk1 
$disks += $disk2 
$EnableJob2 = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -Name $rpiName2 ` 
-AzureToAzureDiskReplicationConfiguration $disks -ReplicationProtectionCluster $cluster -AzureVmId $vmId2 ` 
-ProtectionContainerMapping $forwardpcm -RecoveryResourceGroupId $rgId -RecoveryAvailabilitySetId $avset ` 
-RecoveryProximityPlacementGroupId $ppg -RecoveryAzureNetworkId $networkId 
```

The `AzureToAzureDiskReplicationConfiguration` should contain both the normal disks and shared disk information. For example, enabling protection for two VMs in a WSFC cluster with `1` shared disk and are part of Avset and PPG.


```powershell
$RecoveryRG = Get-AzResourceGroup -Name "a2ademorecoveryrg" -Location "West US 2" 
$Avset = "/subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/ClusterRG-asr/providers/Microsoft.Compute/availabilitySets/SDGQL-AS-asr" 
$Ppg = "/subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/ClusterRG-asr/providers/Microsoft.Compute/proximityPlacementGroups/sdgql-ppg-asr" 
$NetworkId = "/subscriptions/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/ClusterRG-asr/providers/Microsoft.Network/virtualNetworks/adVNET-asr" 
$EnableJob1 = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -Name (New-Guid).Guid -ReplicationProtectionCluster $cluster ` 
-AzureVmId $VM1.Id -ProtectionContainerMapping $EusToWusPCMapping -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryAvailabilitySetId $Avset ` 
-RecoveryProximityPlacementGroupId $Ppg -RecoveryAzureNetworkId $NetworkId -LogStorageAccountId $EastUSCacheStorageAccount.Id 

#OsDisk 
$OSdiskId = $vm2.StorageProfile.OsDisk.ManagedDisk.Id 
$RecoveryOSDiskAccountType = $vm2.StorageProfile.OsDisk.ManagedDisk.StorageAccountType 
$RecoveryReplicaDiskAccountType = $vm2.StorageProfile.OsDisk.ManagedDisk.StorageAccountType 
$OSDiskReplicationConfig = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id ` 
-DiskId $OSdiskId -RecoveryResourceGroupId  $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType  $RecoveryReplicaDiskAccountType ` 
-RecoveryTargetDiskAccountType $RecoveryOSDiskAccountType 

# Data disk 
$datadiskId1 = $vm2.StorageProfile.DataDisks[0].ManagedDisk.Id 
$RecoveryReplicaDiskAccountType = $vm2.StorageProfile.DataDisks[0].ManagedDisk.StorageAccountType 
$RecoveryTargetDiskAccountType = $vm2.StorageProfile.DataDisks[0].ManagedDisk.StorageAccountType 
$DataDisk1ReplicationConfig  = New-AzRecoveryServicesAsrAzureToAzureDiskReplicationConfig -ManagedDisk -LogStorageAccountId $EastUSCacheStorageAccount.Id ` 
-DiskId $datadiskId1 -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryReplicaDiskAccountType $RecoveryReplicaDiskAccountType ` 
-RecoveryTargetDiskAccountType $RecoveryTargetDiskAccountType 

#Create a list of disk replication configuration objects for the disks of the virtual machine that are to be replicated. 
$diskconfigs = @() 
$diskconfigs += $OSDiskReplicationConfig, $DataDisk1ReplicationConfig 
$EnableJob2 = New-AzRecoveryServicesAsrReplicationProtectedItem -AzureToAzure -Name (New-Guid).Guid ` 
-AzureToAzureDiskReplicationConfiguration $diskconfigs-ReplicationProtectionCluster $cluster -AzureVmId $VM2.Id ` 
-ProtectionContainerMapping $EusToWusPCMapping -RecoveryResourceGroupId $RecoveryRG.ResourceId -RecoveryAvailabilitySetId $Avset ` 
-RecoveryProximityPlacementGroupId $Ppg -RecoveryAzureNetworkId $NetworkId 
```

## Create recovery points 

The recovery point is specific point in time to which you can fail over. You can create a recovery point for the cluster or for the individual nodes. To create a recovery point, do the following:


**List** 
```
Get-AzRecoveryServicesAsrClusterRecoveryPoint -ReplicationProtectionCluster $cluster
```


**Get** 
```
Get-AzRecoveryServicesAsrClusterRecoveryPoint -ReplicationProtectionCluster $cluster -Name "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```


## Test failover 

Test the failover of the cluster to a specific recovery point. To test failover, do the following:

```powershell
$tfoJob = Start-AzRecoveryServicesAsrClusterTestFailoverJob -ReplicationProtectionCluster $protectionCluster -Direction PrimaryToRecovery -AzureVMNetworkId "/subscriptions/xxxxxxxxx/resourceGroups/ClusterRG-asr/providers/Microsoft.Network/virtualNetworks/adVNET-asr" -LatestProcessedRecoveryPoint 
```

 
###  Clean up test failover 

To clean up the test failover, do the following: 

```powershell
Start-AzRecoveryServicesAsrClusterTestFailoverCleanupJob -ReplicationProtectionCluster $protectionCluster  
```

## Failover 

Fail over the cluster to a specific recovery point, as follows:

```powershell
$rpi1 = Get-ASRReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName "sdgql1" 
$rpi2 = Get-ASRReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName "sdgql2" 
$nodeRecoveryPoint1 = Get-ASRRecoveryPoint -ReplicationProtectedItem $rpi1 
$nodeRecoveryPoint2 = Get-ASRRecoveryPoint -ReplicationProtectedItem $rpi2 
$nodeRecoveryPoints = @($nodeRecoveryPoint1[-1].ID, $nodeRecoveryPoint2[-1].ID) 
$clusterRecoveryPoints = Get-AzRecoveryServicesAsrClusterRecoveryPoint -ReplicationProtectionCluster $protectionCluster 
$ufoJob = Start-AzRecoveryServicesAsrClusterUnplannedFailoverJob -ReplicationProtectionCluster $protectionCluster -Direction PrimaryToRecovery -ClusterRecoveryPoint $clusterRecoveryPoints[-1] -ListNodeRecoveryPoint $nodeRecoveryPoints 
```
 
## Change pit

You can change the point in time to which you want to fail over. This is useful when you want to fail over to a specific recovery point. To change the pit, do the following:

```powershell
$rpi1 = Get-ASRReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName "sdgql1" 
$rpi2 = Get-ASRReplicationProtectedItem -ProtectionContainer $protectionContainer -FriendlyName "sdgql2" 
$nodeRecoveryPoint1 = Get-ASRRecoveryPoint -ReplicationProtectedItem $rpi1 
$nodeRecoveryPoint2 = Get-ASRRecoveryPoint -ReplicationProtectedItem $rpi2 
$nodeRecoveryPoints = @($nodeRecoveryPoint1[-1].ID, $nodeRecoveryPoint2[-1].ID) 
$clusterRecoveryPoints = Get-AzRecoveryServicesAsrClusterRecoveryPoint -ReplicationProtectionCluster $protectionCluster 
$changePitJob = Start-AzRecoveryServicesAsrApplyClusterRecoveryPoint -ReplicationProtectionCluster $protectionCluster -ClusterRecoveryPoint $clusterRecoveryPoints[-1] -ListNodeRecoveryPoint $nodeRecoveryPoints 
```
 
## Commit failover

After failover, commit the failover to the new target region. To commit the failover, do the following:

```powershell 
$CommitFailoverJob = Start-AzRecoveryServicesAsrClusterCommitFailoverJob -ReplicationProtectionCluster $protectionCluster    
```

## Reprotect  

After failover, protect the cluster in the new source region and failover to the new target region. To reprotect, do the following:

```powershell
$storage = "/subscriptions/XXXX-XXX-XXXXXXX/resourceGroups/XXXXXX/providers/Microsoft.Storage/storageAccounts/XXXXXXXtestasrcache" 
$ppg = "/subscriptions/XXXXXX-XXX-XXXXXX/resourceGroups/ClusterRG-XXXXX/providers/Microsoft.Compute/proximityPlacementGroups/sdgql-ppg" 
$avset = "/subscriptions/XXXX-XXXXX-XXXXX/resourceGroups/ClusterXXXX-XXX/providers/Microsoft.Compute/availabilitySets/SDGQL-AS" 
$rgId = "/subscriptions/XXXX-XXXXX-XXXXX/resourceGroups/ClusterRG-XXXX-XXXXX-XXXXX" 

# Without protected item details 

$recoveryFabricName = "asr-a2a-default-XXXXXX" 
$recoveryFabric = Get-AzRecoveryServicesAsrFabric -Name $recoveryFabricName 
$recoverypc = Get-AzRecoveryServicesAsrProtectionContainer -Fabric $recoveryFabric 
$recoverypcm = Get-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainer $recoverypc -Name "westus-eastus2-24-hour-retention-policy" 
$ReprotectJob = Update-AzRecoveryServicesAsrClusterProtectionDirection -AzureToAzure -ReplicationProtectionCluster $cluster ` 
-RecoveryProximityPlacementGroupId $ppg -RecoveryAvailabilitySetId $avset ` 
-RecoveryResourceGroupId $rgId -LogStorageAccountId $storage -ProtectionContainerMapping $recoverypcm 
```

After reprotection is complete, you can fail over in the reverse direction, West US to East US, and fail back to source region using Failover. 

## Disable protection

To disable protection, do the following: 

```powershell
$clusterToDisableName = "PowershellTestLatest"
$clusterToDisable = Get-AzRecoveryServicesAsrReplicationProtectionCluster -Name $clusterToDisableName -ProtectionContainer $pc
$DisableJob = Remove-AzRecoveryServicesAsrReplicationProtectionCluster -ReplicationProtectionCluster $clusterToDisable
```

### Resync cluster

To resync the cluster, do the following:

```powershell
Start-AzRecoveryServicesAsrClusterResynchronizeReplicationJob -ReplicationProtectionCluster $cluster 
```

## Next steps 

- View the [Azure Site Recovery PowerShell reference](/powershell/module/az.RecoveryServices) to learn how you can do other tasks such as creating recovery plans and testing failover of recovery plans with PowerShell.

- Learn more about [shared disks in Azure Site Recovery](./tutorial-shared-disk.md). 
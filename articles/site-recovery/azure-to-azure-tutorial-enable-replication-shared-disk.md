---
title: Shared disks in Azure Site Recovery using PowerShell
description: This article describes how set up disaster recovery for shared disks using PowerShell.
ms.topic: how-to
ms.service: azure-site-recovery
ms.date: 04/02/2025
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Set up disaster recovery for shared disks using PowerShell

This article describes how to set up disaster recovery for Azure to Azure shared disks VM using PowerShell. For more information about shared disks, see [Shared disks in Azure Site Recovery](./shared-disk-support-matrix.md).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Prerequisites

Before you start:
- Make sure that you understand the [scenario architecture and components](azure-to-azure-architecture.md).
- Review the [support requirements](azure-to-azure-support-matrix.md) for all components.
- You have the Azure PowerShell `Az` module. If you need to install or upgrade Azure PowerShell, follow this [Guide to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).  


## Set up the environment

Sign in to your Azure account and set the context to the subscription where you want to enable replication.

```powershell
Connect-AzAccount 
```

Select your Azure subscription. Use the Get-AzSubscription cmdlet to get the list of Azure subscriptions you have access to. Select the Azure subscription to work with using the Set-AzContext cmdlet. 

```powershell
Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
```

## Get the resource group and VM details

In this article, a virtual machine in the East US region is replicated to and recovered in the West US 2 region. The virtual machine being replicated has an OS disk and a single data disk. The name of the virtual machine used in the example is `AzureDemoVM`. 

```powershell
# Get details of the virtual machine 
$VM = Get-AzVM -ResourceGroupName "A2AdemoRG" -Name "AzureDemoVM" 
Write-Output $V
```

```Output
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

Get disk details for the virtual machine's disks. Disk details will be used later when starting replication for the virtual machine.

```azurepowershell
$OSDiskVhdURI = $VM.StorageProfile.OsDisk.Vhd
$DataDisk1VhdURI = $VM.StorageProfile.DataDisks[0].Vhd
```

## Create a Recovery Services vault

Create a resource group in which to create the Recovery Services vault.

> [!IMPORTANT]
> * The Recovery services vault and the virtual machines being protected, must be in different Azure locations.
> * The resource group of the Recovery services vault, and the virtual machines being protected, must be in different Azure locations.
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

## Prepare the vault to start replicating Azure virtual machines

### Create a Site Recovery fabric object to represent the primary (source) region

The fabric object in the vault represents an Azure region. The primary fabric object is created to represent the Azure region that virtual machines being protected to the vault belong to. In the example in this article, the virtual machine being protected is in the East US region.

- Only one fabric object can be created per region.
- If you've previously enabled Site Recovery replication for a VM in the Azure portal, Site Recovery creates a fabric object automatically. If a fabric object exists for a region, you can't create a new one.

Before you start, understand that Site Recovery operations are executed asynchronously. When you initiate an operation, an Azure Site Recovery job is submitted and a job tracking object is returned. Use the job tracking object to get the latest status for the job (`Get-AzRecoveryServicesAsrJob`), and to monitor the status of the operation.

```powershell
#Create Primary ASR fabric
$TempASRJob = New-AzRecoveryServicesAsrFabric -Azure -Location 'East US'  -Name "A2Ademo-EastUS"

# Track Job status to check for completion
while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
}

#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $TempASRJob.State

$PrimaryFabric = Get-AzRecoveryServicesAsrFabric -Name "A2Ademo-EastUS"
```

If virtual machines from multiple Azure regions are being protected to the same vault, create one fabric object for each source Azure region.

### Create a Site Recovery fabric object to represent the recovery region

The recovery fabric object represents the recovery Azure location. If there's a failover, virtual machines are replicated and recovered to the recovery region represented by the recovery fabric. The recovery Azure region used in this example is West US 2.

```powershell
#Create Recovery ASR fabric
$TempASRJob = New-AzRecoveryServicesAsrFabric -Azure -Location 'West US 2'  -Name "A2Ademo-WestUS"

# Track Job status to check for completion
while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
        sleep 10;
        $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
}

#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $TempASRJob.State

$RecoveryFabric = Get-AzRecoveryServicesAsrFabric -Name "A2Ademo-WestUS"
```

### Create a Site Recovery protection container in the primary fabric

The protection container is a container used to group replicated items within a fabric.

```powershell
#Create a Protection container in the primary Azure region (within the Primary fabric)
$TempASRJob = New-AzRecoveryServicesAsrProtectionContainer -InputObject $PrimaryFabric -Name "A2AEastUSProtectionContainer"

#Track Job status to check for completion
while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
        sleep 10;
        $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
}

Write-Output $TempASRJob.State

$PrimaryProtContainer = Get-AzRecoveryServicesAsrProtectionContainer -Fabric $PrimaryFabric -Name "A2AEastUSProtectionContainer"
```

#### Fabric and container creation when enabling zone to zone replication

When enabling zone to zone replication, only one fabric will be created. But there will be two containers. Assuming that the region is West Europe, use following commands to get the primary and protection containers -

```powershell
$primaryProtectionContainer = Get-AzRecoveryServicesAsrProtectionContainer -Fabric $fabric -Name "asr-a2a-default-westeurope-container"
$recoveryProtectionContainer = Get-AzRecoveryServicesAsrProtectionContainer -Fabric $fabric -Name "asr-a2a-default-westeurope-t-container"
```

### Create a replication policy

```powershell
#Create replication policy
$TempASRJob = New-AzRecoveryServicesAsrPolicy -AzureToAzure -Name "A2APolicy" -RecoveryPointRetentionInHours 24 -ApplicationConsistentSnapshotFrequencyInHours 4

#Track Job status to check for completion
while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
        sleep 10;
        $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
}

#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $TempASRJob.State

$ReplicationPolicy = Get-AzRecoveryServicesAsrPolicy -Name "A2APolicy"
```

### Create a protection container mapping between the primary and recovery protection container

A protection container mapping maps the primary protection container with a recovery protection container and a replication policy. Create one mapping for each replication policy that you'll use to replicate virtual machines between a protection container pair.

```powershell
#Create Protection container mapping between the Primary and Recovery Protection Containers with the Replication policy
$TempASRJob = New-AzRecoveryServicesAsrProtectionContainerMapping -Name "A2APrimaryToRecovery" -Policy $ReplicationPolicy -PrimaryProtectionContainer $PrimaryProtContainer -RecoveryProtectionContainer $RecoveryProtContainer

#Track Job status to check for completion
while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
        sleep 10;
        $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
}

#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $TempASRJob.State

$EusToWusPCMapping = Get-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainer $PrimaryProtContainer -Name "A2APrimaryToRecovery"
```

#### Protection container mapping creation when enabling zone to zone replication

When enabling zone to zone replication, use the below command to create protection container mapping. Assuming that the region is West Europe, the command will be -

```powershell
$protContainerMapping = Get-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainer $PrimprotectionContainer -Name "westeurope-westeurope-24-hour-retention-policy-s"
```

### Create a protection container mapping for failback (reverse replication after a failover)

After a failover, when you're ready to bring the failed over virtual machine back to the original Azure region, you do a failback. To fail back, the failed over virtual machine is reverse replicated from the failed over region to the original region. For reverse replication the roles of the original region and the recovery region switch. The original region now becomes the new recovery region, and what was originally the recovery region now becomes the primary region. The protection container mapping for reverse replication represents the switched roles of the original and recovery regions.

```powershell
#Create Protection container mapping (for fail back) between the Recovery and Primary Protection Containers with the Replication policy
$TempASRJob = New-AzRecoveryServicesAsrProtectionContainerMapping -Name "A2ARecoveryToPrimary" -Policy $ReplicationPolicy -PrimaryProtectionContainer $RecoveryProtContainer -RecoveryProtectionContainer $PrimaryProtContainer

#Track Job status to check for completion
while (($TempASRJob.State -eq "InProgress") -or ($TempASRJob.State -eq "NotStarted")){
        sleep 10;
        $TempASRJob = Get-AzRecoveryServicesAsrJob -Job $TempASRJob
}

#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded"
Write-Output $TempASRJob.State

$WusToEusPCMapping = Get-AzRecoveryServicesAsrProtectionContainerMapping -ProtectionContainer $RecoveryProtContainer -Name "A2ARecoveryToPrimary"
```

## Create cache storage account and target storage account

A cache storage account is a standard storage account in the same Azure region as the virtual machine being replicated. The cache storage account is used to hold replication changes temporarily, before the changes are moved to the recovery Azure region. High churn support is also available in Azure Site Recovery to get higher churn limits. To use this feature, please create a Premium Block Blob type of storage accounts and then use it as the cache storage account.  You can choose to, but it's not necessary, to specify different cache storage accounts for the different disks of a virtual machine. If you use different cache storage accounts, ensure they are of the same type (Standard or Premium Block Blobs). For more information, see [Azure VM Disaster Recovery - High Churn Support](./concepts-azure-to-azure-high-churn-support.md).

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

A network mapping maps virtual networks in the primary region to virtual networks in the recovery region. The network mapping specifies the Azure virtual network in the recovery region, that a virtual machine in the primary virtual network should fail over to. One Azure virtual network can be mapped to only a single Azure virtual network in a recovery region.

1. Create an Azure virtual network in the recovery region to fail over to:

   ```powershell
    #Create a Recovery Network in the recovery region
    $WestUSRecoveryVnet = New-AzVirtualNetwork -Name "a2arecoveryvnet" -ResourceGroupName "a2ademorecoveryrg" -Location 'West US 2' -AddressPrefix "10.0.0.0/16"

    Add-AzVirtualNetworkSubnetConfig -Name "default" -VirtualNetwork $WestUSRecoveryVnet -AddressPrefix "10.0.0.0/20" | Set-AzVirtualNetwork

    $WestUSRecoveryNetwork = $WestUSRecoveryVnet.Id
   ```

1. Retrieve the primary virtual network. The VNet that the virtual machine is connected to:

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

1. Create network mapping between the primary virtual network and the recovery virtual network:

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

1. Create network mapping for the reverse direction (fail back):

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








## Next steps 

View the Azure Site Recovery PowerShell reference to learn how you can do other tasks such as creating recovery plans and testing failover of recovery plans with PowerShell. 
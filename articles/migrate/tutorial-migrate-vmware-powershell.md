---
title: Migrate VMware VMs to Azure (agentless) - PowerShell
description: Learn how to run an agentless migration of VMware VMs with Azure Migrate through PowerShell.
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.topic: tutorial
ms.date: 05/11/2023 
ms.service: azure-migrate
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Migrate VMware VMs to Azure (agentless) - PowerShell

In this article, you'll learn how to migrate discovered VMware VMs with the agentless method using Azure PowerShell for [Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool).

You learn how to:

> [!div class="checklist"]
> * Retrieve discovered VMware VMs in an Azure Migrate project.
> * Start replicating VMs.
> * Update properties for replicating VMs.
> * Monitor replication.
> * Run a test migration to make sure everything's working as expected.
> * Run a full VM migration.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible and don't show all possible settings and paths.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## 1. Prerequisites

Before you begin this tutorial, you should:

1. Complete the [Tutorial: Discover VMware VMs with Server Assessment](tutorial-discover-vmware.md) to prepare Azure and VMware for migration.
2. Complete the [Tutorial: Assess VMware VMs for migration to Azure VMs](./tutorial-assess-vmware-azure-vm.md) before migrating them to Azure.
3. [Install the Az PowerShell module](/powershell/azure/install-azure-powershell)

## 2. Install Azure Migrate PowerShell module

Azure Migrate PowerShell module is available as part of Azure PowerShell (`Az`). Run the `Get-InstalledModule -Name Az.Migrate` command to check if the Azure Migrate PowerShell module is installed on your machine.  

## 3. Sign in to your Microsoft Azure subscription

Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

```azurepowershell-interactive
Connect-AzAccount
```

### Select your Azure subscription

Use the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) cmdlet to get the list of Azure subscriptions you have access to. Select the Azure subscription that has your Azure Migrate project to work with using the [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## 4. Retrieve the Azure Migrate project

An Azure Migrate project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating.
In a project you can track discovered assets, orchestrate assessments, and perform migrations.

As part of prerequisites, you would have already created an Azure Migrate project. Use the [Get-AzMigrateProject](/powershell/module/az.migrate/get-azmigrateproject) cmdlet to retrieve details of an Azure Migrate project. You'll need to specify the name of the Azure Migrate project (`Name`) and the name of the resource group of the Azure Migrate project (`ResourceGroupName`).

```azurepowershell-interactive
# Get resource group of the Azure Migrate project
$ResourceGroup = Get-AzResourceGroup -Name MyResourceGroup
```
```azurepowershell-interactive
# Get details of the Azure Migrate project
$MigrateProject = Get-AzMigrateProject -Name MyMigrateProject -ResourceGroupName $ResourceGroup.ResourceGroupName
```
```azurepowershell-interactive
# View Azure Migrate project details
Write-Output $MigrateProject
```

## 5. Retrieve discovered VMs in an Azure Migrate project

Azure Migrate uses a lightweight [Azure Migrate appliance](migrate-appliance-architecture.md). As part of the prerequisites, you would have deployed the Azure Migrate appliance as a VMware VM.

To retrieve a specific VMware VM in an Azure Migrate project, specify name of the Azure Migrate project (`ProjectName`), resource group of the Azure Migrate project (`ResourceGroupName`), and the VM name (`DisplayName`).


```azurepowershell-interactive
# Get a specific VMware VM in an Azure Migrate project
$DiscoveredServer = Get-AzMigrateDiscoveredServer -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName -DisplayName MyTestVM | Format-Table DisplayName, Name, Type

# View discovered server details
Write-Output $DiscoveredServer
```

We'll migrate this VM as part of this tutorial.

You can also retrieve all VMware VMs in an Azure Migrate project by using the (`ProjectName`) and (`ResourceGroupName`) parameters.

```azurepowershell-interactive
# Get all VMware VMs in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateDiscoveredServer -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName
```

If you have multiple appliances in an Azure Migrate project, you can use (`ProjectName`), (`ResourceGroupName`), and (`ApplianceName`) parameters to retrieve all VMs discovered using a specific Azure Migrate appliance.

```azurepowershell-interactive
# Get all VMware VMs discovered by an Azure Migrate Appliance in an Azure Migrate project
$DiscoveredServers = Get-AzMigrateDiscoveredServer -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName -ApplianceName MyMigrateAppliance

```

## 6. Initialize replication infrastructure

[Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) leverages multiple Azure resources for migrating VMs. Migration and modernization provisions the following resources, in the same resource group as the project.

- **Service bus**: Migration and modernization uses the service bus to send replication orchestration messages to the appliance.
- **Gateway storage account**: Migration and modernization uses the gateway storage account to store state information about the VMs being replicated.
- **Log storage account**: The Azure Migrate appliance uploads replication logs for VMs to a log storage account. Azure Migrate applies the replication information to the replica-managed disks.
- **Key vault**: The Azure Migrate appliance uses the key vault to manage connection strings for the service bus, and access keys for the storage accounts used in replication.

Before replicating the first VM in the Azure Migrate project, run the following command to provision the replication infrastructure. This command provisions and configures the aforementioned resources so that you can start migrating your VMware VMs.

> [!NOTE]
> One Azure Migrate project supports migrations to one Azure region only. Once you run this script, you can't change the target region to which you want to migrate your VMware VMs.
> You'll need to run the `Initialize-AzMigrateReplicationInfrastructure` command if you configure a new appliance in your Azure Migrate project.

In the article, we'll initialize the replication infrastructure so that we can migrate our VMs to `Central US` region.

```azurepowershell-interactive
# Initialize replication infrastructure for the current Migrate project
Initialize-AzMigrateReplicationInfrastructure -ResourceGroupName $ResourceGroup.ResourceGroupName -ProjectName $MigrateProject. Name -Scenario agentlessVMware -TargetRegion "CentralUS" 

```

## 7. Replicate VMs

After completing discovery and initializing replication infrastructure, you can begin replication of VMware VMs to Azure. You can run up to 500 replications simultaneously.

You can specify the replication properties as follows.

**Parameter** | **Type** | **Description**
--- | --- | ---
 Target subscription and resource group |  Mandatory | Specify the subscription and resource group that the VM should be migrated to by providing the resource group ID using the (`TargetResourceGroupId`) parameter.
 Target virtual network and subnet | Mandatory | Specify the ID of the Azure Virtual Network and the name of the subnet that the VM should be migrated to by using the (`TargetNetworkId`) and (`TargetSubnetName`) parameters respectively.
 Machine ID | Mandatory | Specify the ID of the discovered machine that needs to be replicated and migrated. Use (`InputObject`) to specify the discovered VM object for replication.  
 Target VM name | Mandatory | Specify the name of the Azure VM to be created by using the (`TargetVMName`) parameter. 
 Target VM size | Mandatory | Specify the Azure VM size to be used for the replicating VM by using (`TargetVMSize`) parameter. For instance, to migrate a VM to D2_v2 VM in Azure, specify the value for (`TargetVMSize`) as "Standard_D2_v2". 
 License | Mandatory | To use Azure Hybrid Benefit for your Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, specify the value for (`LicenseType`) parameter as **WindowsServer**. Otherwise, specify the value as **NoLicenseType**. 
 OS Disk | Mandatory | Specify the unique identifier of the disk that has the operating system bootloader and installer. The disk ID to be used is the unique identifier (UUID) property for the disk retrieved using the [Get-AzMigrateDiscoveredServer](/powershell/module/az.migrate/get-azmigratediscoveredserver) cmdlet.
 Disk Type | Mandatory | Specify the type of disk to be used. 
 Infrastructure redundancy | Optional | Specify infrastructure redundancy option as follows. <br/><br/> - **Availability Zone** to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. This option is only available if the target region selected for the migration supports Availability Zones. To use availability zones, specify the availability zone value for (`TargetAvailabilityZone`) parameter. <br/> - **Availability Set** to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets to use this option. To use availability set, specify the availability set ID for (`TargetAvailabilitySet`) parameter. 
 Boot Diagnostic Storage Account | Optional | To use a boot diagnostic storage account, specify the ID for (`TargetBootDiagnosticStorageAccount`) parameter. <br/> - The storage account used for boot diagnostics should be in the same subscription that you're migrating your VMs to. <br/> - By default, no value is set for this parameter. 
 Tags | Optional | Add tags to your migrated virtual machines, disks, and NICs. <br/>  Use (`Tag`) to add tags to virtual machines, disks, and NICs. <br/> or <br/> Use (`VMTag`) for adding tags to your migrated virtual machines.<br/> Use (`DiskTag`) for adding tags to disks. <br/> Use (`NicTag`) for adding tags to network interfaces. <br/> For example, add the required tags to a variable $tags and pass the variable in the required parameter.  $tags = @{Organization=”Contoso”}



### Replicate VMs with all disks

In this tutorial, we'll replicate all the disks of the discovered VM and specify a new name for the VM in Azure. We specify the first disk of the discovered server as OS Disk and migrate all disks as Standard HDD. The OS disk is the disk that has the operating system bootloader and installer. The cmdlet returns a job that can be tracked for monitoring the status of the operation.

```azurepowershell-interactive
# Retrieve the resource group that you want to migrate to
$TargetResourceGroup = Get-AzResourceGroup -Name MyTargetResourceGroup
```

```azurepowershell-interactive
# Retrieve the Azure virtual network and subnet that you want to migrate to
$TargetVirtualNetwork = Get-AzVirtualNetwork -Name MyVirtualNetwork
```
```azurepowershell-interactive
# Start replication for a discovered VM in an Azure Migrate project
$MigrateJob =  New-AzMigrateServerReplication -InputObject $DiscoveredServer -TargetResourceGroupId $TargetResourceGroup.ResourceId -TargetNetworkId $TargetVirtualNetwork.Id -LicenseType NoLicenseType -OSDiskID $DiscoveredServer.Disk[0].Uuid -TargetSubnetName $TargetVirtualNetwork.Subnets[0].Name -DiskType Standard_LRS -TargetVMName MyMigratedTestVM -TargetVMSize Standard_DS2_v2
```
```azurepowershell-interactive
# Track job status to check for completion
while (($MigrateJob.State -eq 'InProgress') -or ($MigrateJob.State -eq 'NotStarted')){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $MigrateJob = Get-AzMigrateJob -InputObject $MigrateJob
}
#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
Write-Output $MigrateJob.State
```

### Replicate VMs with select disks

You can also selectively replicate the disks of the discovered VM by using [New-AzMigrateDiskMapping](/powershell/module/az.migrate/new-azmigratediskmapping) cmdlet and providing that as an input to the (`DiskToInclude`) parameter in the [New-AzMigrateServerReplication](/powershell/module/az.migrate/new-azmigrateserverreplication) cmdlet. You can also use [New-AzMigrateDiskMapping](/powershell/module/az.migrate/new-azmigratediskmapping) cmdlet to specify different target disk types for each individual disk to be replicated.

Specify values for the following parameters of the [New-AzMigrateDiskMapping](/powershell/module/az.migrate/new-azmigratediskmapping) cmdlet.

- **DiskId** - Specify the unique identifier for the disk to be migrated. The disk ID to be used is the unique identifier (UUID) property for the disk retrieved using the [Get-AzMigrateDiscoveredServer](/powershell/module/az.migrate/get-azmigratediscoveredserver) cmdlet.
- **IsOSDisk** - Specify "true" if the disk to be migrated is the OS disk of the VM, else "false".
- **DiskType** - Specify the type of disk to be used in Azure.

In the following example, we'll replicate only two disks of the discovered VM. We'll specify the OS disk and use different disk types for each disk to be replicated. The cmdlet returns a job which can be tracked for monitoring the status of the operation.

```azurepowershell-interactive
# View disk details of the discovered server
Write-Output $DiscoveredServer.Disk
```

```azurepowershell-interactive
# Create a new disk mapping for the disks to be replicated
$DisksToReplicate = @()
$OSDisk = New-AzMigrateDiskMapping -DiskID $DiscoveredServer.Disk[0].Uuid -DiskType StandardSSD_LRS -IsOSDisk true
$DataDisk = New-AzMigrateDiskMapping -DiskID $DiscoveredServer.Disk[1].Uuid -DiskType Premium_LRS -IsOSDisk false

$DisksToReplicate += $OSDisk
$DisksToReplicate += $DataDisk
```

```azurepowershell-interactive
# Retrieve the resource group that you want to migrate to
$TargetResourceGroup = Get-AzResourceGroup -Name MyTargetResourceGroup
```

```azurepowershell-interactive
# Retrieve the Azure virtual network and subnet that you want to migrate to
$TargetVirtualNetwork = Get-AzVirtualNetwork -Name MyVirtualNetwork
```

```azurepowershell-interactive
# Start replication for the VM
$MigrateJob =  New-AzMigrateServerReplication -InputObject $DiscoveredServer -TargetResourceGroupId $TargetResourceGroup.ResourceId -TargetNetworkId $TargetVirtualNetwork.Id -LicenseType NoLicenseType -DiskToInclude $DisksToReplicate -TargetSubnetName $TargetVirtualNetwork.Subnets[0].Name -TargetVMName MyMigratedTestVM -TargetVMSize Standard_DS2_v2
```

```azurepowershell-interactive
# Track job status to check for completion
while (($MigrateJob.State -eq 'InProgress') -or ($MigrateJob.State -eq 'NotStarted')){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $MigrateJob = Get-AzMigrateJob -InputObject $MigrateJob
}
# Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
Write-Output $MigrateJob.State
```

## 8. Monitor replication

Replication occurs as follows:

- When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica-managed disks in Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

Track the status of the replication by using the [Get-AzMigrateServerReplication](/powershell/module/az.migrate/get-azmigrateserverreplication) cmdlet.



```azurepowershell-interactive
# List replicating VMs and filter the result for selecting a replicating VM. This cmdlet will not return all properties of the replicating VM.
$ReplicatingServer = Get-AzMigrateServerReplication -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName -MachineName MyTestVM
```
```azurepowershell-interactive
# Retrieve all properties of a replicating VM 
$ReplicatingServer = Get-AzMigrateServerReplication -TargetObjectID $ReplicatingServer.Id
```

You can track the **Migration State** and **Migration State Description** properties in the output.

- For initial replication, the values for **Migration State** and **Migration State Description** properties will be `InitialSeedingInProgress` and `Initial replication` respectively.
- During delta replication, the values for **Migrate State** and **Migration State Description** properties will be `Replicating` and `Ready to migrate` respectively.
- After you complete the migration, the values for **Migrate State** and **Migration State Description** properties will be `Migration succeeded` and `Migrated` respectively.

```Output
AllowedOperation            : {DisableMigration, TestMigrate, Migrate}
CurrentJobId                : /Subscriptions/xxx/resourceGroups/xxx/providers/Micr
                              osoft.RecoveryServices/vaults/xxx/replicationJobs/None
CurrentJobName              : None
CurrentJobStartTime         : 1/1/1753 1:01:01 AM
EventCorrelationId          : 9d435c55-4660-41a5-a8ed-dd74213d85fa
Health                      : Normal
HealthError                 : {}
Id                          : /Subscriptions/xxx/resourceGroups/xxx/providers/Micr
                              osoft.RecoveryServices/vaults/xxx/replicationFabrics/xxx/replicationProtectionContainers/xxx/
                              replicationMigrationItems/10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_5009e941-3e40-
                              39b2-1e14-f90584522703
LastTestMigrationStatus     :
LastTestMigrationTime       :
Location                    :
MachineName                 : MyTestVM
MigrationState              : InitialSeedingInProgress
MigrationStateDescription   : Initial replication
Name                        : 10-150-8-52-b090bef3-b733-5e34-bc8f-eb6f2701432a_5009e941-3e40-39b2-1e14-f90584522703
PolicyFriendlyName          : xxx
PolicyId                    : /Subscriptions/xxx/resourceGroups/xxx/providers/Micr
                              osoft.RecoveryServices/vaults/xxx/replicationPolicies/xxx
ProviderSpecificDetail      : Microsoft.Azure.PowerShell.Cmdlets.Migrate.Models.Api20180110.VMwareCbtMigrationDetails
TestMigrateState            : None
TestMigrateStateDescription : None
Type                        : Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems
```

For details on replication progress, run the following cmdlet.

```azurepowershell-interactive
Write-Output $replicatingserver.ProviderSpecificDetail
```

You can track the initial replication progress using the **Initial Seeding Progress Percentage** properties in the output.

```Output
    "DataMoverRunAsAccountId": "/subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.OffAzure/VMwareSites/xxx/runasaccounts/xxx",
    "FirmwareType":  "BIOS",
    "InitialSeedingProgressPercentage": 20,
    "InstanceType":  "VMwareCbt",
    "LastRecoveryPointReceived":  "\/Date(1601733591427)\/",
    "LicenseType":  "NoLicenseType",
    "MigrationProgressPercentage":  null,
    "MigrationRecoveryPointId":  null,
    "OSType":  "Windows",
    "PerformAutoResync":  "true",
```

Replication occurs as follows:

- When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica-managed disks in Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

## 9. Retrieve the status of a job

You can monitor the status of a job by using the [Get-AzMigrateJob](/powershell/module/az.migrate/get-azmigratejob) cmdlet.

```azurepowershell-interactive
# Retrieve the updated status for a job
$job = Get-AzMigrateJob -InputObject $job
```

## 10. Update properties of a replicating VM

[Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) allows you to change target properties, such as name, size, resource group, NIC configuration and so on, for a replicating VM.

The following properties can be updated for a VM.


**Parameter** | **Type** | **Description**
--- | --- | ---
VM Name | Optional | Specify the name of the Azure VM to be created by using the [`TargetVMName`] parameter. 
VM size | Optional | Specify the Azure VM size to be used for the replicating VM by using [`TargetVMSize`] parameter. For instance, to migrate a VM to D2_v2 VM in Azure, specify the value for [`TargetVMSize`] as `Standard_D2_v2`.
Virtual Network | Optional | Specify the ID of the Azure Virtual Network that the VM should be migrated to by using the [`TargetNetworkId`] parameter. 
Resource Group | Optional | IC configuration can be specified using the [New-AzMigrateNicMapping](/powershell/module/az.migrate/new-azmigratenicmapping) cmdlet. The object is then passed an input to the [`NicToUpdate`] parameter in the [Set-AzMigrateServerReplication](/powershell/module/az.migrate/set-azmigrateserverreplication) cmdlet. <br/><br/> - **Change IP allocation** - To specify a static IP for a NIC, provide the IPv4 address to be used as static IP for the VM using the [`TargetNicIP`] parameter. To dynamically assign an IP for a NIC, provide `auto` as the value for the **TargetNicIP** parameter. <br/> - Use values `Primary`, `Secondary` or `DoNotCreate` for [`TargetNicSelectionType`] parameter to specify whether the NIC should be primary, secondary, or is not to be created on the migrated VM. Only one NIC can be specified as the primary NIC for the VM. <br/> - To make a NIC primary, you'll also need to specify the other NICs that should be made secondary or are not to be created on the migrated VM. <br/> - To change the subnet for the NIC, specify the name of the subnet by using the [`TargetNicSubnet`] parameter.
Network Interface | Optional | Specify the name of the Azure VM to be created by using the [`TargetVMName`] parameter. 
Availability Zone | Optional | To use availability zones, specify the availability zone value for [`TargetAvailabilityZone`] parameter. 
Availability Set | Optional | To use availability set, specify the availability set ID for [`TargetAvailabilitySet`] parameter. 
Tags | Optional | For updating tags, use the following parameters [`UpdateTag`] or [`UpdateVMTag`], [`UpdateDiskTag`], [`UpdateNicTag`], and type of update tag operation [`UpdateTagOperation`] or [`UpdateVMTagOperation`], [`UpdateDiskTagOperation`], [`UpdateNicTagOperation`].   The update tag operation takes the following values – Merge, Delete, and Replace. <br/> Use [`UpdateTag`] to update all tags across virtual machines, disks, and NICs. <br/> Use [`UpdateVMTag`] for updating virtual machine tags. <br/> Use [`UpdateDiskTag`] for updating disk tags. <br/> Use [`UpdateNicTag`] for updating NIC tags. <br/> Use [`UpdateTagOperation`] to update the operation for all tags across virtual machines, disks, and NICs. <br/>  Use [`UpdateVMTagOperation`] for updating virtual machine tags. <br/> Use [`UpdateDiskTagOperation`] for updating disk tags. <br/> Use [`UpdateNicTagOperation`] for updating NIC tags. <br/> <br/> The *replace* option replaces the entire set of existing tags with a new set. <br/> The *merge* option allows adding tags with new names and updating the values of tags with existing names. <br/> The *delete* option allows selectively deleting tags based on given names or name/value pairs. 
Disk(s) | Optional | For the OS disk: <br/> Update the name of the OS disk by using the [`TargetDiskName`] parameter.  <br/><br/> For updating multiple disks: <br/>  Use [Set-AzMigrateDiskMapping](/powershell/module/az.migrate/set-azmigratediskmapping) to set the disk names to a variable *$DiskMapping* and then use the [`DiskToUpdate`] parameter and pass along the variable. <br/> <br/> **Note:** The disk ID to be used in [Set-AzMigrateDiskMapping](/powershell/module/az.migrate/set-azmigratediskmapping) is the unique identifier (UUID) property for the disk retrieved using the [Get-AzMigrateDiscoveredServer](/powershell/module/az.migrate/get-azmigratediscoveredserver) cmdlet. 
NIC(s) name | Optional | Use [New-AzMigrateNicMapping](/powershell/module/az.migrate/new-azmigratenicmapping) to set the NIC names to a variable *$NICMapping* and then use the [`NICToUpdate`] parameter and pass the variable.

The [Get-AzMigrateServerReplication](/powershell/module/az.migrate/get-azmigrateserverreplication) cmdlet returns a job which can be tracked for monitoring the status of the operation.

```azurepowershell-interactive
# List replicating VMs and filter the result for selecting a replicating VM. This cmdlet will not return all properties of the replicating VM.
$ReplicatingServer = Get-AzMigrateServerReplication -ProjectName $MigrateProject.Name -ResourceGroupName $ResourceGroup.ResourceGroupName -MachineName MyTestVM
```

```azurepowershell-interactive
# Retrieve all properties of a replicating VM 
$ReplicatingServer = Get-AzMigrateServerReplication -TargetObjectID $ReplicatingServer.Id

# View NIC details of the replicating server
Write-Output $ReplicatingServer.ProviderSpecificDetail.VMNic
```

In the following example, we'll update the NIC configuration by making the first NIC as primary and assigning a static IP to it. we'll discard the second NIC for migration, update the target VM name & size, and customizing NIC names.

```azurepowershell-interactive
# Specify the NIC properties to be updated for a replicating VM.
$NicMapping = @()
$NicMapping1 = New-AzMigrateNicMapping -NicId $ReplicatingServer.ProviderSpecificDetail.VMNic[0].NicId -TargetNicIP ###.###.###.### -TargetNicSelectionType Primary TargetNicName "ContosoNic_1"
$NicMapping2 = New-AzMigrateNicMapping -NicId $ReplicatingServer.ProviderSpecificDetail.VMNic[1].NicId -TargetNicSelectionType DoNotCreate - TargetNicName "ContosoNic_2"

$NicMapping += $NicMapping1
$NicMapping += $NicMapping2
```
```azurepowershell-interactive
# Update the name, size and NIC configuration of a replicating server
$UpdateJob = Set-AzMigrateServerReplication -InputObject $ReplicatingServer -TargetVMSize Standard_DS13_v2 -TargetVMName MyMigratedVM -NicToUpdate $NicMapping
```

In the following example, we'll customize the disk name.

```azurepowershell-interactive
# Customize the Disk names for a replicating VM
$OSDisk = Set-AzMigrateDiskMapping -DiskID "6000C294-1217-dec3-bc18-81f117220424" -DiskName "ContosoDisk_1" 
$DataDisk1= Set-AzMigrateDiskMapping -DiskID "6000C292-79b9-bbdc-fb8a-f1fa8dbeff84" -DiskName "ContosoDisk_2" 
$DiskMapping = $OSDisk, $DataDisk1 
```

```azurepowershell-interactive
# Update the disk names for a replicating server
$UpdateJob = Set-AzMigrateServerReplication InputObject $ReplicatingServer DiskToUpdate $DiskMapping 
 ```

In the following example, we'll add tags to the replicating VMs.

```azurepowershell-interactive
# Update all tags across virtual machines, disks, and NICs.
Set-azmigrateserverreplication UpdateTag $UpdateTag UpdateTagOperation Merge/Replace/Delete

# Update virtual machines tags
Set-azmigrateserverreplication UpdateVMTag $UpdateVMTag UpdateVMTagOperation Merge/Replace/Delete 
```
Use the following example to track the job status

```azurepowershell-interactive
# Track job status to check for completion
while (($UpdateJob.State -eq 'InProgress') -or ($UpdateJob.State -eq 'NotStarted')){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $UpdateJob = Get-AzMigrateJob -InputObject $UpdateJob
}
# Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
Write-Output $UpdateJob.State
```

## 11. Run a test migration

When delta replication begins, you can run a test migration for the VMs before running a full migration to Azure. We highly recommend that you do test migration at least once for each machine before you migrate it. The cmdlet returns a job which can be tracked for monitoring the status of the operation.

- Running a test migration checks that migration will work as expected. Test migration doesn't impact the on-premises machine, which remains operational, and continues replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Select the Azure Virtual Network to be used for testing by specifying the ID of the virtual network using the [`TestNetworkID`] parameter.

```azurepowershell-interactive
# Retrieve the Azure virtual network created for testing
$TestVirtualNetwork = Get-AzVirtualNetwork -Name MyTestVirtualNetwork
```
```azurepowershell-interactive
# Start test migration for a replicating server
$TestMigrationJob = Start-AzMigrateTestMigration -InputObject $ReplicatingServer -TestNetworkID $TestVirtualNetwork.Id
```
```azurepowershell-interactive
# Track job status to check for completion
while (($TestMigrationJob.State -eq 'InProgress') -or ($TestMigrationJob.State -eq 'NotStarted')){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $TestMigrationJob = Get-AzMigrateJob -InputObject $TestMigrationJob
}
# Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
Write-Output $TestMigrationJob.State
```

After testing is complete, clean-up the test migration using the [Start-AzMigrateTestMigrationCleanup](/powershell/module/az.migrate/start-azmigratetestmigrationcleanup) cmdlet. The cmdlet returns a job that can be tracked for monitoring the status of the operation.

```azurepowershell-interactive
# Clean-up test migration for a replicating server
$CleanupTestMigrationJob = Start-AzMigrateTestMigrationCleanup -InputObject $ReplicatingServer
```
```azurepowershell-interactive
# Track job status to check for completion
while (($CleanupTestMigrationJob.State -eq "InProgress") -or ($CleanupTestMigrationJob.State -eq "NotStarted")){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $CleanupTestMigrationJob = Get-AzMigrateJob -InputObject $CleanupTestMigrationJob
}
# Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
Write-Output $CleanupTestMigrationJob.State
```

## 12. Migrate VMs

After you've verified that the test migration works as expected, you can migrate the replicating server using the following cmdlet. The cmdlet returns a job that can be tracked for monitoring the status of the operation.

If you don't want to turn-off the source server, then don't use [`TurnOffSourceServer`] parameter.

```azurepowershell-interactive
# Start migration for a replicating server and turn off source server as part of migration
$MigrateJob = Start-AzMigrateServerMigration -InputObject $ReplicatingServer -TurnOffSourceServer
```
```azurepowershell-interactive
# Track job status to check for completion
while (($MigrateJob.State -eq 'InProgress') -or ($MigrateJob.State -eq 'NotStarted')){
        #If the job hasn't completed, sleep for 10 seconds before checking the job status again
        sleep 10;
        $MigrateJob = Get-AzMigrateJob -InputObject $MigrateJob
}
#Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
Write-Output $MigrateJob.State
```

## 13. Complete the migration

1. After the migration is done, stop replication for the on-premises machine and clean-up replication state information for the VM using the following cmdlet. The cmdlet returns a job that can be tracked for monitoring the status of the operation.

   ```azurepowershell-interactive
   # Stop replication for a migrated server
   $StopReplicationJob = Remove-AzMigrateServerReplication -InputObject $ReplicatingServer
   ```
   ```azurepowershell-interactive
   # Track job status to check for completion
   while (($StopReplicationJob.State -eq 'InProgress') -or ($StopReplicationJob.State -eq 'NotStarted')){
           #If the job hasn't completed, sleep for 10 seconds before checking the job status again
           sleep 10;
           $StopReplicationJob = Get-AzMigrateJob -InputObject $StopReplicationJob
   }
   # Check if the Job completed successfully. The updated job state of a successfully completed job should be "Succeeded".
   Write-Output $StopReplicationJob.State
   ```
   
1. Perform any post-migration app tweaks, such as updating database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

## 14. Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs using the Azure Backup service. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just in time administration](../security-center/security-center-just-in-time.md).
    - Restrict network traffic to management endpoints with [Network Security Groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](../virtual-machines/disk-encryption-overview.md) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/), and visit the [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
-  Consider deploying [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.
